"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Pencil,
  Trash2,
  MinusCircle,
  X,
} from "lucide-react";

type Role = "Admin" | "User";

type UserItem = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: Role;
};

const ITEMS_PER_PAGE = 9;

export default function UserManagerPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"fullName" | "email" | "role">("fullName");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  // ================= FETCH =================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/manageuser", {
          credentials: "include",
        });
        
        if (!res.ok) {
          console.error("API error:", res.status);
          return;
        }
        
        const contentType = res.headers.get("content-type");
        
        if (!contentType?.includes("application/json")) {
          const text = await res.text();
          console.error("Không phải JSON:", text);
          return;
        }
        if (res.status === 401) {
          console.log("Chưa đăng nhập");
          return;
        }

        const data = await res.json();
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedUsers = data.data.map((u: any) => ({
          id: u._id,
          fullName: u.hoten,
          email: u.email,
          phone: u.sdt || "",
          address: u.diachi || "",
          role: u.role === "Admin" ? "Admin" : "User",
        }));

        setUsers(mappedUsers);
      } catch (error) {
        console.error("Lỗi fetch user:", error);
      }
    };

    fetchUsers();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    const user = users.find((u) => u.id === id);
  
    // ❌ Không cho xóa Admin
    if (user?.role === "Admin") {
      alert("Không thể xóa tài khoản Admin");
      return;
    }
  
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
  
    try {
      await fetch(`http://localhost:3001/api/manageuser/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
  
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Lỗi delete:", error);
    }
  };
  // ================= UPDATE =================
  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      const res = await fetch(
        `http://localhost:3001/api/manageuser/${editingUser.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            hoten: editForm.fullName,
            email: editForm.email,
            sdt: editForm.phone,
            diachi: editForm.address,
          }),
        }
      );
      

      const data = await res.json();

      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                fullName: data.data.hoten,
                email: data.data.email,
                phone: data.data.sdt,
                address: data.data.diachi,
              }
            : u
        )
      );

      setEditingUser(null);
    } catch (error) {
      console.error("Lỗi update:", error);
    }
  };

  // ================= FILTER =================
  const filteredUsers = useMemo(() => {
    const keyword = searchTerm.toLowerCase();
    return users
      .filter(
        (u) =>
          u.fullName.toLowerCase().includes(keyword) ||
          u.email.toLowerCase().includes(keyword)
      )
      .sort((a, b) => {
        if (a.role === "Admin") return -1;
        if (b.role === "Admin") return 1;
        return a[sortBy].localeCompare(b[sortBy], "vi");
      });
  }, [users, searchTerm, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  );

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const stats = useMemo(() => {
    const admin = users.filter((u) => u.role === "Admin").length;
    return {
      total: users.length,
      admin,
      user: users.length - admin,
    };
  }, [users]);
  const handleToggleRole = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, role: u.role === "Admin" ? "User" : "Admin" }
          : u
      )
    );
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

  return (
    <>
      <div className="min-h-screen w-full bg-[#F5F6F8] px-6 py-6 md:px-8 lg:px-10">
        <div className="w-full">
          <h1 className="mb-6 text-[36px] md:text-[42px] font-semibold tracking-tight text-gray-900">
            Quản lý tài khoản
          </h1>

          {/* Stats */}
          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard bg="bg-gradient-to-r from-violet-400 to-teal-500" value={stats.total} label="Tổng số tài khoản" />
            <StatCard bg="bg-gradient-to-r from-orange-500 to-indigo-600" value={stats.admin} label="Admin" />
            <StatCard bg="bg-gradient-to-r from-blue-400 to-teal-500" value={stats.user} label="Người dùng" />
          </div>

          {/* Search & Sort */}
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

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "fullName" | "email" | "role")}
                className="h-[46px] appearance-none rounded-[8px] border border-[#D7DCE3] bg-white px-4 pr-10 text-[14px] font-semibold text-[#333] outline-none"
              >
                <option value="fullName">Họ tên</option>
                <option value="email">Email</option>
                <option value="role">Quyền</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#333]" />
            </div>
          </div>

          {/* Bảng chính */}
          <div className="w-full overflow-hidden rounded-[14px] border border-[#E1E5EB] bg-white">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[1150px] table-fixed">
                <thead>
                  <tr className="h-[56px]  border-b border-[#ECEFF4] bg-[#FBFBFC] text-left">
                    <th className="w-[85px] px-3 text-center text-[14px] font-bold text-[#3B4351]">ID</th>
                    <th className="w-[200px] px-3 text-[14px] font-bold text-[#3B4351] pl-35">Họ tên</th>
                    <th className="w-[170px] px-3 text-[14px] font-bold text-[#3B4351]">Email</th>
                    <th className="w-[120px] px-3 text-[14px] font-bold text-[#3B4351]">Số điện thoại</th>
                    <th className="w-[90px] px-3 text-[14px] font-bold text-[#3B4351]">Địa chỉ</th>
                    <th className="w-[90px] px-3 text-[14px] font-bold text-[#3B4351] pl-7">Quyền</th>
                    <th className="w-[90px] px-3 text-center text-[14px] font-bold text-[#3B4351]">Hành động</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-[14px] text-[#6B7280]">
                        Không tìm thấy tài khoản nào
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className={`h-[62px] border-b border-[#F1F3F7] text-[14px] text-[#3B3F46] last:border-b-0 ${
                          user.role === "Admin" ? "bg-[#FFF9F2]" : ""
                        }`}
                      >
                        <td className="px-3 text-center font-mono text-[15px]  text-[#3B3F46] ">
                          #{user.id.toString().padStart(3, "0")}
                        </td>
                        <td className="truncate px-3 font-medium text-[#2F3640] pl-35">{user.fullName}</td>
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
                              <MinusCircle className="h-[18px] w-[18px] text-[#8D96A7]" />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEditModal(user)}
                                className="flex h-[26px] w-[26px] items-center justify-center rounded-md border border-[#E1E5EB] bg-white text-[#7B8496] hover:bg-[#F6F8FB]"
                                title="Sửa"
                              >
                                <Pencil className="h-[13px] w-[13px]" />
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="flex h-[26px] w-[26px] items-center justify-center rounded-md border border-[#FFE0E0] bg-white text-[#FF5B5B] hover:bg-[#FFF5F5]"
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

            {/* Phân trang */}
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

      {/* Modal Sửa */}
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
              {["Họ tên", "Email", "Số điện thoại", "Địa chỉ"].map((label, i) => (
                <div key={i}>
                  <label className="mb-2 block text-sm font-semibold text-[#374151]">
                    {label}
                  </label>
                  <input
                    value={editForm[Object.keys(editForm)[i] as keyof typeof editForm]}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        [Object.keys(editForm)[i]]: e.target.value,
                      }))
                    }
                    className="h-[46px] w-full rounded-xl border border-[#D8DEE8] px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#15A5D8]"
                  />
                </div>
              ))}
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

function StatCard({ value, label, bg }: { value: number; label: string; bg: string }) {
  return (
    <div className={`${bg} h-[130px] w-full rounded-xl px-6 py-5 text-white shadow-sm`}>
      <div className="text-[40px] md:text-[46px] font-bold leading-none">{value}</div>
      <div className="mt-3 text-[16px] md:text-[17px] font-medium opacity-95">{label}</div>
    </div>
  );
}