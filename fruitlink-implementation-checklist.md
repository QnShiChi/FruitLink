# Checklist Triển Khai Hệ Thống FruitLink

> Tài liệu này được lập dựa trên `phan_tich_he_thong_fruitlink.md`.
> Mục đích: dùng làm checklist tổng để theo dõi tiến độ triển khai hệ thống, và đánh dấu hoàn thành sau mỗi lần implement tính năng mới.

## 1. Cách sử dụng

- Mỗi task hoàn thành thì đánh dấu `- [x]`
- Nếu một task quá lớn, tách thêm checklist con ngay bên dưới task đó
- Khi bắt đầu một phase mới, tạo nhánh hoặc mốc triển khai tương ứng để dễ đối chiếu
- Chỉ đánh dấu hoàn thành khi đã xong code, kiểm thử, và chạy ổn trong môi trường local Docker
- Toàn bộ giao diện và nội dung hiển thị cho người dùng cuối phải là tiếng Việt có dấu 100%

---

## 2. Giai đoạn 0: Nền tảng kỹ thuật và khởi tạo dự án

- [x] Chốt stack công nghệ cho toàn hệ thống
- [x] Thiết kế cấu trúc monorepo cho `web`, `api`, `packages`, `infra`
- [x] Khởi tạo `Next.js` cho giao diện người dùng
- [x] Khởi tạo `NestJS` cho API backend
- [x] Khởi tạo `Prisma` và kết nối `PostgreSQL`
- [x] Thiết lập `Redis`
- [x] Thiết lập `MinIO`
- [x] Thiết lập `Mailpit`
- [x] Thiết lập `docker-compose.yml`
- [x] Thiết lập `Makefile` với `make up`, `make down`, `make logs`, `make ps`
- [x] Thiết lập `.env.example` và `.env`
- [x] Kiểm tra chạy toàn bộ hệ thống bằng Docker
- [x] Kiểm tra kết nối `PostgreSQL` từ `DBeaver`
- [ ] Thiết lập chuẩn log ứng dụng cho `web` và `api`
- [ ] Thiết lập chuẩn xử lý lỗi dùng chung cho backend
- [ ] Thiết lập chuẩn response API dùng chung
- [ ] Thiết lập seed dữ liệu mẫu ban đầu
- [ ] Thiết lập CI cơ bản cho lint, typecheck, build

---

## 3. Giai đoạn 1: Tài khoản, xác thực và phân quyền

### 3.1. Tài khoản người dùng
- [x] Thiết kế bảng dữ liệu người dùng
- [x] Thiết kế bảng hồ sơ người dùng
- [x] Thiết kế vai trò `nhà đầu tư`, `nông dân`, `quản trị viên`
- [x] Xây dựng API đăng ký tài khoản
- [x] Xây dựng API đăng nhập
- [x] Xây dựng API đăng xuất
- [x] Xây dựng API lấy thông tin hồ sơ cá nhân
- [x] Xây dựng API cập nhật hồ sơ cá nhân

### 3.2. OTP và xác thực
- [x] Xây dựng luồng gửi OTP
- [x] Xây dựng luồng xác thực OTP
- [x] Thiết lập thời gian hết hạn OTP
- [x] Thiết lập giới hạn gửi lại OTP
- [x] Hiển thị lỗi xác thực bằng tiếng Việt có dấu

### 3.3. Phân quyền và bảo mật
- [x] Xây dựng middleware hoặc guard phân quyền
- [x] Chặn truy cập route admin nếu không đúng vai trò
- [ ] Chặn truy cập route nông dân nếu không đúng vai trò
- [ ] Thiết lập refresh token hoặc cơ chế duy trì phiên đăng nhập
- [x] Ghi log các sự kiện đăng nhập quan trọng

---

## 4. Giai đoạn 2: Quản lý nông sản và dự án đầu tư

### 4.1. Danh mục dự án nông sản
- [ ] Thiết kế bảng dữ liệu dự án nông sản
- [ ] Thiết kế bảng dữ liệu mùa vụ hoặc đợt đầu tư
- [ ] Thiết kế bảng dữ liệu hình ảnh và tài liệu dự án
- [ ] Xây dựng API tạo dự án nông sản
- [ ] Xây dựng API cập nhật dự án nông sản
- [ ] Xây dựng API xoá hoặc ẩn dự án nông sản
- [ ] Xây dựng API danh sách dự án đang mở đầu tư
- [ ] Xây dựng API chi tiết dự án

