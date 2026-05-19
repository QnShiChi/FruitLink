# FruitLink Phase 1 Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hoàn thiện Giai đoạn 1 của FruitLink gồm đăng ký tài khoản nhà đầu tư, xác thực OTP email, đăng nhập bằng email và mật khẩu, hồ sơ cá nhân, seed tài khoản quản trị viên và phân quyền cơ bản.

**Architecture:** Backend mở rộng từ `apps/api` theo cấu trúc SOLID với `controller`, `request DTO`, `response DTO`, `service`, `impl service`, `repository`, `mapper`. Frontend mở rộng từ `apps/web` với các màn hình xác thực và hồ sơ bám theo `DESIGN.md`, toàn bộ text hiển thị bằng tiếng Việt có dấu. OTP email dùng Redis, dữ liệu tài khoản dùng PostgreSQL, email local đi qua Mailpit.

**Tech Stack:** Next.js, NestJS, Prisma, PostgreSQL, Redis, Mailpit, Tailwind CSS, TypeScript, JWT, bcrypt

---

### Task 1: Chuẩn hóa nền backend cho Giai đoạn 1

**Files:**
- Modify: `apps/api/package.json`
- Modify: `apps/api/src/app.module.ts`
- Create: `apps/api/src/common/dto/api-response.dto.ts`
- Create: `apps/api/src/common/enums/account-role.enum.ts`
- Create: `apps/api/src/common/enums/account-status.enum.ts`
- Create: `apps/api/src/common/guards/jwt-auth.guard.ts`
- Create: `apps/api/src/common/guards/roles.guard.ts`
- Create: `apps/api/src/common/decorators/current-user.decorator.ts`
- Create: `apps/api/src/common/decorators/roles.decorator.ts`
- Create: `apps/api/src/common/interfaces/current-user.interface.ts`
- Create: `apps/api/src/common/constants/redis-key.constant.ts`
- Create: `apps/api/src/modules/redis/redis.module.ts`
- Create: `apps/api/src/modules/redis/service/redis.service.ts`
- Create: `apps/api/src/modules/redis/service/impl/redis.service.impl.ts`

- [ ] **Step 1: Cài các dependency backend cần cho auth**

Run: `pnpm --filter @fruitlink/api add @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt class-validator class-transformer ioredis`
Expected: PASS và dependency mới xuất hiện trong `apps/api/package.json`

- [ ] **Step 2: Cài dev dependency typings cần thiết**

Run: `pnpm --filter @fruitlink/api add -D @types/passport-jwt @types/bcrypt`
Expected: PASS và typings được thêm vào `apps/api/package.json`

- [ ] **Step 3: Tạo enum và DTO response dùng chung**

```ts
export enum AccountRole {
  ADMIN = 'admin',
  INVESTOR = 'investor',
  FARMER = 'farmer',
}
```

```ts
export enum AccountStatus {
  PENDING_VERIFICATION = 'pending_verification',
  ACTIVE = 'active',
  LOCKED = 'locked',
}
```

```ts
export class ApiResponseDto<T> {
  message!: string;
  data!: T;
}
```

- [ ] **Step 4: Tạo decorator và guard nền cho phân quyền**

```ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUser } from '../interfaces/current-user.interface';

export const CurrentUserDecorator = createParamDecorator((_: unknown, ctx: ExecutionContext): CurrentUser | undefined => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
```

```ts
import { SetMetadata } from '@nestjs/common';
import { AccountRole } from '../enums/account-role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AccountRole[]) => SetMetadata(ROLES_KEY, roles);
```

```ts
export interface CurrentUser {
  id: string;
  email: string;
  role: string;
  status: string;
}
```

- [ ] **Step 5: Tạo Redis module và service abstraction**

```ts
export const RedisKeyConstant = {
  registerOtp: (email: string) => `auth:register-otp:${email}`,
  registerOtpAttempts: (email: string) => `auth:register-otp-attempts:${email}`,
  registerOtpCooldown: (email: string) => `auth:register-otp-cooldown:${email}`,
};
```

