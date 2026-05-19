import { UpdateProfileRequestDto } from '../dto/request/update-profile.request.dto';

export abstract class ProfilesService {
  abstract getMyProfile(userId: string): Promise<{
    userId: string;
    fullName: string;
    phoneNumber: string | null;
    avatarUrl: string | null;
    email: string;
  }>;
  abstract updateMyProfile(userId: string, dto: UpdateProfileRequestDto): Promise<{
    userId: string;
    fullName: string;
    phoneNumber: string | null;
    avatarUrl: string | null;
    email: string;
  }>;
}
