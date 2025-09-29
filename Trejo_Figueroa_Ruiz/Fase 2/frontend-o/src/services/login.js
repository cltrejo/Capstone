/** login.js
const handleLogin = async () => {
  const res = await fetch("http://localhost:8000/api/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("token", data.token); // o sessionStorage
    window.location.href = "/home"; // redirigir
  } else {
    alert("Credenciales inválidas");
  }
}; */