### 4.2. Giao diện khám phá dự án
- [ ] Xây dựng trang danh sách dự án nông sản
- [ ] Xây dựng bộ lọc dự án theo trạng thái, địa phương, loại nông sản
- [ ] Xây dựng trang chi tiết dự án
- [ ] Hiển thị vùng trồng, quy trình canh tác, thời gian dự kiến thu hoạch
- [ ] Hiển thị hình ảnh, video hoặc tài liệu mô tả dự án
- [ ] Tối ưu giao diện mobile cho trang danh sách và chi tiết dự án

### 4.3. Quản trị dự án
- [ ] Xây dựng màn hình admin quản lý dự án
- [ ] Xây dựng màn hình admin quản lý mùa vụ
- [ ] Xây dựng màn hình gán nông dân phụ trách dự án
- [ ] Hiển thị trạng thái dự án rõ ràng bằng tiếng Việt có dấu

---

## 5. Giai đoạn 3: Đầu tư và thanh toán

### 5.1. Gói đầu tư
- [ ] Thiết kế bảng dữ liệu gói đầu tư
- [ ] Thiết kế bảng dữ liệu lệnh đầu tư
- [ ] Xây dựng API tạo gói đầu tư
- [ ] Xây dựng API lấy danh sách gói đầu tư theo dự án
- [ ] Hiển thị thông tin gói đầu tư trên giao diện chi tiết dự án

### 5.2. Luồng đầu tư
- [ ] Xây dựng API tạo lệnh đầu tư
- [ ] Xây dựng API xác nhận đầu tư
- [ ] Sinh mã đầu tư sau khi giao dịch thành công
- [ ] Hiển thị trạng thái đầu tư trên dashboard người dùng
- [ ] Hiển thị lịch sử đầu tư của người dùng

### 5.3. Thanh toán
- [ ] Thiết kế bảng dữ liệu giao dịch thanh toán
- [ ] Xây dựng `MockPaymentProvider`
- [ ] Xây dựng `SandboxPaymentProvider`
- [ ] Ghi nhận trạng thái thanh toán `chờ xử lý`, `thành công`, `thất bại`, `đã huỷ`
- [ ] Hiển thị thông báo thanh toán thành công bằng tiếng Việt có dấu
- [ ] Hiển thị thông báo thanh toán thất bại bằng tiếng Việt có dấu
- [ ] Xây dựng màn hình admin theo dõi giao dịch thanh toán

---

## 6. Giai đoạn 4: Theo dõi canh tác và nhật ký số

### 6.1. Nhật ký canh tác
- [ ] Thiết kế bảng dữ liệu nhật ký canh tác
- [ ] Thiết kế bảng dữ liệu hình ảnh hoặc minh chứng nhật ký
- [ ] Xây dựng API tạo nhật ký canh tác
- [ ] Xây dựng API cập nhật nhật ký canh tác
- [ ] Xây dựng API lấy danh sách nhật ký theo dự án hoặc mùa vụ
- [ ] Xây dựng API chi tiết một bản ghi nhật ký

### 6.2. Giao diện theo dõi tiến độ
- [ ] Xây dựng timeline nhật ký canh tác cho nhà đầu tư
- [ ] Hiển thị ảnh, video, ghi chú kỹ thuật theo từng mốc
- [ ] Hiển thị trạng thái mùa vụ theo thời gian thực hoặc gần thời gian thực
- [ ] Tối ưu giao diện xem nhật ký trên điện thoại

### 6.3. Vai trò nông dân
- [ ] Xây dựng màn hình cho nông dân cập nhật nhật ký
- [ ] Xây dựng form nhập nội dung nhật ký hoàn toàn bằng tiếng Việt có dấu
- [ ] Cho phép tải ảnh minh chứng lên hệ thống
- [ ] Hiển thị lịch sử các lần cập nhật của nông dân

---

## 7. Giai đoạn 5: Truy xuất nguồn gốc và QR

### 7.1. Dữ liệu truy xuất
- [ ] Thiết kế bảng dữ liệu truy xuất nguồn gốc
- [ ] Liên kết dữ liệu truy xuất với dự án, mùa vụ và nhật ký canh tác
- [ ] Chuẩn hoá các trường vùng trồng, giống cây, quy trình, ngày cập nhật

