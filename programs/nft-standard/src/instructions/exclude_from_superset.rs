use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{Mint, TokenAccount, TokenInterface},
};

use crate::{
    constants::*,
    errors::*,
    state::{Metadata, SupersetInclusion},
};

pub fn exclude_from_superset(_: Context<ExcludeFromSuperset>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct ExcludeFromSuperset<'info> {
    /// CHECK: Only receives the fee
    #[account(mut)]
    pub holder: AccountInfo<'info>,

    #[account(
        seeds = [
            METADATA_SEED.as_ref(),
            parent_metadata.mint.as_ref()
        ],
        bump,
    )]
    pub parent_metadata: Account<'info, Metadata>,

    #[account(
        seeds = [
            METADATA_SEED.as_ref(),
            child_metadata.mint.as_ref()
        ],
        bump,
        has_one = mint,
    )]
    pub child_metadata: Account<'info, Metadata>,

    #[account(
        mut,
        close = holder,
        seeds = [
            SUPERSET_SEED.as_ref(),
            parent_metadata.key().as_ref(),
            child_metadata.key().as_ref(),
        ],
        bump
    )]
    pub inclusion: Account<'info, SupersetInclusion>,

    #[account(
        mint::decimals = 0,
        mint::token_program = token_program,
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        seeds = [
            holder.key().as_ref(),
            token_program.key().as_ref(),
            mint.key().as_ref(),
        ],
        bump,
        seeds::program = associated_token_program.key(),
        constraint = token_account.amount == 1 @ NftStandardError::NotHolder,
    )]
    pub token_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
