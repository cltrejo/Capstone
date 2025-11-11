import endpoints from "../api";

export const isAuthenticated = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const { data } = await endpoints.auth.verifyToken(token);

    if (data.valid) {
      // Opcional: guardar usuario
      localStorage.setItem("username", data.user);
      return true;
    } else {
      localStorage.removeItem("token");
      return false;
    }

  } catch (error) {
    console.error("❌ Error verificando token:", error);
    localStorage.removeItem("token");
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