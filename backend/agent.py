from __future__ import annotations

import asyncio
import logging
import os
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage, ToolMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_mcp_adapters.client import MultiServerMCPClient

logger = logging.getLogger(__name__)


def create_system_prompt() -> str:
    """Prompt base que guia al agente al momento de orquestar la campana."""
    return (
        "Eres un experto Community Manager. Tu tarea es generar y publicar una campana "
        "completa en redes sociales usando las herramientas disponibles. Debes seguir "
        "las instrucciones del usuario al pie de la letra, usando las herramientas "
        "`subir_tweet`, `subir_post_linkedin` y `subir_publicacion_instagram`."
    )


def create_user_input(producto: str, publico: str) -> str:
    """Prompt de usuario que alimenta al LLM con el contexto concreto."""
    return (
        "Genera y publica una campana completa para el siguiente caso:\n"
        f"- Producto: {producto}\n"
        f"- Publico Objetivo: {publico}\n\n"
        "Sigue estos pasos OBLIGATORIAMENTE:\n"
        "1. Genera un hilo de TRES tweets creativos y atractivos. Llama a la herramienta "
        "`subir_tweet` UNA VEZ POR CADA TWEET. Deben ser tres llamadas separadas.\n"
        "2. Genera UN post profesional y bien estructurado para LinkedIn. Llama a la "
        "herramienta `subir_post_linkedin` para publicarlo.\n"
        "3. Genera UNA descripcion llamativa para Instagram, incluyendo emojis relevantes "
        "y al menos 3 hashtags. Llama a la herramienta `subir_publicacion_instagram` "
        "para publicarla.\n"
        "4. Al finalizar todas las publicaciones, responde con un resumen de lo que hiciste."
    )


def _stringify_content(content: Any) -> str:
    """Convierte el payload de LangChain a string plain-text."""
    if content is None:
        return ""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        return "\n".join(str(item) for item in content if item)
    if isinstance(content, dict):
        return "\n".join(f"{key}: {value}" for key, value in content.items())
    return str(content)


def _now_utc_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass
class CampaignResult:
    producto: str
    publico_objetivo: str
    tweets: List[str] = field(default_factory=list)
    linkedin_post: Optional[str] = None
    instagram_post: Optional[str] = None
    resumen: Optional[str] = None
    generated_at: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "producto": self.producto,
            "publico_objetivo": self.publico_objetivo,
            "tweets": self.tweets,
            "linkedin_post": self.linkedin_post,
            "instagram_post": self.instagram_post,
            "resumen": self.resumen,
            "generated_at": self.generated_at,
        }


class CampaignAgent:
    """Encapsula la logica necesaria para conversar con el servidor MCP."""

    def __init__(
        self,
        *,
        model_name: str = "gemini-2.5-pro",
        temperature: float = 0.7,
        server_url: Optional[str] = None,
    ) -> None:
        load_dotenv()
        if not os.getenv("GOOGLE_API_KEY"):
            raise ValueError(
                "No se encontro la GOOGLE_API_KEY. Crea un archivo .env con tu clave."
            )

        self.model_name = model_name
        self.temperature = temperature
        self.server_url = server_url or os.getenv(
            "MCP_SERVER_URL", "http://localhost:8000/mcp"
        )

    def _create_llm(self) -> ChatGoogleGenerativeAI:
        return ChatGoogleGenerativeAI(
            model=self.model_name,
            temperature=self.temperature,
        )

    def _create_client(self) -> MultiServerMCPClient:
        return MultiServerMCPClient(
            {
                "campaign_tools": {
                    "transport": "streamable_http",
                    "url": self.server_url,
                }
            }
        )

    async def generate_campaign(self, producto: str, publico: str) -> CampaignResult:
        """Ejecuta todo el flujo de tool calling y devuelve los posteos generados."""
        llm = self._create_llm()
        client = self._create_client()
        mcp_tools = await client.get_tools()
        tool_names = {tool.name: tool for tool in mcp_tools}

        messages: List[Any] = [
            SystemMessage(content=create_system_prompt()),
            HumanMessage(content=create_user_input(producto, publico)),
        ]
        result = CampaignResult(
            producto=producto,
            publico_objetivo=publico,
            generated_at=_now_utc_iso(),
        )

        while True:
            response: AIMessage = await llm.ainvoke(messages, tools=mcp_tools)
            messages.append(response)

            if response.tool_calls:
                tool_response_messages: List[ToolMessage] = []
                for tool_call in response.tool_calls:
                    tool_name = tool_call["name"]
                    tool_args = tool_call.get("args") or {}
                    tool_id = tool_call.get("id")

                    self._capture_tool_payload(tool_name, tool_args, result)

                    tool_object = tool_names.get(tool_name)
                    if tool_object is None:
                        raise ValueError(f"Herramienta desconocida solicitada: {tool_name}")

                    tool_output = await tool_object.ainvoke(tool_args)
                    tool_response_messages.append(
                        ToolMessage(content=tool_output, tool_call_id=tool_id)
                    )

                messages.extend(tool_response_messages)
                continue

            result.resumen = _stringify_content(response.content).strip()
            return result

    @staticmethod
    def _capture_tool_payload(
        tool_name: str, tool_args: Dict[str, Any], result: CampaignResult
    ) -> None:
        """Mantiene un registro local de lo que el agente fue publicando."""
        contenido = tool_args.get("contenido")
        if not isinstance(contenido, str):
            return

        if tool_name == "subir_tweet":
            result.tweets.append(contenido)
        elif tool_name == "subir_post_linkedin":
            result.linkedin_post = contenido
        elif tool_name == "subir_publicacion_instagram":
            result.instagram_post = contenido


async def run_campaign_agent_cli() -> None:
    """CLI simple para probar al agente sin el frontend."""
    agent = CampaignAgent()
    print("Asistente de Campanas para Redes Sociales Activado")
    print("--------------------------------------------------")
    producto = input("Por favor, ingresa el nombre del producto: ").strip()
    publico = input("Ahora, describe el publico objetivo: ").strip()

    print("\nEl agente esta procesando tu solicitud y generando la campana...\n")
    result = await agent.generate_campaign(producto, publico)
    print("Campana completada exitosamente!")
    print("Tweets generados:")
    for idx, tweet in enumerate(result.tweets, 1):
        print(f"  {idx}. {tweet}")

    if result.linkedin_post:
        print("\nPost de LinkedIn:\n", result.linkedin_post)
    if result.instagram_post:
        print("\nDescripcion de Instagram:\n", result.instagram_post)
    if result.resumen:
        print("\nResumen del agente:\n", result.resumen)


if __name__ == "__main__":
    try:
        asyncio.run(run_campaign_agent_cli())
    except KeyboardInterrupt:
        print("\nSaliendo del programa.")
    except Exception as exc:  # pragma: no cover - CLI helper
        logger.exception("Ocurrio un error critico al ejecutar el agente")
        raise exc
