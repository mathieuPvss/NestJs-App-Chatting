import { Role, User } from '../modules/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

export const users: Partial<User>[] = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin123', 10),
    role: Role.ADMIN,
  },
  {
    username: 'jean.dupont',
    email: 'user@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: Role.USER,
  },
  {
    username: 'marie.curie',
    email: 'marie.curie@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: Role.USER,
  },
  {
    username: 'pierre.durand',
    email: 'pierre.durand@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: Role.USER,
  },
];
