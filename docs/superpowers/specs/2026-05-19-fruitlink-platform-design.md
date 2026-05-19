# FruitLink Platform Design

**Date:** 2026-05-19

## 1. Mục tiêu

Xây dựng nền tảng FruitLink theo hướng monorepo fullstack, phục vụ ba nhóm người dùng chính: nhà đầu tư, nông dân và quản trị viên. Hệ thống cần hỗ trợ trọn chu kỳ đầu tư nông sản từ khám phá dự án, đầu tư, theo dõi canh tác, truy xuất nguồn gốc, nhận quyền lợi và vận hành nội bộ.

## 2. Phạm vi thiết kế

Tài liệu này chốt kiến trúc nền tảng và stack kỹ thuật cho phase đầu. Trọng tâm là:

- cấu trúc dự án
- lựa chọn công nghệ
- cách tổ chức frontend/backend
- nguyên tắc thiết kế dữ liệu
- định hướng hạ tầng Docker cho local/dev
- chuẩn UI bám theo `DESIGN.md`

Ràng buộc nội dung bắt buộc:

- toàn bộ hệ thống phải dùng tiếng Việt có dấu 100%
- không trộn tiếng Anh vào label, menu, trạng thái, thông báo, placeholder, seed data hoặc nội dung hiển thị cho người dùng cuối
- tên kỹ thuật trong code có thể giữ bằng tiếng Anh để thuận tiện phát triển, nhưng mọi chuỗi hiển thị ra UI phải là tiếng Việt có dấu

Tài liệu này chưa đi vào chi tiết từng endpoint, từng bảng dữ liệu hay rule nghiệp vụ mức field-level. Các phần đó sẽ được cụ thể hóa trong implementation plan.

## 3. Phạm vi phase 1 đề xuất

Phase 1 nên đi theo hướng MVP chặt, đủ để chứng minh vòng đời đầu tư mùa vụ và tính minh bạch của nền tảng. Bao gồm:

- đăng ký, đăng nhập, OTP
- quản lý hồ sơ người dùng cơ bản
- danh sách dự án nông sản
- trang chi tiết dự án và truy xuất nguồn gốc
- tạo đầu tư và thanh toán giả lập hoặc sandbox
- nhật ký canh tác số
- thông báo tiến độ cơ bản
- dashboard theo vai trò
- quản trị dự án, người dùng, nhật ký
- QR truy xuất nguồn gốc

Chưa đưa vào phase 1:

- chat thời gian thực đầy đủ giữa nhà đầu tư và nông dân
- đặt tour trải nghiệm hoàn chỉnh
- loyalty nhiều tầng và ledger phức tạp
- chuyển nhượng quyền đầu tư
- tích hợp sâu với hệ thống hAgri bên ngoài

Các mục này vẫn phải được tính ngay từ kiến trúc để không phá vỡ khả năng mở rộng về sau.

## 4. Kiến trúc tổng thể

Kiến trúc được đề xuất là modular monorepo, gồm một frontend ứng dụng web, một backend API, và các package dùng chung.

### 4.1. Kiểu kiến trúc

- monorepo để đồng bộ code, type và design system
- modular monolith ở backend cho giai đoạn đầu
- database quan hệ tập trung
- event/queue cho các tác vụ bất đồng bộ

Lý do chọn modular monolith:

- bài toán có nhiều module nghiệp vụ nhưng vẫn dùng chung dữ liệu mạnh
- giai đoạn đầu cần tốc độ triển khai cao hơn microservices
- giảm overhead deploy, observability, giao tiếp service-to-service
- vẫn có thể tách dần sau này theo module như payment, notification, traceability nếu tải tăng

### 4.2. Thành phần chính

1. `apps/web`
Frontend cho:
- landing page
- investor portal
- farmer portal
- admin portal ở route riêng

2. `apps/api`
Backend phục vụ:
- auth
- user/profile
- projects
- investments
- payments
- cultivation logs
- traceability
- notifications
- admin operations

3. `packages/ui`
Design system và reusable components bám theo `DESIGN.md`

4. `packages/types`
Shared types, DTO contract, enum, constants dùng chung giữa web và api

5. `infra`
Dockerfiles, docker-compose, reverse proxy config, bootstrap scripts

## 5. Stack kỹ thuật được chọn

### 5.1. Frontend

- `Next.js` với App Router
- `TypeScript`
- `Tailwind CSS`
- `TanStack Query`
- `React Hook Form`
- `Zod`

Lý do:

- hỗ trợ tốt cả landing page và dashboard app
- routing linh hoạt cho nhiều khu vực người dùng
- SSR/ISR có lợi cho landing và trang chi tiết dự án
- TypeScript giúp contract với backend rõ ràng

### 5.2. Backend

- `NestJS`
- `Prisma ORM`
- `Swagger/OpenAPI`
- `BullMQ` cho queue nền
- `Socket.IO` được để sẵn dưới dạng extension point

Lý do:

