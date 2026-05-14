'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getUserProfile, updateProfile } from '@/app/lib/authService';   // ← Đường dẫn này rất quan trọng

interface UserInfo {
    fullName: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: string;
    address: string;
}

const defaultUser: UserInfo = {
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "Nam",
    address: "",
};

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [userInfo, setUserInfo] = useState<UserInfo>(defaultUser);
    const [tempInfo, setTempInfo] = useState<UserInfo>(defaultUser);

    // Load thông tin người dùng
    useEffect(() => {
        const loadUser = async () => {
            setLoading(true);
            try {
                // Lấy từ localStorage trước
                const localUser = localStorage.getItem("user");
                if (localUser) {
                    const parsed = JSON.parse(localUser);
                    const mapped = mapUserData(parsed);
                    setUserInfo(mapped);
                    setTempInfo(mapped);
                }

                // Fetch từ server
                const data = await getUserProfile();
                const userData = data?.user || data?.data || data;

                if (userData) {
                    const mapped = mapUserData(userData);
                    setUserInfo(mapped);
                    setTempInfo(mapped);
                    localStorage.setItem("user", JSON.stringify(userData));
                }
            } catch (err) {
                console.error("Lỗi tải thông tin profile:", err);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const mapUserData = (data: any): UserInfo => ({
        fullName: data.hoten || data.fullName || "",
        email: data.email || "",
        phone: data.sdt || data.phone || "",
        birthDate: data.ngaysinh ? data.ngaysinh.split("T")[0] : "",
        gender: data.gioitinh || "Nam",
        address: data.diachi || data.address || "",
    });

    const handleEdit = () => {
        setTempInfo({ ...userInfo });
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!tempInfo.fullName?.trim() || !tempInfo.email?.trim()) {
            alert("Vui lòng nhập Họ tên và Email");
            return;
        }
    
        setSaving(true);
    
        try {
            const updateData = {
                hoten: tempInfo.fullName,
                email: tempInfo.email,
                sdt: tempInfo.phone,
                ngaysinh: tempInfo.birthDate,
                gioitinh: tempInfo.gender,
                diachi: tempInfo.address,
            };
    
            const result = await updateProfile(updateData);
    
            // 🔥 FIX CHÍNH Ở ĐÂY
            const updatedUserRaw = result?.user || result?.data || result;
            const finalUser = updatedUserRaw?.user || updatedUserRaw?.data || updatedUserRaw;
    
            localStorage.setItem("user", JSON.stringify(finalUser));
    
            const mapped = mapUserData(finalUser);
            setUserInfo(mapped);
            setTempInfo(mapped);
    
            setIsEditing(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
    
        } catch (err: any) {
            console.error("Lỗi cập nhật:", err);
            alert(err.message || "Cập nhật thất bại. Vui lòng thử lại!");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setTempInfo({ ...userInfo });
        setIsEditing(false);
    };

    const handleChange = (field: keyof UserInfo, value: string) => {
        setTempInfo(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
                <p className="text-lg text-gray-600">Đang tải thông tin...</p>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#f8f9fa] py-10 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold text-black mb-8">THÔNG TIN CÁ NHÂN</h1>

                    <div className="bg-white rounded-2xl p-10 shadow-sm max-w-3xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">

                            <InputField label="Họ Và Tên" value={isEditing ? tempInfo.fullName : userInfo.fullName} onChange={(v) => handleChange('fullName', v)} disabled={!isEditing} />

                            <InputField label="Email" type="email" value={isEditing ? tempInfo.email : userInfo.email} onChange={(v) => handleChange('email', v)} disabled={!isEditing} />

                            <InputField label="Số điện thoại" value={isEditing ? tempInfo.phone : userInfo.phone} onChange={(v) => handleChange('phone', v)} disabled={!isEditing} />

                            <InputField label="Ngày sinh" type="date" value={isEditing ? tempInfo.birthDate : userInfo.birthDate} onChange={(v) => handleChange('birthDate', v)} disabled={!isEditing} />

                            <div>
                                <label className="block text-sm text-gray-600 mb-2">Giới tính</label>
                                <select
                                    value={isEditing ? tempInfo.gender : userInfo.gender}
                                    onChange={(e) => handleChange('gender', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-full disabled:bg-gray-50 text-black"
                                >
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <InputField label="Địa chỉ" value={isEditing ? tempInfo.address : userInfo.address} onChange={(v) => handleChange('address', v)} disabled={!isEditing} />
                            </div>
                        </div>

                        <div className="mt-10">
                            {!isEditing ? (
                                <button
                                    onClick={handleEdit}
                                    className="bg-[#3b82f6] hover:bg-blue-700 text-white px-8 py-3 rounded-full transition"
                                >
                                    Cập nhật thông tin
                                </button>
                            ) : (
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="bg-[#3b82f6] hover:bg-blue-700 text-white px-8 py-3 rounded-full disabled:opacity-70"
                                    >
                                        {saving ? "Đang lưu..." : "Lưu thay đổi"}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={saving}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-full disabled:opacity-70"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            )}
                        </div>

                        {showSuccess && (
                            <p className="text-green-600 mt-6 text-center font-medium">
                                ✓ Cập nhật thông tin thành công!
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

function InputField({ label, value, onChange, disabled, type = "text" }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    disabled: boolean;
    type?: string;
}) {
    return (
        <div>
            <label className="block text-sm text-gray-600 mb-2">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full px-4 py-3 border border-gray-300 rounded-full disabled:bg-gray-50 text-black"
            />
        </div>
    );
}