'use client';

import React, { useState, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Edit2, Trash2, Plus, Lock, Unlock, X } from 'lucide-react';

interface Discount {
  id: number;
  name: string;
  code: string;
  discount: string;
  tour: string;
  status: 'Hoạt động' | 'Ngừng';
  quantity: number;
}

const initialDiscounts: Discount[] = [
  { id: 1, name: 'Giảm 15%', code: 'KMVVP', discount: '15%', tour: 'Tất cả', status: 'Hoạt động', quantity: 100 },
  { id: 2, name: 'Giảm 10%', code: 'KMKH1', discount: '10%', tour: 'Tất cả', status: 'Hoạt động', quantity: 50 },
  { id: 3, name: 'Mùa hè sôi động', code: 'KMHSD', discount: '7%', tour: 'Tất cả', status: 'Hoạt động', quantity: 25 },
  { id: 4, name: 'Tết đông đầy', code: 'KMTTD', discount: '12%', tour: 'Tất cả', status: 'Ngừng', quantity: 75 },
  { id: 5, name: 'Giảm 7%', code: 'KMTBD', discount: '7%', tour: 'Tất cả', status: 'Hoạt động', quantity: 127 },
  { id: 6, name: 'Giảm 3%', code: 'KMART', discount: '7%', tour: 'Tất cả', status: 'Hoạt động', quantity: 49 },
];

const DiscountPage: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>(initialDiscounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Hoạt động' | 'Ngừng'>('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    discount: '',
    tour: 'Tất cả',
    status: 'Hoạt động' as 'Hoạt động' | 'Ngừng',
    quantity: 0,
  });

  const filteredDiscounts = useMemo(() => {
    return discounts
      .filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((item) => statusFilter === 'All' || item.status === statusFilter);
  }, [discounts, searchTerm, statusFilter]);

  const toggleLock = (id: number) => {
    setDiscounts((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'Hoạt động' ? 'Ngừng' : 'Hoạt động' }
          : item
      )
    );
    toast.success('Đã thay đổi trạng thái khóa/mở khóa');
  };

  const deleteDiscount = (id: number, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa khuyến mãi "${name}" không?`)) return;
    setDiscounts((prev) => prev.filter((item) => item.id !== id));
    toast.success(`Đã xóa khuyến mãi "${name}"`);
  };

  const openCreateModal = () => {
    setEditingDiscount(null);
    setFormData({ name: '', code: '', discount: '', tour: 'Tất cả', status: 'Hoạt động', quantity: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (discount: Discount) => {
    setEditingDiscount(discount);
    setFormData({
      name: discount.name,
      code: discount.code,
      discount: discount.discount,
      tour: discount.tour,
      status: discount.status,
      quantity: discount.quantity,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.discount) {
      toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc!');
      return;
    }

    if (editingDiscount) {
      setDiscounts((prev) =>
        prev.map((item) => (item.id === editingDiscount.id ? { ...item, ...formData } : item))
      );
      toast.success('Cập nhật khuyến mãi thành công!');
    } else {
      const newDiscount = { id: Date.now(), ...formData };
      setDiscounts((prev) => [newDiscount, ...prev]);
      toast.success('Tạo khuyến mãi mới thành công!');
    }
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý khuyến mãi</h1>
          <p className="text-gray-600 mt-1">Chương trình khuyến mãi</p>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 relative max-w-md">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</div>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc mã khuyến mãi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 text-gray-700 placeholder-gray-400"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={20} />
            Tạo mới
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-5 text-left w-10"><input type="checkbox" className="rounded border-gray-300" /></th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">Tên Khuyến mãi</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">Mã khuyến mãi</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">Giảm giá</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">Tour áp dụng</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-600">Số lượng</th>
                  <th className="px-6 py-5 text-center text-sm font-semibold text-gray-600">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDiscounts.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5"><input type="checkbox" className="rounded border-gray-300" /></td>
                    <td className="px-6 py-5 font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-5 font-mono text-gray-700">{item.code}</td>
                    <td className="px-6 py-5 font-semibold text-gray-900">{item.discount}</td>
                    <td className="px-6 py-5 text-gray-600">{item.tour}</td>
                    <td className="px-6 py-5">
                      <span className={`px-4 py-1.5 text-xs font-medium rounded-full select-none ${
                        item.status === 'Hoạt động'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-medium text-gray-700">{item.quantity}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-5 text-gray-500">
                        <button
                          onClick={() => openEditModal(item)}
                          className="hover:text-amber-600 transition"
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={19} />
                        </button>
                        <button
                          onClick={() => toggleLock(item.id)}
                          className={`transition ${item.status === 'Hoạt động'
                            ? 'text-emerald-600 hover:text-emerald-700'
                            : 'text-red-600 hover:text-red-700'}`}
                          title={item.status === 'Hoạt động' ? 'Khóa khuyến mãi' : 'Mở khóa khuyến mãi'}
                        >
                          {item.status === 'Hoạt động' ? <Lock size={19} /> : <Unlock size={19} />}
                        </button>
                        <button
                          onClick={() => deleteDiscount(item.id, item.name)}
                          className="hover:text-red-600 transition"
                          title="Xóa"
                        >
                          <Trash2 size={19} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredDiscounts.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-gray-500">
                      Không tìm thấy chương trình khuyến mãi nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form - Kiểu dọc giống yêu cầu */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingDiscount ? 'Chỉnh sửa khuyến mãi' : 'Tạo khuyến mãi mới'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên khuyến mãi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã khuyến mãi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 text-gray-900 font-mono uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giảm giá <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tour áp dụng</label>
                <select
                  name="tour"
                  value={formData.tour}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 text-gray-900 bg-white"
                >
                  <option value="Tất cả">Tất cả</option>
                  <option value="Vé Cáp Treo Bà Nà">Vé Cáp Treo Bà Nà</option>
                  <option value="Tour Hội An">Tour Hội An</option>
                  <option value="Tour Huế">Tour Huế</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 text-gray-900 bg-white"
                  >
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Ngừng">Ngừng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 text-gray-900"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 border border-gray-300 text-gray-700 font-medium rounded-2xl hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl"
                >
                  {editingDiscount ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountPage;