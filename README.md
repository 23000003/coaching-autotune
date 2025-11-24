## Todo
1. Apply audio configuration panels and algorithm for autotune.
2. Real-time communication with coaches (chat-based).
3. Coaches can view user's audio config panel.
4. Landing page for entering sessions/rooms.

## Audio Processing Flow
```bash
  User records audio with configured audio settings
  ⬇️
  Client sends audio + config values to backend
  ⬇️
  Backend processes audio (audio signal algorithms)
  ⬇️
  Backend sends processed audio back to client
  ⬇️
  User and coach play/review the modified audio
```

## Fastapi
```bash
  python -m venv venv # environment
  
  venv\Scripts\activate # windows

  pip install -r requirements.txt # install packages
  
  uvicorn main:app --reload # run
```