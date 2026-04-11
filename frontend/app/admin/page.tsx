export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Chào buổi sáng, Tài khoản Demo</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: "THÀNH VIÊN", value: "5", icon: "👤" },
          { label: "THÀNH VIÊN", value: "5", icon: "👤" },
          { label: "THÀNH VIÊN", value: "5", icon: "👤" },
          { label: "THÀNH VIÊN", value: "5", icon: "👤" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl p-8 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-3xl">
              {stat.icon}
            </div>
            <div>
              <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-500 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Hoạt động gần đây */}
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <h3 className="text-xl font-semibold mb-6">Hoạt động gần đây</h3>
        
        <div className="bg-gray-50 rounded-2xl p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            🔍
          </div>
          <p className="text-gray-500">Không tìm thấy dữ liệu để hiện thị</p>
        </div>
      </div>
    </div>
  );
}