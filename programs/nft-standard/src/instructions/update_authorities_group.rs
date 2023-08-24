use anchor_lang::prelude::*;

use crate::{
    constants::AUTHORITIES_SEED, events::UpdatedAuthoritiesGroup, state::AuthoritiesGroup,
};

pub fn update_authorities_group(
    ctx: Context<UpdateAuthoritiesGroup>,
    update_authority: Pubkey,
    metadata_authority: Pubkey,
    inclusion_authority: Pubkey,
) -> Result<()> {
    let group = &mut ctx.accounts.authorities_group;
    group.update_authority = update_authority;
    group.metadata_authority = metadata_authority;
    group.inclusion_authority = inclusion_authority;

    emit!(UpdatedAuthoritiesGroup {
        authorities_group: ctx.accounts.authorities_group.key(),
    });

    Ok(())
}

#[derive(Accounts)]
pub struct UpdateAuthoritiesGroup<'info> {
    pub update_authority: Signer<'info>,

    #[account(
        mut,
        seeds = [
            AUTHORITIES_SEED.as_ref(),
            authorities_group.id.as_ref()
        ],
        bump,
        has_one = update_authority,
    )]
    pub authorities_group: Account<'info, AuthoritiesGroup>,

    pub system_program: Program<'info, System>,
}
