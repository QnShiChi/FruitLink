import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AccountRole } from '../../../common/enums/account-role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(AccountRole.ADMIN)
export class UsersController {
  @Get('ping')
  ping() {
    return {
      message: 'Khu vực người dùng dành cho quản trị viên đã sẵn sàng.',
      data: null,
    };
  }
}
