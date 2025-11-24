from pydantic import BaseModel

class UploadAudioData(BaseModel):
  file_url: str
  
class AudioConfig(BaseModel):
  # add more config params
  file_path: str
  volume: int