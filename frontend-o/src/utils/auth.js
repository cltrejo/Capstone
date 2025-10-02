export const isAuthenticated = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const res = await fetch("http://localhost:8000/api/verify-token/", {
      method: "POST",
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json"
      },
    });

    if (!res.ok) return false;

    const data = await res.json();
    return data.valid; // true o false
  } catch (error) {
    console.error("Error verificando token:", error);
    return false;
  }
};
/** auth.js
export const isAuthenticated = () => {
  return !!localStorage.getItem("token"); // true si existe token
};

export const isAuthenticated = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const response = await fetch("http://localhost:8000/api/verify-token/", {
      method: "POST",
      headers: {
        "Authorization": `Token ${token}`
      }
    });

    if (response.ok) {
      return true;
    } else {
      localStorage.removeItem("token"); // 👈 elimina si no es válido
      return false;
    }
  } catch (err) {
    localStorage.removeItem("token");
    console.error(err)
    return false;
  }
}; */