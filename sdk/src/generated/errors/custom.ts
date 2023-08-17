export type CustomError =
  | InvalidMint
  | InvalidBumps
  | InvalidPath
  | InvalidPathStart
  | InvalidPathEnd
  | NotHolder

export class InvalidMint extends Error {
  static readonly code = 6000
  readonly code = 6000
  readonly name = "InvalidMint"
  readonly msg = "Mint provided is invalid"

  constructor(readonly logs?: string[]) {
    super("6000: Mint provided is invalid")
  }
}

export class InvalidBumps extends Error {
  static readonly code = 6001
  readonly code = 6001
  readonly name = "InvalidBumps"
  readonly msg = "Bumps do not match remaining accounts"

  constructor(readonly logs?: string[]) {
    super("6001: Bumps do not match remaining accounts")
  }
}

export class InvalidPath extends Error {
  static readonly code = 6002
  readonly code = 6002
  readonly name = "InvalidPath"
  readonly msg = "Invalid validation path"

  constructor(readonly logs?: string[]) {
    super("6002: Invalid validation path")
  }
}

export class InvalidPathStart extends Error {
  static readonly code = 6003
  readonly code = 6003
  readonly name = "InvalidPathStart"
  readonly msg = "Remaining accounts path start does not match the root"

  constructor(readonly logs?: string[]) {
    super("6003: Remaining accounts path start does not match the root")
  }
}

export class InvalidPathEnd extends Error {
  static readonly code = 6004
  readonly code = 6004
  readonly name = "InvalidPathEnd"
  readonly msg = "Remaining accounts path end does not match the child"

  constructor(readonly logs?: string[]) {
    super("6004: Remaining accounts path end does not match the child")
  }
}

export class NotHolder extends Error {
  static readonly code = 6005
  readonly code = 6005
  readonly name = "NotHolder"
  readonly msg = "The holder does not own a token"

  constructor(readonly logs?: string[]) {
    super("6005: The holder does not own a token")
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new InvalidMint(logs)
    case 6001:
      return new InvalidBumps(logs)
    case 6002:
      return new InvalidPath(logs)
    case 6003:
      return new InvalidPathStart(logs)
    case 6004:
      return new InvalidPathEnd(logs)
    case 6005:
      return new NotHolder(logs)
  }

  return null
}
