from fastapi import WebSocket
from typing import TypedDict, Union

class Session(TypedDict):
  room: str
  initiator_role: str
  connection: WebSocket