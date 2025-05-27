import { Role, User } from '../modules/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

export const users: Partial<User>[] = [
  {
    username: 'user',
    email: 'user@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: Role.USER,
    color: '#FF0000',
  },
  {
    username: 'jean.dupont',
    email: 'jean.dupont@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: Role.USER,
    color: '#00FF00',
  },
  {
    username: 'marie.curie',
    email: 'marie.curie@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: Role.USER,
    color: '#0000FF',
  },
  {
    username: 'pierre.durand',
    email: 'pierre.durand@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: Role.USER,
    color: '#FFFF00',
  },
];
