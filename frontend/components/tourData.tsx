export const tourData = {
  title: "Núi bà đen | Thành phố Tây Bắc | Bắc Ninh",
  rating: 4.0,
  reviews: 13,

  images: [
    "/glr10.jpg",
    "/glr7.jpg",
    "/glr3.jpg",
    "/glr9.jpg",
    "/glr7.jpg",
  ],

  description: {
    title: "Tour du lịch núi bà đen tại Bắc Ninh, Việt Nam",
    content:
      "Tận hưởng hành trình của bạn tại núi bà đen trong 2 ngày, 1 đêm của tour",
    highlights: [
      "Trải nghiệm cáp treo Chùa Bà nổi tiếng",
      "Check-in cảnh đẹp thiên nhiên",
      "Tham gia Fantasy Park",
      "Thưởng thức buffet đặc sản",
    ],
  },

  itinerary: [
    "Ngày 1: Di chuyển - trekking - cắm trại",
    "07:00 - 12:00: Di chuyển",
    "13:30: Ăn trưa",
    "Chiều: trekking",
    "Tối: nghỉ ngơi",
    "Ngày 2: Di chuyển - trekking - cắm trại",
    "07:00 - 12:00: Di chuyển",
    "13:30: Ăn trưa",
    "Chiều: trekking",
    "Tối: nghỉ ngơi",
  ],

  adultPrice: 1500000,
  childPrice: 700000,

  included: [
    "Xe tham quan (15, 25, 35, 45 chỗ tùy số lượng khách)",
    "Hành lý ký gửi: 20kg, xách tay 7kg/1 khách",
    "Ăn theo chương trình (set menu)",
    "Vé tham quan theo chương trình",
    "Hướng dẫn viên tiếng Việt",
    "Bảo hiểm du lịch tối đa 120.000.000đ/vụ",
    "Nón Vietravel + Nước suối + Khăn lạnh",
    "Thuế VAT",
  ],

  extra: [
    {
      id: 1,
      title: "Dịch vụ thêm: Phương tiện di chuyển",
      type: "Phương tiện di chuyển",
      description: "Vé máy bay khứ hồi, hỗ trợ đặt chỗ theo lịch trình tour.",

      included: [
        "Vé máy bay khứ hồi",
        "Hỗ trợ đặt chỗ theo lịch trình",
        "Hỗ trợ tư vấn giờ bay"
      ],

      notIncluded: [
        "Hành lý quá cước",
        "Phí đổi ngày bay",
        "Phụ thu hạng ghế thương gia",
      ],

      terms: [
        "Giá có thể thay đổi tùy thời điểm đặt vé",
        "Không hoàn hủy sát ngày khởi hành",
        "Cần cung cấp thông tin đúng như CCCD"
      ],

      adultPrice: 500000,
      childPrice: 350000,
    },
    {
      id: 2,
      title: "Dịch vụ thêm: Nơi ở",
      type: "Lưu trú",
      description: "Khách sạn tiêu chuẩn 1 khách/phòng, tiện nghi cơ bản đầy đủ.",

      included: [
        "Phòng nghỉ tiêu chuẩn",
        "Wifi miễn phí",
        "Dọn phòng hằng ngày"
      ],

      notIncluded: [
        "Giặt ủi",
        "Đồ uống minibar",
        "Phụ thu trả phòng trễ",
      ],

      terms: [
        "Nhận phòng sau 14:00",
        "Trả phòng trước 12:00",
        "Phụ thu nếu phát sinh thêm người"
      ],

      adultPrice: 300000,
      childPrice: 200000,
    },
  ],

  // ✅ PHẦN ĐÁNH GIÁ (MỚI THÊM)
  reviewSection: {
    average: 4.0,
    total: 13,

    breakdown: [
      { star: 5, percent: 60 },
      { star: 4, percent: 30 },
      { star: 3, percent: 10 },
      { star: 2, percent: 5 },
      { star: 1, percent: 2 },
    ],

    list: [
      {
        id: 1,
        name: "Hà Văn Tèo",
        rating: 4,
        content:
          "Trải nghiệm cáp treo rất đẹp, cảnh núi hùng vĩ, đáng đi thử một lần.",
      },
      {
        id: 2,
        name: "Nguyễn Văn A",
        rating: 5,
        content:
          "Dịch vụ tốt, hướng dẫn viên nhiệt tình, đồ ăn ngon.",
      },
      {
        id: 3,
        name: "Trần Thị B",
        rating: 3,
        content:
          "Ổn nhưng hơi đông khách vào cuối tuần.",
      },
      {
        id: 4,
        name: "Lê Văn C",
        rating: 4,
        content:
          "View đẹp, chụp ảnh cực chill.",
      },
      {
        id: 5,
        name: "Lê Văn C",
        rating: 4,
        content:
          "View đẹp, chụp ảnh cực chill.",
      },
      {
        id: 6,
        name: "Lê Văn C",
        rating: 4,
        content:
          "View đẹp, chụp ảnh cực chill.",
      },
      {
        id: 7,
        name: "Lê Văn C",
        rating: 4,
        content:
          "View đẹp, chụp ảnh cực chill.",
      },
      {
        id: 8,
        name: "Lê Văn C",
        rating: 4,
        content:
          "View đẹp, chụp ảnh cực chill.",
      },
      {
        id: 9,
        name: "Lê Văn C",
        rating: 4,
        content:
          "View đẹp, chụp ảnh cực chill.",
      },
      {
        id: 10,
        name: "Lê Văn C",
        rating: 4,
        content:
          "View đẹp, chụp ảnh cực chill.",
      },

    ],
  },
  
  terms: [
    "Xe tham quan (15, 25, 35, 45 chỗ tùy số lượng khách)",
    "Hành lý ký gửi: 20kg, xách tay 7kg/1 khách",
    "Ăn theo chương trình (set menu)",
    "Vé tham quan theo chương trình",
    "Hướng dẫn viên tiếng Việt",
    "Bảo hiểm du lịch tối đa 120.000.000đ/vụ",
    "Nón Vietravel + Nước suối + Khăn lạnh",
    "Thuế VAT",
    "Khi chọn vào dịch vụ thêm, thì người bên phía nhà cung cấp sẽ chọn các dịch vụ sau đó xác nhận lại với phía khách hàng sau",
  ]
};