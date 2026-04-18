'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface UserInfo {
    fullName: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: string;
    address: string;
}

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    const [userInfo, setUserInfo] = useState<UserInfo>({
        fullName: "Phạm Văn Bảo",
        email: "baopham9424@gmail.com",
        phone: "0357799435",
        birthDate: "09/04/2004",
        gender: "Nam",
        address: "506 Tôn Dần, Hòa Phát, Thành phố Đà Nẵng",
    });

    const [tempInfo, setTempInfo] = useState<UserInfo>({ ...userInfo });

    // Tạm thời bỏ hết logic localStorage để test
    useEffect(() => {
        // Giả lập tải dữ liệu trong 500ms
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const handleEdit = () => {
        setTempInfo({ ...userInfo });
        setIsEditing(true);
    };

    const handleSave = () => {
        setUserInfo({ ...tempInfo });
        setIsEditing(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2500);
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
                <p className="text-lg text-gray-600">Đang tải...</p>
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
                            <div>
                                <label className="block text-sm text-gray-600 mb-2">Họ Và Tên</label>
                                <input
                                    type="text"
                                    value={isEditing ? tempInfo.fullName : userInfo.fullName}
                                    onChange={(e) => handleChange('fullName', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 disabled:bg-gray-50 text-black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={isEditing ? tempInfo.email : userInfo.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 disabled:bg-gray-50 text-black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-2">Số điện thoại</label>
                                <input
                                    type="tel"
                                    value={isEditing ? tempInfo.phone : userInfo.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 disabled:bg-gray-50 text-black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-2">Ngày Sinh</label>
                                <input
                                    type="text"
                                    value={isEditing ? tempInfo.birthDate : userInfo.birthDate}
                                    onChange={(e) => handleChange('birthDate', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 disabled:bg-gray-50 text-black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-2">Giới tính</label>
                                <select
                                    value={isEditing ? tempInfo.gender : userInfo.gender}
                                    onChange={(e) => handleChange('gender', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 disabled:bg-gray-50 text-black appearance-none"
                                >
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm text-gray-600 mb-2">Địa chỉ</label>
                                <input
                                    type="text"
                                    value={isEditing ? tempInfo.address : userInfo.address}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 disabled:bg-gray-50 text-black"
                                />
                            </div>
                        </div>

                        <div className="mt-10">
                            {!isEditing ? (
                                <button
                                    onClick={handleEdit}
                                    className="bg-[#3b82f6] hover:bg-blue-600 text-white px-8 py-3 rounded-full transition font-medium"
                                >
                                    Cập nhật
                                </button>
                            ) : (
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleSave}
                                        className="bg-[#3b82f6] hover:bg-blue-600 text-white px-8 py-3 rounded-full transition font-medium"
                                    >
                                        Cập nhật
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-full transition font-medium"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            )}
                        </div>

                        {showSuccess && (
                            <p className="text-green-600 font-medium mt-4 text-center">Cập nhật thành công</p>
                        )}
                    </div>z
                </div>
            </div>

            <Footer />
        </>
    );
}