const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api/tours";

export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method: "GET",
    credentials: "include",
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Lỗi gọi API");
  }

  return json.data;
}

export async function apiPost<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || json.message || "Lỗi gọi API");
  }

  return json.data;
}

export async function apiPut<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || json.message || "Lỗi gọi API");
  }

  return json.data;
}

export async function apiDelete<T>(url: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method: "DELETE",
    credentials: "include",
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || json.message || "Lỗi gọi API");
  }

  return json.data;
}