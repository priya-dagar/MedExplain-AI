"""add profile fields to users

Revision ID: 8a6720bcd4ba
Revises: 199949cb28bb
Create Date: 2026-07-18 17:15:37.363646

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8a6720bcd4ba'
down_revision: Union[str, Sequence[str], None] = '199949cb28bb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('age', sa.Integer(), nullable=True))
    op.add_column('users', sa.Column('gender', sa.String(), nullable=True))
    op.add_column('users', sa.Column('blood_group', sa.String(), nullable=True))
    op.add_column('users', sa.Column('allergies', sa.String(), nullable=True))
    op.add_column('users', sa.Column('medical_history', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('users', 'medical_history')
    op.drop_column('users', 'allergies')
    op.drop_column('users', 'blood_group')
    op.drop_column('users', 'gender')
    op.drop_column('users', 'age')