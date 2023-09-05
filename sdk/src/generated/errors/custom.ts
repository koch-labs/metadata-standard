export type CustomError =
  | InvalidMint
  | InvalidAuthority
  | InvalidBumps
  | InvalidPath
  | InvalidPathStart
  | InvalidPathEnd
  | NotHolder
  | SupplyNotZero

export class InvalidMint extends Error {
  static readonly code = 6000
  readonly code = 6000
  readonly name = "InvalidMint"
  readonly msg = "Mint provided is invalid"

  constructor(readonly logs?: string[]) {
    super("6000: Mint provided is invalid")
  }
}

export class InvalidAuthority extends Error {
  static readonly code = 6001
  readonly code = 6001
  readonly name = "InvalidAuthority"
  readonly msg = "Mint authority did not sign"

  constructor(readonly logs?: string[]) {
    super("6001: Mint authority did not sign")
  }
}

export class InvalidBumps extends Error {
  static readonly code = 6002
  readonly code = 6002
  readonly name = "InvalidBumps"
  readonly msg = "Bumps do not match remaining accounts"

  constructor(readonly logs?: string[]) {
    super("6002: Bumps do not match remaining accounts")
  }
}

export class InvalidPath extends Error {
  static readonly code = 6003
  readonly code = 6003
  readonly name = "InvalidPath"
  readonly msg = "Invalid validation path"

  constructor(readonly logs?: string[]) {
    super("6003: Invalid validation path")
  }
}

export class InvalidPathStart extends Error {
  static readonly code = 6004
  readonly code = 6004
  readonly name = "InvalidPathStart"
  readonly msg = "Remaining accounts path start does not match the root"

  constructor(readonly logs?: string[]) {
    super("6004: Remaining accounts path start does not match the root")
  }
}

export class InvalidPathEnd extends Error {
  static readonly code = 6005
  readonly code = 6005
  readonly name = "InvalidPathEnd"
  readonly msg = "Remaining accounts path end does not match the child"

  constructor(readonly logs?: string[]) {
    super("6005: Remaining accounts path end does not match the child")
  }
}

export class NotHolder extends Error {
  static readonly code = 6006
  readonly code = 6006
  readonly name = "NotHolder"
  readonly msg = "The holder does not own a token"

  constructor(readonly logs?: string[]) {
    super("6006: The holder does not own a token")
  }
}

export class SupplyNotZero extends Error {
  static readonly code = 6007
  readonly code = 6007
  readonly name = "SupplyNotZero"
  readonly msg = "Cannot close metadata with tokens left"

  constructor(readonly logs?: string[]) {
    super("6007: Cannot close metadata with tokens left")
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new InvalidMint(logs)
    case 6001:
      return new InvalidAuthority(logs)
    case 6002:
      return new InvalidBumps(logs)
    case 6003:
      return new InvalidPath(logs)
    case 6004:
      return new InvalidPathStart(logs)
    case 6005:
      return new InvalidPathEnd(logs)
    case 6006:
      return new NotHolder(logs)
    case 6007:
      return new SupplyNotZero(logs)
  }

  return null
}
