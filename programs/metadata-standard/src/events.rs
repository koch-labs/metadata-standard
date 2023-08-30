use anchor_lang::prelude::*;

#[event]
pub struct CreatedAuthoritiesGroup {
    #[index]
    pub authorities_group: Pubkey,
}

#[event]
pub struct UpdatedAuthoritiesGroup {
    #[index]
    pub authorities_group: Pubkey,
}

#[event]
pub struct CreatedMetadata {
    #[index]
    pub metadata: Pubkey,
}

#[event]
pub struct UpdatedMetadata {
    #[index]
    pub metadata: Pubkey,
}

#[event]
pub struct IncludedInSet {
    #[index]
    pub parent_metadata: Pubkey,

    pub child_metadata: Pubkey,
}

#[event]
pub struct ExcludedFromSet {
    #[index]
    pub parent_metadata: Pubkey,

    pub child_metadata: Pubkey,
}

#[event]
pub struct IncludedInSuperset {
    #[index]
    pub parent_metadata: Pubkey,

    pub child_metadata: Pubkey,
}

#[event]
pub struct ExcludedFromSuperset {
    #[index]
    pub parent_metadata: Pubkey,

    pub child_metadata: Pubkey,
}
