export const ErrorCode = {
  EC01: -20001 /* "Ảnh chụp không đủ 4 góc giấy tờ hoặc bị che khuất. Vui lòng chụp lại! Your document is without 4 corners or covered. Please try again!" */,
  EC02: -20002 /* "Ảnh bị mờ. Vui lòng chụp rõ nét giấy tờ với đầy đủ thông tin! Blurred document. Please take a clear photo with full information!" */,
  EC03: -20003 /* "Điều kiện ánh sáng không phù hợp. Vui lòng chụp lại! Unsuitable lighting condition. Please try again!" */,
  EC04: -20004 /* "Ảnh chụp giấy tờ quá nhỏ. Vui lòng chụp ở khoảng cách phù hợp! Your document is too small. Please try again!" */,
  EC05: -20005 /* "Ảnh chụp giấy tờ quá nhỏ. Vui lòng chụp ở khoảng cách phù hợp! Your document is too small. Please try again!" */,
  EC06: -20006 /* "Giấy tờ không hợp lệ. Vui lòng chỉ chụp duy nhất loại giấy tờ bạn đã chọn! Invalid documents. Please only capture the selected type of document!" */,
  EC07: -20007 /*" Giấy tờ không hợp lệ. Vui lòng chỉ chụp duy nhất loại giấy tờ bạn đã chọn! Invalid documents. Please only capture the selected type of document!" */,
  EC08: -20008 /* "Giấy tờ không hợp lệ. Vui lòng chỉ chụp duy nhất loại giấy tờ bạn đã chọn! Invalid documents. Please only capture the selected type of document!" */,
  EC09: -20009 /* "Giấy tờ giả mạo. Vui lòng chụp giấy tờ thật! Forged documents. Please try again!" */,

  ES01: -10001 /*"Không phải ảnh người thật. Vui lòng chụp lại! Not a real person. Please try again!"*/,
  ES02: -10002 /*"Ảnh không chứa khuôn mặt. Vui lòng chụp lại! No face detected. Please try again!"*/,
  ES03: -10003 /*"Ảnh chứa nhiều khuôn mặt. Vui lòng chỉ chụp duy nhất khuôn mặt của bạn! Multiple faces detected. Please only capture your face!"*/,
  ES04: -10004 /*"Chất lượng ảnh không đạt yêu cầu. Vui lòng chụp lại! Low quality photo. Please try again!" */,
  ES05: -10005 /*"Chất lượng ảnh không đạt yêu cầu. Vui lòng chụp lại! Low quality photo. Please try again!" */,
  ES06: -10006 /*"Một phần khuôn mặt bị che khuất. Vui lòng chụp lại! Part of your face is covered. Please try again!" */,
  ES07: -10007 /*"Một phần khuôn mặt bị che khuất. Vui lòng chụp lại! Part of your face is covered. Please try again!" */,
  ES08: -10008 /*"Khoảng cách chụp ảnh không phù hợp. Vui lòng chụp lại! Unsuitable capturing distance. Please try again!" */,
  ES09: -10009 /*"Khoảng cách chụp ảnh không phù hợp. Vui lòng chụp lại! Unsuitable capturing distance. Please try again!" */
};

export function parseErrorCode2Number(code: string): number {
  const beCode = ErrorCode[code];
  return beCode || -1;
}
