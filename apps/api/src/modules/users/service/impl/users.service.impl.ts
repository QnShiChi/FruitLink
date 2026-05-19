import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../repository/users.repository';
import { UsersService } from '../users.service';

@Injectable()
export class UsersServiceImpl implements UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  findById(id: string) {
    return this.usersRepository.findById(id);
  }

  createInvestorAccount(payload: {
    email: string;
    passwordHash: string;
    fullName: string;
    role: string;
    status: string;
  }) {
    return this.usersRepository.createInvestorUser(payload);
  }

  activateUser(userId: string) {
    return this.usersRepository.activateUser(userId);
  }

  updateStatus(userId: string, status: string) {
    return this.usersRepository.updateStatus(userId, status);
  }
}
