use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenInterface};

use crate::{
    constants::*,
    errors::*,
    state::{AuthoritiesGroup, Metadata, MetadataData, OnchainDataType},
};

pub fn create_external_metadata(ctx: Context<CreateMetadata>, uri: String) -> Result<()> {
    let metadata = &mut ctx.accounts.metadata;
    metadata.mint = ctx.accounts.mint.key();
    metadata.authorities_group = ctx.accounts.authorities_group.key();
    metadata.data = MetadataData::External { uri };

    Ok(())
}

pub fn create_reference_metadata(
    ctx: Context<CreateMetadata>,
    metadata_account: Pubkey,
) -> Result<()> {
    let metadata = &mut ctx.accounts.metadata;
    metadata.mint = ctx.accounts.mint.key();
    metadata.authorities_group = ctx.accounts.authorities_group.key();
    metadata.data = MetadataData::Reference { metadata_account };

    Ok(())
}

pub fn create_onchain_metadata(
    ctx: Context<CreateMetadata>,
    data_type: u8,
    data_account: Pubkey,
) -> Result<()> {
    let metadata = &mut ctx.accounts.metadata;
    metadata.mint = ctx.accounts.mint.key();
    metadata.authorities_group = ctx.accounts.authorities_group.key();
    metadata.data = MetadataData::Onchain {
        data_type: OnchainDataType::from(data_type),
        data_account,
    };

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
    pub system_program: Program<'info, System>,
}
