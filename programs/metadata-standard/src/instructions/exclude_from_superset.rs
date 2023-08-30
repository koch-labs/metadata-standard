use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::get_associated_token_address_with_program_id,
    token_interface::{Mint, TokenAccount, TokenInterface},
};

use crate::{
    constants::*,
    errors::*,
    events::ExcludedFromSuperset,
    state::{Metadata, SupersetInclusion},
};

pub fn exclude_from_superset(ctx: Context<ExcludeFromSuperset>) -> Result<()> {
    emit!(ExcludedFromSuperset {
        parent_metadata: ctx.accounts.parent_metadata.key(),
        child_metadata: ctx.accounts.child_metadata.key()
    });

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
        mut,
        address = get_associated_token_address_with_program_id(
            &holder.key(),
            &mint.key(),
            &token_program.key(),
        ),
        constraint = token_account.amount == 1 @ MetadataStandardError::NotHolder,
    )]
    pub token_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}
