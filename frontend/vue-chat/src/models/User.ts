export enum Role {
  'USER' = 'user',
  'ADMIN' = 'admin',
}

export interface User {
  id: string
  username: string
  email: string
  role: Role
  color: string
}
