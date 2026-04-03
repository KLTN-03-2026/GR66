"use client";

import React from "react";
import Image from "next/image";

const reasons = [
  {
    title: "Hỗ trợ từng bước",
    desc: "Đội ngũ chăm sóc hành trình của chúng tôi luôn đồng hành cùng bạn trước, trong và sau chuyến đi, đảm bảo mọi trải nghiệm diễn ra suôn sẻ và trọn vẹn nhất.",
    icon: "/R1.jpg",
  },
  {
    title: "Trải nghiệm chân thực",
    desc: "Đội ngũ hướng dẫn viên và chuyên gia du lịch của chúng tôi được tuyển chọn kỹ lưỡng để mang đến những trải nghiệm đích thực, giúp điểm đến của bạn sống động hơn bằng sự tận tâm và niềm đam mê.",
    icon: "/R2.jpg",
  },
  {
    title: "Du lịch có trách nhiệm",
    desc: "Những hành trình cao cấp của chúng tôi được xây dựng dựa trên các nguyên tắc du lịch bền vững, ưu tiên những trải nghiệm vừa tốt cho bạn, vừa tốt cho hành tinh.",
    icon: "/R3.jpg",
  },
];

const ReasonSection = () => {
  return (
    <section className="py-24 bg-blue-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Tiêu đề */}
        <h2 className="text-center text-4xl md:text-5xl font-serif text-gray-900 mb-16">
          Vì sao bạn nên chọn chúng tôi?
        </h2>

        {/* 3 cột */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="group text-center transition-all duration-500 hover:-translate-y-3"
            >
              {/* Icon + hiệu ứng phóng to nhẹ */}
              <div className="mb-10 flex justify-center">
                <div className="relative w-48 h-48 transition-all duration-700 hover:scale-110">
                  <Image
                    src={reason.icon}
                    alt={reason.title}
                    fill
                    className="object-contain drop-shadow-lg transition-all duration-700 group-hover:drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Tiêu đề */}
              <h3 className="text-2xl font-serif text-gray-900 mb-5 transition-colors group-hover:text-amber-700">
                {reason.title}
              </h3>

              {/* Mô tả */}
              <p className="text-gray-700 leading-relaxed max-w-sm mx-auto px-4 transition-colors group-hover:text-gray-900">
                {reason.desc}
              </p>

              {/* Đường gạch vàng nhỏ khi hover */}
              <div className="mt-6 h-0.5 bg-amber-600 w-16 mx-auto scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReasonSection;