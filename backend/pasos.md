# Pasos para levantar el backend MCP

1. Clona este repo y parate en la carpeta `mcp`.
2. Instala `uv` de forma global y crea un entorno: `uv venv venv`.
3. Activa el entorno (`venv\Scripts\activate` en Windows) y ejecuta
   `uv pip install -r requirements.txt`.
4. Arranca el servidor MCP que expone las herramientas de redes sociales:
   `uv run python server.py`.
5. En otra terminal levanta el backend FastAPI que usa el modelo/agent:
   `uv run uvicorn backend:app --host 0.0.0.0 --port 5001`.
6. El frontend (carpeta `frontend`) debe apuntar al puerto 5001
   (`VITE_API_URL=http://localhost:5001`). Desde ahi obtiene los posteos.

> Opcional: podes correr `uv run python agent.py` para probar el agente de
> manera manual en la consola sin necesidad del frontend.
