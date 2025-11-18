from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
import os
from pathlib import Path
from threading import Lock
from typing import Dict, List, Literal, Optional
from uuid import uuid4

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from agent import CampaignAgent, CampaignResult

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


class CampaignPayloadModel(BaseModel):
    producto: str = Field(..., min_length=3, max_length=280)
    publico_objetivo: str = Field(..., min_length=3, max_length=280)


class CampaignResultModel(BaseModel):
    producto: str
    publico_objetivo: str
    tweets: List[str]
    linkedin_post: Optional[str] = None
    instagram_post: Optional[str] = None
    resumen: Optional[str] = None
    generated_at: Optional[str] = None


class CampaignRecordModel(BaseModel):
    id: str
    producto: str
    publico_objetivo: str
    status: Literal["pending", "completed", "failed"]
    created_at: str
    updated_at: str
    result: Optional[CampaignResultModel] = None
    error: Optional[str] = None


class CampaignRepository:
    """Persiste los registros de campanas en un archivo JSON simple."""

    def __init__(self, path: Path) -> None:
        self._path = path
        self._lock = Lock()
        self._items: List[Dict] = []
        self._load()

    def _load(self) -> None:
        if not self._path.exists():
            return
        try:
            self._items = json.loads(self._path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            logger.warning("El archivo de campanas estaba corrupto. Se reinicia vacio.")
            self._items = []

    def _persist(self) -> None:
        self._path.parent.mkdir(parents=True, exist_ok=True)
        self._path.write_text(
            json.dumps(self._items, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

    def create_pending(self, producto: str, publico_objetivo: str) -> Dict:
        record = {
            "id": str(uuid4()),
            "producto": producto,
            "publico_objetivo": publico_objetivo,
            "status": "pending",
            "created_at": _now(),
            "updated_at": _now(),
            "result": None,
            "error": None,
        }
        with self._lock:
            self._items.append(record)
            self._persist()
        return record

    def mark_completed(self, record_id: str, result: CampaignResult) -> Dict:
        payload = result.to_dict()
        with self._lock:
            record = self._get(record_id)
            record["status"] = "completed"
            record["result"] = payload
            record["updated_at"] = _now()
            record["error"] = None
            self._persist()
        return record

    def mark_failed(self, record_id: str, error: str) -> Dict:
        with self._lock:
            record = self._get(record_id)
            record["status"] = "failed"
            record["updated_at"] = _now()
            record["error"] = error
            self._persist()
        return record

    def list(self, limit: int) -> List[Dict]:
        with self._lock:
            ordered = sorted(self._items, key=lambda item: item["created_at"], reverse=True)
            return ordered[:limit]

    def latest(self, status: Optional[str] = None) -> Optional[Dict]:
        with self._lock:
            items = self._items
            if status:
                items = [item for item in items if item["status"] == status]
            if not items:
                return None
            return max(items, key=lambda item: item["created_at"])

    def get(self, record_id: str) -> Dict:
        with self._lock:
            return self._get(record_id)

    def _get(self, record_id: str) -> Dict:
        for item in self._items:
            if item["id"] == record_id:
                return item
        raise KeyError(f"Campana con id {record_id} no encontrada")


DATA_PATH = Path(__file__).parent / "data" / "campaigns.json"
repository = CampaignRepository(DATA_PATH)
agent_service = CampaignAgent()

app = FastAPI(title="Backend MCP Campaigns", version="1.0.0")

allowed_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ALLOW_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/campaigns", response_model=CampaignRecordModel)
async def create_campaign(payload: CampaignPayloadModel) -> CampaignRecordModel:
    record = repository.create_pending(
        producto=payload.producto.strip(),
        publico_objetivo=payload.publico_objetivo.strip(),
    )
    try:
        result = await agent_service.generate_campaign(
            producto=record["producto"],
            publico=record["publico_objetivo"],
        )
        repository.mark_completed(record["id"], result)
    except Exception as exc:  # pragma: no cover - errores en runtime
        logger.exception("Error generando la campana")
        repository.mark_failed(record["id"], str(exc))
        raise HTTPException(
            status_code=500,
            detail="No se pudo generar la campana. Revisa los logs del servidor MCP.",
        ) from exc

    return repository.get(record["id"])


@app.get("/campaigns", response_model=List[CampaignRecordModel])
async def list_campaigns(limit: int = Query(20, ge=1, le=100)) -> List[CampaignRecordModel]:
    return repository.list(limit=limit)


@app.get("/campaigns/latest", response_model=CampaignRecordModel)
async def latest_campaign(
    status: Optional[Literal["pending", "completed", "failed"]] = None,
) -> CampaignRecordModel:
    record = repository.latest(status=status)
    if not record:
        raise HTTPException(status_code=404, detail="No hay campanas disponibles.")
    return record


@app.get("/health")
async def healthcheck() -> Dict[str, str]:
    return {"status": "ok"}
