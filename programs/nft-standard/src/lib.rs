pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

use anchor_lang::prelude::*;

declare_id!("9msweUGitRR1ELUe4XZi6xhecPCko54kSqSnfWH7LLiZ");

#[program]
pub mod nft_standard {

    use super::*;

    pub fn create_authorities_group(
        ctx: Context<CreateAuthoritiesGroup>,
        id: Pubkey,
        update_authority: Pubkey,
        inclusion_authority: Pubkey,
    ) -> Result<()> {
        instructions::create_authorities_group(ctx, id, update_authority, inclusion_authority)
    }

    pub fn update_authorities_group(
        ctx: Context<UpdateAuthoritiesGroup>,
        update_authority: Pubkey,
        inclusion_authority: Pubkey,
    ) -> Result<()> {
        instructions::update_authorities_group(ctx, update_authority, inclusion_authority)
    }

    pub fn create_external_metadata(ctx: Context<CreateMetadata>, uri: String) -> Result<()> {
        instructions::create_external_metadata(ctx, uri)
    }

    pub fn create_reference_metadata(
        ctx: Context<CreateMetadata>,
        metadata_account: Pubkey,
    ) -> Result<()> {
        instructions::create_reference_metadata(ctx, metadata_account)
    }

    pub fn create_onchain_metadata(
        ctx: Context<CreateMetadata>,
        data_type: u8,
        data_account: Pubkey,
    ) -> Result<()> {
        instructions::create_onchain_metadata(ctx, data_type, data_account)
    }

    pub fn include_in_set(ctx: Context<IncludeInSet>) -> Result<()> {
        instructions::include_in_set(ctx)
    }

    pub fn exclude_from_set(ctx: Context<ExcludeFromSet>) -> Result<()> {
        instructions::exclude_from_set(ctx)
    }

    /// Verification path is passed as remaining accounts in the form `[Metadata, Inclusion, Metadata, Inclusion, ...]`
    /// Only pass bumps of inclusions
    pub fn include_in_superset(ctx: Context<IncludeInSuperset>, bumps: Vec<u8>) -> Result<()> {
        instructions::include_in_superset(ctx, &bumps)
    }

    pub fn exclude_from_superset(ctx: Context<ExcludeFromSuperset>) -> Result<()> {
        instructions::exclude_from_superset(ctx)
    }
}