### 7.2. QR truy xuất
- [ ] Xây dựng chức năng sinh mã QR
- [ ] Xây dựng trang truy xuất từ mã QR
- [ ] Hiển thị nguồn gốc, nhật ký và hình ảnh liên quan trên trang QR
- [ ] Kiểm tra QR hoạt động tốt trên điện thoại

### 7.3. Quản trị truy xuất
- [ ] Xây dựng màn hình admin quản lý dữ liệu truy xuất
- [ ] Cho phép cập nhật hoặc ẩn bản ghi truy xuất không hợp lệ
- [ ] Ghi log khi chỉnh sửa dữ liệu truy xuất

---

## 8. Giai đoạn 6: Thông báo và tương tác

### 8.1. Thông báo hệ thống
- [ ] Thiết kế bảng dữ liệu thông báo
- [ ] Xây dựng API lấy danh sách thông báo
- [ ] Xây dựng API đánh dấu đã đọc
- [ ] Gửi thông báo khi đầu tư thành công
- [ ] Gửi thông báo khi có nhật ký canh tác mới
- [ ] Gửi thông báo khi đến gần kỳ thu hoạch

### 8.2. Nhắn tin và hỗ trợ
- [ ] Thiết kế dữ liệu hội thoại và tin nhắn
- [ ] Xây dựng API nhắn tin cơ bản
- [ ] Xây dựng giao diện nhắn tin giữa nhà đầu tư và bộ phận hỗ trợ
- [ ] Xây dựng giao diện nhắn tin giữa nhà đầu tư và nông dân
- [ ] Hiển thị nội dung tin nhắn bằng tiếng Việt có dấu 100%

---

## 9. Giai đoạn 7: Thu hoạch và trải nghiệm

### 9.1. Theo dõi thu hoạch
- [ ] Thiết kế bảng dữ liệu lịch thu hoạch
- [ ] Hiển thị thời gian thu hoạch dự kiến trên dashboard
- [ ] Gửi thông báo khi mùa vụ chuyển sang trạng thái thu hoạch
- [ ] Hiển thị quyền lợi người dùng sau thu hoạch

### 9.2. Tour trải nghiệm
- [ ] Thiết kế bảng dữ liệu tour trải nghiệm
- [ ] Thiết kế bảng dữ liệu đặt tour
- [ ] Xây dựng API tạo tour
- [ ] Xây dựng API đặt tour
- [ ] Xây dựng giao diện danh sách tour
- [ ] Xây dựng giao diện đặt tour
- [ ] Xây dựng màn hình admin quản lý lịch tour

### 9.3. Hoàn tất chu kỳ đầu tư
- [ ] Xây dựng trạng thái hoàn tất chu kỳ đầu tư
- [ ] Xác nhận người dùng đã nhận nông sản hoặc quyền lợi
- [ ] Hiển thị lịch sử chu kỳ đã hoàn tất

---

## 10. Giai đoạn 8: Thành viên, điểm thưởng và quyền lợi

### 10.1. Điểm thành viên
- [ ] Thiết kế bảng dữ liệu điểm thành viên
- [ ] Xây dựng rule cộng điểm sau đầu tư
- [ ] Xây dựng rule cộng điểm sau hoàn tất chu kỳ
- [ ] Hiển thị điểm hiện tại trên hồ sơ người dùng

### 10.2. Hạng thành viên
- [ ] Thiết kế bảng dữ liệu hạng thành viên
- [ ] Xây dựng rule nâng hạng
- [ ] Hiển thị quyền lợi theo hạng thành viên
- [ ] Xây dựng màn hình admin cấu hình hạng thành viên

### 10.3. Tái đầu tư và chuyển nhượng
- [ ] Xây dựng luồng tái đầu tư từ khoản đầu tư cũ
- [ ] Xây dựng dữ liệu chuyển nhượng quyền đầu tư
- [ ] Xây dựng rule kiểm tra điều kiện chuyển nhượng
- [ ] Xây dựng giao diện yêu cầu chuyển nhượng
- [ ] Xây dựng giao diện admin duyệt chuyển nhượng

---

