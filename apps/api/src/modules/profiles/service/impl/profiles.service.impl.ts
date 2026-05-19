import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfilesRepository } from '../../repository/profiles.repository';
import { ProfilesService } from '../profiles.service';
import { UpdateProfileRequestDto } from '../../dto/request/update-profile.request.dto';

@Injectable()
export class ProfilesServiceImpl implements ProfilesService {
  constructor(private readonly profilesRepository: ProfilesRepository) {}

  async getMyProfile(userId: string) {
    const profile = await this.profilesRepository.findByUserId(userId);

    if (!profile) {
      throw new NotFoundException('Không tìm thấy hồ sơ người dùng.');
    }

    return {
      userId: profile.userId,
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber,
      avatarUrl: profile.avatarUrl,
      email: profile.user.email,
    };
  }

  async updateMyProfile(userId: string, dto: UpdateProfileRequestDto) {
    const profile = await this.profilesRepository.updateByUserId(userId, dto);

    return {
      userId: profile.userId,
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber,
      avatarUrl: profile.avatarUrl,
      email: profile.user.email,
    };
  }
}
