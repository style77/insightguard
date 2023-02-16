"""create user table

Revision ID: 4e3f6b2aec5f
Revises:
Create Date: 2023-02-16 19:14:08.910384

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '4e3f6b2aec5f'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'user',
        sa.Column('id', sa.UUID, primary_key=True),
        sa.Column('username', sa.String(50), unique=True, nullable=False),
        sa.Column('hashed_password', sa.String(100), nullable=False),
        sa.Column('email', sa.String(100), unique=True, nullable=False),
        sa.Column('full_name', sa.String(100), nullable=True),
        sa.Column('company', sa.String(100), nullable=True),
        sa.Column('disabled', sa.Boolean, nullable=False, default=True),
        sa.Column('account_type', sa.Enum('free', 'developer', 'enterprise',
                                          name='account_type_enum'),
                  nullable=False, default='free'),

    )


def downgrade() -> None:
    op.drop_table('user')
