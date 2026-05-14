export interface TourRaw {
  _id: string;
  maTour: string;
  tenTour: string;
  diaDiem: string;
  hinhAnh: string[];
  thoiLuong: string;
  mota: string;
  diemNoiBat: string;
  loTrinh: string;
  chitiettour: string;
  dieuKhoan: string;
  trangThai: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleRaw {
  _id: string;
  tourId: string;
  ngaykhoihanh: string;
  ngayketthuc: string;
  Socho: number;
  Conlai: number;
}

export interface TourPriceRaw {
  _id: string;
  tourId: string;
  giaNguoiLon: number;
  giaTreEm: number;
}

export interface TourServiceRaw {
  _id: string;
  tourId: string;
  dichvuId: string;
  tenDichVuApDung: string;
  giaApDungNguoiLon: number;
  giaApDungTreEm: number;
  noiDungDichVuBaoGom: string;
  noiDungDichVuKhongBaoGom: string;
  dieuKhoan: string;
}

export interface Review {
  _id: string;
  Users_ID: string;
  Tour_Id: string;
  Noidung: string;
  Sosao: number;
}

export interface TourDetail {
  tour: TourRaw;
  schedules: ScheduleRaw[];
  tourPrices: TourPriceRaw[];
  tourServices: TourServiceRaw[];
  reviews: Review[];
}

export interface TourDetailResponse {
  success: boolean;
  data: TourDetail;
}

// ─── BOOKING ────────────────────────────────────────────────────────────────

export interface PriceBreakdown {
  nguoiLon: number;
  treEm: number;
}

export interface DichVu {
  detailId: string;
  tenDichVu: string | null;
  donGia: PriceBreakdown;
  thanhTien: number;
}

export interface CreateBookingPayload {
  userId: string;
  tourId: string;
  tourServiceIds: string[];
  soluongnguoilon: number;
  soluongtreem: number;
  ngaydat: string;
  ngaydi: string;
}

export interface CreateBookingResponse {
  success: boolean;
  message: string;
  data: {
    bookingId: string;
  };
}

export interface BookedTour {
  bookingId: string;
  tour: {
    _id: string;
    tenTour: string;
    diaDiem: string;
    hinhAnh: string[];
  };
  trangThai: string;
  ngaydat: string;
  ngaydi: string;
  ngayketthuc: string;
  soLuong: PriceBreakdown;
  giaCurrent: PriceBreakdown;
  tongTien: number;
  trangThaiThanhToan: string;
  maGiaoDich?: string;
  ngayThanhToan?: string;
  dichVu: DichVu[];
  updatedAt?: string;
  expireAt: string;
}

export interface BookedTourResponse {
  success: boolean;
  message: string;
  data: BookedTour[];
}

// hóa đơn đặt tourr

export type InvoiceItem = {
  id: number;
  bookingId: string;
  tourId: string;
  tourName: string;
  location: string;
  image: string;
  bookingDate: string;
  paymentStatus: string;
  total: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerCode: string;
  adults: number;
  children: number;
  departureDate: string;
  endDate: string;
  tourAdultPrice: number;
  tourChildPrice: number;
  services: ServiceItem[];
  trangthai: string;
};

export type ServiceItem = {
  tenDichVu: string;
  giaNguoiLon: number;
  giaTreEm: number;
};