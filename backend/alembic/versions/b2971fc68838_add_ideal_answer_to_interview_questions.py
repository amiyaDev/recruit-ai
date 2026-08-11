"""add ideal_answer to interview_questions

Revision ID: b2971fc68838
Revises: 16e3d439eb2a
Create Date: 2026-08-11 08:32:48.743610

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b2971fc68838'
down_revision: Union[str, Sequence[str], None] = '16e3d439eb2a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('interview_questions', sa.Column('ideal_answer', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('interview_questions', 'ideal_answer')