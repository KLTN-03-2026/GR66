"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const services = [
  {
    title: "Tour và trải nghiệm",
    icon: "/ss1.png",
  },
  {
    title: "Vé tham quan",
    icon: "/ss2.png",
  },
  {
    title: "Di chuyển",
    icon: "/ss3.png",
  },
  {
    title: "Nơi ở",
    icon: "/ss4.png",
  },
  {
    title: "Mục khác",
    icon: "/ss5.png",
  },
];

const ServiceSection = () => {
  return (
    <section className="w-full bg-white py-12">
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-xl text-black md:text-2xl font-semibold uppercase tracking-wide">
          CÁC DỊCH VỤ HIỆN CÓ
        </h2>
      </div>

      {/* Service Grid */}
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="border-2 border-gray-300 rounded-md flex flex-col items-center justify-center min-h-[160px] py-10 px-8 cursor-pointer transition hover:shadow-md hover:scale-105"
            >
              {/* Icon */}
              <div className="mb-3 w-[70px] h-[70px] relative">
                  <Image
                    src={service.icon}
                    alt={service.title}
                    fill
                    className="object-contain"
                  />
              </div>

              {/* Title */}
              <p className="text-sm text-gray-700 text-center">
                {service.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;