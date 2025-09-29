import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAuthenticated }from './auth'

export default function PrivateRoute({ children }) {
  const [auth, setAuth] = useState(null); // null = cargando, true/false = resultado

  useEffect(() => {
    const checkAuth = async () => {
      const result = await isAuthenticated();
      setAuth(result);
    };
    checkAuth();
  }, []);

  if (auth === null) {
    return <div>Verificando sesión...</div>; // loader provisional
  }

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
/**
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth";

export default function PrivateRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

 
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth";

export default function PrivateRoute({ children }) {
  const [isValid, setIsValid] = useState(null); // null = cargando

  useEffect(() => {
    (async () => {
      const valid = await isAuthenticated();
      setIsValid(valid);
    })();
  }, []);

  if (isValid === null) {
    return <p>Verificando sesión...</p>; // loading mientras valida
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
*/
