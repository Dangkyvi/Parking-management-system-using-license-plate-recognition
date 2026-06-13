## Thông tin dự án

- Mục tiêu: Quản lý xe ra vào bãi đỗ bằng AI.
- Phát hiện biển số: YOLOv8.
- Nhận dạng ký tự: PaddleOCR.
- Backend: FastAPI.
- Frontend: ReactJS.
- Cơ sở dữ liệu: MongoDB.
- Hai chế độ hoạt động: Thủ công và Tự động.


Hệ Thống Quản Lý Bãi Đỗ Xe Sử Dụng AI Nhận Diện Biển Số

I.Giới thiệu

Đây là dự án xây dựng hệ thống quản lý xe ra vào bãi đỗ xe sử dụng trí tuệ nhân tạo. Hệ thống có khả năng tự động phát hiện và nhận diện biển số xe từ hình ảnh, đồng thời lưu trữ lịch sử các phương tiện đã đi vào bãi đỗ.

Dự án sử dụng mô hình YOLOv8 để phát hiện vị trí biển số xe và PaddleOCR để nhận dạng các ký tự trên biển số. 

II.Chức năng chính
1. Chế độ chụp thủ công
- Người dùng nhấn nút chụp ảnh.
- Ảnh được gửi từ Frontend đến Backend.
- Backend sử dụng YOLOv8 để phát hiện biển số xe.
- Sau khi cắt vùng biển số, PaddleOCR sẽ nhận dạng các ký tự.
- Kết quả được trả về Frontend để hiển thị.
- Thông tin biển số và thời gian nhận diện được lưu vào cơ sở dữ liệu.
2. Chế độ tự động

Hệ thống hoạt động liên tục và tự động phát hiện khi có xe xuất hiện.

Quy trình hoạt động:

- Hệ thống so sánh frame hiện tại với frame trước đó 3 giây. Nếu số lượng pixel thay đổi vượt ngưỡng cho phép, hệ thống xác định có thể có phương tiện xuất hiện và thực hiện chụp lại ảnh.
- Ảnh sẽ được tự động chụp và gửi về Backend để YOLOv8 phát hiện biển số và PaddleOCR nhận dạng các ký tự.
- Hệ thống kiểm tra dữ liệu gần nhất:
+ Nếu biển số vừa nhận diện giống với biển số trước đó.
+ Thời gian giữa hai lần nhận diện nhỏ hơn 60 giây.
-> Hệ thống sẽ không lưu thêm bản ghi mới nhằm tránh dữ liệu trùng lặp.

Cơ chế này giúp hạn chế việc lưu nhiều lần cùng một phương tiện khi xe vẫn đang đứng trước camera.

3. Xem lịch sử xe ra vào

Xem lịch sử các phương tiện đã được nhận diện.

Người dùng có thể:

- Xem danh sách các biển số xe.
- Xem thời gian nhận diện.
- Tra cứu thông tin đã được lưu trong MongoDB.


III.Công nghệ sử dụng
Frontend:
- ReactJS
- JavaScript
Backend:
- FastAPI
- Python
AI & Computer Vision:
- YOLOv8
- PaddleOCR
- OpenCV
Database:
- MongoDB

IV.Tác giả
**Họ và tên:** Đặng Kỳ Vĩ

**GitHub:** https://github.com/Dangkyvi

**Email:** 29112005vi@gmail.com