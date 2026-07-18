"""add missing otp_code column

Revision ID: 199949cb28bb
Revises: 1175ff3bcef3
Create Date: 2026-07-16 22:00:27.456038

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '199949cb28bb'
down_revision: Union[str, Sequence[str], None] = '1175ff3bcef3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('otp_code', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('users', 'otp_code')