```ts
export abstract class RedisService {
  abstract get(key: string): Promise<string | null>;
  abstract set(key: string, value: string, ttlSeconds?: number): Promise<void>;
  abstract del(key: string): Promise<void>;
  abstract incr(key: string): Promise<number>;
  abstract expire(key: string, ttlSeconds: number): Promise<void>;
}
```

```ts
@Injectable()
export class RedisServiceImpl implements RedisService {
  private readonly client = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379');

  async get(key: string) {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
      return;
    }
    await this.client.set(key, value);
  }

  async del(key: string) {
    await this.client.del(key);
  }

  async incr(key: string) {
    return this.client.incr(key);
  }

  async expire(key: string, ttlSeconds: number) {
    await this.client.expire(key, ttlSeconds);
  }
}
```

- [ ] **Step 6: Import RedisModule vào `AppModule`**

```ts
imports: [
  ConfigModule.forRoot({ isGlobal: true }),
  PrismaModule,
  RedisModule,
  AuthModule,
  UsersModule,
  ProfilesModule,
  ProjectsModule,
  InvestmentsModule,
]
```

- [ ] **Step 7: Chạy typecheck backend**

Run: `pnpm --filter @fruitlink/api typecheck`
Expected: PASS không lỗi TypeScript

### Task 2: Mở rộng Prisma schema cho tài khoản và hồ sơ

**Files:**
- Modify: `apps/api/prisma/schema.prisma`
- Create: `apps/api/prisma/seed.ts`
- Modify: `apps/api/package.json`
- Create: `apps/api/.env.example`

- [ ] **Step 1: Cập nhật schema `User` và thêm `Profile`, `AuditLog`**

```prisma
model User {
  id              String        @id @default(cuid())
  email           String        @unique
  passwordHash    String
  role            String
  status          String
  emailVerifiedAt DateTime?
  profile         Profile?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  auditLogs       AuditLog[]
}

model Profile {
  id          String   @id @default(cuid())
  userId      String   @unique
  fullName    String
  phoneNumber String?
  avatarUrl   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model AuditLog {
  id         String   @id @default(cuid())
  userId     String?
  action     String
  targetType String
  targetId   String?
  metadata   Json?
  createdAt  DateTime @default(now())
  user       User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
}
```

- [ ] **Step 2: Thêm script Prisma vào `apps/api/package.json`**

```json
"scripts": {
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev",
  "prisma:seed": "ts-node prisma/seed.ts"
}
```

- [ ] **Step 3: Tạo file seed admin**

```ts
const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@fruitlink.local';
const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin@123';
const passwordHash = await bcrypt.hash(adminPassword, 10);
```

Seed phải:
- tạo user `admin` nếu chưa tồn tại
- trạng thái `active`
- có profile cơ bản
- ghi log ra console local

- [ ] **Step 4: Bổ sung biến môi trường admin**

```env
ADMIN_EMAIL=admin@fruitlink.local
ADMIN_PASSWORD=Admin@123
JWT_SECRET=fruitlink-secret-key
JWT_EXPIRES_IN=1d
OTP_REGISTER_TTL_SECONDS=300
OTP_REGISTER_MAX_ATTEMPTS=5
OTP_REGISTER_RESEND_COOLDOWN_SECONDS=60
MAIL_FROM=fruitlink@example.local
```

- [ ] **Step 5: Chạy generate và migrate**

Run: `pnpm --filter @fruitlink/api exec prisma generate`
Expected: PASS và Prisma Client được cập nhật

Run: `pnpm --filter @fruitlink/api exec prisma migrate dev --name phase1-auth`
Expected: PASS và migration mới được tạo

- [ ] **Step 6: Chạy seed admin**

Run: `pnpm --filter @fruitlink/api prisma:seed`
Expected: PASS và console báo đã seed hoặc đã tồn tại tài khoản admin

### Task 3: Xây dựng module `users` và `profiles` theo SOLID