## 11. Giai đoạn 9: Quản trị hệ thống

### 11.1. Quản trị người dùng
- [ ] Xây dựng màn hình admin danh sách người dùng
- [ ] Xây dựng màn hình admin xem chi tiết người dùng
- [ ] Xây dựng chức năng khoá hoặc mở tài khoản
- [ ] Xây dựng chức năng gán vai trò

### 11.2. Quản trị nội dung và vận hành
- [ ] Xây dựng màn hình quản lý dự án, mùa vụ, nhật ký, truy xuất
- [ ] Xây dựng màn hình quản lý giao dịch đầu tư
- [ ] Xây dựng màn hình quản lý tour và đặt tour
- [ ] Xây dựng màn hình quản lý thông báo
- [ ] Xây dựng màn hình quản lý khiếu nại hoặc hỗ trợ

### 11.3. Nhật ký hệ thống
- [ ] Thiết kế bảng dữ liệu audit log
- [ ] Ghi log hành động admin quan trọng
- [ ] Ghi log thay đổi trạng thái giao dịch
- [ ] Ghi log thay đổi dữ liệu truy xuất và nhật ký canh tác

---

## 12. Giai đoạn 10: Kiểm thử và hoàn thiện

### 12.1. Kiểm thử backend
- [ ] Viết test cho xác thực tài khoản
- [ ] Viết test cho đầu tư và thanh toán
- [ ] Viết test cho nhật ký canh tác
- [ ] Viết test cho truy xuất QR
- [ ] Viết test cho phân quyền admin, nông dân, nhà đầu tư

### 12.2. Kiểm thử frontend
- [ ] Kiểm tra giao diện landing page
- [ ] Kiểm tra giao diện dashboard nhà đầu tư
- [ ] Kiểm tra giao diện dashboard nông dân
- [ ] Kiểm tra giao diện quản trị
- [ ] Kiểm tra responsive trên mobile
- [ ] Kiểm tra toàn bộ text hiển thị là tiếng Việt có dấu

### 12.3. Kiểm thử tích hợp
- [x] Kiểm tra luồng đăng ký đến xác thực OTP
- [ ] Kiểm tra luồng khám phá dự án đến đầu tư
- [ ] Kiểm tra luồng nông dân cập nhật nhật ký
- [ ] Kiểm tra luồng truy xuất QR
- [ ] Kiểm tra luồng hoàn tất chu kỳ đầu tư

### 12.4. Hoàn thiện vận hành
- [x] Tối ưu cấu hình Docker cho môi trường dev
- [ ] Chuẩn bị cấu hình cho staging hoặc production
- [ ] Hoàn thiện tài liệu hướng dẫn triển khai
- [ ] Hoàn thiện tài liệu hướng dẫn sử dụng cho admin
- [ ] Hoàn thiện tài liệu hướng dẫn sử dụng cho nông dân và nhà đầu tư

---

## 13. Mốc ưu tiên đề xuất

### 13.1. MVP nên làm trước
- [x] Tài khoản và OTP
- [ ] Danh sách và chi tiết dự án nông sản
- [ ] Gói đầu tư và đầu tư cơ bản
- [ ] Thanh toán giả lập hoặc sandbox
- [ ] Nhật ký canh tác
- [ ] Truy xuất QR
- [ ] Dashboard nhà đầu tư
- [ ] Dashboard nông dân
- [ ] Admin cơ bản

### 13.2. Giai đoạn mở rộng sau MVP
- [ ] Thông báo hoàn chỉnh
- [ ] Nhắn tin
- [ ] Tour trải nghiệm
- [ ] Điểm thành viên và nâng hạng
- [ ] Tái đầu tư
- [ ] Chuyển nhượng quyền đầu tư

---

## 14. Mẫu đánh dấu sau mỗi lần triển khai tính năng

### Mẫu cập nhật

- [ ] Tên tính năng
  - Ngày bắt đầu:
  - Ngày hoàn thành:
  - Người thực hiện:
  - Phân hệ liên quan:
  - Ghi chú kiểm thử:

Ví dụ:

- [ ] Đăng ký tài khoản bằng OTP
  - Ngày bắt đầu:
  - Ngày hoàn thành:
  - Người thực hiện:
  - Phân hệ liên quan: Tài khoản, OTP
  - Ghi chú kiểm thử:
