# api/middleware/response_handler.py

import json

from fastapi.responses import JSONResponse, StreamingResponse, FileResponse
from starlette.middleware.base import BaseHTTPMiddleware


class ResponseMiddleware(BaseHTTPMiddleware):
    EXCLUDED_PATHS = {
        "/docs",
        "/redoc",
        "/openapi.json",
        "/favicon.ico",
    }

    async def dispatch(self, request, call_next):
        # Skip Swagger and other excluded routes
        if request.url.path in self.EXCLUDED_PATHS:
            return await call_next(request)

        response = await call_next(request)

        # Skip error responses
        if response.status_code >= 400:
            return response

        # Skip streaming and file responses
        if isinstance(response, (StreamingResponse, FileResponse)):
            return response

        # Skip non-JSON responses
        content_type = response.headers.get("content-type", "")

        if "application/json" not in content_type:
            return response

        body = b""

        async for chunk in response.body_iterator:
            body += chunk

        try:
            content = json.loads(body.decode())
        except Exception:
            return response

        return JSONResponse(
            status_code=response.status_code,
            content={
                "success": True,
                "message": "Request successful",
                "data": content,
            },
        )