- phù hợp domain có nhiều module nghiệp vụ
- dependency injection, guards, interceptors hợp với RBAC và audit
- dễ chia module nhưng chưa cần microservice

### 5.3. Dữ liệu và hạ tầng lõi

- `PostgreSQL` làm relational database chính
- `Redis` cho OTP, cache ngắn hạn, queue backend
- `MinIO` làm object storage local/dev, tương thích S3
- `Mailpit` để test email local

Lưu ý vận hành local:

- database chạy trong container `postgres`
- quản trị và truy vấn database từ máy cá nhân bằng `DBeaver`
- `docker-compose.yml` cần publish cổng PostgreSQL ra host để `DBeaver` kết nối trực tiếp

### 5.4. Quản lý workspace

- `pnpm workspaces`
- `Turborepo`

Lý do:

- cài dependency nhanh, tiết kiệm disk
- dễ chạy task theo app/package
- tiện cho CI và cache build

## 6. Cấu trúc thư mục đề xuất

```text
FruitLink/
├─ apps/
│  ├─ api/
│  └─ web/
├─ packages/
│  ├─ config/
│  ├─ types/
│  └─ ui/
├─ infra/
│  ├─ docker/
│  ├─ nginx/
│  └─ scripts/
├─ docs/
│  └─ superpowers/
├─ .env.example
├─ docker-compose.yml
├─ Makefile
├─ package.json
├─ pnpm-workspace.yaml
└─ turbo.json
```

### 6.1. `apps/web`

Đề xuất chia route theo khu vực sản phẩm:

- `(marketing)` cho landing page
- `(app)` cho investor và farmer portal
- `(admin)` cho admin portal

Các module frontend chính:

- auth
- projects
- investments
- cultivation logs
- traceability
- notifications
- profile
- admin dashboard

### 6.2. `apps/api`

Đề xuất module backend:

- `auth`
- `users`
- `profiles`
- `farmers`
- `projects`
- `project-seasons`
- `investments`
- `payments`
- `cultivation-logs`
- `traceability`
- `notifications`
- `admin`
- `shared`

### 6.3. `packages/ui`

Chứa:

- token CSS từ `DESIGN.md`
- base components như button, card, badge, input, navbar
- layout primitives
- chart/surface wrappers cho dashboard

### 6.4. `packages/types`

Chứa:

- enum role, status, payment state
- DTO/public contract dùng chung
- helper schema có thể reuse giữa web và api

## 7. Thiết kế giao diện bám `DESIGN.md`

FruitLink nên giữ ngôn ngữ hình ảnh gần với hệ style trong `DESIGN.md`, nhưng nội dung cần chuyển từ playful productivity sang agri-investment platform.

### 7.1. Nguyên tắc UI

- light theme là chủ đạo
- typography chính là `Satoshi`
- CTA xanh `#a3e635`
- text đen đậm, border rõ, shadow offset nhẹ
- card nhiều nền phụ như saffron, mint, lavender để phân tầng nội dung
- hero và các section chính dùng gradient sáng vừa phải, không lạm dụng

### 7.2. Ứng dụng vào sản phẩm

Landing page:

- hero lớn, background gradient sáng
- section giải thích chu kỳ `đầu tư - canh tác - thu hoạch`
- card nổi bật cho lợi ích nhà đầu tư, nông dân, truy xuất QR
- CTA rõ cho xem dự án và tham gia hệ sinh thái

App dashboard:

- giữ cùng token màu với landing
- dùng card, badge, status chip, timeline cho nhật ký canh tác
- data table admin vẫn giữ viền đen rõ và shadow nhẹ để đồng nhất thương hiệu

### 7.3. Quy định implementation

- toàn bộ token màu, spacing, radius, shadow được đưa vào CSS variables
- không dùng dark mode mặc định cho phase 1
- không dùng style thư viện mặc định nếu lệch với `DESIGN.md`
- mọi text hiển thị trên giao diện phải là tiếng Việt có dấu, kể cả landing page, dashboard, admin, trạng thái, CTA và thông báo lỗi

## 8. Mô hình dữ liệu mức khái niệm

Các thực thể lõi:

- `User`
- `Profile`
- `Role`
- `FarmerProfile`
- `Project`
- `ProjectSeason`
- `InvestmentPackage`
- `InvestmentOrder`
- `PaymentTransaction`
- `CultivationLog`
- `TraceabilityRecord`
- `ProjectMedia`
- `Notification`
- `AuditLog`

Quan hệ nghiệp vụ chính:

- một user có một hoặc nhiều role
- farmer quản lý một hoặc nhiều project
- project có thể có nhiều mùa vụ hoặc batch đầu tư
- mỗi mùa vụ có các gói đầu tư
- người dùng có thể tạo nhiều lệnh đầu tư
- một lệnh đầu tư có lịch sử thanh toán
- mỗi project season có nhật ký canh tác và dữ liệu truy xuất

## 9. Luồng nghiệp vụ phase 1

### 9.1. Luồng nhà đầu tư

