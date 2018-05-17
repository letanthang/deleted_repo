export const DeliveryErrors = {
  'GHN-SC77A9': 'KHÔNG LIÊN LẠC ĐƯỢC',
  'GHN-SC8KA0': 'THUÊ BAO KHÔNG LIÊN LẠC ĐƯỢC',
  'GHN-SC8KA1': 'KHÁCH KHÔNG NGHE MÁY',
  'GHN-SC181B': 'KHÁCH HẸN LẠI NGÀY GIAO HÀNG',
  'GHN-SC9649': 'KHÁCH ĐỔI ĐỊA CHỈ GIAO HÀNG',
  'GHN-SCA4EB': 'NGƯỜI GỬI THAY ĐỔI THÔNG TIN GIAO HÀNG',
  'GHN-SCB45E': 'NHÂN VIÊN HẸN LẠI NGÀY GIAO',
  'GHN-SCB78E': 'KHÁCH HẸN GIAO LẠI TRONG NGÀY',
};

export const PickErrors = {
  'GHN-PC952A': 'NGƯỜI GỬI HẸN LẠI NGÀY LẤY',
  'GHN-PC8D3E': 'KHÔNG LIÊN LẠC ĐƯỢC NGƯỜI GỬI',
  'GHN-PC8KA0': 'THUÊ BAO KHÔNG LIÊN LẠC ĐƯỢC',
  'GHN-PC8KA1': 'KHÁCH KHÔNG NGHE MÁY',
  'GHN-PCA940': 'KHÔNG LẤY HÀNG KỊP',
  'GHN-PCC9T0': 'KHÁCH HÀNG MUỐN GỬI HÀNG TẠI ĐIỂM',
};

export const ReturnErrors = {
  'GHN-RC8KA0': 'THUÊ BAO KHÔNG LIÊN LẠC ĐƯỢC',
  'GHN-RC8KA1': 'KHÁCH KHÔNG NGHE MÁY',
  // 'GHN-RC8C8E': 'KHÁCH TỪ CHỐI NHẬN HÀNG',
  'GHN-RC4A54': 'KHÔNG LIÊN LẠC ĐƯỢC VỚI KHÁCH',
  'R_ANOTHERDATE': 'NGƯỜI HẸN LẠI NGÀY TRẢ',
  // 'GHN-RCB9DA': 'SAI THÔNG TIN NGƯỜI NHẬN HÀNG',
  // 'GHN-RC9E91': 'GIAO LẠI NHIỀU LẦN KHÔNG THÀNH CÔNG',
  // 'GHN-RCBC9F': 'SAI LỆCH TIỀN THU HỘ (COD)',
  // 'GHN-RC43CC': 'HÀNG HÓA KHÔNG ĐÚNG THÔNG TIN BÁN HÀNG',
  // 'GHN-RCA4E6': 'NGƯỜI GỬI ĐƯA NHẦM/KHÔNG ĐỦ HÀNG',
  'GHN-RC80BC': 'HÀNG HÓA BỊ HƯ HỎNG',
  // 'GHN-RCF3DE': 'KHÁCH CÓ YÊU CẦU VƯỢT KHẢ NĂNG ĐÁP ỨNG',
  // 'GHN-RC5B4F': 'NGƯỜI GỬI YÊU CẦU TRẢ HÀNG',
};

export const HistoryActions = {
  'CREATE_TRIP': 'tạo chuyến đi',
  'ADD_TO_TRIP': 'thêm đơn vào chuyến đi',
  'REMOVE_FROM_TRIP': 'xóa đơn ra khỏi chuyến đi',
  'UPDATE_TRIP_ACTION': 'cập nhật trạng thái',
  'AUDITED': 'bắn kiểm',
  'OUTSTOCK': 'xuất kho',
  'CANCEL_TRIP': 'hủy chuyến đi',
  'ASSIGN_DRIVER': 'thay đổi thông tin tài xế',
  'START_TRIP': 'bắt đầu chuyến đi',
  'COMPLETE_TRIP': 'hoàn thành chuyến đi',
  'COLLECT_MONEY': 'thu tiền'
};

export const HistoryStatus = {
  'PICK_FAIL': 'lấy thất bại',
  'PICK_SUCCESS': 'lấy thành công',
  'RETURN_FAIL': 'trả thất bại',
  'RETURN_SUCCESS': 'trả thành công',
  'DELIVER_FAIL': 'giao thất bại',
  'DELIVER_SUCCESS': 'giao thành công',
};
