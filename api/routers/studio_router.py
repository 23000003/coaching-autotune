from fastapi import WebSocket, APIRouter
from typing import List
from services.studio_service import room_manager, room_manager_learners_values, RoomManagerPayload
from config.session import Session

studio_session: List[Session] = []
studio_session_config_values: List[Session] = []

router = APIRouter(
    prefix="/studio",
    tags=["studio"]
)

@router.get("/sessions")
async def get_all_sessions():
    rooms: str = {}

    for session in studio_session:
        room_id = session["room"]

        if room_id not in rooms:
            rooms[room_id] = {
                "room_id": room_id,
                "has_coach": False,
                "has_learner": False
            }

        if session["initiator_role"] == "COACH":
            rooms[room_id]["has_coach"] = True
        elif session["initiator_role"] == "LEARNER":
            rooms[room_id]["has_learner"] = True

    return {"rooms": list(rooms.values())}


@router.websocket("/ws/{room}/{role}")
async def user_chat_websocket(websocket: WebSocket, room: str, role: str):
    payload: RoomManagerPayload = {
        "room": room,
        "session": studio_session
    }
    await room_manager(payload, websocket, role)


@router.websocket("/ws/{room}/{role}/config-values")
async def config_values_websocket(websocket: WebSocket, room: str, role: str):
    payload: RoomManagerPayload = {
        "room": room,
        "session": studio_session_config_values
    }
    await room_manager_learners_values(payload, websocket, role)
    await room_manager(payload, websocket, role)