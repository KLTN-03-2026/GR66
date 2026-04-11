"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  Pencil,
  Lock,
  Unlock,
  Trash2,
  MinusCircle,
  X,
} from "lucide-react";

type Role = "Admin" | "Khách";

type UserItem = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: Role;
  isLocked: boolean;
  isNew: boolean;
  protected?: boolean;
};

const initialUsers: UserItem[] = [
  {
    id: 1,
    fullName: "Phạm Văn B",
    email: "levana@gmail.com",
    phone: "01234567890",
    address: "Số 123, đường ABC, quận Hải Châu, Đà Nẵng",
    role: "Admin",
    isLocked: false,
    isNew: true,
    protected: true,
  },
  {
    id: 2,
    fullName: "Lê Văn A",
    email: "levana@gmail.com",
    phone: "01234567890",
    address: "Số 123, đường ABC, quận Thanh Khê, Đà Nẵng",
    role: "Khách",
    isLocked: false,
    isNew: true,
  },
  {
    id: 3,
    fullName: "Lê Văn A",
    email: "levana@gmail.com",
    phone: "01234567890",
    address: "Số 123, đường ABC, quận Liên Chiểu, Đà Nẵng",
    role: "Khách",
    isLocked: false,
    isNew: true,
  },
  {
    id: 4,
    fullName: "Lê Văn A",
    email: "levana@gmail.com",
    phone: "01234567890",
    address: "Số 123, đường ABC, quận Sơn Trà, Đà Nẵng",
    role: "Khách",
    isLocked: false,
    isNew: true,
  },
  {
    id: 5,
    fullName: "Lê Văn A",
    email: "levana@gmail.com",
    phone: "01234567890",
    address: "Số 123, đường ABC, quận Ngũ Hành Sơn, Đà Nẵng",
    role: "Khách",
    isLocked: false,
    isNew: true,
  },
  {
    id: 6,
    fullName: "Lê Văn A",
    email: "levana@gmail.com",
    phone: "01234567890",
    address: "Số 123, đường ABC, quận Cẩm Lệ, Đà Nẵng",
    role: "Khách",
    isLocked: false,
    isNew: true,
  },
  {
    id: 7,
    fullName: "Lê Văn A",
    email: "levana@gmail.com",
    phone: "01234567890",
    address: "Số 123, đường ABC, quận Hải Châu, Đà Nẵng",
    role: "Khách",
    isLocked: false,
    isNew: true,
  },
  {
    id: 8,
    fullName: "Lê Văn A",
    email: "levana@gmail.com",
    phone: "01234567890",
    address: "Số 123, đường ABC, quận Thanh Khê, Đà Nẵng",
    role: "Khách",
    isLocked: false,
    isNew: true,
  },
  {
    id: 9,
    fullName: "Lê Văn A",
    email: "levana@gmail.com",
    phone: "01234567890",
    address: "Số 123, đường ABC, quận Liên Chiểu, Đà Nẵng",
    role: "Khách",
    isLocked: false,
    isNew: true,
  },
  {
    id: 10,
    fullName: "Nguyễn Văn C",
    email: "nguyenvanc@gmail.com",
    phone: "09876543210",
    address: "Số 25, đường Trần Phú, Hải Châu, Đà Nẵng",
    role: "Khách",
    isLocked: true,
    isNew: false,
  },
  {
    id: 11,
    fullName: "Trần Thị D",
    email: "trand@gmail.com",
    phone: "0911222333",
    address: "Số 88, đường Điện Biên Phủ, Thanh Khê, Đà Nẵng",
    role: "Khách",
    isLocked: true,
    isNew: false,
  },
];

const ITEMS_PER_PAGE = 9;

