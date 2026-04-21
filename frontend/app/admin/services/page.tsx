"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Library,
  Settings2,
  Ban,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

type TrangThai = "Hoạt động" | "Ngừng";
type TabKey = "library" | "tour_services";

type ServiceType = {
  _id: string;
  loaidichvu: string;
  createdAt?: string;
  updatedAt?: string;
};

type Service = {
  _id: string;
  serviceTypeId: string;
  tendichvu: string;
  moTa: string;
  donVi: string;
  trangThai: TrangThai;
  createdAt?: string;
  updatedAt?: string;
};

type Tour = {
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
  trangThai: TrangThai;
  createdAt?: string;
  updatedAt?: string;
};

type TourPrice = {
  _id: string;
  tourId: string;
  giaNguoiLon: number;
  giaTreEm: number;
  createdAt?: string;
  updatedAt?: string;
};

type TourService = {
  _id: string;
  tourId: string;
  dichvuId: string;
  tenDichVuApDung: string;
  giaApDungNguoiLon: number;
  giaApDungTreEm: number;
  noiDungDichVuBaoGom: string;
  noiDungDichVuKhongBaoGom: string;
  dieuKhoan: string;
  createdAt?: string;
  updatedAt?: string;
};

const mockServiceTypes: ServiceType[] = [
  {
    _id: "69e65f819885f6fdb4bb4b1b",
    loaidichvu: "Xe khách du lịch",
    createdAt: "2026-04-20T17:16:49.399+00:00",
    updatedAt: "2026-04-20T17:16:49.399+00:00",
  },
  {
    _id: "69e65f819885f6fdb4bb4b1c",
    loaidichvu: "Khách sạn",
  },
  {
    _id: "69e65f819885f6fdb4bb4b1d",
    loaidichvu: "Ăn uống",
  },
  {
    _id: "69e65f819885f6fdb4bb4b1e",
    loaidichvu: "Vé tham quan",
  },
];

const mockServices: Service[] = [
  {
    _id: "69e71f584eed2f590c85a4ca",
    serviceTypeId: "69e65f819885f6fdb4bb4b1b",
    tendichvu: "Xe du lịch 30 chỗ",
    moTa: "xe du lịch 30 chỗ vận chuyển đi và về",
    donVi: "xe",
    trangThai: "Hoạt động",
    createdAt: "2026-04-21T06:55:20.788+00:00",
    updatedAt: "2026-04-21T07:17:30.826+00:00",
  },
  {
    _id: "69e65fa69885f6fdb4bb4b1d",
    serviceTypeId: "69e65f819885f6fdb4bb4b1b",
    tendichvu: "Xe du lịch 45 chỗ",
    moTa: "Xe lớn dùng cho đoàn đông người, đưa đón theo lịch trình.",
    donVi: "xe",
    trangThai: "Hoạt động",
  },
  {
    _id: "69e65fa69885f6fdb4bb4b1e",
    serviceTypeId: "69e65f819885f6fdb4bb4b1c",
    tendichvu: "Khách sạn 3 sao",
    moTa: "Khách sạn tiêu chuẩn 3 sao, phòng đôi, có ăn sáng.",
    donVi: "đêm",
    trangThai: "Hoạt động",
  },
  {
    _id: "69e65fa69885f6fdb4bb4b1f",
    serviceTypeId: "69e65f819885f6fdb4bb4b1d",
    tendichvu: "Bữa trưa set menu",
    moTa: "Thực đơn tiêu chuẩn đoàn khách du lịch.",
    donVi: "suất",
    trangThai: "Hoạt động",
  },
  {
    _id: "69e65fa69885f6fdb4bb4b20",
    serviceTypeId: "69e65f819885f6fdb4bb4b1e",
    tendichvu: "Vé tham quan Đại Nội",
    moTa: "Vé vào cổng khu di tích Đại Nội Huế.",
    donVi: "vé",
    trangThai: "Ngừng",
  },
];

