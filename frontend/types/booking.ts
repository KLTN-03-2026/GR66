
export interface ExtraService {
  id: string | number;
  title: string;
  type: string;
  adultPrice: number;
  childPrice: number;
  included: string[];
  notIncluded?: string[];
  terms?: string[];
}

/* ===== TOUR DATA ===== */
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
  tendichvu: string;
  dichvuId: string;
  tenDichVuApDung: string;
  giaApDungNguoiLon: number;
  giaApDungTreEm: number;
  noiDungDichVuBaoGom: string;
  noiDungDichVuKhongBaoGom: string;
  dieuKhoan: string;
}

export interface DichVuId {
  _id: string;
  tendichvu: string;
  donVi: string;
  moTa: string;
  trangThai: string;
  createdAt: string;
  updatedAt: string;
  serviceTypeId: {
    _id: string;
    loaidichvu: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface TourDetailResponse {
  success: boolean;
  data: {
    tour: TourRaw;
    schedules: ScheduleRaw[];
    tourPrices: TourPriceRaw[];
    tourServices: TourServiceRaw[];
  };
}