**Files:**
- Create: `apps/api/src/modules/users/controller/users.controller.ts`
- Create: `apps/api/src/modules/users/dto/response/user-summary.response.dto.ts`
- Create: `apps/api/src/modules/users/repository/users.repository.ts`
- Create: `apps/api/src/modules/users/service/users.service.ts`
- Create: `apps/api/src/modules/users/service/impl/users.service.impl.ts`
- Modify: `apps/api/src/modules/users/users.module.ts`
- Create: `apps/api/src/modules/profiles/profiles.module.ts`
- Create: `apps/api/src/modules/profiles/controller/profiles.controller.ts`
- Create: `apps/api/src/modules/profiles/dto/request/update-profile.request.dto.ts`
- Create: `apps/api/src/modules/profiles/dto/response/profile.response.dto.ts`
- Create: `apps/api/src/modules/profiles/repository/profiles.repository.ts`
- Create: `apps/api/src/modules/profiles/service/profiles.service.ts`
- Create: `apps/api/src/modules/profiles/service/impl/profiles.service.impl.ts`

- [ ] **Step 1: Tạo repository `users`**

Repository cần có các hàm:
- `findByEmail(email: string)`
- `findById(id: string)`
- `createInvestorUser(...)`
- `activateUser(userId: string)`
- `updateStatus(userId: string, status: string)`

- [ ] **Step 2: Tạo service interface và impl cho `users`**

Service cần có các hàm:
- `findByEmail`
- `findById`
- `activateUser`
- `createInvestorAccount`

- [ ] **Step 3: Tạo repository và service cho `profiles`**

Service cần có các hàm:
- `getMyProfile(userId: string)`
- `updateMyProfile(userId: string, dto)`

- [ ] **Step 4: Tạo DTO response cho user và profile**

```ts
export class UserSummaryResponseDto {
  id!: string;
  email!: string;
  role!: string;
  status!: string;
}
```

```ts
export class ProfileResponseDto {
  userId!: string;
  fullName!: string;
  phoneNumber!: string | null;
  avatarUrl!: string | null;
  email!: string;
}
```

- [ ] **Step 5: Tạo DTO request cập nhật hồ sơ**

```ts
export class UpdateProfileRequestDto {
  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
```

- [ ] **Step 6: Tạo controller hồ sơ**

Controller phải có:
- `GET /api/profile/me`
- `PATCH /api/profile/me`

Mọi response message đều bằng tiếng Việt có dấu.

- [ ] **Step 7: Import `ProfilesModule` vào `AppModule`**

Run: `pnpm --filter @fruitlink/api typecheck`
Expected: PASS không lỗi TypeScript

### Task 4: Xây dựng module `audit` và `mail`

**Files:**
- Create: `apps/api/src/modules/audit/audit.module.ts`
- Create: `apps/api/src/modules/audit/repository/audit.repository.ts`
- Create: `apps/api/src/modules/audit/service/audit.service.ts`
- Create: `apps/api/src/modules/audit/service/impl/audit.service.impl.ts`
- Create: `apps/api/src/modules/mail/mail.module.ts`
- Create: `apps/api/src/modules/mail/service/mail.service.ts`
- Create: `apps/api/src/modules/mail/service/impl/mail.service.impl.ts`

- [ ] **Step 1: Tạo repository và service audit**

Service cần có hàm:
- `record(action, targetType, targetId, userId, metadata)`

- [ ] **Step 2: Tạo service mail abstraction**

```ts
export abstract class MailService {
  abstract sendRegisterOtpEmail(payload: { to: string; fullName: string; otpCode: string }): Promise<void>;
}
```

- [ ] **Step 3: Tạo impl mail gửi qua SMTP Mailpit**

Dùng `nodemailer` với env local:
- host `mailpit`
- port `1025`
- secure `false`

Email subject và body phải bằng tiếng Việt có dấu.

- [ ] **Step 4: Cài dependency gửi mail**

Run: `pnpm --filter @fruitlink/api add nodemailer`
Expected: PASS

Run: `pnpm --filter @fruitlink/api add -D @types/nodemailer`
Expected: PASS

- [ ] **Step 5: Chạy typecheck backend**

Run: `pnpm --filter @fruitlink/api typecheck`
Expected: PASS không lỗi TypeScript

### Task 5: Xây dựng module `auth` theo SOLID

