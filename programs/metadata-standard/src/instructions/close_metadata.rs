use crate::{constants::*, errors::*, events::ClosedMetadata, state::Metadata};
use anchor_lang::prelude::*;
use anchor_spl::associated_token::get_associated_token_address_with_program_id;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

pub fn close_metadata(ctx: Context<CloseMetadata>) -> Result<()> {
    emit!(ClosedMetadata {
        metadata: ctx.accounts.metadata.key()
    });

    Ok(())
}

// Only the holder can close the metadata
#[derive(Accounts)]
pub struct CloseMetadata<'info> {
    #[account(mut)]
    pub holder: Signer<'info>,

    #[account(
        mint::token_program = token_program,
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        address = get_associated_token_address_with_program_id(
            holder.key,
            &mint.key(),
            token_program.key
        ),
        constraint = mint_account.amount > 0 @ MetadataStandardError::NotHolder,
    )]
    pub mint_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        close = holder,
        seeds = [
            METADATA_SEED.as_ref(),
            metadata.mint.key().as_ref()
        ],
        bump,
        has_one = mint,
    )]
    pub metadata: Account<'info, Metadata>,

    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}
