import { body } from 'express-validator';
import { TokenDto } from './token.dto';
import { UserDto } from './user.dto';

export class LoginDto {
  name: string;
  password: string;
  email: string;

  static validator() {
    return [
      body('email').isEmail().withMessage('Invalid email address'),
      body('password')
        .isStrongPassword({
          minLength: 8,
        })
        .withMessage('Password must be at least 8 characters'),
    ];
  }
}

export interface LoginResponseDto {
  user: UserDto;
  token: TokenDto;
}
