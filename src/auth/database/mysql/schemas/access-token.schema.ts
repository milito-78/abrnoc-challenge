import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  AccessToken,
  IAccessToken,
} from '../../../../domains/access_token.domain';

@Entity()
@Index('tokens_unique', ['token'], { unique: true })
export class TokenEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 144, nullable: false })
  token: string;

  @Column({ nullable: false })
  userId: number;

  @CreateDateColumn({ type: 'timestamp' })
  expiredAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  static toDomain(token: TokenEntity): AccessToken {
    return {
      createdAt: token.createdAt,
      expiredAt: token.expiredAt,
      id: String(token.id),
      token: token.token,
      updatedAt: token.updatedAt,
      userId: String(token.userId),
    };
  }

  static fromDomain(token: IAccessToken): TokenEntity {
    const tmp = new TokenEntity();
    tmp.token = token.token;
    tmp.userId = Number(token.userId);
    tmp.expiredAt = token.expiredAt;
    return tmp;
  }
}