export default function UserManagerPage() {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"fullName" | "email" | "role">("fullName");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const filteredUsers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    const result = users.filter((user) => {
      return (
        user.fullName.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.phone.toLowerCase().includes(keyword) ||
        user.address.toLowerCase().includes(keyword)
      );
    });

    result.sort((a, b) => {
      // Luôn ưu tiên Admin lên đầu
      if (a.role === "Admin" && b.role !== "Admin") return -1;
      if (a.role !== "Admin" && b.role === "Admin") return 1;

      // Sau đó mới sort theo lựa chọn
      if (sortBy === "fullName") return a.fullName.localeCompare(b.fullName, "vi");
      if (sortBy === "email") return a.email.localeCompare(b.email, "vi");
      return a.role.localeCompare(b.role, "vi");
    });

    return result;
  }, [users, searchTerm, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const stats = useMemo(() => {
    const newCount = users.filter((u) => u.isNew).length;
    const activeCount = users.filter((u) => !u.isLocked).length;
    const lockedCount = users.filter((u) => u.isLocked).length;
    const totalCount = users.length;

    return { newCount, activeCount, lockedCount, totalCount };
  }, [users]);

  const isAllSelected =
    paginatedUsers.length > 0 &&
    paginatedUsers.every((user) => selectedIds.includes(user.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !paginatedUsers.some((user) => user.id === id))
      );
    } else {
      setSelectedIds((prev) => {
        const newIds = paginatedUsers.map((u) => u.id);
        return Array.from(new Set([...prev, ...newIds]));
      });
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleRole = (id: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              role: user.role === "Admin" ? "Khách" : "Admin",
            }
          : user
      )
    );
  };

  const handleToggleLock = (id: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, isLocked: !user.isLocked } : user
      )
    );
  };

  const handleDelete = (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa tài khoản này không?");
    if (!ok) return;

    setUsers((prev) => prev.filter((user) => user.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const openEditModal = (user: UserItem) => {
    setEditingUser(user);
    setEditForm({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
    });
  };

  const closeEditModal = () => {
    setEditingUser(null);
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;

    setUsers((prev) =>
      prev.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              fullName: editForm.fullName,
              email: editForm.email,
              phone: editForm.phone,
              address: editForm.address,
            }
          : user
      )
    );

    closeEditModal();
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy]);

  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  return (
    <>
      <div className="min-h-screen w-full bg-[#F5F6F8] px-6 py-6 md:px-8 lg:px-10">
        <div className="w-full">
          <h1 className="mb-6 text-[36px] md:text-[42px] font-semibold tracking-tight text-gray-900">
            Quản lý tài khoản
          </h1>

          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              bg="bg-[#5D78EA]"
              value={stats.newCount}
              label="Tài khoản vừa đăng ký"
            />
            <StatCard
              bg="bg-[#F08B55]"
              value={stats.activeCount}
              label="Tài khoản còn hoạt động"
            />
            <StatCard
              bg="bg-[#7757E8]"
              value={stats.lockedCount}
              label="Tài khoản đã khóa"
            />
            <StatCard
              bg="bg-[#42C4A2]"
              value={stats.totalCount}
              label="Tổng số tài khoản"
            />
          </div>

          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full max-w-[560px] overflow-hidden rounded-[10px] border border-[#D7DCE3] bg-white">
              <div className="flex flex-1 items-center px-4">
                <Search className="mr-2 h-4 w-4 text-[#8D96A7]" />
                <input
                  type="text"
                  placeholder="Tìm kiếm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-[46px] w-full border-none bg-transparent text-[14px] text-[#333] outline-none placeholder:text-[#A1A7B3]"
                />
              </div>
              <button className="flex h-[46px] min-w-[82px] items-center justify-center bg-[#15A5D8] px-5 text-[14px] font-semibold text-white transition hover:bg-[#1196c4]">
                Tìm
              </button>
            </div>

            <div className="flex">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "fullName" | "email" | "role")
                  }
                  className="h-[46px] appearance-none rounded-[8px] border border-[#D7DCE3] bg-white px-4 pr-10 text-[14px] font-semibold text-[#333] outline-none"
                >
                  <option value="fullName">Họ tên</option>
                  <option value="email">Email</option>
                  <option value="role">Quyền</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#333]" />
              </div>
            </div>
          </div>

          <div className="w-full overflow-hidden rounded-[14px] border border-[#E1E5EB] bg-white">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[1200px] table-fixed">
                <thead>
                  <tr className="h-[56px] border-b border-[#ECEFF4] bg-[#FBFBFC] text-left">
                    <th className="w-[52px] px-4">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        className="h-4 w-4 rounded border border-[#D6DCE5] accent-[#15A5D8]"
                      />
                    </th>
                    <th className="w-[170px] px-3 text-[14px] font-bold text-[#3B4351]">
                      Họ tên
                    </th>
                    <th className="w-[190px] px-3 text-[14px] font-bold text-[#3B4351]">
                      Email
                    </th>
                    <th className="w-[150px] px-3 text-[14px] font-bold text-[#3B4351]">
                      Số điện thoại
                    </th>
                    <th className="w-[320px] px-3 text-[14px] font-bold text-[#3B4351]">
                      Địa chỉ
                    </th>
                    <th className="w-[130px] px-3 text-[14px] font-bold text-[#3B4351]">
                      Quyền
                    </th>
                    <th className="w-[170px] px-3 text-center text-[14px] font-bold text-[#3B4351]">
                      Hành động
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-10 text-center text-[14px] text-[#6B7280]"
                      >
                        Không tìm thấy tài khoản nào
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className={`h-[62px] border-b border-[#F1F3F7] text-[14px] text-[#4B5563] last:border-b-0 ${
                          user.role === "Admin" ? "bg-[#FFF9F2]" : ""
                        }`}
                      >
                        <td className="px-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(user.id)}
                            onChange={() => handleSelectOne(user.id)}
                            className="h-4 w-4 rounded border border-[#D6DCE5] accent-[#15A5D8]"
                          />
                        </td>

                        <td className="truncate px-3 font-medium text-[#2F3640]">
                          {user.fullName}
                        </td>
                        <td className="truncate px-3 text-[#3B3F46]">{user.email}</td>
                        <td className="truncate px-3 text-[#3B3F46]">{user.phone}</td>
                        <td className="truncate px-3 text-[#3B3F46]">{user.address}</td>

                        <td className="px-3">
                          <button
                            onClick={() => handleToggleRole(user.id)}
                            className={`inline-flex min-w-[78px] items-center justify-center rounded-full px-3 py-[5px] text-[12px] font-semibold transition ${
                              user.role === "Admin"
                                ? "bg-[#F8D7D7] text-[#F04444] hover:bg-[#f4caca]"
                                : "bg-[#CFF3EC] text-[#1BB59B] hover:bg-[#bcece1]"
                            }`}
                          >
                            {user.role}
                          </button>
                        </td>

                        <td className="px-3">
                          {user.protected ? (
                            <div className="flex items-center justify-center">
                              <button className="text-[#8D96A7]">
                                <MinusCircle className="h-[18px] w-[18px]" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEditModal(user)}
                                className="flex h-[26px] w-[26px] items-center justify-center rounded-md border border-[#E1E5EB] bg-white text-[#7B8496] transition hover:bg-[#F6F8FB]"
                                title="Sửa"
                              >
                                <Pencil className="h-[13px] w-[13px]" />
                              </button>

                              <button
                                onClick={() => handleToggleLock(user.id)}
                                className="flex h-[26px] w-[26px] items-center justify-center rounded-md border border-[#E1E5EB] bg-white text-[#7B8496] transition hover:bg-[#F6F8FB]"
                                title={user.isLocked ? "Mở khóa" : "Khóa"}
                              >
                                {user.isLocked ? (
                                  <Unlock className="h-[13px] w-[13px]" />
                                ) : (
                                  <Lock className="h-[13px] w-[13px]" />
                                )}
                              </button>

                              <button
                                onClick={() => handleDelete(user.id)}
                                className="flex h-[26px] w-[26px] items-center justify-center rounded-md border border-[#FFE0E0] bg-white text-[#FF5B5B] transition hover:bg-[#FFF5F5]"
                                title="Xóa"
                              >
                                <Trash2 className="h-[13px] w-[13px]" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#EEF1F5] px-4 py-3 text-[13px] text-[#7B8496] sm:flex-row sm:items-center sm:justify-between">
              <div>
                Hiển thị{" "}
                {filteredUsers.length === 0
                  ? 0
                  : (currentPage - 1) * ITEMS_PER_PAGE + 1}{" "}
                - {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} của{" "}
                {filteredUsers.length}
              </div>

              <div className="flex items-center gap-2">
                <span>Trang</span>
                <div className="relative">
                  <select
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                    className="h-[32px] appearance-none rounded-[8px] border border-[#D7DCE3] bg-[#F8F9FB] px-3 pr-8 text-[13px] text-[#6B7280] outline-none"
                  >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <option key={page} value={page}>
                        {page}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#7B8496]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[560px] rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EEF1F5] px-6 py-4">
              <h2 className="text-[22px] font-bold text-[#1F2937]">Sửa tài khoản</h2>
              <button
                onClick={closeEditModal}
                className="rounded-full p-1 text-[#6B7280] transition hover:bg-[#F3F4F6]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#374151]">
                  Họ tên
                </label>
                <input
                  value={editForm.fullName}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  className="h-[46px] w-full rounded-xl border border-[#D8DEE8] px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#15A5D8]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#374151]">
                  Email
                </label>
                <input
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="h-[46px] w-full rounded-xl border border-[#D8DEE8] px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#15A5D8]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#374151]">
                  Số điện thoại
                </label>
                <input
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="h-[46px] w-full rounded-xl border border-[#D8DEE8] px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#15A5D8]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#374151]">
                  Địa chỉ
                </label>
                <input
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, address: e.target.value }))
                  }
                  className="h-[46px] w-full rounded-xl border border-[#D8DEE8] px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#15A5D8]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#EEF1F5] px-6 py-4">
              <button
                onClick={closeEditModal}
                className="rounded-xl border border-[#D8DEE8] px-5 py-2.5 text-sm font-semibold text-[#4B5563] transition hover:bg-[#F9FAFB]"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveEdit}
                className="rounded-xl bg-[#15A5D8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1196c4]"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function StatCard({
  value,
  label,
  bg,
}: {
  value: number;
  label: string;
  bg: string;
}) {
  return (
    <div className={`${bg} h-[130px] w-full rounded-xl px-6 py-5 text-white shadow-sm`}>
      <div className="text-[40px] md:text-[46px] font-bold leading-none">{value}</div>
      <div className="mt-3 text-[16px] md:text-[17px] font-medium opacity-95">
        {label}
      </div>
    </div>
  );
}