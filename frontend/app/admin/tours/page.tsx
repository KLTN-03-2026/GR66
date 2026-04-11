"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  PlusCircle,
  Pencil,
  Lock,
  Unlock,
  Trash2,
  Eye,
  ImagePlus,
  X,
} from "lucide-react";

type TourStatus = "Hoạt động" | "Ngừng";

type ExtraService = {
  id: number;
  serviceName: string;
  serviceType: string;
  includedContent: string;
  excludedContent: string;
  terms: string;
  adultPrice: string;
  childPrice: string;
};

type TourItem = {
  id: number;
  code: string;
  name: string;
  location: string;
  image: string;
  duration: string;
  adultPrice: number;
  childPrice: number;
  highlight: string;
  itinerary: string;
  includedPolicy: string;
  serviceTerms: string;
  status: TourStatus;
  startDate: string;
  endDate: string;
  extraServices: ExtraService[];
};

type TourFormType = {
  code: string;
  name: string;
  location: string;
  image: string;
  duration: string;
  adultPrice: string;
  childPrice: string;
  highlight: string;
  itinerary: string;
  includedPolicy: string;
  serviceTerms: string;
  status: TourStatus;
  startDate: string;
  endDate: string;
  extraServices: ExtraService[];
};

const initialTours: TourItem[] = [
  {
    id: 1,
    code: "TOUR001245",
    name: "Đà Nẵng",
    location: "Đà Nẵng",
    image: "",
    duration: "3 ngày 2 đêm",
    adultPrice: 50000000,
    childPrice: 25000000,
    highlight: "Biển Mỹ Khê, Bà Nà Hills",
    itinerary: "Ngày 1 đi biển, ngày 2 tham quan Bà Nà, ngày 3 mua sắm.",
    includedPolicy: "Xe đưa đón, khách sạn, vé tham quan",
    serviceTerms: "Không hoàn vé sau khi xác nhận",
    status: "Ngừng",
    startDate: "27/6/2025",
    endDate: "27/6/2025",
    extraServices: [],
  },
  {
    id: 2,
    code: "TOUR001246",
    name: "Hội An",
    location: "Hội An",
    image: "",
    duration: "2 ngày 1 đêm",
    adultPrice: 20000000,
    childPrice: 10000000,
    highlight: "Phố cổ, thả đèn hoa đăng",
    itinerary: "Tham quan phố cổ, chùa Cầu, ăn đặc sản.",
    includedPolicy: "Xe đưa đón, hướng dẫn viên",
    serviceTerms: "Có thể đổi lịch trước 24h",
    status: "Hoạt động",
    startDate: "27/6/2025",
    endDate: "27/6/2025",
    extraServices: [],
  },
  {
    id: 3,
    code: "TOUR001247",
    name: "Huế",
    location: "Huế",
    image: "",
    duration: "2 ngày 1 đêm",
    adultPrice: 10000000,
    childPrice: 5000000,
    highlight: "Đại Nội, lăng tẩm",
    itinerary: "Tham quan Đại Nội, chùa Thiên Mụ, lăng Khải Định.",
    includedPolicy: "Xe du lịch, vé vào cổng",
    serviceTerms: "Phải thanh toán trước 50%",
    status: "Hoạt động",
    startDate: "27/6/2025",
    endDate: "27/6/2025",
    extraServices: [],
  },
  {
    id: 4,
    code: "TOUR001248",
    name: "Hòa Vang",
    location: "Hòa Vang",
    image: "",
    duration: "1 ngày",
    adultPrice: 15000000,
    childPrice: 7000000,
    highlight: "Suối khoáng, thiên nhiên",
    itinerary: "Đi suối, picnic, trải nghiệm địa phương.",
    includedPolicy: "Ăn trưa, xe đưa đón",
    serviceTerms: "Không áp dụng cuối tuần",
    status: "Hoạt động",
    startDate: "27/6/2025",
    endDate: "27/6/2025",
    extraServices: [],
  },
];

const ITEMS_PER_PAGE = 4;

