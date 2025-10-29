import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

// Redirect /admin to /admin/usuarios so the admin entry point opens the Users management
const Admin: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/admin/usuarios", { replace: true });
  }, [navigate]);

  return null; // redirect only
};

export default Admin;