**Files:**
- Create: `apps/api/src/modules/auth/controller/auth.controller.ts`
- Create: `apps/api/src/modules/auth/dto/request/register.request.dto.ts`
- Create: `apps/api/src/modules/auth/dto/request/verify-register-otp.request.dto.ts`
- Create: `apps/api/src/modules/auth/dto/request/resend-register-otp.request.dto.ts`
- Create: `apps/api/src/modules/auth/dto/request/login.request.dto.ts`
- Create: `apps/api/src/modules/auth/dto/response/auth-token.response.dto.ts`
- Create: `apps/api/src/modules/auth/dto/response/register.response.dto.ts`
- Create: `apps/api/src/modules/auth/repository/auth.repository.ts`
- Create: `apps/api/src/modules/auth/service/auth.service.ts`
- Create: `apps/api/src/modules/auth/service/impl/auth.service.impl.ts`
- Create: `apps/api/src/modules/auth/strategies/jwt.strategy.ts`
- Modify: `apps/api/src/modules/auth/auth.module.ts`

- [ ] **Step 1: Tạo request DTO cho đăng ký**

```ts
export class RegisterRequestDto {
  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  confirmPassword!: string;
}
```

- [ ] **Step 2: Tạo request DTO cho OTP và login**

- `VerifyRegisterOtpRequestDto` gồm `email`, `otpCode`
- `ResendRegisterOtpRequestDto` gồm `email`
- `LoginRequestDto` gồm `email`, `password`

- [ ] **Step 3: Tạo response DTO auth**

```ts
export class AuthTokenResponseDto {
  accessToken!: string;
  tokenType!: string;
  expiresIn!: string;
}
```

```ts
export class RegisterResponseDto {
  email!: string;
  status!: string;
}
```

- [ ] **Step 4: Tạo service interface auth**

Service cần có:
- `registerInvestor(dto)`
- `verifyRegisterOtp(dto)`
- `resendRegisterOtp(dto)`
- `login(dto)`
- `getCurrentUser(userId)`

- [ ] **Step 5: Implement nghiệp vụ auth**

`registerInvestor` phải:
- kiểm tra email trùng
- kiểm tra xác nhận mật khẩu
- hash mật khẩu
- tạo user + profile ở trạng thái `pending_verification`
- sinh OTP 6 chữ số
- lưu OTP vào Redis với TTL
- ghi cooldown resend
- gửi email OTP
- ghi audit log

`verifyRegisterOtp` phải:
- kiểm tra tài khoản tồn tại
- kiểm tra trạng thái pending
- kiểm tra OTP Redis
- tăng số lần sai nếu OTP sai
- khóa flow tạm thời nếu vượt số lần cho phép
- activate tài khoản nếu đúng
- xóa OTP và attempts trong Redis
- ghi audit log

`login` phải:
- kiểm tra email tồn tại
- so sánh mật khẩu
- chặn nếu `pending_verification`
- chặn nếu `locked`
- cấp JWT
- ghi audit log

- [ ] **Step 6: Tạo controller auth**

Controller phải có:
- `POST /api/auth/register`
- `POST /api/auth/verify-register-otp`
- `POST /api/auth/resend-register-otp`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Tất cả message trả về phải là tiếng Việt có dấu.

- [ ] **Step 7: Tạo JWT strategy và guards**

JWT payload tối thiểu:
- `sub`
- `email`
- `role`
- `status`

- [ ] **Step 8: Chạy typecheck backend**

Run: `pnpm --filter @fruitlink/api typecheck`
Expected: PASS không lỗi TypeScript

### Task 6: Viết test backend cho auth phase 1

**Files:**
- Create: `apps/api/test/auth/register.spec.ts`
- Create: `apps/api/test/auth/verify-register-otp.spec.ts`
- Create: `apps/api/test/auth/login.spec.ts`
- Modify: `apps/api/package.json`

- [ ] **Step 1: Cài test dependencies backend nếu thiếu**

Run: `pnpm --filter @fruitlink/api add -D jest ts-jest supertest @types/supertest`
Expected: PASS

- [ ] **Step 2: Tạo test đăng ký thất bại khi email đã tồn tại**

```ts
it('trả về lỗi khi email đã tồn tại', async () => {
  expect(response.body.message).toBe('Email đã tồn tại trong hệ thống.');
});
```

- [ ] **Step 3: Tạo test xác thực OTP thành công**

