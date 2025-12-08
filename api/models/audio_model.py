from pydantic import BaseModel
from typing import List

class UploadAudioData(BaseModel):
  file_url: str
  
class AudioConfig(BaseModel):
  # add more config params
  username: str
  file_path: str
  volume: int
  flex_tune: float      
  retune_speed: float    
  humanize: float       
  vibrato: float        

class MetadataInfo(BaseModel):
  filename: str
  encoded_data: str  # Base64-encoded string

class AllAudioFilesResponse(BaseModel):
  username: str
  raw_files: List[MetadataInfo]
  processed_files: List[MetadataInfo]