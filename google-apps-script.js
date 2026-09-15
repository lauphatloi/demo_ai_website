/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT - TỰ ĐỘNG LƯU THÔNG TIN KHÁCH HÀNG TỪ WEBSITE HONDA LEAD 2026
 * ==============================================================================
 * 
 * HƯỚNG DẪN CÀI ĐẶT NHANH (3 PHÚT):
 * 1. Tạo một Google Sheet mới (hoặc mở Google Sheet muốn lưu dữ liệu).
 * 2. Trên thanh menu Google Sheet, chọn: "Tiện ích mở rộng" (Extensions) > "Apps Script".
 * 3. Xóa hết code mẫu có sẵn và DÁN TOÀN BỘ nội dung file này vào.
 * 4. Bấm biểu tượng "Lưu" (Save - Ctrl+S).
 * 5. Bấm nút "Triển khai" (Deploy) màu xanh ở góc phải trên > Chọn "Tùy chọn triển khai mới" (New deployment).
 * 6. Bấm vào biểu tượng bánh răng bên cạnh "Chọn loại" > Chọn "Ứng dụng web" (Web app).
 * 7. Thiết lập như sau:
 *    - Mô tả: Nhận form tư vấn Honda LEAD 2026
 *    - Thực thi dưới dạng (Execute as): "Tôi" (Me - tài khoản Google của bạn)
 *    - Ai có quyền truy cập (Who has access): "Bất kỳ ai" (Anyone) -> **BẮT BUỘC CHỌN ĐỂ FORM GỬI ĐƯỢC**
 * 8. Bấm "Triển khai" (Deploy). Google sẽ hỏi cấp quyền:
 *    - Bấm "Xem quyền" (Authorize access) > Chọn tài khoản Google của bạn.
 *    - Bấm "Nâng cao" (Advanced) > Bấm "Đi tới [Dự án của bạn] (không an toàn)".
 *    - Bấm "Cho phép" (Allow).
 * 9. Sao chép "URL Ứng dụng web" (Web App URL) vừa tạo (có dạng: https://script.google.com/macros/s/.../exec).
 * 10. Dán URL đó vào biến `GOOGLE_SCRIPT_URL` trong file `assets/js/main.js` của website.
 */

// Tên sheet lưu dữ liệu (mặc định lưu vào trang tính đầu tiên)
const SHEET_NAME = 'KhachHang';

/**
 * Xử lý yêu cầu POST gửi từ Form Website
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  // Đợi tối đa 30 giây để tránh xung đột khi nhiều khách cùng gửi form
  lock.tryLock(30000);

  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    // Nếu chưa có sheet tên 'KhachHang', lấy sheet đầu tiên hoặc tạo mới
    if (!sheet) {
      sheet = spreadsheet.getActiveSheet();
      sheet.setName(SHEET_NAME);
    }

    // Nếu sheet chưa có tiêu đề cột, tự động tạo tiêu đề đẹp và chuyên nghiệp
    if (sheet.getLastRow() === 0) {
      setupSheetHeaders(sheet);
    }

    // Lấy dữ liệu gửi lên (Hỗ trợ cả JSON body lẫn Form URL Encoded)
    let data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    // Trích xuất các trường dữ liệu
    const name = data.name || data['Họ và tên'] || 'Chưa cung cấp';
    let phone = data.phone || data['Số điện thoại'] || '';
    // Thêm dấu nháy đơn trước số điện thoại để Google Sheet không làm mất số 0 đầu tiên
    if (phone && !phone.startsWith("'")) {
      phone = "'" + phone;
    }
    const version = data.version || data['Phiên bản'] || 'Chưa chọn';
    const city = data.city || data['Tỉnh/Thành phố'] || 'Chưa rõ';
    const source = data.source || 'Website Honda LEAD 2026';
    
    // Thời gian khách đăng ký (Múi giờ Việt Nam GMT+7)
    const timestamp = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy HH:mm:ss');

    // Thêm dòng mới vào Google Sheet
    sheet.appendRow([timestamp, name, phone, version, city, source]);

    // Trả về phản hồi thành công dạng JSON (Có header CORS)
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Đã nhận và lưu thông tin khách hàng thành công!'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    // Luôn giải phóng khóa
    lock.releaseLock();
  }
}

/**
 * Xử lý yêu cầu GET để kiểm tra Webhook có đang hoạt động hay không
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'active',
      message: 'Google Apps Script Webhook Honda LEAD 2026 đang hoạt động bình thường!'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Tự động tạo và định dạng hàng tiêu đề cho Google Sheet
 */
function setupSheetHeaders(sheet) {
  const headers = [
    'Thời Gian Gửi',
    'Họ Và Tên Khách Hàng',
    'Số Điện Thoại',
    'Phiên Bản Quan Tâm',
    'Tỉnh / Thành Phố',
    'Nguồn Tiếp Nhận'
  ];

  sheet.appendRow(headers);

  // Định dạng tiêu đề cột nổi bật
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#0f172a'); // Màu xanh than đậm cao cấp
  headerRange.setFontColor('#ffffff'); // Chữ trắng
  headerRange.setHorizontalAlignment('center');
  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1);

  // Đặt độ rộng cột phù hợp
  sheet.setColumnWidth(1, 170); // Thời gian
  sheet.setColumnWidth(2, 220); // Tên
  sheet.setColumnWidth(3, 150); // SĐT
  sheet.setColumnWidth(4, 300); // Phiên bản
  sheet.setColumnWidth(5, 180); // Tỉnh/TP
  sheet.setColumnWidth(6, 200); // Nguồn
}

/**
 * Hàm kiểm tra thử nghiệm (Dành cho việc test trực tiếp trong Apps Script Editor)
 * Bạn có thể chọn hàm này và bấm "Chạy" (Run) để kiểm tra ghi dữ liệu mẫu.
 */
function testAppendRow() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        name: 'Nguyễn Văn Test',
        phone: '0912345678',
        version: 'Phiên bản Đặc biệt (Trang bị phanh ABS)',
        city: 'Bình Dương',
        source: 'Test Trực Tiếp Apps Script'
      })
    }
  };
  const res = doPost(mockEvent);
  Logger.log(res.getContent());
}
