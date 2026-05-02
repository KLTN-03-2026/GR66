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
const API_URL = "http://localhost:3001";

const getImageUrl = (img: string) => {
  if (!img) return "";
  if (img.startsWith("blob:") || img.startsWith("http")) return img;
  return `${API_URL}/uploads/${img}`;
};

type TourStatus = "Hoạt động" | "Ngưng";

// ===== TYPE DỮ LIỆU TỪ BACKEND =====

type BackendTourListItem = {
  _id: string;
  diaDiem: string;
  tenTour: string;
  hinhAnh: string[];
  giaTour: number;
  ngayKhoiHanh: string | null;
};

type BackendTourDetail = {
  tour: {
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
    trangThai: TourStatus;
  };

  schedules: {
    ngaykhoihanh: string;
    ngayketthuc: string;
    Socho: number;
    Conlai: number;
  }[];

  tourPrices: {
    giaNguoiLon: number;
    giaTreEm: number;
  }[];
};

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

type TourScheduleForm = {
  id: number;
  startDate: string;
  endDate: string;
  seatCount: string;
  remaining: string;
};

type TourItem = {
  id: string;
  code: string;
  name: string;
  location: string;
  image: string[];
  duration: string;
  adultPrice: number;
  childPrice: number;
  seatCount: number;
  description: string;
  highlight: string;
  itinerary: string;
  includedPolicy: string;
  serviceTerms: string;
  status: TourStatus;
  startDate: string;
  endDate: string;
  schedules: {
    startDate: string;
    endDate: string;
    seatCount: number;
    remaining: number;
  }[];
  extraServices: ExtraService[];
};

type TourFormType = {
  code: string;
  name: string;
  location: string;
  image: string[];
  duration: string;
  adultPrice: string;
  childPrice: string;
  seatCount: string;
  description: string;
  highlight: string;
  itinerary: string;
  includedPolicy: string;
  serviceTerms: string;
  status: TourStatus;
  startDate: string;
  endDate: string;
  schedules: TourScheduleForm[];
  extraServices: ExtraService[];
};

const initialTours: TourItem[] = [];

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

const createEmptySchedule = (): TourScheduleForm => ({
  id: Date.now() + Math.floor(Math.random() * 10000),
  startDate: "",
  endDate: "",
  seatCount: "",
  remaining: "",
});
const formatDateFromBE = (date: string | null) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("vi-VN");
};

const toInputDateFromBE = (date: string | null) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

