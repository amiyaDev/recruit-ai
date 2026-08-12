"""add resume ownership, parsing fields

Revision ID: 49b9b5cd09a8
Revises: e5daac586cac
Create Date: 2026-08-06 17:32:06.310775

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '49b9b5cd09a8'
down_revision: Union[str, Sequence[str], None] = 'e5daac586cac'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # The initial migration created an outdated resumes table.
    # Since this migration changes the table structure substantially,
    # recreate it with the current schema.

    op.drop_table("resumes")

    op.create_table(
        "resumes",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("filename", sa.String(), nullable=False),
        sa.Column("file_path", sa.String(), nullable=False),
        sa.Column(
            "file_type",
            sa.Enum("PDF", "DOCX", name="resumefiletype"),
            nullable=False,
        ),
        sa.Column("raw_text", sa.String(), nullable=True),
        sa.Column(
            "parsed_data",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=True,
        ),
        sa.Column(
            "status",
            sa.Enum(
                "UPLOADED",
                "PARSING",
                "PARSED",
                "FAILED",
                name="resumestatus",
            ),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        op.f("ix_resumes_user_id"),
        "resumes",
        ["user_id"],
        unique=False,
    )

def downgrade() -> None:
    """Downgrade schema."""

    op.drop_index(
        op.f("ix_resumes_user_id"),
        table_name="resumes",
    )

    op.drop_table("resumes")

    op.create_table(
        "resumes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("filename", sa.String(), nullable=False),
        sa.Column("file_path", sa.String(), nullable=False),
        sa.Column("extracted_text", sa.String(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
