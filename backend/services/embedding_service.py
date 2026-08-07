import uuid

from fastembed import TextEmbedding
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct ,Distance, VectorParams

from core.config import settings


_model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5", cache_dir=".fastembed_cache")
_client = QdrantClient(url=settings.QDRANT_URL)

VECTOR_SIZE = 384

def _ensure_collection (collection_name) -> None:
    if not _client.collection_exists(collection_name):
        _client.create_collection(collection_name=collection_name, vectors_config=VectorParams(size=VECTOR_SIZE,distance=Distance.COSINE))
        


def generate_embedding(text:str) -> list[float]:
    embedding = list(_model.embed([text]))
    return embedding[0].tolist()


def upsert_vector(collection_name:str, point_id:uuid.UUID, text:str,payload:dict) ->None:
    _ensure_collection(collection_name)
    vector = generate_embedding(text)
    _client.upsert(
        collection_name=collection_name,
        points=[PointStruct(id=str(point_id), vector=vector,payload=payload)]
    )
        
def delete_vector(collection_name:str, point_id:uuid.UUID) -> None:
    if _client.collection_exists(collection_name):
        _client.delete(collection_name=collection_name,points_selector=[str(point_id)])