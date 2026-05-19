# FruitLink

Monorepo bootstrap cho nền tảng FruitLink.

## Phát triển local

### Yêu cầu

- Docker
- Docker Compose
- pnpm

### Chạy dự án

```bash
pnpm install --force
make up
```

Web: `http://localhost:3000`
API: `http://localhost:4000/api`
Swagger: `http://localhost:4000/docs`
Mailpit: `http://localhost:8025`
MinIO Console: `http://localhost:9001`

### Tài khoản quản trị viên seed sẵn

- Email: `admin@fruitlink.local`
- Mật khẩu: `Admin@123`

### Luồng Giai đoạn 1 đã có

- Đăng ký tài khoản nhà đầu tư qua `OTP email`
- Xác thực OTP bằng `Mailpit`
- Đăng nhập bằng `email + mật khẩu`
- Xem thông tin người dùng hiện tại
- Xem và cập nhật hồ sơ cá nhân

### Dừng dự án

```bash
make down
```

### Kết nối PostgreSQL bằng DBeaver

- Host: `127.0.0.1`
- Port: `5432`
- Database: `fruitlink`
- Username: `fruitlink`
- Password: `fruitlink`

### Lệnh hữu ích

```bash
make logs
make ps
make shell-api
make shell-web
```

### Quy ước ngôn ngữ

- Toàn bộ giao diện người dùng cuối phải dùng tiếng Việt có dấu 100%
- Không dùng chuỗi tiếng Anh cho menu, nhãn, nút bấm, thông báo hoặc trạng thái hiển thị