```ts
it('kích hoạt tài khoản khi OTP hợp lệ', async () => {
  expect(response.body.message).toBe('Xác thực đăng ký thành công.');
});
```

- [ ] **Step 4: Tạo test đăng nhập bị chặn khi chưa xác thực**

```ts
it('không cho đăng nhập khi tài khoản chưa xác thực email', async () => {
  expect(response.body.message).toBe('Tài khoản của bạn chưa xác thực email.');
});
```

- [ ] **Step 5: Chạy test auth**

Run: `pnpm --filter @fruitlink/api test`
Expected: PASS các test auth phase 1

### Task 7: Xây dựng UI dùng chung cho các màn hình auth theo `DESIGN.md`

**Files:**
- Modify: `packages/ui/src/index.ts`
- Create: `packages/ui/src/components/input.tsx`
- Create: `packages/ui/src/components/auth-shell.tsx`
- Create: `packages/ui/src/components/form-message.tsx`
- Modify: `packages/ui/package.json`
- Modify: `apps/web/src/app/globals.css`

- [ ] **Step 1: Tạo component input theo style DESIGN**

Input cần có:
- nền trắng
- border xám hoặc đen nhẹ
- radius 4px
- text đen
- placeholder tiếng Việt có dấu

- [ ] **Step 2: Tạo layout `AuthShell`**

Layout gồm:
- hero hoặc panel nền sáng theo gradient đã chốt
- form card rõ ràng, viền đen, shadow nhẹ
- tiêu đề lớn, mô tả ngắn bằng tiếng Việt có dấu

- [ ] **Step 3: Tạo component hiển thị lỗi và thành công**

`FormMessage` cần hỗ trợ `error` và `success`, giữ ngôn ngữ hiển thị hoàn toàn tiếng Việt có dấu.

- [ ] **Step 4: Export component mới từ `packages/ui`**

Run: `pnpm --filter @fruitlink/web typecheck`
Expected: PASS không lỗi TypeScript

### Task 8: Xây dựng các trang frontend cho Giai đoạn 1

**Files:**
- Create: `apps/web/src/app/(auth)/dang-ky/page.tsx`
- Create: `apps/web/src/app/(auth)/xac-thuc-otp/page.tsx`
- Create: `apps/web/src/app/(auth)/dang-nhap/page.tsx`
- Create: `apps/web/src/app/(app)/ho-so/page.tsx`
- Modify: `apps/web/src/app/(app)/dashboard/page.tsx`
- Create: `apps/web/src/lib/api/auth-api.ts`
- Create: `apps/web/src/lib/api/profile-api.ts`
- Create: `apps/web/src/lib/types/auth.ts`

- [ ] **Step 1: Tạo helper gọi API auth và profile**

Các hàm cần có:
- `registerInvestor`
- `verifyRegisterOtp`
- `resendRegisterOtp`
- `login`
- `getMe`
- `getMyProfile`
- `updateMyProfile`

- [ ] **Step 2: Tạo trang `đăng ký`**

Form cần có:
- họ tên
- email
- mật khẩu
- xác nhận mật khẩu

Nút CTA: `Tạo tài khoản nhà đầu tư`

- [ ] **Step 3: Tạo trang `xác thực OTP`**

Form cần có:
- email
- mã OTP

Nút CTA:
- `Xác thực đăng ký`
- `Gửi lại mã OTP`

- [ ] **Step 4: Tạo trang `đăng nhập`**

Form cần có:
- email
- mật khẩu

Nút CTA: `Đăng nhập vào hệ thống`

- [ ] **Step 5: Tạo trang `hồ sơ cá nhân`**

Hiển thị và cập nhật:
- họ tên
- email chỉ đọc
- số điện thoại

- [ ] **Step 6: Cập nhật dashboard nhà đầu tư**

Dashboard phải hiển thị nội dung phase 1 tối thiểu:
- lời chào người dùng
- trạng thái tài khoản
- email đã xác thực hay chưa
- lối tắt tới hồ sơ cá nhân

- [ ] **Step 7: Chạy typecheck web**

Run: `pnpm --filter @fruitlink/web typecheck`
Expected: PASS không lỗi TypeScript

