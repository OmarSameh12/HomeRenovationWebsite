"""Widen enquiry_images.file_url to TEXT for base64 data URIs

Revision ID: f7a2c9d41e08
Revises: 0bdd8a60e9a6
Create Date: 2026-08-26

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f7a2c9d41e08'
down_revision: Union[str, Sequence[str], None] = '0bdd8a60e9a6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # VARCHAR(500) cannot hold base64 data URIs uploaded for enquiries.
    op.alter_column(
        'enquiry_images',
        'file_url',
        existing_type=sa.String(length=500),
        type_=sa.Text(),
        existing_nullable=False,
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column(
        'enquiry_images',
        'file_url',
        existing_type=sa.Text(),
        type_=sa.String(length=500),
        existing_nullable=False,
    )
