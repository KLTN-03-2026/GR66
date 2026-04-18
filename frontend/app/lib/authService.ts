import { CredentialResponse } from '@react-oauth/google';
<<<<<<< HEAD
import { debug } from 'node:util';
=======
import { jwtDecode } from "jwt-decode";
>>>>>>> master

//Đăng ký , đăng nhập bằng gg
export const handleGoogleSuccess = async (credentialResponse: CredentialResponse,) => {
  console.log("Đăng nhập google thành công", credentialResponse);
<<<<<<< HEAD

  const token = credentialResponse.credential;

=======
  const token = credentialResponse.credential;
>>>>>>> master
  try {
    const res = await fetch("http://localhost:3001/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
<<<<<<< HEAD

    const data = await res.json();
    console.log("Server response:", data);
    // TODO: Lưu token và redirect làm sau

    if(data.success){
        window.location.href = "/";
=======
    const data = await res.json();
    console.log("Server response:", data);
    if(data.success){
      localStorage.setItem("accessToken", data.user.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user.user));
      window.location.href = "/";
>>>>>>> master
    }

  } catch (err) {
    console.error("Login failed:", err);
    alert("Đăng nhập Google thất bại");
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
<<<<<<< HEAD

=======
>>>>>>> master
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

<<<<<<< HEAD

=======
>>>>>>> master
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
  try {
    const res = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ 
        email, 
        matkhau: password, 
        rememberMe 
      }),
    });

    console.log("URL thực tế:", res.url); // test url gửi đi
    const data = await res.json(); //Lấy dữ liệu JSON mà server trả về → chuyển thành object JavaScript.
    console.log("Response từ server:", data);
    if (res.status === 200) { //mỗi response đều có status code (mã trạng thái):
     // alert ("Đăng nhập thành công");
      console.log("Đăng nhập thành công:", data);
    if(data.success){
        localStorage.setItem("accessToken", data.accessToken);
<<<<<<< HEAD
=======
        localStorage.setItem("user", JSON.stringify(data.user));
>>>>>>> master
        window.location.href = "/";
    }
      // TODO: Lưu token và redirect làm sau
    } else {
      alert(data.message || "Đăng nhập thất bại");
      throw new Error(data.message || "Login failed");
    }
<<<<<<< HEAD

    
=======
>>>>>>> master
  } catch (err) {
    console.error("Login failed:", err);
  } 
};

<<<<<<< HEAD
=======
// Đăng nhập lỗi trên gg
>>>>>>> master
export const handleGoogleError =   () => {
  alert("Không có quyền truy cập");
};

<<<<<<< HEAD

// JSON WEB TOKEN 
export const getUserProfile = async () => {
  console.log("getUserProfile đã được gọi");
  const token = localStorage.getItem("accessToken");
=======
// JSON WEB TOKEN 
export const getUserProfile = async () => {
  console.log("getUserProfile đã được gọi");
  const token =localStorage.getItem("accessToken");
>>>>>>> master

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

<<<<<<< HEAD
=======
// kiểm tra token đã hết hạn chưa, 
export const checkTokenExpiration = () => {
  const token = localStorage.getItem("accessToken"); // lấy token từ local storage
  if (!token) return;  // nếu không có token thì không cần kiểm tra gì cả
  try {
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




>>>>>>> master
