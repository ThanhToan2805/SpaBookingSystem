// Lấy token từ localStorage
export function getToken() {
  return localStorage.getItem("token");
}

// Lưu token vào localStorage
export function setToken(token) {
  localStorage.setItem("token", token);
}

// Xóa token khỏi localStorage
export function removeToken() {
  localStorage.removeItem("token");
}

// Decode JWT payload
export function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

// Lấy role từ token
export function getRoleFromToken(token) {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  // Thử lấy từ standard claim URL
  const roleClaim =
    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  return roleClaim || null;
}

// Kiểm tra token còn hợp lệ không
export function isTokenValid(token) {
  if (!token) return false;
  const payload = decodeToken(token);
  if (!payload) return false;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp && payload.exp > now;
}