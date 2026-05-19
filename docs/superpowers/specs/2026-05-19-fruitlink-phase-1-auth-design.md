# FruitLink Phase 1 Authentication Design

**Date:** 2026-05-19

## 1. Mục tiêu

Thiết kế Giai đoạn 1 của FruitLink cho các chức năng nền tảng liên quan đến tài khoản, xác thực OTP email, đăng nhập, hồ sơ cá nhân và phân quyền. Giai đoạn này là lớp nền bắt buộc cho các phân hệ tiếp theo như dự án nông sản, đầu tư, nhật ký canh tác và quản trị vận hành.

## 2. Phạm vi Giai đoạn 1

Giai đoạn 1 bao gồm:

- người dùng tự đăng ký tài khoản
- người dùng mặc định là nhà đầu tư
- gửi OTP qua email để xác thực đăng ký
- OTP chỉ dùng cho xác thực đăng ký
- đăng nhập bằng email và mật khẩu
- chỉ cho phép đăng nhập sau khi xác thực OTP thành công
- seed sẵn một tài khoản quản trị viên
- quản lý hồ sơ cá nhân cơ bản
- phân quyền cơ bản giữa `admin`, `investor`, `farmer`

Giai đoạn này chưa bao gồm:

- quên mật khẩu
- đăng nhập không mật khẩu bằng OTP
- nông dân tự đăng ký tài khoản
- xác thực SMS OTP
- quản lý đa thiết bị hoặc phiên đăng nhập nâng cao
- chat, thông báo hoàn chỉnh, loyalty, tour trải nghiệm

## 3. Quyết định nghiệp vụ đã chốt

### 3.1. Vai trò hệ thống

Các vai trò hệ thống vẫn được định nghĩa từ đầu để phù hợp kiến trúc tổng thể:

- `admin`
- `investor`
- `farmer`

Tuy nhiên trong Giai đoạn 1:

- người dùng tự đăng ký chỉ tạo tài khoản `investor`
- hệ thống seed sẵn 1 tài khoản `admin`
- `farmer` chưa có luồng tự đăng ký

### 3.2. Người dùng và nhà đầu tư là một

Trong Giai đoạn 1 không có lớp “người dùng thường” riêng. Người dùng tự đăng ký vào hệ thống mặc định chính là nhà đầu tư.

### 3.3. Luồng xác thực email

Hệ thống sử dụng OTP email cho xác thực đăng ký.

- OTP chỉ phục vụ mục đích hoàn tất đăng ký
- OTP không dùng cho đăng nhập
- OTP không dùng cho quên mật khẩu trong phase này
- người dùng chỉ được đăng nhập khi email đã được xác thực thành công

## 4. Kiến trúc triển khai được chọn

### 4.1. Phương án triển khai

Giai đoạn 1 dùng mô hình lai:

- `PostgreSQL` lưu dữ liệu tài khoản, hồ sơ, audit log
- `Redis` lưu OTP, số lần thử và cooldown gửi lại OTP
- `Mailpit` dùng cho local/dev để kiểm tra email OTP

Lý do chọn:

- OTP là dữ liệu ngắn hạn, phù hợp Redis hơn PostgreSQL
- vẫn giữ được audit cho sự kiện quan trọng trong PostgreSQL
- thuận tiện mở rộng sau này sang quên mật khẩu hoặc OTP SMS

### 4.2. Quy tắc frontend

Frontend phải bám sát `DESIGN.md` trong thư mục gốc:

- light theme là mặc định
- typography, màu sắc, shadow, border, spacing theo token đã chốt
- không dùng giao diện mặc định lệch hệ thiết kế
- toàn bộ chuỗi hiển thị cho người dùng cuối phải là tiếng Việt có dấu 100%

### 4.3. Quy tắc backend

Backend phải tuân thủ nguyên tắc SOLID ở mức tổ chức module và trách nhiệm thành phần:

- tách rõ `controller`
- tách rõ `request DTO`
- tách rõ `response DTO`
- tách rõ `service interface`
- tách rõ `impl service`
- tách rõ `repository`
- không nhét nghiệp vụ vào controller
- không trả trực tiếp model database ra ngoài API

## 5. Mô hình dữ liệu Giai đoạn 1

## 5.1. Bảng `users`

Mục đích:

- lưu thông tin tài khoản đăng nhập
- lưu vai trò
- lưu trạng thái xác thực và trạng thái hoạt động

Các trường chính:

- `id`
- `email`
- `password_hash`
- `role`
- `status`
- `email_verified_at`
- `created_at`
- `updated_at`

### 5.1.1. Trạng thái tài khoản

Đề xuất các trạng thái:

- `pending_verification`
- `active`
- `locked`

Ý nghĩa:

- `pending_verification`: đã đăng ký nhưng chưa xác thực OTP
- `active`: đã xác thực và có thể đăng nhập
- `locked`: bị khóa bởi quản trị viên hoặc hệ thống

## 5.2. Bảng `profiles`

Mục đích:

- tách dữ liệu hồ sơ khỏi bảng tài khoản
- chuẩn bị cho mở rộng thông tin vai trò sau này

Các trường chính:

- `id`
- `user_id`
- `full_name`
- `phone_number` nullable
- `avatar_url` nullable
- `created_at`
- `updated_at`

## 5.3. Redis keys cho OTP

Không lưu OTP đăng ký trực tiếp trong PostgreSQL. Dùng Redis với các key theo email hoặc user id.

Các nhóm key:

- OTP đăng ký
- số lần nhập sai OTP
- cooldown gửi lại OTP

Thông tin cần lưu:

- mã OTP hoặc hash OTP
- hạn sử dụng
- số lần thử hiện tại
- timestamp được phép gửi lại

## 5.4. Bảng `audit_logs`

Mục đích:

- ghi nhận các hành động nghiệp vụ quan trọng liên quan đến auth

Các sự kiện nên ghi log:

- đăng ký tài khoản
- gửi OTP đăng ký
- xác thực OTP thành công
- xác thực OTP thất bại nhiều lần
- đăng nhập thành công
- đăng nhập thất bại
- seed tài khoản admin

## 6. Luồng nghiệp vụ chi tiết

## 6.1. Đăng ký tài khoản nhà đầu tư

1. Người dùng nhập:
- họ tên
- email
- mật khẩu
- xác nhận mật khẩu

2. Backend kiểm tra:
- email hợp lệ
- mật khẩu đạt chính sách tối thiểu
- email chưa tồn tại

3. Backend tạo:
- `user` với role `investor`
- status `pending_verification`
- `profile` cơ bản tương ứng

4. Backend sinh OTP đăng ký trong Redis và gửi email qua Mailpit ở môi trường local/dev.

5. Frontend điều hướng người dùng sang màn hình nhập OTP xác thực đăng ký.

## 6.2. Xác thực OTP đăng ký

1. Người dùng nhập email và OTP.
2. Backend kiểm tra:
- tài khoản có tồn tại không
- trạng thái hiện tại có phải `pending_verification` không
- OTP có tồn tại không
- OTP có còn hạn không
- số lần thử có vượt ngưỡng không

3. Nếu hợp lệ:
- xóa hoặc vô hiệu OTP trong Redis
- cập nhật `email_verified_at`
- cập nhật `status = active`
- ghi audit log

4. Trả về kết quả thành công bằng tiếng Việt có dấu.

## 6.3. Gửi lại OTP đăng ký

1. Người dùng chọn gửi lại OTP.
2. Backend kiểm tra cooldown.
3. Nếu hợp lệ thì sinh OTP mới, ghi đè OTP cũ, gửi lại email.
4. Nếu chưa đến thời gian cho phép gửi lại, trả lỗi bằng tiếng Việt có dấu.

## 6.4. Đăng nhập

1. Người dùng nhập email và mật khẩu.
2. Backend kiểm tra:
- tài khoản có tồn tại không
- mật khẩu có đúng không
- tài khoản đã xác thực email chưa
- tài khoản có bị khóa không

3. Nếu hợp lệ:
- cấp JWT
- trả thông tin người dùng cơ bản
- ghi audit log đăng nhập thành công

4. Nếu không hợp lệ:
- trả lỗi bằng tiếng Việt có dấu
- ghi audit log nếu cần

## 6.5. Hồ sơ cá nhân

Người dùng đã đăng nhập có thể:

- xem hồ sơ cá nhân
- cập nhật họ tên
- cập nhật số điện thoại
- cập nhật ảnh đại diện ở phase sau nếu cần

