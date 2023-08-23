use anchor_lang::prelude::*;

#[event]
pub struct UpdatedMetadata {
    #[index]
    pub metadata: Pubkey,
}
