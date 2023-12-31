export type MetadataStandard = {
  "version": "0.1.0",
  "name": "metadata_standard",
  "constants": [
    {
      "name": "MAX_URI_LENGTH",
      "type": {
        "defined": "usize"
      },
      "value": "200"
    },
    {
      "name": "MAX_NAME_LENGTH",
      "type": {
        "defined": "usize"
      },
      "value": "32"
    },
    {
      "name": "AUTHORITIES_SEED",
      "type": "string",
      "value": "\"authorities\""
    },
    {
      "name": "METADATA_SEED",
      "type": "string",
      "value": "\"metadata\""
    },
    {
      "name": "INCLUSION_SEED",
      "type": "string",
      "value": "\"inclusion\""
    },
    {
      "name": "SUPERSET_SEED",
      "type": "string",
      "value": "\"superset\""
    }
  ],
  "instructions": [
    {
      "name": "createAuthoritiesGroup",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authoritiesGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "publicKey"
        },
        {
          "name": "updateAuthority",
          "type": "publicKey"
        },
        {
          "name": "metadataAuthority",
          "type": "publicKey"
        },
        {
          "name": "inclusionAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "updateAuthoritiesGroup",
      "accounts": [
        {
          "name": "updateAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "authoritiesGroup",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "updateAuthority",
          "type": "publicKey"
        },
        {
          "name": "metadataAuthority",
          "type": "publicKey"
        },
        {
          "name": "inclusionAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "createExternalMetadata",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "authoritiesGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "contentHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "uri",
          "type": "string"
        }
      ]
    },
    {
      "name": "createReferenceMetadata",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "authoritiesGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "contentHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "metadataAccount",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "createOnchainMetadata",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "authoritiesGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "contentHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "dataType",
          "type": "u8"
        },
        {
          "name": "dataAccount",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "updateExternalMetadata",
      "accounts": [
        {
          "name": "metadataAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authoritiesGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "contentHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "uri",
          "type": "string"
        }
      ]
    },
    {
      "name": "updateReferenceMetadata",
      "accounts": [
        {
          "name": "metadataAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authoritiesGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "contentHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "metadataAccount",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "updateOnchainMetadata",
      "accounts": [
        {
          "name": "metadataAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authoritiesGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "contentHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "dataType",
          "type": "u8"
        },
        {
          "name": "dataAccount",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "closeMetadata",
      "accounts": [
        {
          "name": "holder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "includeInSet",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "inclusionAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "authoritiesGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "parentMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "childMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inclusion",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "excludeFromSet",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "inclusionAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "authoritiesGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "parentMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "childMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inclusion",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "includeInSuperset",
      "docs": [
        "Verification path is passed as remaining accounts in the form `[Metadata, Inclusion, Metadata, Inclusion, ...]`",
        "Only pass bumps of inclusions"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "parentMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "childMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inclusion",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bumps",
          "type": "bytes"
        }
      ]
    },
    {
      "name": "excludeFromSuperset",
      "accounts": [
        {
          "name": "holder",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "parentMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "childMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inclusion",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "authoritiesGroup",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "publicKey"
          },
          {
            "name": "updateAuthority",
            "docs": [
              "The account that can update the authorities group"
            ],
            "type": "publicKey"
          },
          {
            "name": "metadataAuthority",
            "docs": [
              "The account that can update metadata"
            ],
            "type": "publicKey"
          },
          {
            "name": "inclusionAuthority",
            "docs": [
              "The account that can include other tokens in the set"
            ],
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "metadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "authoritiesGroup",
            "type": "publicKey"
          },
          {
            "name": "creationSlot",
            "type": "u64"
          },
          {
            "name": "contentHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "data",
            "type": {
              "defined": "MetadataData"
            }
          }
        ]
      }
    },
    {
      "name": "inclusion",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "inclusionSlot",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "supersetInclusion",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "inclusionSlot",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "OnchainDataType",
      "docs": [
        "Onchain Data Type describes the format of the onchain data"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Bytes"
          },
          {
            "name": "Hex"
          },
          {
            "name": "Base64"
          }
        ]
      }
    },
    {
      "name": "MetadataData",
      "docs": [
        "Metadata type describes how the actual token data is stored"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "External",
            "fields": [
              {
                "name": "uri",
                "type": "string"
              }
            ]
          },
          {
            "name": "Reference",
            "fields": [
              {
                "name": "metadata_account",
                "type": "publicKey"
              }
            ]
          },
          {
            "name": "Onchain",
            "fields": [
              {
                "name": "data_type",
                "type": {
                  "defined": "OnchainDataType"
                }
              },
              {
                "name": "data_account",
                "type": "publicKey"
              }
            ]
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "CreatedAuthoritiesGroup",
      "fields": [
        {
          "name": "authoritiesGroup",
          "type": "publicKey",
          "index": true
        }
      ]
    },
    {
      "name": "UpdatedAuthoritiesGroup",
      "fields": [
        {
          "name": "authoritiesGroup",
          "type": "publicKey",
          "index": true
        }
      ]
    },
    {
      "name": "CreatedMetadata",
      "fields": [
        {
          "name": "metadata",
          "type": "publicKey",
          "index": true
        }
      ]
    },
    {
      "name": "UpdatedMetadata",
      "fields": [
        {
          "name": "metadata",
          "type": "publicKey",
          "index": true
        }
      ]
    },
    {
      "name": "ClosedMetadata",
      "fields": [
        {
          "name": "metadata",
          "type": "publicKey",
          "index": true
        }
      ]
    },
    {
      "name": "IncludedInSet",
      "fields": [
        {
          "name": "parentMetadata",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "childMetadata",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "ExcludedFromSet",
      "fields": [
        {
          "name": "parentMetadata",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "childMetadata",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "IncludedInSuperset",
      "fields": [
        {
          "name": "parentMetadata",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "childMetadata",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "ExcludedFromSuperset",
      "fields": [
        {
          "name": "parentMetadata",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "childMetadata",
          "type": "publicKey",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidAuthority",
      "msg": "Mint authority did not sign"
    },
    {
      "code": 6001,
      "name": "InvalidBumps",
      "msg": "Bumps do not match remaining accounts"
    },
    {
      "code": 6002,
      "name": "InvalidPath",
      "msg": "Invalid validation path"
    },
    {
      "code": 6003,
      "name": "InvalidPathStart",
      "msg": "Remaining accounts path start does not match the root"
    },
    {
      "code": 6004,
      "name": "InvalidPathEnd",
      "msg": "Remaining accounts path end does not match the child"
    },
    {
      "code": 6005,
      "name": "NotHolder",
      "msg": "The holder does not own a token"
    },
    {
      "code": 6006,
      "name": "SupplyNotZero",
      "msg": "Cannot close metadata with tokens left"
    }
  ]
};

export const IDL: MetadataStandard = {
  "version": "0.1.0",
  "name": "metadata_standard",
  "constants": [
    {
      "name": "MAX_URI_LENGTH",
      "type": {
        "defined": "usize"
      },
      "value": "200"
    },
    {
      "name": "MAX_NAME_LENGTH",
      "type": {
        "defined": "usize"
      },
      "value": "32"
    },
    {
      "name": "AUTHORITIES_SEED",
      "type": "string",
      "value": "\"authorities\""
    },
    {
      "name": "METADATA_SEED",
      "type": "string",
      "value": "\"metadata\""
    },
    {
      "name": "INCLUSION_SEED",
      "type": "string",
      "value": "\"inclusion\""
    },
    {
      "name": "SUPERSET_SEED",
      "type": "string",
      "value": "\"superset\""
    }
  ],
  "instructions": [
    {
      "name": "createAuthoritiesGroup",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authoritiesGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "publicKey"
        },
        {
          "name": "updateAuthority",
          "type": "publicKey"
        },
        {
          "name": "metadataAuthority",
          "type": "publicKey"
        },
        {
          "name": "inclusionAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "updateAuthoritiesGroup",
      "accounts": [
        {
          "name": "updateAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "authoritiesGroup",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "updateAuthority",
          "type": "publicKey"
        },
        {
          "name": "metadataAuthority",
          "type": "publicKey"
        },
        {
          "name": "inclusionAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "createExternalMetadata",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "authoritiesGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "contentHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "uri",
          "type": "string"
        }
      ]
    },
    {
      "name": "createReferenceMetadata",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "authoritiesGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "contentHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "metadataAccount",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "createOnchainMetadata",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "authoritiesGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "contentHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "dataType",
          "type": "u8"
        },
        {
          "name": "dataAccount",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "updateExternalMetadata",
      "accounts": [
        {
          "name": "metadataAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authoritiesGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "contentHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "uri",
          "type": "string"
        }
      ]
    },
    {
      "name": "updateReferenceMetadata",
      "accounts": [
        {
          "name": "metadataAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authoritiesGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "contentHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "metadataAccount",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "updateOnchainMetadata",
      "accounts": [
        {
          "name": "metadataAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authoritiesGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "contentHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "dataType",
          "type": "u8"
        },
        {
          "name": "dataAccount",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "closeMetadata",
      "accounts": [
        {
          "name": "holder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "includeInSet",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "inclusionAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "authoritiesGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "parentMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "childMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inclusion",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "excludeFromSet",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "inclusionAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "authoritiesGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "parentMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "childMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inclusion",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "includeInSuperset",
      "docs": [
        "Verification path is passed as remaining accounts in the form `[Metadata, Inclusion, Metadata, Inclusion, ...]`",
        "Only pass bumps of inclusions"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "parentMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "childMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inclusion",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bumps",
          "type": "bytes"
        }
      ]
    },
    {
      "name": "excludeFromSuperset",
      "accounts": [
        {
          "name": "holder",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "parentMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "childMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inclusion",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "authoritiesGroup",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "publicKey"
          },
          {
            "name": "updateAuthority",
            "docs": [
              "The account that can update the authorities group"
            ],
            "type": "publicKey"
          },
          {
            "name": "metadataAuthority",
            "docs": [
              "The account that can update metadata"
            ],
            "type": "publicKey"
          },
          {
            "name": "inclusionAuthority",
            "docs": [
              "The account that can include other tokens in the set"
            ],
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "metadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "authoritiesGroup",
            "type": "publicKey"
          },
          {
            "name": "creationSlot",
            "type": "u64"
          },
          {
            "name": "contentHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "data",
            "type": {
              "defined": "MetadataData"
            }
          }
        ]
      }
    },
    {
      "name": "inclusion",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "inclusionSlot",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "supersetInclusion",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "inclusionSlot",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "OnchainDataType",
      "docs": [
        "Onchain Data Type describes the format of the onchain data"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Bytes"
          },
          {
            "name": "Hex"
          },
          {
            "name": "Base64"
          }
        ]
      }
    },
    {
      "name": "MetadataData",
      "docs": [
        "Metadata type describes how the actual token data is stored"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "External",
            "fields": [
              {
                "name": "uri",
                "type": "string"
              }
            ]
          },
          {
            "name": "Reference",
            "fields": [
              {
                "name": "metadata_account",
                "type": "publicKey"
              }
            ]
          },
          {
            "name": "Onchain",
            "fields": [
              {
                "name": "data_type",
                "type": {
                  "defined": "OnchainDataType"
                }
              },
              {
                "name": "data_account",
                "type": "publicKey"
              }
            ]
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "CreatedAuthoritiesGroup",
      "fields": [
        {
          "name": "authoritiesGroup",
          "type": "publicKey",
          "index": true
        }
      ]
    },
    {
      "name": "UpdatedAuthoritiesGroup",
      "fields": [
        {
          "name": "authoritiesGroup",
          "type": "publicKey",
          "index": true
        }
      ]
    },
    {
      "name": "CreatedMetadata",
      "fields": [
        {
          "name": "metadata",
          "type": "publicKey",
          "index": true
        }
      ]
    },
    {
      "name": "UpdatedMetadata",
      "fields": [
        {
          "name": "metadata",
          "type": "publicKey",
          "index": true
        }
      ]
    },
    {
      "name": "ClosedMetadata",
      "fields": [
        {
          "name": "metadata",
          "type": "publicKey",
          "index": true
        }
      ]
    },
    {
      "name": "IncludedInSet",
      "fields": [
        {
          "name": "parentMetadata",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "childMetadata",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "ExcludedFromSet",
      "fields": [
        {
          "name": "parentMetadata",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "childMetadata",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "IncludedInSuperset",
      "fields": [
        {
          "name": "parentMetadata",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "childMetadata",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "ExcludedFromSuperset",
      "fields": [
        {
          "name": "parentMetadata",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "childMetadata",
          "type": "publicKey",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidAuthority",
      "msg": "Mint authority did not sign"
    },
    {
      "code": 6001,
      "name": "InvalidBumps",
      "msg": "Bumps do not match remaining accounts"
    },
    {
      "code": 6002,
      "name": "InvalidPath",
      "msg": "Invalid validation path"
    },
    {
      "code": 6003,
      "name": "InvalidPathStart",
      "msg": "Remaining accounts path start does not match the root"
    },
    {
      "code": 6004,
      "name": "InvalidPathEnd",
      "msg": "Remaining accounts path end does not match the child"
    },
    {
      "code": 6005,
      "name": "NotHolder",
      "msg": "The holder does not own a token"
    },
    {
      "code": 6006,
      "name": "SupplyNotZero",
      "msg": "Cannot close metadata with tokens left"
    }
  ]
};