Không cho sửa trực tiếp:

- role
- status
- email_verified_at

## 7. API Giai đoạn 1

## 7.1. Auth API

- `POST /api/auth/register`
- `POST /api/auth/verify-register-otp`
- `POST /api/auth/resend-register-otp`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## 7.2. Profile API

- `GET /api/profile/me`
- `PATCH /api/profile/me`

## 7.3. Admin seed và quản trị nền

Không cần public API cho seed. Seed admin được thực hiện ở bước bootstrap dữ liệu hoặc lệnh seed riêng.

## 8. Cấu trúc backend theo SOLID

Mỗi module như `auth`, `users`, `profiles` nên có cấu trúc tương tự:

```text
src/modules/auth/
├─ controller/
├─ dto/
│  ├─ request/
│  └─ response/
├─ service/
│  ├─ auth.service.ts
│  └─ impl/
├─ repository/
├─ mapper/
├─ enums/
└─ types/
```

Nguyên tắc trách nhiệm:

- `controller`: nhận request, validate đầu vào ở mức transport, gọi service, trả response DTO
- `request DTO`: mô tả dữ liệu đầu vào từ client
- `response DTO`: chuẩn hoá dữ liệu trả về cho client
- `service interface`: định nghĩa contract nghiệp vụ
- `impl service`: chứa nghiệp vụ cụ thể
- `repository`: đọc ghi dữ liệu từ Prisma hoặc data source
- `mapper`: chuyển đổi entity sang response DTO nếu cần

## 9. Cấu trúc frontend Giai đoạn 1

## 9.1. Màn hình cần có

- trang đăng ký
- trang xác thực OTP đăng ký
- trang đăng nhập
- trang hồ sơ cá nhân
- dashboard nhà đầu tư cơ bản
- khu vực admin cơ bản

## 9.2. Quy tắc hiển thị

- tất cả text UI là tiếng Việt có dấu
- CTA, alert, validation message phải là tiếng Việt có dấu
- dùng token từ `DESIGN.md`
- form auth phải sáng, rõ, border đen, shadow nhẹ, CTA xanh đúng tinh thần thiết kế

## 10. Tài khoản quản trị viên seed sẵn

Hệ thống phải seed sẵn 1 tài khoản `admin` trong local/dev.

Quy tắc:

- nếu chưa tồn tại thì tạo mới
- nếu đã tồn tại thì bỏ qua
- tài khoản seed phải ở trạng thái `active`
- thông tin tài khoản seed nên cấu hình qua env để tránh hardcode cố định trong code

## 11. Quy tắc validate và thông báo lỗi

Các lỗi và thông báo phải viết bằng tiếng Việt có dấu 100%.

Các nhóm thông báo bắt buộc:

- email đã tồn tại
- mật khẩu không hợp lệ
- OTP không đúng
- OTP đã hết hạn
- bạn đã nhập sai quá số lần cho phép
- tài khoản chưa xác thực email
- tài khoản đã bị khóa
- đăng nhập thành công
- xác thực đăng ký thành công

## 12. Non-functional requirements cho Giai đoạn 1

- toàn bộ API auth trả response rõ ràng, không expose dữ liệu nhạy cảm
- mật khẩu phải được băm trước khi lưu
- OTP nên lưu dưới dạng hash nếu triển khai thuận lợi trong phase này
- có giới hạn số lần nhập OTP sai
- có giới hạn gửi lại OTP
- có audit cho các sự kiện auth quan trọng
- toàn bộ UI hiển thị bằng tiếng Việt có dấu
- frontend phải bám `DESIGN.md`
- backend phải giữ cấu trúc rõ theo SOLID

## 13. Phạm vi hoàn thành của Giai đoạn 1

Giai đoạn 1 được xem là hoàn thành khi có đủ:

- người dùng tự đăng ký tài khoản nhà đầu tư
- email OTP xác thực đăng ký hoạt động
- tài khoản chưa xác thực không đăng nhập được
- đăng nhập bằng email và mật khẩu hoạt động
- hồ sơ cá nhân cơ bản hoạt động
- seed admin hoạt động
- guard phân quyền cơ bản hoạt động
- giao diện auth hiển thị đúng tiếng Việt có dấu và bám `DESIGN.md`
- backend tách module theo controller, DTO, service, impl service, repository
