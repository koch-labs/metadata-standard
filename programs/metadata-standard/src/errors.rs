use anchor_lang::prelude::*;

#[error_code]
pub enum MetadataStandardError {
    #[msg("Mint provided is invalid")]
    InvalidMint,
    #[msg("Bumps do not match remaining accounts")]
    InvalidBumps,
    #[msg("Invalid validation path")]
    InvalidPath,
    #[msg("Remaining accounts path start does not match the root")]
    InvalidPathStart,
    #[msg("Remaining accounts path end does not match the child")]
    InvalidPathEnd,

    #[msg("The holder does not own a token")]
    NotHolder,
}
