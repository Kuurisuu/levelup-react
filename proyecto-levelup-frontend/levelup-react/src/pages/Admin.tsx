import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

const Admin: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/admin/usuarios", { replace: true });
  }, [navigate]);

  return null;
};

export default Admin;
