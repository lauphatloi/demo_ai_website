# HƯỚNG DẪN KẾT NỐI FORM WEBSITE VỚI GOOGLE SHEETS QUA GOOGLE APPS SCRIPT

Tài liệu này hướng dẫn bạn từng bước kết nối form đăng ký trên website Honda LEAD 2026 với Google Sheets hoàn toàn tự động, miễn phí và không giới hạn số lượng khách hàng.

---

## BƯỚC 1: Tạo Google Sheet Mới
1. Truy cập [Google Sheets (Trang tính)](https://sheets.new) để tạo một bảng tính mới.
2. Đặt tên bảng tính, ví dụ: **Khách Hàng Đăng Ký Honda LEAD 2026**.
3. (Tùy chọn) Đổi tên tab trang tính ở dưới thành `KhachHang`.

---

## BƯỚC 2: Mở Trình Soạn Thảo Google Apps Script
1. Trên thanh menu trên cùng của Google Sheet, bấm vào:  
   👉 **Tiện ích mở rộng (Extensions)** > **Apps Script**.
2. Một cửa sổ soạn thảo code mới sẽ mở ra.
3. Xóa toàn bộ nội dung mẫu đang có (hàm `myFunction()`).

---

## BƯỚC 3: Dán Mã Code Vào Apps Script
1. Mở file [**`google-apps-script.js`**](file:///home/ubuntu24_04/Desktop/lead_landing_page/google-apps-script.js) trong dự án.
2. Sao chép toàn bộ code và dán vào màn hình Apps Script.
3. Nhấn **Ctrl + S** (hoặc biểu tượng đĩa mềm 💾) để lưu dự án. Đặt tên dự án là: `Webhook Honda LEAD`.

---

## BƯỚC 4: Triển Khai Dưới Dạng Ứng Dụng Web (Web App)
*(Đây là bước quan trọng nhất để form gửi được dữ liệu)*

1. Ở góc trên cùng bên phải, nhấn vào nút **Triển khai (Deploy)** màu xanh > Chọn **Tùy chọn triển khai mới (New deployment)**.
2. Nhấn vào biểu tượng **Bánh răng (Cài đặt)** ở bên cạnh chữ "Chọn loại" > Chọn **Ứng dụng web (Web app)**.
3. Điền các thông tin thiết lập như sau:
   - **Mô tả (Description):** `Webhook Form Honda LEAD 2026`
   - **Thực thi dưới dạng (Execute as):** `Tôi (email của bạn)`
   - **Ai có quyền truy cập (Who has access):** 👉 **`Bất kỳ ai (Anyone)`** *(BẮT BUỘC chọn "Anyone" để người duyệt web có thể gửi dữ liệu vào)*
4. Nhấn nút **Triển khai (Deploy)**.

---

## BƯỚC 5: Cấp Quyền Truy Cập (Chỉ cần làm 1 lần đầu)
1. Khi hiện cửa sổ yêu cầu quyền, nhấn **Ủy quyền truy cập (Authorize access)**.
2. Chọn tài khoản Google của bạn.
3. Nếu Google hiển thị cảnh báo *"Google chưa xác minh ứng dụng này"*:
   - Nhấn vào chữ **Nâng cao (Advanced)** ở góc dưới.
   - Nhấn tiếp vào dòng chữ nhỏ: **Đi tới [Tên dự án] (không an toàn)**.
   - Nhấn **Cho phép (Allow)**.
4. Sau khi cấp quyền, Google sẽ hiển thị **URL Ứng dụng web (Web app URL)** có dạng:  
   `https://script.google.com/macros/s/AKfycb.../exec`
5. Hãy bấm **Sao chép (Copy)** đường link này.

---

## BƯỚC 6: Dán URL Vào Code Website
1. Mở file [**`assets/js/main.js`**](file:///home/ubuntu24_04/Desktop/lead_landing_page/assets/js/main.js).
2. Tìm đến dòng số 380:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz_REPLACE_WITH_YOUR_DEPLOYED_URL/exec';
   ```
3. Thay thế đoạn `'https://script.google.com/macros/s/.../exec'` bằng đường link URL bạn vừa sao chép ở Bước 5.
4. Lưu file và đẩy code lên GitHub Pages:
   ```bash
   git add assets/js/main.js
   git commit -m "feat: cap nhat google apps script webhook url"
   git push origin main && git push origin main:gh-pages
   ```

---

## CÁC TÍNH NĂNG TỰ ĐỘNG CỦA HỆ THỐNG:
- **Tự động tạo tiêu đề chuẩn đẹp:** Ngay khi có đơn hàng đầu tiên, bảng tính tự động tạo hàng tiêu đề màu xanh than đậm sang trọng gồm 6 cột:
  1. *Thời Gian Gửi* (giờ Việt Nam dd/MM/yyyy HH:mm:ss)
  2. *Họ Và Tên Khách Hàng*
  3. *Số Điện Thoại* (tự động giữ nguyên số `0` ở đầu số điện thoại)
  4. *Phiên Bản Quan Tâm*
  5. *Tỉnh / Thành Phố*
  6. *Nguồn Tiếp Nhận*
- **Khóa tránh xung đột:** Dữ liệu được bảo vệ bằng ScriptLock, dù có hàng chục khách gửi form cùng lúc cũng không bị mất đơn hoặc ghi đè.
- **Trải nghiệm mượt mà:** Nút gửi có hiệu ứng xoay loading và modal cảm ơn pop-up ngay lập tức, đem lại cảm giác chuyên nghiệp cao.