const mockTours: Tour[] = [
  {
    _id: "69e65fe89885f6fdb4bb4b27",
    maTour: "TOUR1776705512952",
    tenTour: "Du lịch Huế",
    diaDiem: "Huế",
    hinhAnh: ["/tour-hue-1.jpg"],
    thoiLuong: "3 ngày",
    mota: "Huế là một trong những điểm du lịch nổi tiếng của Việt Nam.",
    diemNoiBat: "Kinh Thành Huế, Chùa Thiên Mụ, ẩm thực cố đô.",
    loTrinh: "Ngày 1 tham quan trung tâm, ngày 2 khám phá di tích, ngày 3 mua sắm.",
    chitiettour: "Dịch vụ tham quan, lưu trú, ăn uống theo chương trình.",
    dieuKhoan: "Đặt tour và thanh toán theo quy định công ty.",
    trangThai: "Hoạt động",
    createdAt: "2026-04-20T17:18:32.956+00:00",
    updatedAt: "2026-04-20T17:18:32.956+00:00",
  },
  {
    _id: "69e65fe89885f6fdb4bb4b28",
    maTour: "TOUR1776705512953",
    tenTour: "Du lịch Đà Nẵng",
    diaDiem: "Đà Nẵng",
    hinhAnh: ["/tour-danang-1.jpg"],
    thoiLuong: "2 ngày",
    mota: "Tour nghỉ dưỡng và tham quan Đà Nẵng.",
    diemNoiBat: "Biển Mỹ Khê, Bà Nà Hills.",
    loTrinh: "Ngày 1 biển, ngày 2 Bà Nà Hills.",
    chitiettour: "Xe đưa đón, ăn sáng, lưu trú theo lịch.",
    dieuKhoan: "Theo chính sách công ty.",
    trangThai: "Hoạt động",
  },
  {
    _id: "69e65fe89885f6fdb4bb4b29",
    maTour: "TOUR1776705512954",
    tenTour: "Du lịch Hội An",
    diaDiem: "Hội An",
    hinhAnh: ["/tour-hoian-1.jpg"],
    thoiLuong: "2 ngày",
    mota: "Khám phá phố cổ Hội An.",
    diemNoiBat: "Phố cổ, đèn lồng, ẩm thực địa phương.",
    loTrinh: "Ngày 1 tham quan phố cổ, ngày 2 trải nghiệm địa phương.",
    chitiettour: "Lưu trú, ăn uống, vé tham quan.",
    dieuKhoan: "Theo chính sách công ty.",
    trangThai: "Ngừng",
  },
];

const mockTourPrices: TourPrice[] = [
  {
    _id: "69e65fe99885f6fdb4bb4b2c",
    tourId: "69e65fe89885f6fdb4bb4b27",
    giaNguoiLon: 450000,
    giaTreEm: 500000,
    createdAt: "2026-04-20T17:18:33.112+00:00",
    updatedAt: "2026-04-20T17:18:33.112+00:00",
  },
  {
    _id: "69e65fe99885f6fdb4bb4b2d",
    tourId: "69e65fe89885f6fdb4bb4b28",
    giaNguoiLon: 1500000,
    giaTreEm: 900000,
  },
  {
    _id: "69e65fe99885f6fdb4bb4b2e",
    tourId: "69e65fe89885f6fdb4bb4b29",
    giaNguoiLon: 1200000,
    giaTreEm: 700000,
  },
];

const mockTourServices: TourService[] = [
  {
    _id: "69e65fe99885f6fdb4bb4b2f",
    tourId: "69e65fe89885f6fdb4bb4b27",
    dichvuId: "69e65fa69885f6fdb4bb4b1d",
    tenDichVuApDung: "Xe 45 chổ",
    giaApDungNguoiLon: 1000000,
    giaApDungTreEm: 500000,
    noiDungDichVuBaoGom:
      "Xe du lịch đưa đón theo chương trình tham quan các điểm như Kinh Thành…",
    noiDungDichVuKhongBaoGom:
      "Vé máy bay/xe khách từ nơi ở đến Huế (nếu không ghi rõ trong tour)",
    dieuKhoan:
      "Đặt tour & thanh toán: Khách hàng cần đặt tour trước ngày khởi hành…",
    createdAt: "2026-04-20T17:18:33.247+00:00",
    updatedAt: "2026-04-20T17:18:33.247+00:00",
  },
  {
    _id: "69e65fe99885f6fdb4bb4b30",
    tourId: "69e65fe89885f6fdb4bb4b27",
    dichvuId: "69e65fa69885f6fdb4bb4b1e",
    tenDichVuApDung: "Khách sạn 3 sao trung tâm",
    giaApDungNguoiLon: 800000,
    giaApDungTreEm: 450000,
    noiDungDichVuBaoGom: "Lưu trú 2 đêm, ăn sáng buffet.",
    noiDungDichVuKhongBaoGom: "Giặt ủi, minibar.",
    dieuKhoan: "Tùy theo tình trạng phòng.",
  },
  {
    _id: "69e65fe99885f6fdb4bb4b31",
    tourId: "69e65fe89885f6fdb4bb4b28",
    dichvuId: "69e71f584eed2f590c85a4ca",
    tenDichVuApDung: "Xe du lịch 30 chỗ đi Bà Nà",
    giaApDungNguoiLon: 300000,
    giaApDungTreEm: 200000,
    noiDungDichVuBaoGom: "Xe đưa đón nội thành Đà Nẵng.",
    noiDungDichVuKhongBaoGom: "Phát sinh ngoài lịch trình.",
    dieuKhoan: "Có mặt đúng giờ.",
  },
];

