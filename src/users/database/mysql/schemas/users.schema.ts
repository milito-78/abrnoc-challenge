import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IUser, User } from '../../../../domains/user.domain';

@Entity('users')
@Index('emails_unique', ['email'], { unique: true })
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  static toDomain(user: UserEntity): User {
    return {
      createdAt: user.createdAt,
      email: user.email,
      id: String(user.id),
      name: user.name,
      password: user.password,
      updatedAt: user.updatedAt,
    };
  }

  static fromDomain(user: IUser): UserEntity {
    const tmp = new UserEntity();
    tmp.name = user.name;
    tmp.email = user.email;
    tmp.password = user.password;
    return tmp;
  }
}
