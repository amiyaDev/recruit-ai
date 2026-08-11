"""add missing llmfeature enum values

The `llmfeature` Postgres enum was created with only ATS_SUGGESTIONS
(Phase 4). core/constants.py's LLMFeature enum gained INTERVIEW_GENERATE,
INTERVIEW_EVALUATE, and CHAT for Phase 5, but no migration ever added them
to the database type — record_usage() fails with
"invalid input value for enum llmfeature" the first time any Phase 5
feature actually calls it.

Revision ID: 16e3d439eb2a
Revises: 6723cdd110ce
Create Date: 2026-08-11 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '16e3d439eb2a'
down_revision: Union[str, Sequence[str], None] = '6723cdd110ce'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


NEW_VALUES = ["INTERVIEW_GENERATE", "INTERVIEW_EVALUATE", "CHAT"]


def upgrade() -> None:
    for value in NEW_VALUES:
        op.execute(f"ALTER TYPE llmfeature ADD VALUE IF NOT EXISTS '{value}'")


def downgrade() -> None:
    # Postgres doesn't support removing enum values directly. Downgrading
    # would require recreating the type and remapping llm_usage_log.feature,
    # which risks data loss for rows already using these values — left as a
    # no-op since this migration is purely additive.
    pass
