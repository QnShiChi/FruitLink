import { UserSummaryResponseDto } from '../../../users/dto/response/user-summary.response.dto';

export class AuthTokenResponseDto {
  accessToken!: string;
  tokenType!: string;
  expiresIn!: string;
  user!: UserSummaryResponseDto;
}
