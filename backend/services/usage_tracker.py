import uuid

from sqlalchemy import func
from sqlalchemy.orm import Session

from core.constants import GPT_4O_MINI_INPUT_PRICE_PER_1M, GPT_4O_MINI_OUTPUT_PRICE_PER_1M, LLMFeature
from core.config import settings
from core.exceptions import BudgetExceededError
from models.llm_usage_log import LLMUsageLog


def _estimate_cost(input_tokens: int, output_tokens: int) -> float:
    return (
        (input_tokens / 1_000_000) * GPT_4O_MINI_INPUT_PRICE_PER_1M
        + (output_tokens / 1_000_000) * GPT_4O_MINI_OUTPUT_PRICE_PER_1M
    )


def get_total_spend(db: Session) -> float:
    total = db.query(func.sum(LLMUsageLog.estimated_cost_usd)).scalar()
    return float(total or 0)


def ensure_budget_available(db: Session) -> None:
    if get_total_spend(db) >= settings.MAX_LLM_SPEND_USD:
        raise BudgetExceededError("Demo LLM budget reached — this feature is temporarily paused")


def record_usage(db: Session, user_id: uuid.UUID, feature: LLMFeature, input_tokens: int, output_tokens: int) -> None:
    log = LLMUsageLog(
        user_id=user_id,
        feature=feature,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        estimated_cost_usd=_estimate_cost(input_tokens, output_tokens),
    )
    db.add(log)
    db.commit()