### Task 9: Tích hợp xác thực frontend với backend

**Files:**
- Create: `apps/web/src/lib/auth/token-storage.ts`
- Create: `apps/web/src/lib/auth/session.ts`
- Create: `apps/web/src/middleware.ts`
- Modify: `apps/web/src/app/(admin)/admin/page.tsx`
- Modify: `apps/web/src/app/layout.tsx`

- [ ] **Step 1: Tạo utility lưu JWT**

Dùng local storage hoặc cookie strategy đơn giản cho phase 1, nhưng phải thống nhất một cách duy nhất.

- [ ] **Step 2: Sau đăng nhập thành công, điều hướng về dashboard**

Thông báo thành công phải là: `Đăng nhập thành công.`

- [ ] **Step 3: Nếu tài khoản chưa xác thực, hiển thị lỗi đúng từ backend**

Ví dụ:
- `Tài khoản của bạn chưa xác thực email.`
- `Mã OTP không đúng.`
- `Mã OTP đã hết hạn.`

- [ ] **Step 4: Bảo vệ route hồ sơ và dashboard**

Route phase 1 cần bảo vệ:
- `/dashboard`
- `/ho-so`
- `/admin`

- [ ] **Step 5: Chặn người không phải admin vào khu vực admin**

Run: `pnpm --filter @fruitlink/web typecheck`
Expected: PASS không lỗi TypeScript

### Task 10: Cập nhật checklist, README và xác thực end-to-end

**Files:**
- Modify: `fruitlink-implementation-checklist.md`
- Modify: `README.md`
- Modify: `apps/web/next.config.ts`

- [ ] **Step 1: Cập nhật checklist cho Giai đoạn 1**

Đánh dấu các task đã hoàn thành trong `fruitlink-implementation-checklist.md`:
- thiết kế bảng dữ liệu người dùng
- thiết kế bảng hồ sơ người dùng
- thiết kế vai trò
- API đăng ký
- API đăng nhập
- luồng gửi OTP
- luồng xác thực OTP
- refresh hoặc duy trì phiên nếu đã triển khai ở mức cơ bản

- [ ] **Step 2: Cập nhật README hướng dẫn chạy auth phase 1**

README cần thêm:
- tài khoản admin seed sẵn
- luồng Mailpit xem OTP email
- lệnh migrate và seed
- đường dẫn các trang auth

- [ ] **Step 3: Chạy kiểm tra end-to-end phase 1**

Run: `pnpm --filter @fruitlink/api typecheck`
Expected: PASS

Run: `pnpm --filter @fruitlink/web typecheck`
Expected: PASS

Run: `pnpm --filter @fruitlink/api test`
Expected: PASS

Run: `make up`
Expected: PASS toàn bộ service lên thành công

Run: `curl -s http://localhost:4000/api/health`
Expected: trả về `{"status":"ok"}`

Run: `curl -I http://localhost:3000`
Expected: trả về `HTTP/1.1 200 OK`

- [ ] **Step 4: Xác nhận luồng thủ công**

Kiểm tra thủ công các bước:
- đăng ký tài khoản nhà đầu tư
- mở Mailpit lấy OTP
- xác thực OTP thành công
- đăng nhập thành công
- vào dashboard
- sửa hồ sơ cá nhân
- đăng nhập admin bằng tài khoản seed

## Self-review

Spec coverage:
- Đã có task cho đăng ký, OTP email, đăng nhập, hồ sơ cá nhân, seed admin, frontend bám `DESIGN.md`, backend chia rõ theo SOLID.
- `farmer` và quên mật khẩu chưa đưa vào plan vì nằm ngoài phạm vi phase 1.

Placeholder scan:
- Không dùng `TODO`, `TBD`, hoặc tham chiếu mơ hồ kiểu “làm tương tự”.
- Mỗi task đều có file đích, command kiểm tra và kết quả mong đợi.

Type consistency:
- Vai trò dùng thống nhất `admin`, `investor`, `farmer`.
- Trạng thái dùng thống nhất `pending_verification`, `active`, `locked`.
- Các route auth được giữ thống nhất dưới `/api/auth/*` và frontend route tiếng Việt theo phase 1.
