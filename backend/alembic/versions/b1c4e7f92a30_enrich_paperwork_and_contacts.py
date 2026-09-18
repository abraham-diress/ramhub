"""enrich paperwork and contacts with phases, steps, and sourcing

Revision ID: b1c4e7f92a30
Revises: 4ae877d3982d
Create Date: 2026-09-18 10:12:04.118225

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b1c4e7f92a30'
down_revision: Union[str, Sequence[str], None] = '4ae877d3982d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('contacts', sa.Column('category', sa.String(length=50), nullable=False, server_default='general'))
    op.add_column('contacts', sa.Column('website', sa.String(length=500), nullable=True))
    op.add_column('contacts', sa.Column('rose_hill_location', sa.String(length=200), nullable=True))
    op.add_column('contacts', sa.Column('lincoln_center_location', sa.String(length=200), nullable=True))
    op.alter_column('contacts', 'phone', existing_type=sa.String(length=50), type_=sa.String(length=100))
    op.create_index(op.f('ix_contacts_category'), 'contacts', ['category'])

    op.add_column(
        'paperwork_items',
        sa.Column('phase', sa.String(length=40), nullable=False, server_default='first_semester'),
    )
    op.add_column('paperwork_items', sa.Column('position', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('paperwork_items', sa.Column('steps', sa.JSON(), nullable=True))
    op.add_column(
        'paperwork_items',
        sa.Column('is_critical', sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.add_column('paperwork_items', sa.Column('source_name', sa.String(length=200), nullable=True))
    op.add_column('paperwork_items', sa.Column('source_url', sa.String(length=500), nullable=True))
    op.add_column('paperwork_items', sa.Column('last_verified', sa.Date(), nullable=True))
    op.create_index(op.f('ix_paperwork_items_phase'), 'paperwork_items', ['phase'])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_paperwork_items_phase'), table_name='paperwork_items')
    op.drop_column('paperwork_items', 'last_verified')
    op.drop_column('paperwork_items', 'source_url')
    op.drop_column('paperwork_items', 'source_name')
    op.drop_column('paperwork_items', 'is_critical')
    op.drop_column('paperwork_items', 'steps')
    op.drop_column('paperwork_items', 'position')
    op.drop_column('paperwork_items', 'phase')

    op.drop_index(op.f('ix_contacts_category'), table_name='contacts')
    op.alter_column('contacts', 'phone', existing_type=sa.String(length=100), type_=sa.String(length=50))
    op.drop_column('contacts', 'lincoln_center_location')
    op.drop_column('contacts', 'rose_hill_location')
    op.drop_column('contacts', 'website')
    op.drop_column('contacts', 'category')
