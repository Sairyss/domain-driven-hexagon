export enum UserRoles {
  admin = 'admin',
  moderator = 'moderator',
  guest = 'guest',
}

export interface UpdateUserAddressProps {
  country?: string;
  postalCode?: string;
  street?: string;
}
