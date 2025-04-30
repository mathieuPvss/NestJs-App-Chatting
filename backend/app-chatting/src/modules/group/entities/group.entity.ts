import { GroupMessage } from 'src/modules/group-message/entities/group-message.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User)
  owner: User;

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @OneToMany(() => GroupMessage, (message) => message.group)
  messages: GroupMessage[];
}
