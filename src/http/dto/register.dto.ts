import { body } from 'express-validator';
import { UserDto } from './user.dto';
import { TokenDto } from './token.dto';

export class RegisterDto {
  name: string;
  password: string;
  email: string;

  static validator() {
    return [
      body('name')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters'),
      body('email').isEmail().withMessage('Invalid email address'),
      body('password')
        .isStrongPassword({
          minLength: 8,
        })
        .withMessage('Password must be at least 8 characters'),
    ];
  }
}

export interface RegisterResponseDto {
  user: UserDto;
  token: TokenDto;
}
