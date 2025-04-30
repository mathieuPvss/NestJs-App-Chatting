import { Group } from 'src/modules/group/entities/group.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class GroupMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => Group, (group) => group.messages)
  group: Group;

  @CreateDateColumn()
  timestamp: Date;
}
