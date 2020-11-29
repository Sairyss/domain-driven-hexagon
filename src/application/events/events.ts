export enum UserEvents {
  created = 'user-created',
  deleted = 'user-deleted',
}

export enum WalletEvents {
  created = 'wallet-created',
  deleted = 'wallet-deleted',
}

export type Events = UserEvents | WalletEvents;
