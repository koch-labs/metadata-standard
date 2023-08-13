# Koch Labs NFT Standard

This is an alternative to [Metaplex's NFT Standard](https://github.com/metaplex-foundation/mpl-token-metadata). It aims to provide up-to-date dependencies, simpler accounts, Token2022 compatibility, easier programmability and more flexibility when creating collections.

## Getting started

### Anchor Program

Running the program requires [Anchor](https://www.anchor-lang.com/docs/installation) (currently `0.28.0`) and [Solana](https://docs.solana.com/cli/install-solana-cli-tools) (currently `1.16.7`).

### Typescript SDK

`npm add @koch-labs/nft-standard`

## Docs

### Design

Objectives:

- Minimize accounts size
- Maximize accounts reusability
- Simple programmability
- Flexible collections

Our standard takes a different approach at NFT sets (generally called _collections_).
Instead of Metaplex's explicit collections (collection informations are written directly in the metadata), any NFT can be a set that contains any other elements.
This means that what is a bilateral relation in Metaplex is now unilateral since a including in a set does not require any authority over the included token.

This design enables proving nested relations or what we call _supersets_: a token being part of a collection which is itself part of a collection. This enables using NFTs to create things like lists and groups of collections for airdrops for example.

### [Accounts](./programs/nft-standard/src/state.rs)

#### **Metadata**

Uniquely identified by the mint of the token it represents.

It maintains a version number that is incremented for every set operation of this token (When this token includes other tokens in its set, not when other tokens include it).

#### **AuthoritiesGroup**

Uniquely identified by a random ID.

Allows reusing groups of authorities for many tokens and enables modifying a single account to update all tokens.

#### **Inclusion**

Uniquely identified by the parent metadata and the child metadata.
Can only be created by the Inclusion Authority.
Does not need to store the version because they don't become stale since they're created by the Inclusion Authority.

#### **SupersetInclusion**

Uniquely identified by the parent metadata and the child metadata.
They need to maintain the counter because these accounts can be created by anyone, generally the token holder.

Data:

- **index**. Public key of the parent set metadata
- **index**. Public key of the child metadata
- Last seen Set Version Counter

### Instructions

#### CreateAuthoritiesGroup

#### UpdateAuthoritiesGroup

Only the update authority of an authorities group can update it

#### CreateMetadata

#### UpdateMetadata

Only the update authority of the metadata authorities group can update it

#### BurnMetadata

Only the update authority of the metadata authorities group can burn it.
Requires the burning metadata set size to 0.

#### IncludeMetadata

Only the inclusion authority of the parent metadata's authorities group can include

#### ExcludeMetadata

Only the inclusion authority of the parent metadata's authorities group can exclude

#### CreateSupersetInclusion

#### CloseSupersetInclusion

## Rent NFT