const createTourCode = () => {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `TOUR${random}`;
};
const createEmptyTourForm = (): TourFormType => ({
  code: createTourCode(),
  name: "",
  location: "",
  image: [],
  duration: "",
  adultPrice: "",
  childPrice: "",
  seatCount: "",
  description: "",
  highlight: "",
  itinerary: "",
  includedPolicy: "",
  serviceTerms: "",
  status: "Hoạt động",
  startDate: "",
  endDate: "",
  schedules: [createEmptySchedule()],
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
  const [tours, setTours] = useState<TourItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showTourForm, setShowTourForm] = useState(false);
  const [editingTourId, setEditingTourId] = useState<string | null>(null);
  const [tourForm, setTourForm] = useState<TourFormType>(createEmptyTourForm());
  const [imageFiles, setImageFiles] = useState<File[]>([]);

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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTours.length / ITEMS_PER_PAGE),
  );

  const paginatedTours = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTours.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTours, currentPage]);

  const openCreateForm = () => {
    setEditingTourId(null);
    setImageFiles([]);
    setFormErrors({});
    setTourForm(createEmptyTourForm());
    setShowTourForm(true);
  };

  const openEditForm = (tour: TourItem) => {
    setEditingTourId(tour.id);
    setImageFiles([]);
    setFormErrors({});
    setTourForm({
      code: tour.code,
      name: tour.name,
      location: tour.location,
      image: tour.image,
      duration: tour.duration,
      adultPrice: String(tour.adultPrice),
      childPrice: String(tour.childPrice),
      seatCount: String(tour.seatCount),
      description: tour.description,
      highlight: tour.highlight,
      itinerary: tour.itinerary,
      includedPolicy: tour.includedPolicy,
      serviceTerms: tour.serviceTerms,
      status: tour.status,
      startDate: tour.schedules[0]?.startDate
        ? toInputDate(tour.schedules[0].startDate)
        : toInputDate(tour.startDate),
      endDate: tour.schedules[0]?.endDate
        ? toInputDate(tour.schedules[0].endDate)
        : toInputDate(tour.endDate),
      schedules:
        tour.schedules.length > 0
          ? tour.schedules.map((schedule) => ({
              id: Date.now() + Math.floor(Math.random() * 10000),
              startDate: toInputDate(schedule.startDate),
              endDate: toInputDate(schedule.endDate),
              seatCount: String(schedule.seatCount),
              remaining: String(schedule.remaining),
            }))
          : [createEmptySchedule()],
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
    setImageFiles([]);
    setFormErrors({});
    setTourForm(createEmptyTourForm());
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setTours((prev) => prev.filter((tour) => tour.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleToggleStatus = async (id: string) => {
    const currentTour = tours.find((tour) => tour.id === id);
    if (!currentTour) return;
  
    const nextStatus: TourStatus =
      currentTour.status === "Hoạt động" ? "Ngưng" : "Hoạt động";
  
    try {
      const formData = new FormData();
      formData.append("trangThai", nextStatus);
  
      const res = await fetch(`${API_URL}/api/tours/update/${id}`, {
        method: "PUT",
        body: formData,
      });
  
      const result = await res.json();
  
      if (!res.ok) {
        throw new Error(result.message || "Cập nhật trạng thái thất bại");
      }
  
      setTours((prev) =>
        prev.map((tour) =>
          tour.id === id
            ? {
                ...tour,
                status: nextStatus,
              }
            : tour
        )
      );
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      alert(error instanceof Error ? error.message : "Lỗi cập nhật trạng thái");
    }
  };

  const handleTourFieldChange = (
    field: keyof TourFormType,
    value: string | string[] | TourStatus | ExtraService[] | TourScheduleForm[],
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
  const getTodayInputDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  };

  // ===== CHỈ CHO NHẬP SỐ =====
  const onlyNumber = (value: string) => value.replace(/\D/g, "");

  const handleScheduleFieldChange = (
    scheduleId: number,
    field: keyof Omit<TourScheduleForm, "id">,
    value: string,
  ) => {
    setTourForm((prev) => ({
      ...prev,
      schedules: prev.schedules.map((schedule) => {
        if (schedule.id !== scheduleId) return schedule;

        const updatedSchedule = { ...schedule, [field]: value };

        // Nếu đổi ngày bắt đầu mà ngày kết thúc nhỏ hơn ngày bắt đầu thì reset ngày kết thúc
        if (
          field === "startDate" &&
          updatedSchedule.endDate &&
          updatedSchedule.endDate < value
        ) {
          updatedSchedule.endDate = "";
        }

        return updatedSchedule;
      }),
    }));

    setFormErrors((prev) => {
      const next = { ...prev };
      delete next.schedules;
      delete next.startDate;
      delete next.endDate;
      delete next.seatCount;
      return next;
    });
  };

  const handleAddSchedule = () => {
    setTourForm((prev) => ({
      ...prev,
      schedules: [...prev.schedules, createEmptySchedule()],
    }));
  };

  const handleRemoveSchedule = (scheduleId: number) => {
    setTourForm((prev) => {
      if (prev.schedules.length === 1) {
        return { ...prev, schedules: [createEmptySchedule()] };
      }

      return {
        ...prev,
        schedules: prev.schedules.filter(
          (schedule) => schedule.id !== scheduleId,
        ),
      };
    });
  };

  const handleServiceFieldChange = (
    serviceId: number,
    field: keyof ExtraService,
    value: string,
  ) => {
    setTourForm((prev) => ({
      ...prev,
      extraServices: prev.extraServices.map((service) =>
        service.id === serviceId ? { ...service, [field]: value } : service,
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
        extraServices: prev.extraServices.filter(
          (service) => service.id !== serviceId,
        ),
      };
    });
  };

  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const selectedFiles = Array.from(files);
    const newImages = selectedFiles.map((file) => URL.createObjectURL(file));
    const updatedImages = [...tourForm.image, ...newImages];

    if (updatedImages.length > 5) {
      setFormErrors((prev) => ({
        ...prev,
        image: "Chỉ được tối đa 5 ảnh",
      }));
      event.target.value = "";
      return;
    }

    setImageFiles((prev) => [...prev, ...selectedFiles]);
    handleTourFieldChange("image", updatedImages);

    setFormErrors((prev) => {
      const next = { ...prev };
      delete next.image;
      return next;
    });

    // reset input để có thể chọn lại cùng file
    event.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    const removedImage = tourForm.image[index];
  
    const updatedImages = tourForm.image.filter((_, i) => i !== index);
  
    if (removedImage?.startsWith("blob:")) {
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
    }
  
    handleTourFieldChange("image", updatedImages);
  };

  const validateTourForm = () => {
    const errors: Record<string, string> = {};
    if (!tourForm.description.trim())
      errors.description = "Vui lòng nhập mô tả tour";

    if (!tourForm.name.trim()) errors.name = "Vui lòng nhập tên tour";
    if (!tourForm.location.trim()) errors.location = "Vui lòng nhập địa điểm";
    if (!tourForm.duration.trim())
      errors.duration = "Vui lòng nhập thời lượng tour";
    if (!tourForm.adultPrice.trim())
      errors.adultPrice = "Vui lòng nhập giá người lớn";
    if (!tourForm.childPrice.trim())
      errors.childPrice = "Vui lòng nhập giá trẻ em";
    if (!tourForm.highlight.trim())
      errors.highlight = "Vui lòng nhập điểm nổi bật";
    if (!tourForm.itinerary.trim()) errors.itinerary = "Vui lòng nhập lộ trình";
    if (!tourForm.includedPolicy.trim()) {
      errors.includedPolicy = "Vui lòng nhập chi tiết dịch vụ đi kèm";
    }
    if (!tourForm.serviceTerms.trim()) {
      errors.serviceTerms = "Vui lòng nhập điều khoản dịch vụ";
    }
    const invalidScheduleIndex = tourForm.schedules.findIndex(
      (schedule) =>
        !schedule.startDate.trim() ||
        !schedule.endDate.trim() ||
        !schedule.seatCount.trim() ||
        !schedule.remaining.trim(),
    );

    if (invalidScheduleIndex !== -1) {
      errors.schedules = `Vui lòng nhập đầy đủ lịch khởi hành ${invalidScheduleIndex + 1}`;
    } else {
      const today = getTodayInputDate();
      const invalidDateIndex = tourForm.schedules.findIndex(
        (schedule) =>
          schedule.startDate < today || schedule.endDate < schedule.startDate,
      );

      if (invalidDateIndex !== -1) {
        errors.schedules = `Ngày khởi hành/kết thúc ở lịch ${invalidDateIndex + 1} không hợp lệ`;
      }
    }

    if (tourForm.image.length < 5) {
      errors.image = "Vui lòng tải tối thiểu 5 ảnh tour";
    }

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
  const mapTourDetailToFE = (detail: BackendTourDetail): TourItem => {
    const tour = detail.tour;
    const price = detail.tourPrices?.[0];
    const schedule = detail.schedules?.[0];
    const mappedSchedules =
      detail.schedules?.map((item) => ({
        startDate: formatDateFromBE(item.ngaykhoihanh),
        endDate: formatDateFromBE(item.ngayketthuc),
        seatCount: item.Socho,
        remaining: item.Conlai,
      })) || [];

    return {
      id: tour._id,
      code: tour.maTour,
      name: tour.tenTour,
      location: tour.diaDiem,
      image: tour.hinhAnh || [],
      duration: tour.thoiLuong,
      adultPrice: price?.giaNguoiLon || 0,
      childPrice: price?.giaTreEm || 0,
      seatCount: schedule?.Socho || 0,
      description: tour.mota || "",
      highlight: tour.diemNoiBat || "",
      itinerary: tour.loTrinh || "",
      includedPolicy: tour.chitiettour || "",
      serviceTerms: tour.dieuKhoan || "",
      status: tour.trangThai,
      startDate: formatDateFromBE(schedule?.ngaykhoihanh || null),
      endDate: formatDateFromBE(schedule?.ngayketthuc || null),
      extraServices: [],
      schedules: mappedSchedules,
    };
  };
  const handleViewTour = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/tours/view/${id}`, {
        method: "GET",
        cache: "no-store",
      });

      const result = await res.json();

      if (result.success) {
        const mappedTour = mapTourDetailToFE(result.data);
        setViewingTour(mappedTour);
      }
    } catch (error) {
      console.error("Lỗi xem chi tiết tour:", error);
    }
  };

  const handleEditTour = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/tours/view/${id}`, {
        method: "GET",
        cache: "no-store",
      });

      const result = await res.json();

      if (result.success) {
        const mappedTour = mapTourDetailToFE(result.data);
        openEditForm(mappedTour);
      }
    } catch (error) {
      console.error("Lỗi lấy dữ liệu sửa tour:", error);
    }
  };

  const fetchTours = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tours`, {
        method: "GET",
        cache: "no-store",
      });

      const result = await res.json();

      if (result.success && Array.isArray(result.data)) {
        const mappedTours: TourItem[] = await Promise.all(
          result.data.map(async (item: BackendTourListItem) => {
            try {
              const detailRes = await fetch(
                `${API_URL}/api/tours/view/${item._id}`,
                {
                  method: "GET",
                  cache: "no-store",
                },
              );

              const detailResult = await detailRes.json();

              if (detailResult.success) {
                return mapTourDetailToFE(detailResult.data);
              }
            } catch (error) {
              console.error("Lỗi lấy chi tiết tour trong danh sách:", error);
            }

            return {
              id: item._id,
              code: item._id,
              name: item.tenTour,
              location: item.diaDiem,
              image: item.hinhAnh || [],
              duration: "",
              adultPrice: item.giaTour || 0,
              childPrice: 0,
              seatCount: 0,
              description: "",
              highlight: "",
              itinerary: "",
              includedPolicy: "",
              serviceTerms: "",
              status: "Hoạt động",
              startDate: formatDateFromBE(item.ngayKhoiHanh),
              endDate: "",
              extraServices: [],
              schedules: [],
            };
          }),
        );

        setTours(mappedTours);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách tour:", error);
    }
  };

  const createTourFormData = () => {
    const formData = new FormData();

    formData.append("tenTour", tourForm.name.trim());
    formData.append("diaDiem", tourForm.location.trim());
    formData.append("thoiLuong", tourForm.duration.trim());
    formData.append("mota", tourForm.description.trim());
    formData.append("diemNoiBat", tourForm.highlight.trim());
    formData.append("loTrinh", tourForm.itinerary.trim());
    formData.append("chitiettour", tourForm.includedPolicy.trim());
    formData.append("dieuKhoan", tourForm.serviceTerms.trim());
    formData.append("trangThai", tourForm.status);

    formData.append(
      "tourPrices",
      JSON.stringify({
        giaNguoiLon: Number(tourForm.adultPrice) || 0,
        giaTreEm: Number(tourForm.childPrice) || 0,
      }),
    );

    formData.append(
      "tourSchedules",
      JSON.stringify(
        tourForm.schedules.map((schedule) => ({
          ngaykhoihanh: schedule.startDate,
          ngayketthuc: schedule.endDate,
          Socho: Number(schedule.seatCount) || 0,
          Conlai:
            Number(schedule.remaining) ||
            Number(schedule.seatCount) ||
            0,
        })),
      ),
    );

    // Gửi mảng rỗng để BE không bị thiếu field tourServices
    formData.append("tourServices", JSON.stringify([]));
    // giữ lại hỉnh ảnh cũ 
    formData.append(
      "oldImages",
      JSON.stringify(
        tourForm.image.filter((img) => !img.startsWith("blob:"))
      )
    );

    // Field này phải đúng với route BE: upload.array("hinhAnh")
    imageFiles.forEach((file) => {
      formData.append("hinhAnh", file);
    });

    return formData;
  };

  const handleSubmitTour = async () => {
    if (!validateTourForm()) return;

    // ===== CHỈNH SỬA TOUR =====
    if (editingTourId !== null) {
      try {
        const res = await fetch(`${API_URL}/api/tours/update/${editingTourId}`, {
          method: "PUT",
          body: createTourFormData(),
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || result.error || "Cập nhật tour thất bại");
        }

        await fetchTours();
        closeTourForm();
        alert("Cập nhật tour thành công");
      } catch (error) {
        console.error("Lỗi tạo/cập nhật tour:", error);
      
        const message =
          error instanceof Error ? error.message : "Lỗi tạo/cập nhật tour";
      
        if (message.includes("Write conflict")) {
          await fetchTours();
          closeTourForm();
          alert("Cập nhật tour thành công");
          return;
        }
      
        alert(message);
      }
    }

    // ===== THÊM TOUR =====
    if (imageFiles.length < 5) {
      setFormErrors((prev) => ({
        ...prev,
        image: "Vui lòng tải tối thiểu 5 ảnh tour",
      }));
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/tours/create/tours`, {
        method: "POST",
        body: createTourFormData(),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || result.error || "Tạo tour thất bại");
      }

      await fetchTours();
      closeTourForm();
      alert("Tạo tour thành công");
    } catch (error) {
      console.error("Lỗi tạo tour:", error);
      alert(error instanceof Error ? error.message : "Lỗi tạo tour");
    }
  };
  useEffect(() => {
    fetchTours();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    // eslint-disable-next-line
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewTour(tour.id);
                          }}
                          className="h-[56px] cursor-pointer border-b border-[#F1F3F6] text-[14px] text-[#444] last:border-b-0 hover:bg-[#FAFBFC]"
                        >
                          <td className="truncate px-4">{tour.code}</td>
                          <td className="truncate px-3">{tour.name}</td>
                          <td className="truncate px-3">
                            {formatPrice(tour.adultPrice)}
                          </td>
                          <td className="px-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStatus(tour.id);
                              }}
                              className={
                                tour.status === "Ngưng"
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
                                  handleViewTour(tour.id);
                                }}
                                className="flex h-[24px] w-[24px] items-center justify-center rounded-md border border-[#DFE5EC] bg-white text-[#7C8798] hover:bg-[#F8FAFC]"
                                title="Xem chi tiết"
                              >
                                <Eye className="h-[12px] w-[12px]" />
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditTour(tour.id);
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
                                title={
                                  tour.status === "Hoạt động"
                                    ? "Khóa"
                                    : "Mở khóa"
                                }
                              >
                                {tour.status === "Hoạt động" ? (
                                  <Lock className="h-[12px] w-[12px]" />
                                ) : (
                                  <Unlock className="h-[12px] w-[12px]" />
                                )}
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[18px] ${
                          currentPage === page ? "text-black" : "text-[#444]"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <span>...</span>
                </div>
              </div>
            </div>
          </>
        )}

        {showTourForm && (
          <div className="rounded-[12px] border border-[#BFC5CD] bg-[#F9F9F9] p-5 md:p-7">
            <div className="max-w-[980px]">
              <h2 className="mb-5 text-[22px] font-bold text-black">
                Thông tin tour
              </h2>

              <div className="space-y-4">
                <div>
                  <RoundedInput
                    placeholder="Nhập tên tour"
                    value={tourForm.name}
                    onChange={(e) =>
                      handleTourFieldChange("name", e.target.value)
                    }
                    error={!!formErrors.name}
                  />
                  {formErrors.name && <ErrorText text={formErrors.name} />}
                </div>

                <div>
                  <RoundedInput
                    placeholder="Địa điểm"
                    value={tourForm.location}
                    onChange={(e) =>
                      handleTourFieldChange("location", e.target.value)
                    }
                    error={!!formErrors.location}
                  />
                  {formErrors.location && (
                    <ErrorText text={formErrors.location} />
                  )}
                </div>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
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
                    {tourForm.image.length > 0 ? "Đổi ảnh tour" : "Thêm ảnh"}
                  </button>

                  {tourForm.image.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-5">
                      {tourForm.image.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={getImageUrl(img)}
                            alt={`Ảnh tour ${index + 1}`}
                            className="h-[120px] w-full rounded-[10px] object-cover border border-[#D7DCE3]"
                          />

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-500"
                            title="Xóa ảnh"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {formErrors.image && <ErrorText text={formErrors.image} />}
                </div>
                <div>
                  <RoundedTextarea
                    placeholder="Mô tả của tour"
                    value={tourForm.description}
                    onChange={(e) =>
                      handleTourFieldChange("description", e.target.value)
                    }
                    rows={4}
                    error={!!formErrors.description}
                  />
                  {formErrors.description && (
                    <ErrorText text={formErrors.description} />
                  )}
                </div>

                <div>
                  <RoundedInput
                    placeholder="Thời lượng của tour"
                    value={tourForm.duration}
                    onChange={(e) =>
                      handleTourFieldChange("duration", e.target.value)
                    }
                    error={!!formErrors.duration}
                  />
                  {formErrors.duration && (
                    <ErrorText text={formErrors.duration} />
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <RoundedInput
                      type="text"
                      inputMode="numeric"
                      placeholder="Giá của tour đối với người lớn"
                      value={tourForm.adultPrice}
                      onChange={(e) =>
                        handleTourFieldChange(
                          "adultPrice",
                          onlyNumber(e.target.value),
                        )
                      }
                      error={!!formErrors.adultPrice}
                    />
                    {formErrors.adultPrice && (
                      <ErrorText text={formErrors.adultPrice} />
                    )}
                  </div>

                  <div>
                    <RoundedInput
                      type="text"
                      inputMode="numeric"
                      placeholder="Giá của tour đối với trẻ em"
                      value={tourForm.childPrice}
                      onChange={(e) =>
                        handleTourFieldChange(
                          "childPrice",
                          onlyNumber(e.target.value),
                        )
                      }
                      error={!!formErrors.childPrice}
                    />
                    {formErrors.childPrice && (
                      <ErrorText text={formErrors.childPrice} />
                    )}
                  </div>
                </div>

                <div className="rounded-[14px] border border-[#D7DCE3] bg-white p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-[18px] font-bold text-black">
                      Lịch khởi hành
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddSchedule}
                      className="flex items-center gap-2 rounded-[8px] bg-[#10B5F1] px-3 py-2 text-sm font-bold text-black"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Thêm lịch
                    </button>
                  </div>

                  <div className="space-y-4">
                    {tourForm.schedules.map((schedule, index) => (
                      <div
                        key={schedule.id}
                        className="rounded-[12px] border border-[#E5E7EB] bg-[#FAFAFA] p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <p className="font-semibold text-[#111827]">
                            Lịch {index + 1}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleRemoveSchedule(schedule.id)}
                            className="rounded-full p-1 text-red-500 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <DateInput
                            min={getTodayInputDate()}
                            value={schedule.startDate}
                            onChange={(e) =>
                              handleScheduleFieldChange(
                                schedule.id,
                                "startDate",
                                e.target.value,
                              )
                            }
                          />

                          <DateInput
                            min={schedule.startDate || getTodayInputDate()}
                            value={schedule.endDate}
                            onChange={(e) =>
                              handleScheduleFieldChange(
                                schedule.id,
                                "endDate",
                                e.target.value,
                              )
                            }
                          />

                          <RoundedInput
                            type="text"
                            inputMode="numeric"
                            placeholder="Số chỗ"
                            value={schedule.seatCount}
                            onChange={(e) =>
                              handleScheduleFieldChange(
                                schedule.id,
                                "seatCount",
                                onlyNumber(e.target.value),
                              )
                            }
                          />

                          <RoundedInput
                            type="text"
                            inputMode="numeric"
                            placeholder="Còn lại"
                            value={schedule.remaining}
                            onChange={(e) =>
                              handleScheduleFieldChange(
                                schedule.id,
                                "remaining",
                                onlyNumber(e.target.value),
                              )
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {formErrors.schedules && (
                    <ErrorText text={formErrors.schedules} />
                  )}
                </div>

                <RoundedSelect
                  value={tourForm.status}
                  onChange={(e) =>
                    handleTourFieldChange(
                      "status",
                      e.target.value as TourStatus,
                    )
                  }
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Ngưng">Ngưng</option>
                </RoundedSelect>

                <div>
                  <RoundedTextarea
                    placeholder="Điểm nổi bật của tour"
                    value={tourForm.highlight}
                    onChange={(e) =>
                      handleTourFieldChange("highlight", e.target.value)
                    }
                    rows={4}
                    error={!!formErrors.highlight}
                  />
                  {formErrors.highlight && (
                    <ErrorText text={formErrors.highlight} />
                  )}
                </div>

                <div>
                  <RoundedTextarea
                    placeholder="Lộ trình của tour"
                    value={tourForm.itinerary}
                    onChange={(e) =>
                      handleTourFieldChange("itinerary", e.target.value)
                    }
                    rows={4}
                    error={!!formErrors.itinerary}
                  />
                  {formErrors.itinerary && (
                    <ErrorText text={formErrors.itinerary} />
                  )}
                </div>
              </div>

              <h2 className="mb-5 mt-8 text-[22px] font-bold text-black">
                Điều khoản tour
              </h2>

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
                  {formErrors.serviceTerms && (
                    <ErrorText text={formErrors.serviceTerms} />
                  )}
                </div>
              </div>

              {formErrors.extraServices && (
                <ErrorText text={formErrors.extraServices} />
              )}

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
            <h3 className="text-[24px] font-bold text-[#111827]">
              Xác nhận xóa
            </h3>
            <p className="mt-3 text-[15px] text-[#4B5563]">
              Bạn có chắc muốn xóa tour{" "}
              <span className="font-semibold text-[#111827]">
                {deleteTarget.name}
              </span>{" "}
              không?
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
              <h2 className="text-[28px] font-bold text-[#111827]">
                Chi tiết tour
              </h2>
              <button
                onClick={() => setViewingTour(null)}
                className="rounded-full p-1 text-[#6B7280] hover:bg-[#F3F4F6]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 px-6 py-5">
              {viewingTour.image.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                  {viewingTour.image.slice(0, 5).map((img, index) => (
                    <img
                      key={index}
                      src={getImageUrl(img)}
                      alt={`${viewingTour.name} ${index + 1}`}
                      className="h-[140px] w-full rounded-[14px] object-cover"
                    />
                  ))}
                </div>
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
                <DetailArea
                  label="Mô tả tour"
                  value={viewingTour.description}
                />
                <DetailBox
                  label="Số chỗ"
                  value={String(viewingTour.seatCount)}
                />
                <DetailBox
                  label="Giá người lớn"
                  value={formatPrice(viewingTour.adultPrice)}
                />
                <DetailBox
                  label="Giá trẻ em"
                  value={formatPrice(viewingTour.childPrice)}
                />
                <div className="md:col-span-2 rounded-[12px] border border-[#E5E7EB] bg-[#FAFAFA] p-4">
                  <div className="text-sm font-semibold text-[#6B7280]">
                    Lịch khởi hành
                  </div>

                  {viewingTour.schedules.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {viewingTour.schedules.map((schedule, index) => (
                        <div
                          key={index}
                          className="rounded-[10px] border border-[#E5E7EB] bg-white p-3 text-[15px] text-[#111827]"
                        >
                          <div>
                            <span className="font-semibold">
                              Lịch {index + 1}:{" "}
                            </span>
                            {schedule.startDate} - {schedule.endDate}
                          </div>
                          <div className="mt-1 text-sm text-[#6B7280]">
                            Số chỗ: {schedule.seatCount} | Còn lại:{" "}
                            {schedule.remaining}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-1 text-[16px] font-medium text-[#111827]">
                      Chưa có lịch tour
                    </div>
                  )}
                </div>
                <DetailBox label="Trạng thái" value={viewingTour.status} />
              </div>

              <DetailArea label="Điểm nổi bật" value={viewingTour.highlight} />
              <DetailArea label="Lộ trình" value={viewingTour.itinerary} />
              <DetailArea
                label="Chi tiết dịch vụ đi kèm tour"
                value={viewingTour.includedPolicy}
              />
              <DetailArea
                label="Điều khoản dịch vụ"
                value={viewingTour.serviceTerms}
              />
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
                  handleEditTour(viewingTour.id);
                  setViewingTour(null);
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
      <div className="mt-1 text-[16px] font-medium text-[#111827]">
        {value || "-"}
      </div>
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






