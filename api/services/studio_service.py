from fastapi import WebSocket
from fastapi.websockets import WebSocketDisconnect
from typing import TypedDict, List
import json
from config.session import Session
from utils.logger import logger
from datetime import datetime

class RoomManagerPayload(TypedDict):
    room: str
    session: List[Session]


async def room_manager(p: RoomManagerPayload, websocket: WebSocket, role: str):
    room = p["room"]
    session_list = p["session"]

    await websocket.accept()

    session: Session = {
        "room": room,
        "initiator_role": role,
        "connection": websocket
    }
    session_list.append(session)

    logger.info(f"{role} joined room {room}")

    if role == "COACH":
        coach_joined_message = json.dumps({
            "sender": "SYSTEM",
            "text": "Coach has joined the room",
            "timestamp": datetime.now().isoformat()
        })

        for s in session_list:
            if s["room"] == room and s["connection"] != websocket:
                try:
                    await s["connection"].send_text(coach_joined_message)
                except Exception as e:
                    logger.error(f"Error notifying coach join: {e}")

    try:
        while True:
            raw = await websocket.receive_text()
            logger.info(f"Received message from {role} in room {room}: {raw}")
            
            try:
                payload = json.loads(raw)

                message = json.dumps({
                    "room": room,
                    "sender": role,
                    "text": payload.get("text"),
                    "timestamp": payload.get("timestamp")
                })

                # Broadcast to all connections in this room
                for s in session_list:
                    if s["room"] == room:
                        try:
                            await s["connection"].send_text(message)
                            logger.info(f"Message sent to {s['initiator_role']} in room {room}")
                        except Exception as send_err:
                            logger.error(f"Error sending message to {s['initiator_role']}: {send_err}")
                            # Try to remove disconnected session
                            try:
                                session_list.remove(s)
                            except ValueError:
                                pass
                                
            except json.JSONDecodeError as json_err:
                logger.error(f"Invalid JSON received: {json_err}")
                await websocket.send_text(json.dumps({
                    "error": "Invalid message format",
                    "text": "Message must be valid JSON"
                }))

    except WebSocketDisconnect:
        logger.info(f"{role} disconnected from room {room}")

    except Exception as e:
        logger.error(f"Unexpected error in room {room}: {e}", exc_info=True)

    finally:
        # Cleanup: Remove this session
        try:
            session_list.remove(session)
        except ValueError:
            pass

        # Notify remaining users
        disconnect_message = json.dumps({
            "sender": "SYSTEM",
            "text": f"{role.capitalize()} left the room",
            "timestamp": datetime.now().isoformat()
        })

        for s in session_list:
            if s["room"] == room:
                try:
                    await s["connection"].send_text(disconnect_message)
                except Exception as notify_err:
                    logger.error(f"Error sending disconnect notification: {notify_err}")

        logger.info(
            f"Room {room} now has "
            f"{len([s for s in session_list if s['room'] == room])} connections"
        )


async def room_manager_learners_values(p: RoomManagerPayload, websocket: WebSocket, role: str):
    room = p["room"]
    session_list = p["session"]

    await websocket.accept()

    session: Session = {
        "room": room,
        "initiator_role": role,
        "connection": websocket
    }
    session_list.append(session)
    
    try:
        while True:
            raw = await websocket.receive_text()
            logger.info(f"Received message from {role} in room {room}: {raw}")
            
            try:
                payload = json.loads(raw)

                audio_config = {
                    "retune_speed": payload.get("retune_speed"),
                    "humanize": payload.get("humanize"),
                    "pitch_shift": payload.get("pitch_shift"),
                    "noise_filtering_enabled": payload.get("noise_filtering_enabled"),
                    "fx_enabled": payload.get("fx_enabled"),
                    "air": payload.get("air"),
                    "compression": payload.get("compression"),
                    "chorus": payload.get("chorus"),
                    "reverb": payload.get("reverb"),
                    "delay": payload.get("delay")
                }

                message = json.dumps({
                    "audio_config": audio_config,
                })

                # Broadcast to all connections in this room
                for s in session_list:
                    if s["room"] == room:
                        try:
                            await s["connection"].send_text(message)
                            logger.info(f"Message sent to {s['initiator_role']} in room {room}")
                        except Exception as send_err:
                            logger.error(f"Error sending message to {s['initiator_role']}: {send_err}")
                            # Try to remove disconnected session
                            try:
                                session_list.remove(s)
                            except ValueError:
                                pass
                                
            except json.JSONDecodeError as json_err:
                logger.error(f"Invalid JSON received: {json_err}")
                await websocket.send_text(json.dumps({
                    "error": "Invalid message format",
                    "text": "Message must be valid JSON"
                }))

    except WebSocketDisconnect:
        logger.info(f"{role} disconnected from room {room}")

    except Exception as e:
        logger.error(f"Unexpected error in room {room}: {e}", exc_info=True)

    finally:
        # Cleanup: Remove this session
        try:
            session_list.remove(session)
        except ValueError:
            pass

        # Notify remaining users
        disconnect_message = json.dumps({
            "sender": "SYSTEM",
            "text": f"{role.capitalize()} left the room",
            "timestamp": datetime.now().isoformat()
        })

        for s in session_list:
            if s["room"] == room:
                try:
                    await s["connection"].send_text(disconnect_message)
                except Exception as notify_err:
                    logger.error(f"Error sending disconnect notification: {notify_err}")

        logger.info(
            f"Room {room} now has "
            f"{len([s for s in session_list if s['room'] == room])} connections"
        )