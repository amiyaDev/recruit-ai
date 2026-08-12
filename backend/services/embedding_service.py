import uuid
import math
from fastembed import TextEmbedding
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct ,Distance, VectorParams

from core.config import settings


_model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5", cache_dir=".fastembed_cache")
_client = QdrantClient(url=settings.QDRANT_URL, api_key=settings.QDRANT_API_KEY)

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
        


def get_vector(collection_name: str, point_id: uuid.UUID) -> list[float] | None:
    points = _client.retrieve(collection_name=collection_name, ids=[str(point_id)], with_vectors=True)
    if not points:
        return None
    return points[0].vector


def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)