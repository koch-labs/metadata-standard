use anchor_lang::prelude::*;

use crate::{
    constants::*,
    events::*,
    state::{AuthoritiesGroup, Metadata, MetadataData},
};

pub fn update_metadata(
    ctx: Context<UpdateMetadata>,
    name: String,
    hash: [u8; 32],
    data: MetadataData,
) -> Result<()> {
    let metadata = &mut ctx.accounts.metadata;
    metadata.name = name;
    metadata.content_hash = hash;
    metadata.data = data;

    emit!(UpdatedMetadata {
        metadata: metadata.key()
    });

    Ok(())
}

#[derive(Accounts)]
pub struct UpdateMetadata<'info> {
    #[account(mut)]
    pub metadata_authority: Signer<'info>,

    #[account(
        seeds = [
            AUTHORITIES_SEED.as_ref(),
            authorities_group.id.as_ref()
        ],
        bump,
        has_one = metadata_authority,
    )]
    pub authorities_group: Account<'info, AuthoritiesGroup>,

    #[account(
        mut,
        seeds = [
            METADATA_SEED.as_ref(),
            metadata.mint.key().as_ref()
        ],
        bump,
        has_one = authorities_group,
    )]
    pub metadata: Account<'info, Metadata>,
}
