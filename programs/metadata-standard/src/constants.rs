use anchor_lang::prelude::*;

#[constant]
pub const MAX_URI_LENGTH: usize = 200;

#[constant]
pub const AUTHORITIES_SEED: &str = "authorities";

#[constant]
pub const METADATA_SEED: &str = "metadata";

#[constant]
pub const INCLUSION_SEED: &str = "inclusion";

#[constant]
pub const SUPERSET_SEED: &str = "superset";