1. đăng ký tài khoản
2. xác thực OTP
3. duyệt danh sách dự án
4. xem chi tiết dự án, vùng trồng, kế hoạch mùa vụ, dữ liệu truy xuất
5. chọn gói đầu tư
6. tạo giao dịch đầu tư
7. thanh toán mock hoặc sandbox
8. nhận mã đầu tư và xem trạng thái trên dashboard
9. theo dõi nhật ký canh tác và thông báo tiến độ

### 9.2. Luồng nông dân

1. được admin khởi tạo hoặc phê duyệt hồ sơ
2. được gán quản lý dự án hoặc mùa vụ
3. cập nhật nhật ký canh tác
4. đính kèm hình ảnh hoặc dữ liệu truy xuất
5. theo dõi các khoản đầu tư vào mùa vụ của mình

### 9.3. Luồng quản trị viên

1. quản lý người dùng và vai trò
2. quản lý dự án, mùa vụ, gói đầu tư
3. duyệt và kiểm tra nhật ký canh tác
4. theo dõi thanh toán và trạng thái đầu tư
5. quản lý dữ liệu truy xuất và nội dung hiển thị

## 10. Tích hợp ngoài hệ thống

### 10.1. OTP

Phase 1 có thể dùng email OTP. SMS OTP để dưới dạng abstraction.

### 10.2. Thanh toán

Phase 1 dùng payment abstraction:

- `MockPaymentProvider`
- `SandboxPaymentProvider`

Mục tiêu là backend không phụ thuộc chặt vào một cổng thanh toán ngay từ đầu.

### 10.3. QR truy xuất

Backend chịu trách nhiệm sinh mã QR và map tới trang truy xuất trên web. Metadata truy xuất được lưu trong PostgreSQL; file ảnh hoặc chứng từ phụ lưu trong MinIO.

## 11. Hạ tầng local/dev với Docker

`docker-compose.yml` ở root sẽ chạy toàn bộ stack local:

- `web`
- `api`
- `postgres`
- `redis`
- `minio`
- `mailpit`

Tuỳ chọn thêm:

- `nginx` nếu cần reverse proxy một domain local

Mục tiêu:

- một lệnh để khởi động toàn bộ môi trường
- mỗi service có volume phù hợp cho local development
- hot reload cho `web` và `api`
- network nội bộ rõ ràng, không hardcode localhost giữa container
- PostgreSQL phải mở port host để công cụ như `DBeaver` dùng được từ bên ngoài Docker network

Thiết lập PostgreSQL local nên thống nhất theo hướng:

- host từ máy local: `127.0.0.1`
- port mặc định: `5432`
- database: `fruitlink`
- username: `fruitlink`
- password: `fruitlink`

Thiết lập này giúp `DBeaver` kết nối nhanh mà không cần mapping phức tạp.

## 12. Makefile

Makefile ở root cần cung cấp lệnh ngắn gọn:

- `make up`
- `make down`
- `make logs`
- `make ps`
- `make restart`
- `make build`
- `make shell-api`
- `make shell-web`
- `make db-studio`

Nguyên tắc:

- lệnh phải bọc `docker compose` để giảm độ dài thao tác
- tên lệnh nhất quán, dễ nhớ
- ưu tiên phục vụ local/dev trước

## 13. Non-functional requirements

- phân quyền rõ theo role
- audit các thay đổi quan trọng
- dữ liệu giao dịch có trạng thái rõ ràng, không cập nhật mơ hồ
- API versioning sẵn sàng từ đầu
- logging tập trung mức cơ bản cho local/dev
- file upload và object storage tách khỏi database
- sẵn sàng mở rộng thêm queue, realtime, analytics
- toàn bộ chuỗi hiển thị cho người dùng cuối phải được kiểm soát để luôn là tiếng Việt có dấu

## 14. Rủi ro và quyết định kiến trúc

### 14.1. Không chọn microservices ở phase đầu

Nếu tách microservices sớm, chi phí phối hợp sẽ lớn hơn giá trị nhận được. Modular monolith đủ phù hợp cho giai đoạn chứng minh sản phẩm.

### 14.2. Không chọn NoSQL làm database chính

Bài toán này cần quan hệ rõ giữa user, mùa vụ, đầu tư, thanh toán, nhật ký và audit. PostgreSQL phù hợp hơn.

### 14.3. Không tích hợp ngay loyalty và transfer phức tạp

Các module này có ảnh hưởng lớn tới domain model và transaction flow. Chúng nên được thiết kế sau khi phase 1 đã ổn định.

## 15. Kết luận

FruitLink nên được triển khai theo hướng monorepo fullstack với stack:

- `Next.js`
- `NestJS`
- `PostgreSQL`
- `Redis`
- `Prisma`
- `MinIO`
- `Docker Compose`
- `Makefile`

Đây là cấu hình cân bằng tốt giữa tốc độ triển khai, khả năng mở rộng, tính minh bạch nghiệp vụ và độ phù hợp với tài liệu thiết kế hiện tại.
