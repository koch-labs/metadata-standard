use anchor_lang::prelude::*;

use crate::constants::{INCLUSION_SEED, MAX_NAME_LENGTH, MAX_URI_LENGTH};

#[account]
pub struct AuthoritiesGroup {
    pub id: Pubkey,

    /// The account that can update the authorities group
    pub update_authority: Pubkey,

    /// The account that can update metadata
    pub metadata_authority: Pubkey,

    /// The account that can include other tokens in the set
    pub inclusion_authority: Pubkey,
}

impl AuthoritiesGroup {
    pub const LEN: usize = 8 // Discriminator
        + 32 // ID
        + 32 // Update
        + 32 // Metadata
        + 32 // Transfer
        + 32; // Inclusion
}

/// Onchain Data Type describes the format of the onchain data
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum OnchainDataType {
    Bytes = 0,
    Hex = 1,
    Base64 = 2,
}

impl From<u8> for OnchainDataType {
    fn from(value: u8) -> Self {
        match value {
            0 => Self::Bytes,
            1 => Self::Hex,
            _ => Self::Base64,
        }
    }
}

/// Metadata type describes how the actual token data is stored
#[derive(AnchorDeserialize, AnchorSerialize, Clone)]
pub enum MetadataData {
    External {
        uri: String,
    },
    Reference {
        metadata_account: Pubkey,
    },
    Onchain {
        data_type: OnchainDataType,
        data_account: Pubkey,
    },
}

impl MetadataData {
    pub const LEN: usize = 1 // Enum 
        + 4 // String
        + MAX_URI_LENGTH; // Length
}

#[account]
pub struct Metadata {
    pub mint: Pubkey,

    pub authorities_group: Pubkey,

    pub creation_slot: u64,

    pub content_hash: [u8; 32],

    pub name: String,

    pub data: MetadataData,
}

impl Metadata {
    pub const LEN: usize = 8 // Discriminator
        + 32 // Mint
        + 32 // Authorities
        + 8 // Slot
        + 32 // Hash
        + MAX_NAME_LENGTH // Name
        + MetadataData::LEN; // Metadata
}

// An inclusion is valid if there exist an inclusion between both account
// It must be older than both metadata
pub fn validate_inclusion(
    parent: &Account<Metadata>,
    child: &Account<Metadata>,
    inclusion: &Account<Inclusion>,
    bump: u8,
) -> bool {
    let (_key, _bump) = Pubkey::find_program_address(
        &[
            INCLUSION_SEED.as_ref(),
            parent.key().as_ref(),
            child.key().as_ref(),
        ],
        &crate::ID,
    );

    let valid_account = inclusion.key() == _key && bump == _bump;
    let valid_slots = inclusion.inclusion_slot >= parent.creation_slot
        && inclusion.inclusion_slot >= child.creation_slot;

    valid_account && valid_slots
}

#[account]
pub struct Inclusion {
    pub inclusion_slot: u64,
}

impl Inclusion {
    pub const LEN: usize = 8 // Discriminator
        + 8; // Slot
}

#[account]
pub struct SupersetInclusion {
    pub inclusion_slot: u64,
}

impl SupersetInclusion {
    pub const LEN: usize = 8 // Discriminator
        + 8; // Slot
}
