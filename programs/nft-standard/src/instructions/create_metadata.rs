use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{Mint, TokenInterface},
};

use crate::{
    constants::*,
    errors::*,
    state::{AuthoritiesGroup, Metadata, MetadataData},
};

pub fn create_metadata(ctx: Context<CreateMetadata>, data: MetadataData) -> Result<()> {
    let metadata = &mut ctx.accounts.metadata;
    metadata.mint = ctx.accounts.mint.key();
    metadata.authorities_group = ctx.accounts.authorities_group.key();
    metadata.data = data;

    Ok(())
}

#[derive(Accounts)]
pub struct CreateMetadata<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

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
        constraint = mint.decimals == 0 @ NftStandardError::InvalidMint,
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
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
