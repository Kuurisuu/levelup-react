import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface UserSession {
  displayName?: string;
  loginAt?: number;
  userId?: string;
  id?: string;
  role?: string;
  duocMember?: boolean;
  email?: string;
  apellidos?: string;
  region?: string;
  comuna?: string;
  telefono?: string;
  direccion?: string;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false 
}: ProtectedRouteProps): React.JSX.Element {
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthorization = (): void => {
      try {
        const rawSession = localStorage.getItem("lvup_user_session");
        const authToken = localStorage.getItem("auth_token");

        // Si no hay sesión ni token, no está autenticado
        if (!rawSession && !authToken) {
          setIsAuthorized(false);
          return;
        }

        // Si solo requiere autenticación (no admin)
        if (!requireAdmin) {
          setIsAuthorized(true);
          return;
        }

        // Si requiere admin, verificar rol
        if (rawSession) {
          try {
            const session: UserSession = JSON.parse(rawSession);
            const userRole = session.role?.toUpperCase() || "";
            
            // Verificar si es admin (el backend usa "ADMINISTRADOR" según el enum TipoUsuario)
            if (userRole === "ADMINISTRADOR" || userRole === "ADMIN") {
              setIsAuthorized(true);
              return;
            }
          } catch (parseError) {
            console.error("Error al parsear sesión:", parseError);
          }
        }

        // Si llegamos aquí, no es admin
        setIsAuthorized(false);
      } catch (error) {
        console.error("Error al verificar autorización:", error);
        setIsAuthorized(false);
      }
    };

    checkAuthorization();
  }, [requireAdmin, location.pathname]);

  // Mostrar nada mientras se verifica
  if (isAuthorized === null) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <p>Cargando...</p>
      </div>
    );
  }

  // Si no está autorizado, redirigir
  if (!isAuthorized) {
    if (requireAdmin) {
      // Si requiere admin y no lo es, redirigir a home con mensaje
      return <Navigate to="/" state={{ from: location, message: "Acceso denegado. Solo administradores pueden acceder a esta sección." }} replace />;
    } else {
      // Si no está autenticado, redirigir a login
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  // Si está autorizado, renderizar el componente hijo
  return <>{children}</>;
}