const createEmptyService = (): ExtraService => ({
  id: Date.now() + Math.floor(Math.random() * 10000),
  serviceName: "",
  serviceType: "",
  includedContent: "",
  excludedContent: "",
  terms: "",
  adultPrice: "",
  childPrice: "",
});

const createTourCode = () => {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `TOUR${random}`;
};

const createEmptyTourForm = (): TourFormType => ({
  code: createTourCode(),
  name: "",
  location: "",
  image: "",
  duration: "",
  adultPrice: "",
  childPrice: "",
  highlight: "",
  itinerary: "",
  includedPolicy: "",
  serviceTerms: "",
  status: "Hoạt động",
  startDate: "",
  endDate: "",
  extraServices: [createEmptyService()],
});

function formatPrice(value: number) {
  return value.toLocaleString("vi-VN");
}

function toInputDate(date: string) {
  if (!date) return "";
  const parts = date.split("/");
  if (parts.length !== 3) return "";
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function fromInputDate(date: string) {
  if (!date) return "";
  const parts = date.split("-");
  if (parts.length !== 3) return "";
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

export default function ToursPage() {
  const [tours, setTours] = useState<TourItem[]>(initialTours);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showTourForm, setShowTourForm] = useState(false);
  const [editingTourId, setEditingTourId] = useState<number | null>(null);
  const [tourForm, setTourForm] = useState<TourFormType>(createEmptyTourForm());

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<TourItem | null>(null);
  const [viewingTour, setViewingTour] = useState<TourItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredTours = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return tours.filter((tour) => {
      return (
        tour.code.toLowerCase().includes(keyword) ||
        tour.name.toLowerCase().includes(keyword) ||
        tour.location.toLowerCase().includes(keyword) ||
        tour.status.toLowerCase().includes(keyword) ||
        tour.startDate.toLowerCase().includes(keyword) ||
        tour.endDate.toLowerCase().includes(keyword) ||
        formatPrice(tour.adultPrice).includes(keyword)
      );
    });
  }, [tours, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredTours.length / ITEMS_PER_PAGE));

  const paginatedTours = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTours.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTours, currentPage]);

  const openCreateForm = () => {
    setEditingTourId(null);
    setFormErrors({});
    setTourForm(createEmptyTourForm());
    setShowTourForm(true);
  };

  const openEditForm = (tour: TourItem) => {
    setEditingTourId(tour.id);
    setFormErrors({});
    setTourForm({
      code: tour.code,
      name: tour.name,
      location: tour.location,
      image: tour.image,
      duration: tour.duration,
      adultPrice: String(tour.adultPrice),
      childPrice: String(tour.childPrice),
      highlight: tour.highlight,
      itinerary: tour.itinerary,
      includedPolicy: tour.includedPolicy,
      serviceTerms: tour.serviceTerms,
      status: tour.status,
      startDate: toInputDate(tour.startDate),
      endDate: toInputDate(tour.endDate),
      extraServices:
        tour.extraServices.length > 0
          ? tour.extraServices.map((service) => ({ ...service }))
          : [createEmptyService()],
    });
    setShowTourForm(true);
  };

  const closeTourForm = () => {
    setShowTourForm(false);
    setEditingTourId(null);
    setFormErrors({});
    setTourForm(createEmptyTourForm());
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setTours((prev) => prev.filter((tour) => tour.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleToggleStatus = (id: number) => {
    setTours((prev) =>
      prev.map((tour) =>
        tour.id === id
          ? {
              ...tour,
              status: tour.status === "Hoạt động" ? "Ngừng" : "Hoạt động",
            }
          : tour
      )
    );
  };

  const handleTourFieldChange = (
    field: keyof TourFormType,
    value: string | TourStatus | ExtraService[]
  ) => {
    setTourForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFormErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleServiceFieldChange = (
    serviceId: number,
    field: keyof ExtraService,
    value: string
  ) => {
    setTourForm((prev) => ({
      ...prev,
      extraServices: prev.extraServices.map((service) =>
        service.id === serviceId ? { ...service, [field]: value } : service
      ),
    }));
  };

  const handleAddService = () => {
    setTourForm((prev) => ({
      ...prev,
      extraServices: [...prev.extraServices, createEmptyService()],
    }));
  };

  const handleRemoveService = (serviceId: number) => {
    setTourForm((prev) => {
      if (prev.extraServices.length === 1) {
        return {
          ...prev,
          extraServices: [createEmptyService()],
        };
      }

      return {
        ...prev,
        extraServices: prev.extraServices.filter((service) => service.id !== serviceId),
      };
    });
  };

  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    handleTourFieldChange("image", imageUrl);
  };

  const validateTourForm = () => {
    const errors: Record<string, string> = {};

    if (!tourForm.name.trim()) errors.name = "Vui lòng nhập tên tour";
    if (!tourForm.location.trim()) errors.location = "Vui lòng nhập địa điểm";
    if (!tourForm.duration.trim()) errors.duration = "Vui lòng nhập thời lượng tour";
    if (!tourForm.adultPrice.trim()) errors.adultPrice = "Vui lòng nhập giá người lớn";
    if (!tourForm.childPrice.trim()) errors.childPrice = "Vui lòng nhập giá trẻ em";
    if (!tourForm.highlight.trim()) errors.highlight = "Vui lòng nhập điểm nổi bật";
    if (!tourForm.itinerary.trim()) errors.itinerary = "Vui lòng nhập lộ trình";
    if (!tourForm.includedPolicy.trim()) {
      errors.includedPolicy = "Vui lòng nhập chi tiết dịch vụ đi kèm";
    }
    if (!tourForm.serviceTerms.trim()) {
      errors.serviceTerms = "Vui lòng nhập điều khoản dịch vụ";
    }
    if (!tourForm.startDate.trim()) errors.startDate = "Vui lòng chọn ngày khởi tạo";
    if (!tourForm.endDate.trim()) errors.endDate = "Vui lòng chọn ngày kết thúc";
    if (!tourForm.image.trim()) errors.image = "Vui lòng tải ảnh tour";

    const hasInvalidService = tourForm.extraServices.some((service) => {
      return (
        service.serviceName.trim() ||
        service.serviceType.trim() ||
        service.includedContent.trim() ||
        service.excludedContent.trim() ||
        service.terms.trim() ||
        service.adultPrice.trim() ||
        service.childPrice.trim()
      );
    });

    if (hasInvalidService) {
      const invalidIndex = tourForm.extraServices.findIndex((service) => {
        return (
          !service.serviceName.trim() ||
          !service.serviceType.trim() ||
          !service.includedContent.trim() ||
          !service.excludedContent.trim() ||
          !service.terms.trim() ||
          !service.adultPrice.trim() ||
          !service.childPrice.trim()
        );
      });

      if (invalidIndex !== -1) {
        errors.extraServices = `Vui lòng nhập đầy đủ thông tin cho dịch vụ thêm ${invalidIndex + 1}`;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitTour = () => {
    if (!validateTourForm()) return;

    const payload: TourItem = {
      id: editingTourId ?? Date.now(),
      code: editingTourId ? tourForm.code : createTourCode(),
      name: tourForm.name.trim(),
      location: tourForm.location.trim(),
      image: tourForm.image,
      duration: tourForm.duration.trim(),
      adultPrice: Number(tourForm.adultPrice) || 0,
      childPrice: Number(tourForm.childPrice) || 0,
      highlight: tourForm.highlight.trim(),
      itinerary: tourForm.itinerary.trim(),
      includedPolicy: tourForm.includedPolicy.trim(),
      serviceTerms: tourForm.serviceTerms.trim(),
      status: tourForm.status,
      startDate: fromInputDate(tourForm.startDate),
      endDate: fromInputDate(tourForm.endDate),
      extraServices: tourForm.extraServices
        .filter((service) => service.serviceName.trim())
        .map((service) => ({
          ...service,
          serviceName: service.serviceName.trim(),
          serviceType: service.serviceType.trim(),
          includedContent: service.includedContent.trim(),
          excludedContent: service.excludedContent.trim(),
          terms: service.terms.trim(),
          adultPrice: service.adultPrice.trim(),
          childPrice: service.childPrice.trim(),
        })),
    };

    if (editingTourId !== null) {
      setTours((prev) => prev.map((tour) => (tour.id === editingTourId ? payload : tour)));
    } else {
      setTours((prev) => [payload, ...prev]);
    }

    closeTourForm();
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen w-full bg-[#F5F6F8] px-4 py-6 md:px-6 lg:px-8">
      <div className="w-full">
        <h1 className="mb-6 text-[36px] font-semibold tracking-tight text-[#111827]">
          Quản lý tour
        </h1>

        {!showTourForm && (
          <>
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex w-full max-w-[390px] overflow-hidden rounded-[10px] border border-[#A8ADB7] bg-white">
                <div className="flex flex-1 items-center px-4">
                  <Search className="mr-2 h-4 w-4 text-[#8B93A3]" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-[38px] w-full border-none bg-transparent text-[14px] text-[#111827] outline-none placeholder:text-[#A3A3A3]"
                  />
                </div>
                <button className="flex h-[38px] min-w-[80px] items-center justify-center bg-[#13A8E3] px-5 text-[13px] font-semibold text-white hover:bg-[#0f9bd1]">
                  Tìm
                </button>
              </div>

              <button
                onClick={openCreateForm}
                className="flex h-[38px] w-fit items-center gap-2 rounded-[10px] bg-[#73D3F6] px-4 text-[13px] font-semibold text-white hover:bg-[#5bc8f0]"
              >
                <PlusCircle className="h-4 w-4" />
                Tạo mới
              </button>
            </div>

            <div className="overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1060px] table-fixed">
                  <thead>
                    <tr className="h-[52px] border-b border-[#EEF1F5] text-left">
                      <th className="w-[120px] px-4 text-[13px] font-bold text-[#444]">
                        Mã tour
                      </th>
                      <th className="w-[150px] px-3 text-[13px] font-bold text-[#444]">
                        Tên tour
                      </th>
                      <th className="w-[130px] px-3 text-[13px] font-bold text-[#444]">
                        Giá
                      </th>
                      <th className="w-[130px] px-3 text-[13px] font-bold text-[#444]">
                        Trạng thái
                      </th>
                      <th className="w-[140px] px-3 text-[13px] font-bold text-[#444]">
                        Ngày khởi tạo
                      </th>
                      <th className="w-[140px] px-3 text-[13px] font-bold text-[#444]">
                        Ngày kết thúc
                      </th>
                      <th className="w-[160px] px-3 text-center text-[13px] font-bold text-[#444]">
                        Hành động
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedTours.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-12 text-center text-[14px] text-[#6B7280]"
                        >
                          Không có tour nào
                        </td>
                      </tr>
                    ) : (
                      paginatedTours.map((tour) => (
                        <tr
                          key={tour.id}
                          onClick={() => setViewingTour(tour)}
                          className="h-[56px] cursor-pointer border-b border-[#F1F3F6] text-[14px] text-[#444] last:border-b-0 hover:bg-[#FAFBFC]"
                        >
                          <td className="truncate px-4">{tour.code}</td>
                          <td className="truncate px-3">{tour.name}</td>
                          <td className="truncate px-3">{formatPrice(tour.adultPrice)}</td>
                          <td className="px-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStatus(tour.id);
                              }}
                              className={
                                tour.status === "Ngừng"
                                  ? "inline-flex min-w-[58px] items-center justify-center rounded-md bg-[#F8D7D7] px-3 py-[2px] text-[11px] font-semibold text-[#F04444]"
                                  : "inline-flex min-w-[72px] items-center justify-center rounded-md bg-[#CCF4EC] px-3 py-[2px] text-[11px] font-semibold text-[#13B89B]"
                              }
                            >
                              {tour.status}
                            </button>
                          </td>
                          <td className="truncate px-3">{tour.startDate}</td>
                          <td className="truncate px-3">{tour.endDate}</td>
                          <td className="px-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewingTour(tour);
                                }}
                                className="flex h-[24px] w-[24px] items-center justify-center rounded-md border border-[#DFE5EC] bg-white text-[#7C8798] hover:bg-[#F8FAFC]"
                                title="Xem chi tiết"
                              >
                                <Eye className="h-[12px] w-[12px]" />
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditForm(tour);
                                }}
                                className="flex h-[24px] w-[24px] items-center justify-center rounded-md border border-[#DFE5EC] bg-white text-[#7C8798] hover:bg-[#F8FAFC]"
                                title="Sửa"
                              >
                                <Pencil className="h-[12px] w-[12px]" />
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleStatus(tour.id);
                                }}
                                className="flex h-[24px] w-[24px] items-center justify-center rounded-md border border-[#DFE5EC] bg-white text-[#7C8798] hover:bg-[#F8FAFC]"
                                title={tour.status === "Hoạt động" ? "Khóa" : "Mở khóa"}
                              >
                                {tour.status === "Hoạt động" ? (
                                  <Lock className="h-[12px] w-[12px]" />
                                ) : (
                                  <Unlock className="h-[12px] w-[12px]" />
                                )}
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteTarget(tour);
                                }}
                                className="flex h-[24px] w-[24px] items-center justify-center rounded-md border border-[#FFE2E2] bg-white text-[#FF5C5C] hover:bg-[#FFF5F5]"
                                title="Xóa"
                              >
                                <Trash2 className="h-[12px] w-[12px]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end px-6 py-4">
                <div className="flex items-center gap-2 rounded-[10px] border border-[#E5E7EB] bg-white px-3 py-1.5 text-[14px] font-semibold text-[#111827]">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[18px] ${
                        currentPage === page ? "text-black" : "text-[#444]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <span>...</span>
                </div>
              </div>
            </div>
          </>
        )}

        {showTourForm && (
          <div className="rounded-[12px] border border-[#BFC5CD] bg-[#F9F9F9] p-5 md:p-7">
            <div className="max-w-[980px]">
              <h2 className="mb-5 text-[22px] font-bold text-black">Thông tin tour</h2>

              <div className="space-y-4">
                <div>
                  <RoundedInput
                    placeholder="Nhập tên tour"
                    value={tourForm.name}
                    onChange={(e) => handleTourFieldChange("name", e.target.value)}
                    error={!!formErrors.name}
                  />
                  {formErrors.name && <ErrorText text={formErrors.name} />}
                </div>

                <div>
                  <RoundedInput
                    placeholder="Địa điểm"
                    value={tourForm.location}
                    onChange={(e) => handleTourFieldChange("location", e.target.value)}
                    error={!!formErrors.location}
                  />
                  {formErrors.location && <ErrorText text={formErrors.location} />}
                </div>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={handleChooseImage}
                    className={`flex h-[54px] w-full items-center justify-start gap-3 rounded-[12px] border px-4 text-left text-[16px] ${
                      formErrors.image
                        ? "border-red-500 bg-white text-[#444]"
                        : "border-[#444] bg-white text-[#444]"
                    }`}
                  >
                    <ImagePlus className="h-5 w-5" />
                    {tourForm.image ? "Đổi ảnh tour" : "Thêm ảnh"}
                  </button>

                  {tourForm.image && (
                    <div className="mt-3 overflow-hidden rounded-[12px] border border-[#D7DCE3] bg-white p-3">
                      <img
                        src={tourForm.image}
                        alt="Ảnh tour"
                        className="h-[220px] w-full rounded-[10px] object-cover"
                      />
                    </div>
                  )}

                  {formErrors.image && <ErrorText text={formErrors.image} />}
                </div>

                <div>
                  <RoundedInput
                    placeholder="Thời lượng của tour"
                    value={tourForm.duration}
                    onChange={(e) => handleTourFieldChange("duration", e.target.value)}
                    error={!!formErrors.duration}
                  />
                  {formErrors.duration && <ErrorText text={formErrors.duration} />}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <RoundedInput
                      placeholder="Giá của tour đối với người lớn"
                      value={tourForm.adultPrice}
                      onChange={(e) => handleTourFieldChange("adultPrice", e.target.value)}
                      error={!!formErrors.adultPrice}
                    />
                    {formErrors.adultPrice && <ErrorText text={formErrors.adultPrice} />}
                  </div>

                  <div>
                    <RoundedInput
                      placeholder="Giá của tour đối với trẻ em"
                      value={tourForm.childPrice}
                      onChange={(e) => handleTourFieldChange("childPrice", e.target.value)}
                      error={!!formErrors.childPrice}
                    />
                    {formErrors.childPrice && <ErrorText text={formErrors.childPrice} />}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <DateInput
                      value={tourForm.startDate}
                      onChange={(e) => handleTourFieldChange("startDate", e.target.value)}
                      error={!!formErrors.startDate}
                    />
                    {formErrors.startDate && <ErrorText text={formErrors.startDate} />}
                  </div>

                  <div>
                    <DateInput
                      value={tourForm.endDate}
                      onChange={(e) => handleTourFieldChange("endDate", e.target.value)}
                      error={!!formErrors.endDate}
                    />
                    {formErrors.endDate && <ErrorText text={formErrors.endDate} />}
                  </div>
                </div>

                <RoundedSelect
                  value={tourForm.status}
                  onChange={(e) =>
                    handleTourFieldChange("status", e.target.value as TourStatus)
                  }
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Ngừng">Ngừng</option>
                </RoundedSelect>

                <div>
                  <RoundedTextarea
                    placeholder="Điểm nổi bật của tour"
                    value={tourForm.highlight}
                    onChange={(e) => handleTourFieldChange("highlight", e.target.value)}
                    rows={4}
                    error={!!formErrors.highlight}
                  />
                  {formErrors.highlight && <ErrorText text={formErrors.highlight} />}
                </div>

                <div>
                  <RoundedTextarea
                    placeholder="Lộ trình của tour"
                    value={tourForm.itinerary}
                    onChange={(e) => handleTourFieldChange("itinerary", e.target.value)}
                    rows={4}
                    error={!!formErrors.itinerary}
                  />
                  {formErrors.itinerary && <ErrorText text={formErrors.itinerary} />}
                </div>
              </div>

              <h2 className="mb-5 mt-8 text-[22px] font-bold text-black">Điều khoản tour</h2>

              <div className="space-y-4">
                <div>
                  <RoundedTextarea
                    placeholder="Chi tiết dịch vụ đi kèm tour"
                    value={tourForm.includedPolicy}
                    onChange={(e) =>
                      handleTourFieldChange("includedPolicy", e.target.value)
                    }
                    rows={4}
                    error={!!formErrors.includedPolicy}
                  />
                  {formErrors.includedPolicy && (
                    <ErrorText text={formErrors.includedPolicy} />
                  )}
                </div>

                <div>
                  <RoundedTextarea
                    placeholder="Điều khoản dịch vụ"
                    value={tourForm.serviceTerms}
                    onChange={(e) =>
                      handleTourFieldChange("serviceTerms", e.target.value)
                    }
                    rows={4}
                    error={!!formErrors.serviceTerms}
                  />
                  {formErrors.serviceTerms && <ErrorText text={formErrors.serviceTerms} />}
                </div>
              </div>

              <h2 className="mb-5 mt-8 text-[22px] font-bold text-black">Dịch vụ thêm</h2>

              {tourForm.extraServices.map((service, index) => (
                <div
                  key={service.id}
                  className="mb-6 rounded-[24px] border border-[#5A5A5A] bg-white p-5"
                >
                  <div className="space-y-4">
                    <RoundedInput
                      placeholder="Tên dịch vụ"
                      value={service.serviceName}
                      onChange={(e) =>
                        handleServiceFieldChange(service.id, "serviceName", e.target.value)
                      }
                    />

                    <RoundedInput
                      placeholder="Loại dịch vụ"
                      value={service.serviceType}
                      onChange={(e) =>
                        handleServiceFieldChange(service.id, "serviceType", e.target.value)
                      }
                    />

                    <RoundedTextarea
                      placeholder="Nội dung dịch vụ bao gồm"
                      value={service.includedContent}
                      onChange={(e) =>
                        handleServiceFieldChange(
                          service.id,
                          "includedContent",
                          e.target.value
                        )
                      }
                      rows={3}
                    />

                    <RoundedTextarea
                      placeholder="Nội dung dịch vụ không bao gồm"
                      value={service.excludedContent}
                      onChange={(e) =>
                        handleServiceFieldChange(
                          service.id,
                          "excludedContent",
                          e.target.value
                        )
                      }
                      rows={3}
                    />

                    <RoundedTextarea
                      placeholder="Điều khoản"
                      value={service.terms}
                      onChange={(e) =>
                        handleServiceFieldChange(service.id, "terms", e.target.value)
                      }
                      rows={2}
                    />

                    <RoundedInput
                      placeholder="Giá dịch vụ đối với người lớn"
                      value={service.adultPrice}
                      onChange={(e) =>
                        handleServiceFieldChange(service.id, "adultPrice", e.target.value)
                      }
                    />

                    <RoundedInput
                      placeholder="Giá dịch vụ đối với trẻ em"
                      value={service.childPrice}
                      onChange={(e) =>
                        handleServiceFieldChange(service.id, "childPrice", e.target.value)
                      }
                    />
                  </div>

                  <div className="mt-6 flex justify-end gap-4">
                    <button
                      onClick={() => handleRemoveService(service.id)}
                      className="rounded-[6px] bg-[#FF0000] px-5 py-2 text-[14px] font-bold text-black hover:opacity-90"
                    >
                      Xóa dịch vụ
                    </button>

                    {index === tourForm.extraServices.length - 1 && (
                      <button
                        onClick={handleAddService}
                        className="rounded-[6px] bg-[#1BC1F3] px-5 py-2 text-[14px] font-bold text-black hover:opacity-90"
                      >
                        Thêm dịch vụ
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {formErrors.extraServices && <ErrorText text={formErrors.extraServices} />}

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={closeTourForm}
                  className="min-w-[96px] rounded-[6px] border border-[#AEB4BC] bg-white px-6 py-2.5 text-[16px] font-bold text-[#222]"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitTour}
                  className="min-w-[110px] rounded-[6px] bg-[#10B5F1] px-6 py-2.5 text-[16px] font-bold text-black"
                >
                  {editingTourId !== null ? "Lưu tour" : "Thêm tour"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {deleteTarget && (
        <ModalOverlay>
          <div className="w-full max-w-[420px] rounded-[18px] bg-white p-6 shadow-2xl">
            <h3 className="text-[24px] font-bold text-[#111827]">Xác nhận xóa</h3>
            <p className="mt-3 text-[15px] text-[#4B5563]">
              Bạn có chắc muốn xóa tour{" "}
              <span className="font-semibold text-[#111827]">{deleteTarget.name}</span> không?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-[8px] border border-[#D7DCE3] px-5 py-2 text-sm font-semibold text-[#374151]"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="rounded-[8px] bg-[#FF4D4F] px-5 py-2 text-sm font-semibold text-white"
              >
                Xóa
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {viewingTour && (
        <ModalOverlay>
          <div className="max-h-[88vh] w-full max-w-[900px] overflow-y-auto rounded-[20px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EEF1F5] px-6 py-4">
              <h2 className="text-[28px] font-bold text-[#111827]">Chi tiết tour</h2>
              <button
                onClick={() => setViewingTour(null)}
                className="rounded-full p-1 text-[#6B7280] hover:bg-[#F3F4F6]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 px-6 py-5">
              {viewingTour.image ? (
                <img
                  src={viewingTour.image}
                  alt={viewingTour.name}
                  className="h-[280px] w-full rounded-[14px] object-cover"
                />
              ) : (
                <div className="flex h-[280px] w-full items-center justify-center rounded-[14px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] text-[#9CA3AF]">
                  Chưa có ảnh tour
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DetailBox label="Mã tour" value={viewingTour.code} />
                <DetailBox label="Tên tour" value={viewingTour.name} />
                <DetailBox label="Địa điểm" value={viewingTour.location} />
                <DetailBox label="Thời lượng" value={viewingTour.duration} />
                <DetailBox
                  label="Giá người lớn"
                  value={formatPrice(viewingTour.adultPrice)}
                />
                <DetailBox
                  label="Giá trẻ em"
                  value={formatPrice(viewingTour.childPrice)}
                />
                <DetailBox label="Ngày khởi tạo" value={viewingTour.startDate} />
                <DetailBox label="Ngày kết thúc" value={viewingTour.endDate} />
                <DetailBox label="Trạng thái" value={viewingTour.status} />
              </div>

              <DetailArea label="Điểm nổi bật" value={viewingTour.highlight} />
              <DetailArea label="Lộ trình" value={viewingTour.itinerary} />
              <DetailArea
                label="Chi tiết dịch vụ đi kèm tour"
                value={viewingTour.includedPolicy}
              />
              <DetailArea label="Điều khoản dịch vụ" value={viewingTour.serviceTerms} />

              <div>
                <h3 className="mb-3 text-[20px] font-bold text-[#111827]">Dịch vụ thêm</h3>
                {viewingTour.extraServices.length === 0 ? (
                  <div className="rounded-[12px] border border-[#E5E7EB] bg-[#FAFAFA] p-4 text-[#6B7280]">
                    Không có dịch vụ thêm
                  </div>
                ) : (
                  <div className="space-y-4">
                    {viewingTour.extraServices.map((service, index) => (
                      <div
                        key={service.id}
                        className="rounded-[16px] border border-[#E5E7EB] bg-[#FCFCFC] p-4"
                      >
                        <h4 className="mb-3 text-[16px] font-bold text-[#111827]">
                          Dịch vụ {index + 1}
                        </h4>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <DetailBox label="Tên dịch vụ" value={service.serviceName} />
                          <DetailBox label="Loại dịch vụ" value={service.serviceType} />
                          <DetailBox
                            label="Giá người lớn"
                            value={service.adultPrice || "0"}
                          />
                          <DetailBox
                            label="Giá trẻ em"
                            value={service.childPrice || "0"}
                          />
                        </div>
                        <div className="mt-3 space-y-3">
                          <DetailArea
                            label="Bao gồm"
                            value={service.includedContent}
                          />
                          <DetailArea
                            label="Không bao gồm"
                            value={service.excludedContent}
                          />
                          <DetailArea label="Điều khoản" value={service.terms} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#EEF1F5] px-6 py-4">
              <button
                onClick={() => setViewingTour(null)}
                className="rounded-[8px] border border-[#D7DCE3] px-5 py-2 text-sm font-semibold text-[#374151]"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setViewingTour(null);
                  openEditForm(viewingTour);
                }}
                className="rounded-[8px] bg-[#10B5F1] px-5 py-2 text-sm font-semibold text-black"
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}

function RoundedInput({
  error,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      className={`h-[50px] w-full rounded-[12px] border bg-white px-4 text-[16px] text-black outline-none placeholder:text-[#444] ${
        error ? "border-red-500" : "border-[#444]"
      } ${className}`}
    />
  );
}

function DateInput({
  error,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      type="date"
      {...props}
      className={`h-[50px] w-full rounded-[12px] border bg-white px-4 text-[16px] text-black outline-none ${
        error ? "border-red-500" : "border-[#444]"
      } ${className}`}
    />
  );
}

function RoundedTextarea({
  error,
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-[14px] border bg-white px-4 py-3 text-[16px] text-black outline-none placeholder:text-[#444] ${
        error ? "border-red-500" : "border-[#444]"
      } ${className}`}
    />
  );
}

function RoundedSelect({
  className = "",
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`h-[50px] w-full rounded-[12px] border border-[#444] bg-white px-4 text-[16px] text-black outline-none ${className}`}
    />
  );
}

function ErrorText({ text }: { text: string }) {
  return <p className="mt-1 text-sm text-red-500">{text}</p>;
}

function ModalOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      {children}
    </div>
  );
}

function DetailBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-[#FAFAFA] p-4">
      <div className="text-sm font-semibold text-[#6B7280]">{label}</div>
      <div className="mt-1 text-[16px] font-medium text-[#111827]">{value || "-"}</div>
    </div>
  );
}

function DetailArea({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-[#FAFAFA] p-4">
      <div className="text-sm font-semibold text-[#6B7280]">{label}</div>
      <div className="mt-1 whitespace-pre-line text-[15px] text-[#111827]">
        {value || "-"}
      </div>
    </div>
  );
}