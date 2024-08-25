import { User } from '../../domains/user.domain';

export interface UserDto {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export function userFromDomain(domain: User): UserDto {
  return {
    createdAt: domain.createdAt,
    email: domain.email,
    id: domain.id,
    name: domain.name,
    updatedAt: domain.updatedAt,
  };
}
