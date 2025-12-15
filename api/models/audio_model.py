from pydantic import BaseModel
from typing import List

class UploadAudioData(BaseModel):
  file_url: str
  
class AudioConfig(BaseModel):
  # add more config params
  username: str
  file_path: str
  retune_speed: float
  humanize: float
  pitch_shift: float
  noise_filtering_enabled: bool
  
  fx_enabled: bool
  air: float
  compression: float
  chorus: float
  reverb: float
  delay: float
   

class MetadataInfo(BaseModel):
  filename: str
  encoded_data: str  # Base64-encoded string

class AllAudioFilesResponse(BaseModel):
  username: str
  raw_files: List[MetadataInfo]
  processed_files: List[MetadataInfo]