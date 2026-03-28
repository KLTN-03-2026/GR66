import { CredentialResponse } from '@react-oauth/google';

export const handleGoogleSuccess = async (
  credentialResponse: CredentialResponse,
  setLoading: (loading: boolean) => void
) => {
  console.log("Đăng nhập google thành công", credentialResponse);

  const token = credentialResponse.credential;

  try {
    setLoading(true);
    const res = await fetch("http://localhost:3001/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();
    console.log("Server response:", data);
    // TODO: Lưu token và redirect

    if(data.success){
        window.location.href = "/";
    }

  } catch (err) {
    console.error("Login failed:", err);
    alert("Đăng nhập Google thất bại");
    throw err;
  } finally {
    setLoading(false);
  }
};

export const handleEmailLogin = async (
  email: string,
  password: string,
  rememberMe: boolean,
  setLoading: (loading: boolean) => void
) => {
  if (!email || !password) {
    alert("Vui lòng điền đầy đủ thông tin");
    return;
  }

  try {
    const res = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, rememberMe }),
    });
    const data = await res.json();
    if (res.ok) {
      console.log("Đăng nhập thành công:", data);
      // TODO: Lưu token và redirect
      return data;
    } else {
      alert(data.message || "Đăng nhập thất bại");
      throw new Error(data.message || "Login failed");
    }
  } catch (err) {
    console.error("Login failed:", err);
    alert("Lỗi kết nối server");
    throw err;
  } 
};

export const handleGoogleError = () => {
  alert("Không có quyền truy cập");
};