function formatMoney(value: number) {
  return value.toLocaleString("vi-VN");
}

function getServiceTypeName(serviceTypeId: string, serviceTypes: ServiceType[]) {
  return serviceTypes.find((item) => item._id === serviceTypeId)?.loaidichvu || "Không rõ";
}

function getTourPriceByTourId(tourId: string, tourPrices: TourPrice[]) {
  return tourPrices.find((item) => item.tourId === tourId) || null;
}

function getServiceById(serviceId: string, services: Service[]) {
  return services.find((item) => item._id === serviceId) || null;
}

function createTourServiceFromBase(service: Service, tourId: string): TourService {
  return {
    _id: `ts_${Date.now()}`,
    tourId,
    dichvuId: service._id,
    tenDichVuApDung: service.tendichvu,
    giaApDungNguoiLon: 0,
    giaApDungTreEm: 0,
    noiDungDichVuBaoGom: service.moTa || "",
    noiDungDichVuKhongBaoGom: "",
    dieuKhoan: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export default function AdminServicesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("library");

  const [serviceTypes] = useState<ServiceType[]>(mockServiceTypes);
  const [services, setServices] = useState<Service[]>(mockServices);
  const [tours] = useState<Tour[]>(mockTours);
  const [tourPrices] = useState<TourPrice[]>(mockTourPrices);
  const [tourServices, setTourServices] = useState<TourService[]>(mockTourServices);

  const [serviceSearch, setServiceSearch] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>("all");

  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState({
    serviceTypeId: mockServiceTypes[0]?._id || "",
    tendichvu: "",
    moTa: "",
    donVi: "",
    trangThai: "Hoạt động" as TrangThai,
  });

  const [selectedTourId, setSelectedTourId] = useState<string>(
    mockTours[0]?._id || ""
  );
  const [tourServiceSearch, setTourServiceSearch] = useState("");
  const [selectedTourServiceId, setSelectedTourServiceId] = useState<string | null>(null);

  const filteredServices = useMemo(() => {
    const keyword = serviceSearch.trim().toLowerCase();

    return services.filter((service) => {
      const serviceTypeName = getServiceTypeName(service.serviceTypeId, serviceTypes).toLowerCase();

      const matchKeyword =
        service.tendichvu.toLowerCase().includes(keyword) ||
        service.moTa.toLowerCase().includes(keyword) ||
        service.donVi.toLowerCase().includes(keyword) ||
        serviceTypeName.includes(keyword);

      const matchType =
        serviceTypeFilter === "all" || service.serviceTypeId === serviceTypeFilter;

      return matchKeyword && matchType;
    });
  }, [services, serviceSearch, serviceTypeFilter, serviceTypes]);

  const selectedTour = useMemo(
    () => tours.find((tour) => tour._id === selectedTourId) || null,
    [tours, selectedTourId]
  );

  const selectedTourPrice = useMemo(
    () => getTourPriceByTourId(selectedTourId, tourPrices),
    [selectedTourId, tourPrices]
  );

  const filteredTourServices = useMemo(() => {
    const keyword = tourServiceSearch.trim().toLowerCase();

    return tourServices.filter((item) => {
      if (item.tourId !== selectedTourId) return false;

      const service = getServiceById(item.dichvuId, services);
      const tenGoc = service?.tendichvu?.toLowerCase() || "";

      return (
        tenGoc.includes(keyword) ||
        item.tenDichVuApDung.toLowerCase().includes(keyword) ||
        item.noiDungDichVuBaoGom.toLowerCase().includes(keyword) ||
        item.noiDungDichVuKhongBaoGom.toLowerCase().includes(keyword) ||
        item.dieuKhoan.toLowerCase().includes(keyword)
      );
    });
  }, [tourServices, selectedTourId, tourServiceSearch, services]);

  const stats = useMemo(() => {
    return {
      totalServiceTypes: serviceTypes.length,
      totalServices: services.length,
      activeServices: services.filter((item) => item.trangThai === "Hoạt động").length,
      totalTourServices: tourServices.length,
    };
  }, [serviceTypes, services, tourServices]);

  const totalConfiguredAdult = filteredTourServices.reduce(
    (sum, item) => sum + (item.giaApDungNguoiLon || 0),
    0
  );

  const totalConfiguredChild = filteredTourServices.reduce(
    (sum, item) => sum + (item.giaApDungTreEm || 0),
    0
  );

  const resetServiceForm = () => {
    setEditingServiceId(null);
    setServiceForm({
      serviceTypeId: serviceTypes[0]?._id || "",
      tendichvu: "",
      moTa: "",
      donVi: "",
      trangThai: "Hoạt động",
    });
  };

  const openCreateService = () => {
    resetServiceForm();
    setServiceModalOpen(true);
  };

  const openEditService = (service: Service) => {
    setEditingServiceId(service._id);
    setServiceForm({
      serviceTypeId: service.serviceTypeId,
      tendichvu: service.tendichvu,
      moTa: service.moTa,
      donVi: service.donVi,
      trangThai: service.trangThai,
    });
    setServiceModalOpen(true);
  };

  const saveService = () => {
    if (!serviceForm.serviceTypeId || !serviceForm.tendichvu.trim() || !serviceForm.donVi.trim()) {
      window.alert("Vui lòng nhập đầy đủ loại dịch vụ, tên dịch vụ và đơn vị.");
      return;
    }

    if (editingServiceId) {
      setServices((prev) =>
        prev.map((item) =>
          item._id === editingServiceId
            ? {
                ...item,
                serviceTypeId: serviceForm.serviceTypeId,
                tendichvu: serviceForm.tendichvu.trim(),
                moTa: serviceForm.moTa.trim(),
                donVi: serviceForm.donVi.trim(),
                trangThai: serviceForm.trangThai,
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      );
    } else {
      const newService: Service = {
        _id: `sv_${Date.now()}`,
        serviceTypeId: serviceForm.serviceTypeId,
        tendichvu: serviceForm.tendichvu.trim(),
        moTa: serviceForm.moTa.trim(),
        donVi: serviceForm.donVi.trim(),
        trangThai: serviceForm.trangThai,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setServices((prev) => [newService, ...prev]);
    }

    setServiceModalOpen(false);
    resetServiceForm();
  };

  const toggleServiceStatus = (id: string) => {
    setServices((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              trangThai: item.trangThai === "Hoạt động" ? "Ngừng" : "Hoạt động",
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const deleteService = (id: string) => {
    const used = tourServices.some((item) => item.dichvuId === id);

    if (used) {
      window.alert(
        "Dịch vụ này đang được sử dụng trong tourServices. Không nên xóa cứng, hãy chuyển trạng thái sang Ngừng."
      );
      return;
    }

    const ok = window.confirm("Bạn có chắc muốn xóa dịch vụ dùng chung này không?");
    if (!ok) return;

    setServices((prev) => prev.filter((item) => item._id !== id));
  };

  const addServiceToTour = (service: Service) => {
    if (!selectedTourId) return;

    const existed = tourServices.some(
      (item) => item.tourId === selectedTourId && item.dichvuId === service._id
    );

    if (existed) {
      window.alert("Tour này đã có dịch vụ này trong tourServices.");
      return;
    }

    const newItem = createTourServiceFromBase(service, selectedTourId);

    setTourServices((prev) => [newItem, ...prev]);
    setActiveTab("tour_services");
    setSelectedTourServiceId(newItem._id);
  };

  const updateTourService = (
    id: string,
    field: keyof TourService,
    value: string | number
  ) => {
    setTourServices((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              [field]: value,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const deleteTourService = (id: string) => {
    const ok = window.confirm("Bạn có chắc muốn xóa dịch vụ này khỏi tour không?");
    if (!ok) return;

    setTourServices((prev) => prev.filter((item) => item._id !== id));
    if (selectedTourServiceId === id) setSelectedTourServiceId(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F6F8] px-6 py-6 md:px-8 lg:px-10">
      <div className="w-full">
        <h1 className="mb-6 text-[36px] font-semibold tracking-tight text-[#111827] md:text-[42px]">
          Quản lý dịch vụ tour
        </h1>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Loại dịch vụ" value={stats.totalServiceTypes} bg="bg-[#5D78EA]" />
          <StatCard title="Dịch vụ dùng chung" value={stats.totalServices} bg="bg-[#42C4A2]" />
          <StatCard title="Dịch vụ đang hoạt động" value={stats.activeServices} bg="bg-[#7757E8]" />
          <StatCard title="Tour services đã tạo" value={stats.totalTourServices} bg="bg-[#F08B55]" />
        </div>

        <div className="mb-6 rounded-[18px] border border-[#E5E7EB] bg-white p-4">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab("library")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === "library"
                  ? "bg-[#13A8E3] text-white"
                  : "bg-[#F3F4F6] text-[#374151]"
              }`}
            >
              <Library className="h-4 w-4" />
              Thư viện dịch vụ
            </button>

            <button
              onClick={() => setActiveTab("tour_services")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === "tour_services"
                  ? "bg-[#13A8E3] text-white"
                  : "bg-[#F3F4F6] text-[#374151]"
              }`}
            >
              <Settings2 className="h-4 w-4" />
              Thiết lập dịch vụ theo tour
            </button>

            <div className="ml-auto">
              <button
                onClick={openCreateService}
                className="inline-flex items-center gap-2 rounded-xl bg-[#10B981] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                Thêm dịch vụ dùng chung
              </button>
            </div>
          </div>

          {activeTab === "library" && (
            <div className="grid grid-cols-1 gap-5">
              <div className="rounded-[16px] border border-[#E5E7EB] bg-white">
                <div className="flex flex-col gap-3 border-b border-[#EEF1F5] p-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex w-full max-w-[460px] overflow-hidden rounded-[10px] border border-[#D7DCE3] bg-white">
                    <div className="flex flex-1 items-center px-4">
                      <Search className="mr-2 h-4 w-4 text-[#8D96A7]" />
                      <input
                        type="text"
                        placeholder="Tìm theo tên dịch vụ, loại dịch vụ, mô tả..."
                        value={serviceSearch}
                        onChange={(e) => setServiceSearch(e.target.value)}
                        className="h-[42px] w-full border-none bg-transparent text-[14px] text-black outline-none placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <select
                    value={serviceTypeFilter}
                    onChange={(e) => setServiceTypeFilter(e.target.value)}
                    className="h-[42px] min-w-[220px] rounded-[10px] border border-[#D7DCE3] bg-white px-4 text-[14px] text-black outline-none"
                  >
                    <option value="all">Tất cả loại dịch vụ</option>
                    {serviceTypes.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.loaidichvu}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px] table-fixed">
                    <thead>
                      <tr className="h-[52px] border-b border-[#EEF1F5] bg-[#FAFBFC] text-left">
                        <th className="w-[210px] px-4 text-[13px] font-bold text-[#374151]">
                          Tên dịch vụ
                        </th>
                        <th className="w-[180px] px-3 text-[13px] font-bold text-[#374151]">
                          Loại dịch vụ
                        </th>
                        <th className="w-[100px] px-3 text-[13px] font-bold text-[#374151]">
                          Đơn vị
                        </th>
                        <th className="w-[260px] px-3 text-[13px] font-bold text-[#374151]">
                          Mô tả
                        </th>
                        <th className="w-[110px] px-3 text-[13px] font-bold text-[#374151]">
                          Trạng thái
                        </th>
                        <th className="w-[220px] px-3 text-center text-[13px] font-bold text-[#374151]">
                          Hành động
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredServices.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-10 text-center text-sm text-[#6B7280]"
                          >
                            Không có dịch vụ phù hợp
                          </td>
                        </tr>
                      ) : (
                        filteredServices.map((service) => (
                          <tr
                            key={service._id}
                            className="border-b border-[#F1F3F6] text-[14px] text-[#374151] last:border-b-0"
                          >
                            <td className="px-4 py-4 font-medium">{service.tendichvu}</td>
                            <td className="px-3 py-4">
                              {getServiceTypeName(service.serviceTypeId, serviceTypes)}
                            </td>
                            <td className="px-3 py-4">{service.donVi}</td>
                            <td className="px-3 py-4">{service.moTa}</td>
                            <td className="px-3 py-4">
                              <StatusBadge status={service.trangThai} />
                            </td>
                            <td className="px-3 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => addServiceToTour(service)}
                                  className="inline-flex items-center gap-1 rounded-lg bg-[#E6F7FF] px-3 py-1.5 text-xs font-semibold text-[#0EA5E9]"
                                  title="Tạo tourService từ dịch vụ dùng chung này"
                                >
                                  <ArrowRight className="h-3.5 w-3.5" />
                                  Gắn vào tour
                                </button>

                                <IconButton title="Sửa" onClick={() => openEditService(service)}>
                                  <Pencil className="h-3.5 w-3.5" />
                                </IconButton>

                                <IconButton
                                  title={
                                    service.trangThai === "Hoạt động"
                                      ? "Ngừng hoạt động"
                                      : "Bật lại"
                                  }
                                  onClick={() => toggleServiceStatus(service._id)}
                                >
                                  {service.trangThai === "Hoạt động" ? (
                                    <Ban className="h-3.5 w-3.5" />
                                  ) : (
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                  )}
                                </IconButton>

                                <DangerIconButton
                                  title="Xóa"
                                  onClick={() => deleteService(service._id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </DangerIconButton>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tour_services" && (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[0.95fr_1.55fr]">
              <div className="rounded-[16px] border border-[#E5E7EB] bg-white">
                <div className="border-b border-[#EEF1F5] p-4">
                  <h3 className="text-[18px] font-semibold text-[#111827]">Danh sách tour</h3>
                  <p className="mt-1 text-sm text-[#6B7280]">
                    Danh sách này lấy từ các tour đã tạo trong màn Quản lý tour. Chọn tour để cấu hình dịch vụ riêng cho tour đó.
                  </p>
                </div>

                <div className="max-h-[760px] overflow-y-auto p-4">
                  <div className="space-y-3">
                    {tours.map((tour) => {
                      const price = getTourPriceByTourId(tour._id, tourPrices);
                      const totalServicesOfTour = tourServices.filter(
                        (item) => item.tourId === tour._id
                      ).length;

                      return (
                        <button
                          key={tour._id}
                          onClick={() => {
                            setSelectedTourId(tour._id);
                            setSelectedTourServiceId(null);
                          }}
                          className={`w-full rounded-2xl border p-4 text-left transition ${
                            selectedTourId === tour._id
                              ? "border-[#13A8E3] bg-[#F0FAFF]"
                              : "border-[#E5E7EB] bg-white"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-[15px] font-semibold text-[#111827]">
                                {tour.tenTour}
                              </div>
                              <div className="mt-1 text-xs text-[#6B7280]">
                                {tour.maTour}
                              </div>
                              <div className="mt-1 text-xs text-[#6B7280]">
                                Địa điểm: {tour.diaDiem}
                              </div>
                            </div>
                            <StatusBadge status={tour.trangThai} />
                          </div>

                          <div className="mt-3 text-xs text-[#4B5563]">
                            Giá gốc NL: {formatMoney(price?.giaNguoiLon || 0)} đ
                          </div>
                          <div className="mt-1 text-xs text-[#4B5563]">
                            Giá gốc TE: {formatMoney(price?.giaTreEm || 0)} đ
                          </div>
                          <div className="mt-1 text-xs text-[#4B5563]">
                            Đã set {totalServicesOfTour} dịch vụ riêng cho tour này
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="rounded-[16px] border border-[#E5E7EB] bg-white">
                <div className="border-b border-[#EEF1F5] p-4">
                  <div className="mb-3">
                    <h3 className="text-[20px] font-semibold text-[#111827]">
                      Thiết lập dịch vụ theo tour
                    </h3>
                    <p className="mt-1 text-sm text-[#6B7280]">
                      Dịch vụ ở đây được lấy từ dịch vụ dùng chung, sau đó chỉnh lại tên áp dụng, giá áp dụng và nội dung riêng cho từng tour.
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F8FAFC] p-4 text-sm text-[#374151]">
                    <div className="font-semibold text-[#111827]">
                      {selectedTour?.tenTour || "Chưa chọn tour"}
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                      <div>
                        Giá gốc tour người lớn: {formatMoney(selectedTourPrice?.giaNguoiLon || 0)} đ
                      </div>
                      <div>
                        Giá gốc tour trẻ em: {formatMoney(selectedTourPrice?.giaTreEm || 0)} đ
                      </div>
                      <div>
                        Tổng giá dịch vụ NL: {formatMoney(totalConfiguredAdult)} đ
                      </div>
                      <div>
                        Tổng giá dịch vụ TE: {formatMoney(totalConfiguredChild)} đ
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex w-full overflow-hidden rounded-[10px] border border-[#D7DCE3] bg-white">
                    <div className="flex flex-1 items-center px-4">
                      <Search className="mr-2 h-4 w-4 text-[#8D96A7]" />
                      <input
                        type="text"
                        placeholder="Tìm theo tên dịch vụ gốc, tên áp dụng..."
                        value={tourServiceSearch}
                        onChange={(e) => setTourServiceSearch(e.target.value)}
                        className="h-[42px] w-full border-none bg-transparent text-[14px] text-black outline-none placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="max-h-[760px] overflow-y-auto p-4">
                  {filteredTourServices.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#D1D5DB] p-10 text-center text-sm text-[#6B7280]">
                      Tour này chưa có dịch vụ riêng. Hãy quay về tab <b>Thư viện dịch vụ</b> và bấm
                      <b> Gắn vào tour</b>.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTourServices.map((item, index) => {
                        const service = getServiceById(item.dichvuId, services);

                        return (
                          <div
                            key={item._id}
                            className={`rounded-2xl border p-4 transition ${
                              selectedTourServiceId === item._id
                                ? "border-[#13A8E3] bg-[#F0FAFF]"
                                : "border-[#E5E7EB] bg-[#FCFCFD]"
                            }`}
                          >
                            <div className="mb-4 flex items-start justify-between gap-3">
                              <div>
                                <div className="text-sm font-semibold text-[#111827]">
                                  Dịch vụ #{index + 1}
                                </div>
                                <div className="mt-1 text-xs text-[#6B7280]">
                                  Tên gốc từ services: {service?.tendichvu || "Không rõ"}
                                </div>
                                <div className="mt-1 text-xs text-[#6B7280]">
                                  dichvuId: {item.dichvuId}
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => setSelectedTourServiceId(item._id)}
                                  className="rounded-lg bg-[#E8F7FF] px-3 py-1.5 text-xs font-semibold text-[#0284C7]"
                                >
                                  Xem
                                </button>
                                <button
                                  onClick={() => deleteTourService(item._id)}
                                  className="rounded-lg bg-[#FEE2E2] px-3 py-1.5 text-xs font-semibold text-[#DC2626]"
                                >
                                  Xóa
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                              <Input
                                value={item.tenDichVuApDung}
                                onChange={(e) =>
                                  updateTourService(item._id, "tenDichVuApDung", e.target.value)
                                }
                                placeholder="Tên dịch vụ áp dụng"
                              />

                              <div className="grid grid-cols-2 gap-3">
                                <Input
                                  value={String(item.giaApDungNguoiLon)}
                                  onChange={(e) =>
                                    updateTourService(
                                      item._id,
                                      "giaApDungNguoiLon",
                                      Number(e.target.value) || 0
                                    )
                                  }
                                  placeholder="Giá áp dụng người lớn"
                                />
                                <Input
                                  value={String(item.giaApDungTreEm)}
                                  onChange={(e) =>
                                    updateTourService(
                                      item._id,
                                      "giaApDungTreEm",
                                      Number(e.target.value) || 0
                                    )
                                  }
                                  placeholder="Giá áp dụng trẻ em"
                                />
                              </div>
                            </div>

                            <textarea
                              value={item.noiDungDichVuBaoGom}
                              onChange={(e) =>
                                updateTourService(
                                  item._id,
                                  "noiDungDichVuBaoGom",
                                  e.target.value
                                )
                              }
                              placeholder="Nội dung dịch vụ bao gồm"
                              className="mt-3 h-[88px] w-full rounded-xl border border-[#D7DCE3] bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-gray-400"
                            />

                            <textarea
                              value={item.noiDungDichVuKhongBaoGom}
                              onChange={(e) =>
                                updateTourService(
                                  item._id,
                                  "noiDungDichVuKhongBaoGom",
                                  e.target.value
                                )
                              }
                              placeholder="Nội dung dịch vụ không bao gồm"
                              className="mt-3 h-[88px] w-full rounded-xl border border-[#D7DCE3] bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-gray-400"
                            />

                            <textarea
                              value={item.dieuKhoan}
                              onChange={(e) =>
                                updateTourService(item._id, "dieuKhoan", e.target.value)
                              }
                              placeholder="Điều khoản"
                              className="mt-3 h-[78px] w-full rounded-xl border border-[#D7DCE3] bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-gray-400"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
          <div className="w-full max-w-[620px] rounded-[22px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EEF1F5] px-6 py-4">
              <h2 className="text-[24px] font-semibold text-[#111827]">
                {editingServiceId ? "Sửa dịch vụ dùng chung" : "Thêm dịch vụ dùng chung"}
              </h2>
              <button
                onClick={() => {
                  setServiceModalOpen(false);
                  resetServiceForm();
                }}
                className="rounded-full p-1 text-[#6B7280] transition hover:bg-[#F3F4F6]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-black">
                  Loại dịch vụ
                </label>
                <select
                  value={serviceForm.serviceTypeId}
                  onChange={(e) =>
                    setServiceForm((prev) => ({
                      ...prev,
                      serviceTypeId: e.target.value,
                    }))
                  }
                  className="h-[46px] w-full rounded-xl border border-[#D7DCE3] bg-white px-4 text-sm text-black outline-none"
                >
                  {serviceTypes.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.loaidichvu}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black">
                  Tên dịch vụ
                </label>
                <Input
                  value={serviceForm.tendichvu}
                  onChange={(e) =>
                    setServiceForm((prev) => ({
                      ...prev,
                      tendichvu: e.target.value,
                    }))
                  }
                  placeholder="Nhập tên dịch vụ"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black">
                  Đơn vị
                </label>
                <Input
                  value={serviceForm.donVi}
                  onChange={(e) =>
                    setServiceForm((prev) => ({
                      ...prev,
                      donVi: e.target.value,
                    }))
                  }
                  placeholder="Ví dụ: xe, vé, suất, đêm..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black">
                  Mô tả
                </label>
                <textarea
                  value={serviceForm.moTa}
                  onChange={(e) =>
                    setServiceForm((prev) => ({
                      ...prev,
                      moTa: e.target.value,
                    }))
                  }
                  placeholder="Mô tả ngắn về dịch vụ"
                  className="h-[110px] w-full rounded-xl border border-[#D7DCE3] bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black">
                  Trạng thái
                </label>
                <select
                  value={serviceForm.trangThai}
                  onChange={(e) =>
                    setServiceForm((prev) => ({
                      ...prev,
                      trangThai: e.target.value as TrangThai,
                    }))
                  }
                  className="h-[46px] w-full rounded-xl border border-[#D7DCE3] bg-white px-4 text-sm text-black outline-none"
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Ngừng">Ngừng</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#EEF1F5] px-6 py-4">
              <button
                onClick={() => {
                  setServiceModalOpen(false);
                  resetServiceForm();
                }}
                className="rounded-xl border border-[#D8DEE8] px-5 py-2.5 text-sm font-semibold text-[#4B5563]"
              >
                Hủy
              </button>
              <button
                onClick={saveService}
                className="rounded-xl bg-[#13A8E3] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Lưu dịch vụ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  bg,
}: {
  title: string;
  value: number;
  bg: string;
}) {
  return (
    <div className={`${bg} rounded-2xl px-6 py-5 text-white shadow-sm`}>
      <div className="text-[40px] font-bold leading-none">{value}</div>
      <div className="mt-3 text-[16px] font-medium opacity-95">{title}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: TrangThai }) {
  if (status === "Hoạt động") {
    return (
      <span className="inline-flex min-w-[88px] items-center justify-center rounded-full bg-[#D1FAE5] px-3 py-[5px] text-xs font-semibold text-[#047857]">
        Hoạt động
      </span>
    );
  }

  return (
    <span className="inline-flex min-w-[88px] items-center justify-center rounded-full bg-[#FEE2E2] px-3 py-[5px] text-xs font-semibold text-[#DC2626]">
      Ngừng
    </span>
  );
}

function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-[46px] w-full rounded-xl border border-[#D7DCE3] bg-white px-4 text-sm text-black outline-none placeholder:text-gray-400 ${className}`}
    />
  );
}

function IconButton({
  children,
  title,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="flex h-[28px] w-[28px] items-center justify-center rounded-md border border-[#E2E8F0] bg-white text-[#6B7280] transition hover:bg-[#F8FAFC]"
    >
      {children}
    </button>
  );
}

function DangerIconButton({
  children,
  title,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="flex h-[28px] w-[28px] items-center justify-center rounded-md border border-[#FFE1E1] bg-white text-[#FF5C5C] transition hover:bg-[#FFF5F5]"
    >
      {children}
    </button>
  );
}