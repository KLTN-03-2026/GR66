import { CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

//Đăng ký , đăng nhập bằng gg
export const handleGoogleSuccess = async (credentialResponse: CredentialResponse,) => {
  console.log("Đăng nhập google thành công", credentialResponse);
  const token = credentialResponse.credential;
  try {
    const res = await fetch("http://localhost:3001/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    console.log("Server response:", data);
    if (res.status === 200 && data.success) {
      localStorage.setItem("accessToken", data.user.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user.user));
    } else {
      throw new Error(data.message || "Đăng nhập Google thất bại");
    }

  }catch (err) {
    console.error("Login failed:", err);
    throw err;
}
};

//Đăng ký bằng cách nhập thông tin cá nhân và mật khẩu
export const handleEmailSignup = async (
  role: string,
  hoten: string,
  email: string,
  password: string,
  sdt: string,
  gioitinh: string,
  diachi: string,
  ngaysinh: string,
  confirmPassword: string
) => {
  if (!email || !password || !hoten || !sdt || !gioitinh || !diachi || !ngaysinh || !confirmPassword) {
    alert("Vui lòng điền đầy đủ thông tin");
    return;
  }
  try {
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }
    const res = await fetch("http://localhost:3001/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role,
        hoten,
        email,
        matkhau: password,
        sdt,
        gioitinh,
        diachi,
        ngaysinh
      }),
    });
    const data = await res.json();
    console.log("Server response:", data);
    if (data.success) {
      alert(data.message); // "Đăng kí thành công"
      window.location.href = "http://localhost:3000/account/login";
    } else {
      alert(data.message || "Đăng ký thất bại");
    }
  } catch (error) {
    console.error("Signup failed:", error);
    alert("Đăng ký thất bại");
    throw error;
  }
}

// đăng nhập bằng email và mật khẩu
export const handleEmailLogin = async (
  email: string,
  password: string,
  rememberMe: boolean,
) => {
  if (!email || !password) {
    alert("Vui lòng điền đầy đủ thông tin");
    return;
  }

  const res = await fetch("http://localhost:3001/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, matkhau: password, rememberMe }),
  });

  const data = await res.json();
  console.log("Server response:", data);

  if (res.ok && data.success) {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));
  } else {
    throw new Error(data.message || "Đăng nhập thất bại");
  }
};

// Đăng nhập lỗi trên gg
export const handleGoogleError =   () => {
  alert("Không có quyền truy cập");
};

// JSON WEB TOKEN 
export const getUserProfile = async () => {
  console.log("getUserProfile đã được gọi");
  const token =localStorage.getItem("accessToken");

  const res = await fetch("http://localhost:3001/api/users/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();
  return data;
};

// kiểm tra token đã hết hạn chưa, 
export const checkTokenExpiration = () => {
  const token = localStorage.getItem("accessToken"); // lấy token từ local storage
  if (!token) return;  // nếu không có token thì không cần kiểm tra gì cả
  try {
    // eslint-disable-next-line
    const decoded: any = jwtDecode(token);  // giải mã token để lấy thông tin bên trong, đặc biệt là exp (thời gian hết hạn)
    const isExpired = decoded.exp * 1000 < Date.now(); // so sánh thời gian hết hạn (exp) với thời gian hiện tại. 

    if (isExpired) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "http://localhost:3000/account/login";
    }
  } catch (err) {
    console.error("Token lỗi:", err);
    localStorage.removeItem("accessToken");
  }
};

// Đăng xuất:
export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  window.location.href = "http://localhost:3000/account/login";   
}


// Cập nhật thông tin cá nhân 
export const updateProfile = async (updateData: {
  hoten?: string;
  email?: string;
  sdt?: string;
  ngaysinh?: string;
  gioitinh?: string;
  diachi?: string;
}) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
      throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
  }

  const res = await fetch("http://localhost:3001/api/users/me", {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
  });

  const responseText = await res.text();   // Đọc raw text trước

  let errorData;
  try {
      errorData = responseText ? JSON.parse(responseText) : {};
  } catch {
      errorData = { message: responseText };
  }

  if (!res.ok) {
      console.error("Backend Error Response:", {
          status: res.status,
          statusText: res.statusText,
          body: errorData
      });
      
      throw new Error(
          errorData.message || 
          errorData.error || 
          `Lỗi server (${res.status}): Cập nhật thất bại`
      );
  }

  const data = responseText ? JSON.parse(responseText) : {};
  return data;
};




