pub mod constants;
pub mod errors;
pub mod events;
pub mod instructions;
pub mod state;

use instructions::*;
use state::*;

use anchor_lang::prelude::*;

declare_id!("9msweUGitRR1ELUe4XZi6xhecPCko54kSqSnfWH7LLiZ");

#[program]
pub mod metadata_standard {

    use crate::state::MetadataData;

    use super::*;

    pub fn create_authorities_group(
        ctx: Context<CreateAuthoritiesGroup>,
        id: Pubkey,
        update_authority: Pubkey,
        metadata_authority: Pubkey,
        inclusion_authority: Pubkey,
    ) -> Result<()> {
        instructions::create_authorities_group(
            ctx,
            id,
            update_authority,
            metadata_authority,
            inclusion_authority,
        )
    }

    pub fn update_authorities_group(
        ctx: Context<UpdateAuthoritiesGroup>,
        update_authority: Pubkey,
        metadata_authority: Pubkey,
        inclusion_authority: Pubkey,
    ) -> Result<()> {
        instructions::update_authorities_group(
            ctx,
            update_authority,
            metadata_authority,
            inclusion_authority,
        )
    }

    pub fn create_external_metadata(ctx: Context<CreateMetadata>, uri: String) -> Result<()> {
        instructions::create_metadata(ctx, MetadataData::External { uri })
    }

    pub fn create_reference_metadata(
        ctx: Context<CreateMetadata>,
        metadata_account: Pubkey,
    ) -> Result<()> {
        instructions::create_metadata(ctx, MetadataData::Reference { metadata_account })
    }

    pub fn create_onchain_metadata(
        ctx: Context<CreateMetadata>,
        data_type: u8,
        data_account: Pubkey,
    ) -> Result<()> {
        instructions::create_metadata(
            ctx,
            MetadataData::Onchain {
                data_type: OnchainDataType::from(data_type),
                data_account,
            },
        )
    }

    pub fn update_external_metadata(ctx: Context<UpdateMetadata>, uri: String) -> Result<()> {
        instructions::update_metadata(ctx, MetadataData::External { uri })
    }

    pub fn update_reference_metadata(
        ctx: Context<UpdateMetadata>,
        metadata_account: Pubkey,
    ) -> Result<()> {
        instructions::update_metadata(ctx, MetadataData::Reference { metadata_account })
    }

    pub fn update_onchain_metadata(
        ctx: Context<UpdateMetadata>,
        data_type: u8,
        data_account: Pubkey,
    ) -> Result<()> {
        instructions::update_metadata(
            ctx,
            MetadataData::Onchain {
                data_type: OnchainDataType::from(data_type),
                data_account,
            },
        )
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
