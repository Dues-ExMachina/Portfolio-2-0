from fastapi import APIRouter
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
from app.services.chat_service import get_chat_response


router = APIRouter()


headers={
    "Cache-Control": "no-cache",
    "X-Accel-Buffering": "no"
}

class ChatRequest(BaseModel):
    message: str
    session_id: str
    history: list



@router.post('/chat')
async def chat(data:ChatRequest):
    return StreamingResponse(
        get_chat_response(data.message,data.history),
        media_type='text/event-stream',
        headers=headers
    )
