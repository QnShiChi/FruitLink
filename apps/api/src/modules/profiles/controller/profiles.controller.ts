import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { CurrentUserPayload } from '../../../common/interfaces/current-user.interface';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UpdateProfileRequestDto } from '../dto/request/update-profile.request.dto';
import { ProfilesService } from '../service/profiles.service';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  async getMyProfile(@CurrentUser() currentUser: CurrentUserPayload) {
    const profile = await this.profilesService.getMyProfile(currentUser.id);
    return {
      message: 'Lấy thông tin hồ sơ thành công.',
      data: profile,
    };
  }

  @Patch('me')
  async updateMyProfile(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Body() dto: UpdateProfileRequestDto,
  ) {
    const profile = await this.profilesService.updateMyProfile(currentUser.id, dto);
    return {
      message: 'Cập nhật hồ sơ thành công.',
      data: profile,
    };
  }
}
