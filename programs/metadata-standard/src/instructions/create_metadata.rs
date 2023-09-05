use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenInterface};

use crate::{
    constants::*,
    errors::*,
    events::CreatedMetadata,
    state::{AuthoritiesGroup, Metadata, MetadataData},
};

pub fn create_metadata(
    ctx: Context<CreateMetadata>,
    name: String,
    hash: [u8; 32],
    data: MetadataData,
) -> Result<()> {
    let metadata = &mut ctx.accounts.metadata;
    metadata.mint = ctx.accounts.mint.key();
    metadata.authorities_group = ctx.accounts.authorities_group.key();
    metadata.creation_slot = Clock::get()?.slot;
    metadata.name = name;
    metadata.content_hash = hash;
    metadata.data = data;

    emit!(CreatedMetadata {
        metadata: metadata.key()
    });

    Ok(())
}

#[derive(Accounts)]
pub struct CreateMetadata<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    pub admin: Signer<'info>,

    #[account(
        seeds = [
            AUTHORITIES_SEED.as_ref(),
            authorities_group.id.as_ref()
        ],
        bump
    )]
    pub authorities_group: Account<'info, AuthoritiesGroup>,

    #[account(
        mint::token_program = token_program,
        constraint = mint.mint_authority == Some(admin.key()).into() @ MetadataStandardError::InvalidAuthority,
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        init,
        payer = payer,
        space = Metadata::LEN,
        seeds = [
            METADATA_SEED.as_ref(),
            mint.key().as_ref()
        ],
        bump
    )]
    pub metadata: Account<'info, Metadata>,

    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}
