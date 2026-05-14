'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PaymentPage: React.FC = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isPaid, setIsPaid] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 phút = 600 giây

  const tourId = "TOUR123456"; // ← Mã ID tour (sẽ thay đổi theo tour thực tế)

  // Lấy ngày hiện tại để hiển thị ở phần "Ngày"
  const currentDate = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Thông tin thanh toán
  const paymentInfo = {
    bank: 'MB BANK - CN Đà Nẵng',
    accountNumber: '0942843497',
    accountName: 'CÔNG TY TNHH ĐTU TRAVEL',
    tour: 'Vé Cáp Treo Sun World Ba Na Hills Đà Nẵng',
    amount: 2000000,
    memo: tourId, // Nội dung chuyển khoản = mã tour ID
  };

  // Tạo nội dung QR VietQR (định dạng đơn giản)
  const generateQRContent = () => {
    return `https://qr.vietqr.io/${paymentInfo.accountNumber}?amount=${paymentInfo.amount}&memo=${encodeURIComponent(paymentInfo.memo)}`;
  };

  // Generate QR Code
  useEffect(() => {
    const content = generateQRContent();
    QRCode.toDataURL(content, {
      width: 280,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('QR generate error:', err));
  }, []);

  // Giả lập đếm ngược và kiểm tra thanh toán
  useEffect(() => {
    if (isPaid) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error('Hết thời gian thanh toán. Vui lòng thử lại!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaid]);

  // Hàm giả lập thanh toán thành công
  const simulatePaymentSuccess = () => {
    setIsPaid(true);
    toast.success('Thanh toán thành công! Cảm ơn bạn đã đặt tour.', {
      duration: 5000,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <Toaster position="top-center" />

        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="text-center pt-8 pb-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">Thanh toán Tour</h1>
            <p className="text-gray-600 mt-2">Vui lòng chọn phương thức thanh toán</p>
          </div>

          {/* Tab chọn phương thức */}
          <div className="flex border-b">
            <button className="flex-1 py-4 font-medium border-b-2 border-blue-600 text-blue-600 bg-white">
              Chuyển khoản QR
            </button>
            <button className="flex-1 py-4 font-medium text-gray-400 hover:text-gray-600 transition">
              Ví điện tử
              <span className="text-xs block text-gray-400">Momo</span>
            </button>
          </div>

          {/* Nội dung QR */}
          <div className="p-6">
            <div className="text-center mb-6">
              <p className="text-lg font-semibold text-gray-800">Quét mã QR để thanh toán</p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-white border-8 border-white shadow-lg rounded-2xl">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="QR Code thanh toán"
                    className="w-64 h-64"
                  />
                ) : (
                  <div className="w-64 h-64 bg-gray-100 flex items-center justify-center rounded-xl">
                    Đang tạo QR...
                  </div>
                )}
              </div>
            </div>

            {/* Thông tin tài khoản - GIỮ NGUYÊN HOÀN TOÀN */}
            <div className="bg-gray-50 rounded-2xl p-5 space-y-4 text-sm text-black">
              <div className="flex justify-between">
                <span className="text-gray-500">Ngân hàng</span>
                <span className="font-medium text-right">{paymentInfo.bank}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Số tài khoản</span>
                <span className="font-medium font-mono">{paymentInfo.accountNumber}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Chủ tài khoản</span>
                <span className="font-medium text-right">{paymentInfo.accountName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Tour</span>
                <span className="font-medium text-right text-gray-800">{paymentInfo.tour}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Ngày</span>
                <span className="font-medium text-blue-600">{currentDate}</span>   {/* ← Sửa thành ngày hiện tại */}
              </div>
              
              <div className="flex justify-between border-t pt-4">
                <span className="text-gray-500">Nội dung chuyển khoản</span>
                <span className="font-medium text-blue-600">{paymentInfo.memo}</span>   {/* ← Giữ nguyên mã tour */}
              </div>
            </div>

            {/* Số tiền cần thanh toán */}
            <div className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 text-center">
              <p className="text-sm opacity-90">Số tiền cần thanh toán</p>
              <p className="text-4xl font-bold mt-1 tracking-tight">
                {formatCurrency(paymentInfo.amount)}
              </p>
              <p className="text-xs mt-2 opacity-75">2 người lớn • 1 trẻ em</p>
            </div>

            {/* Thời gian còn lại */}
            {!isPaid && countdown > 0 && (
              <div className="mt-6 text-center text-sm text-gray-500">
                Thời gian còn lại để thanh toán: 
                <span className="font-semibold text-red-600 ml-1">
                  {formatTime(countdown)}
                </span>
              </div>
            )}

            {/* Nút giả lập thanh toán (chỉ để test) */}
            
          </div>

          
          <div className="bg-gray-50 border-t px-6 py-5 text-center text-xs text-gray-500">
            Sau khi thanh toán thành công chúng tôi sẽ liên hệ xác nhận trong vòng 10 phút
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentPage;