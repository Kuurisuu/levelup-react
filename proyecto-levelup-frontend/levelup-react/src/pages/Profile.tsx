import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";
import { REGIONES } from "../utils/regiones";
import { UsuarioService } from "../services/api/usuario";
import AvatarSection from "../components/Profile/AvatarSection";
import PersonalInfoForm from "../components/Profile/PersonalInfoForm";
import PointsSection from "../components/Profile/PointsSection";
import SettingsSection from "../components/Profile/SettingsSection";

type UserData = {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  region: string;
  comuna: string;
  direccion: string;
  avatar: string | null;
  referralCode?: string;
  points?: number;
};

const Profile = () => {
  const navigate = useNavigate();
  const originalRef = useRef<UserData | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  // Estado para los datos del usuario
  const [userData, setUserData] = useState<UserData>({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    fechaNacimiento: "",
    region: "",
    comuna: "",
    direccion: "",
    avatar: null,
    referralCode: "",
    points: 0,
  });

  // User id para display/copy
  const [userId, setUserId] = useState<string | null>(null);
  const [copyMsg, setCopyMsg] = useState<string | null>(null);
  const [copyMsgReferral, setCopyMsgReferral] = useState<string | null>(null);

  // Estado para modo edicion
  const [isEditing, setIsEditing] = useState(false);

  // Estado para loading
  const [isLoading, setIsLoading] = useState(true);

  // Estado para errores (campos del profile)
  const [errors, setErrors] = useState<Record<string, string>>({});

  type PersonalErrors = Partial<Record<keyof UserData | "general", string>>;

  const validatePersonalInfo = (
    data: UserData
  ): { valid: boolean; errors: PersonalErrors } => {
    const e: PersonalErrors = {};

    // Nombre
    if (!data.nombre || !data.nombre.trim())
      e.nombre = "El nombre es requerido";
    else if (data.nombre.trim().length < 2)
      e.nombre = "El nombre debe tener al menos 2 caracteres";

    // Apellidos
    if (!data.apellidos || !data.apellidos.trim())
      e.apellidos = "Los apellidos son requeridos";
    else if (data.apellidos.trim().length < 2)
      e.apellidos = "Los apellidos deben tener al menos 2 caracteres";

    // Email obligatorio y dominio
    if (!data.email || !data.email.trim()) e.email = "El email es requerido";
    else {
      const email = data.email.trim();
      const basic = /\S+@\S+\.\S+/.test(email);
      if (!basic) e.email = "El email no es válido";
      else if (!email.endsWith("@duoc.cl") && !email.endsWith("@gmail.com")) {
        e.email = "El email debe pertenecer a @duoc.cl o @gmail.com";
      }
    }

    // FechaNacimiento
    if (!data.fechaNacimiento)
      e.fechaNacimiento = "La fecha de nacimiento es requerida";
    else {
      const today = new Date();
      const birth = new Date(data.fechaNacimiento);
      const age = today.getFullYear() - birth.getFullYear();
      if (age < 18) e.fechaNacimiento = "Debes ser mayor de 18 años";
    }

    // Region y comuna
    if (!data.region) e.region = "Selecciona una región";
    if (!data.comuna) e.comuna = "Selecciona una comuna";

    // Telefono (optional but validate if present)
    if (data.telefono && !/^\+?[0-9\s-()]+$/.test(data.telefono)) {
      e.telefono = "Formato de teléfono inválido";
    }

    const valid = Object.keys(e).length === 0;
    return { valid, errors: e };
  };

  // Campos validados individualmente (true = válido)
  const [validFields, setValidFields] = useState<Record<string, boolean>>({});
  const requiredFields = [
    "nombre",
    "apellidos",
    "email",
    "fechaNacimiento",
    "region",
    "comuna",
  ];

  const labelClass = (name: string) => {
    if (!isEditing) return "";
    if (errors[name]) return "label invalid";
    if (validFields[name]) return "label valid";
    return "label";
  };

  // Label class para password change
  const labelClassPwd = (name: string) => {
    const active = changingPassword || isEditing;
    if (!active) return "";
    if ((pwdErrors as any)[name]) return "label invalid";
    if (validFields[name]) return "label valid";
    return "label";
  };

  const validateField = (name: string, value: string): string | undefined => {
    const v = value?.toString() || "";
    switch (name) {
      case "nombre":
        if (!v.trim()) return "El nombre es requerido";
        if (v.trim().length < 2)
          return "El nombre debe tener al menos 2 caracteres";
        return undefined;
      case "apellidos":
        if (!v.trim()) return "Los apellidos son requeridos";
        if (v.trim().length < 2)
          return "Los apellidos deben tener al menos 2 caracteres";
        return undefined;
      case "email":
        if (!v.trim()) return "El email es requerido";
        if (!/\S+@\S+\.\S+/.test(v)) return "El email no es válido";
        if (!v.endsWith("@duoc.cl") && !v.endsWith("@gmail.com"))
          return "El email debe pertenecer a @duoc.cl o @gmail.com";
        return undefined;
      case "fechaNacimiento":
        if (!v) return "La fecha de nacimiento es requerida";
        {
          const today = new Date();
          const birth = new Date(v);
          const age = today.getFullYear() - birth.getFullYear();
          if (age < 18) return "Debes ser mayor de 18 años";
        }
        return undefined;
      case "region":
        if (!v) return "Selecciona una región";
        return undefined;
      case "comuna":
        if (!v) return "Selecciona una comuna";
        return undefined;
      case "telefono":
        if (v && !/^\+?[0-9\s-()]+$/.test(v))
          return "Formato de teléfono inválido";
        return undefined;
      case "direccion":
        // optional
        return undefined;
      default:
        return undefined;
    }
  };

  const handleFieldBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    const err = validateField(name, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (err) next[name] = err;
      else delete next[name];
      return next;
    });
    const isRequired = requiredFields.includes(name);
    const hasValue =
      value !== undefined && value !== null && (value + "").trim() !== "";
    const isValid = !err && (isRequired ? true : hasValue ? true : false);
    setValidFields((prev) => ({ ...prev, [name]: isValid }));
  };

  // Estado para el historial de pedidos
  const [orderHistory, setOrderHistory] = useState([]);
  // Accordions
  const [openSection, setOpenSection] = useState<string>("personal");
  // Save guard message
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  // Saving indicator for simulated backend
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Change password mode
  const [changingPassword, setChangingPassword] = useState(false);
  const [pwdFields, setPwdFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwdErrors, setPwdErrors] = useState<Record<string, string>>({});

  // Cargar datos del usuario al montar componente
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      const rawSession = localStorage.getItem("lvup_user_session");
      if (!rawSession) {
        setIsLoading(false);
        return;
      }

      let session: any = null;
      try {
        session = JSON.parse(rawSession);
      } catch {
        session = null;
      }

      let data: UserData | null = null;
      let userIdentifier: string | null = session?.userId ?? null;

      try {
        const response = await UsuarioService.getPerfil();
        const perfil = response.data;
        let fechaNac = "";
        if (perfil.fechaNacimiento) {
          const rawFecha = perfil.fechaNacimiento as string;
          fechaNac = rawFecha.length >= 10 ? rawFecha.substring(0, 10) : rawFecha;
        }

        data = {
          nombre: perfil.nombre || perfil.nombreCompleto || "",
          apellidos: perfil.apellido || "",
          email: perfil.correo || "",
          telefono: perfil.telefono || "",
          fechaNacimiento: fechaNac,
          region: perfil.region || "",
          comuna: perfil.comuna || "",
          direccion: perfil.direccion || "",
          avatar: perfil.avatarUrl || null,
          referralCode: perfil.codigoReferido || "",
          points: typeof perfil.puntosLevelUp === "number" ? perfil.puntosLevelUp : 0,
        };

        if (perfil.idUsuario) {
          userIdentifier = perfil.idUsuario.toString();
        }

        // Persistir datos completos en localStorage para reutilizarlos
        const usersRaw = localStorage.getItem("lvup_users");
        const users = usersRaw ? JSON.parse(usersRaw) : [];
        const payload = {
          id: perfil.idUsuario,
          nombre: data.nombre,
          apellidos: data.apellidos,
          email: data.email,
          telefono: data.telefono,
          fechaNacimiento: data.fechaNacimiento,
          region: data.region,
          comuna: data.comuna,
          direccion: data.direccion,
          avatar: data.avatar,
          referralCode: data.referralCode,
          points: data.points,
        };

        const idx = users.findIndex(
          (u: any) => (u.id || u.idUsuario) === perfil.idUsuario
        );
        if (idx >= 0) {
          users[idx] = { ...users[idx], ...payload };
        } else {
          users.push(payload);
        }
        localStorage.setItem("lvup_users", JSON.stringify(users));
      } catch (apiError) {
        console.error("No se pudo cargar el perfil desde la API:", apiError);
        // Fallback a información persistida en localStorage
        const usersRaw = localStorage.getItem("lvup_users");
        const users = usersRaw ? JSON.parse(usersRaw) : [];
        const found =
          users.find((u: any) => u.id === session?.userId) || session || {};

        data = {
          nombre: found.nombre || found.displayName || "",
          apellidos: found.apellidos || found.apellido || "",
          email: found.email || "",
          telefono: found.telefono || "",
          fechaNacimiento: found.fechaNacimiento || "",
          region: found.region || "",
          comuna: found.comuna || "",
          direccion: found.direccion || "",
          avatar: found.avatar || null,
          referralCode:
            found.referralCode ||
            (session && (session.referralCode as string)) ||
            "",
          points:
            typeof found.points === "number"
              ? found.points
              : (session && (session.points as number)) || 0,
        };
      } finally {
        if (data) {
          setUserData(data);
          originalRef.current = data;
        }
        setUserId(userIdentifier ? userIdentifier.toString() : null);
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleCopyId = async () => {
    const id = userId || "";
    try {
      if (navigator && (navigator as any).clipboard && id) {
        await (navigator as any).clipboard.writeText(id.toString());
        setCopyMsg("Copiado");
        setTimeout(() => setCopyMsg(null), 1200);
      }
    } catch {
      setCopyMsg("No se pudo copiar");
      setTimeout(() => setCopyMsg(null), 1200);
    }
  };

  const handleCopyReferral = async () => {
    const code = userData.referralCode || "";
    try {
      if (navigator && (navigator as any).clipboard && code) {
        await (navigator as any).clipboard.writeText(code.toString());
        setCopyMsgReferral("Copiado");
        setTimeout(() => setCopyMsgReferral(null), 1200);
      }
    } catch {
      setCopyMsgReferral("No se pudo copiar");
      setTimeout(() => setCopyMsgReferral(null), 1200);
    }
  };

  // Manejar cambios en los inputs (inputs, selects, textarea)
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setUserData((prev) => ({ ...prev, [name]: value }));

    // Validar en typing (live)
    const err = validateField(name, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (err) next[name] = err;
      else delete next[name];
      return next;
    });
    const isRequired = requiredFields.includes(name);
    const hasValue =
      value !== undefined && value !== null && (value + "").trim() !== "";
    const isValid = !err && (isRequired ? true : hasValue ? true : false);
    setValidFields((prev) => ({ ...prev, [name]: isValid }));
  };

  // Manejar cambio de avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // result is a data URL (base64)
        setUserData((prev) => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClickChangeAvatar = () => {
    avatarInputRef.current?.click();
  };

  const handleRemoveAvatar = () => {
    setUserData((prev) => ({ ...prev, avatar: null }));
  };

  // Guardar cambios del perfil
  const handleSaveProfile = async () => {
    try {
      // Mostrar indicador de guardado (simular backend)
      setIsSaving(true);
      setSaveMessage("Guardando...");
      // Delay artificial para simular trabajo de backend
      await new Promise((res) => setTimeout(res, 900));

      // Validar antes de guardar
      const { valid, errors: valErrors } = validatePersonalInfo(userData);
      if (!valid) {
        setErrors(valErrors as Record<string, string>);
        setSaveMessage("Corrige los errores antes de guardar.");
        // Mantener en modo edición abierto
        setIsEditing(true);
        return;
      }
      setSaveMessage(null);
      // Guardar cambios en localStorage como demo (mejor en API en producción)
      const raw = localStorage.getItem("lvup_user_session");
      if (raw) {
        const session = JSON.parse(raw);
        // actualizar lvup_users si existe
        const usersRaw = localStorage.getItem("lvup_users");
        const users = usersRaw ? JSON.parse(usersRaw) : [];
        const idx = users.findIndex((u: any) => u.id === session.userId);
        if (idx >= 0) {
          users[idx] = { ...users[idx], ...userData };
          localStorage.setItem("lvup_users", JSON.stringify(users));
          // También actualizar la sesión para que el encabezado u otras partes que lean la sesión vean el último avatar/información
          try {
            const newSession = { ...session, ...userData };
            localStorage.setItem(
              "lvup_user_session",
              JSON.stringify(newSession)
            );
            // Notificar a otras partes de la app sobre el cambio de sesión
            try {
              window.dispatchEvent(
                new CustomEvent("lvup:login", { detail: newSession })
              );
            } catch {}
          } catch {}
        } else {
          // No encontrado en users, solo actualizar session
          const newSession = { ...session, ...userData };
          localStorage.setItem("lvup_user_session", JSON.stringify(newSession));
          try {
            window.dispatchEvent(
              new CustomEvent("lvup:login", { detail: newSession })
            );
          } catch {}
        }
      }
      // Actualizar snapshot original
      originalRef.current = { ...userData };
      setIsEditing(false);
      // Mensaje de éxito brevemente
      setSaveMessage("Guardado");
      setTimeout(() => setSaveMessage(null), 1200);
    } catch (err) {
      // Manejar error
      setSaveMessage("Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  // Validar campos de cambio de contraseña
  const validatePasswordFields = () => {
    const e: Record<string, string> = {};
    const { currentPassword, newPassword, confirmPassword } = pwdFields;
    if (!currentPassword) e.currentPassword = "Ingresa tu contraseña actual";
    if (!newPassword) e.newPassword = "La nueva contraseña es requerida";
    else if (newPassword.length < 4 || newPassword.length > 10)
      e.newPassword = "La contraseña debe tener entre 4 y 10 caracteres";
    if (!confirmPassword) e.confirmPassword = "Confirma la contraseña";
    else if (newPassword !== confirmPassword)
      e.confirmPassword = "Las contraseñas no coinciden";
    return e;
  };

  const validatePasswordFieldsFor = (fields: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const e: Record<string, string> = {};
    const { currentPassword, newPassword, confirmPassword } = fields;
    if (!currentPassword) e.currentPassword = "Ingresa tu contraseña actual";
    if (!newPassword) e.newPassword = "La nueva contraseña es requerida";
    else if (newPassword.length < 4 || newPassword.length > 10)
      e.newPassword = "La contraseña debe tener entre 4 y 10 caracteres";
    if (!confirmPassword) e.confirmPassword = "Confirma la contraseña";
    else if (newPassword !== confirmPassword)
      e.confirmPassword = "Las contraseñas no coinciden";
    return e;
  };

  const handlePwdChangeSubmit = () => {
    const errs = validatePasswordFields();
    setPwdErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Verificar contraseña actual
    const sessionRaw = localStorage.getItem("lvup_user_session");
    if (!sessionRaw) {
      setPwdErrors({ general: "No hay sesión activa" });
      return;
    }
    const session = JSON.parse(sessionRaw);
    const usersRaw = localStorage.getItem("lvup_users");
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const idx = users.findIndex((u: any) => u.id === session.userId);
    if (idx < 0) {
      setPwdErrors({ general: "Usuario no encontrado" });
      return;
    }
    if (users[idx].password !== pwdFields.currentPassword) {
      setPwdErrors({ currentPassword: "Contraseña actual incorrecta" });
      return;
    }

    // Actualizar contraseña
    users[idx].password = pwdFields.newPassword;
    localStorage.setItem("lvup_users", JSON.stringify(users));
    // Reiniciar estado
    setChangingPassword(false);
    setPwdFields({ currentPassword: "", newPassword: "", confirmPassword: "" });
    alert("Contraseña actualizada correctamente");
  };

  const handleDeleteAccount = () => {
    const ok = window.confirm(
      "¿Estás seguro de que quieres borrar la cuenta? Esta acción es irreversible."
    );
    if (!ok) return;
    const sessionRaw = localStorage.getItem("lvup_user_session");
    if (!sessionRaw) return;
    const session = JSON.parse(sessionRaw);
    const usersRaw = localStorage.getItem("lvup_users");
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const newUsers = users.filter((u: any) => u.id !== session.userId);
    localStorage.setItem("lvup_users", JSON.stringify(newUsers));
    localStorage.removeItem("lvup_user_session");
    alert("Cuenta eliminada. Serás redirigido al inicio.");
    window.location.href = "/";
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setIsEditing(false);
    // Restaurar datos originales
    if (originalRef.current) {
      setUserData(originalRef.current);
    }
  };

  // Cuando entramos en modo editar perfil, validar todos los campos obligatorios inmediatamente
  // Al salir del modo edición (guardar o cancelar) limpiar el estado de validación para dejarlos neutrales
  useEffect(() => {
    const personalKeys = [
      "nombre",
      "apellidos",
      "email",
      "fechaNacimiento",
      "region",
      "comuna",
    ];

    if (isEditing) {
      const { errors: valErrors } = validatePersonalInfo(userData);

      setErrors((prev) => ({ ...prev, ...valErrors }));

      // marcar campos válidos/ inválidos
      setValidFields((prev) => ({
        ...prev,
        nombre: !valErrors.nombre,
        apellidos: !valErrors.apellidos,
        email: !valErrors.email,
        fechaNacimiento: !valErrors.fechaNacimiento,
        region: !valErrors.region,
        comuna: !valErrors.comuna,
      }));
    } else {
      // limpiar errores y validFlags solo para campos personales
      setErrors((prev) => {
        const next = { ...prev } as Record<string, string>;
        personalKeys.forEach((k) => delete next[k]);
        return next;
      });

      setValidFields((prev) => {
        const next = { ...prev } as Record<string, boolean>;
        personalKeys.forEach((k) => {
          if (k in next) next[k] = false;
        });
        return next;
      });
    }
  }, [isEditing]);

  // cuando cambiamos a modo cambiar contraseña, mantenemos el panel settings abierto
  useEffect(() => {
    if (changingPassword) {
      setOpenSection("settings");
    }
  }, [changingPassword]);

  // validación en tiempo real para campos de contraseña cuando se esta editando contraseña
  useEffect(() => {
    if (!changingPassword) return;

    const anyTyped =
      (pwdFields.currentPassword && pwdFields.currentPassword.length > 0) ||
      (pwdFields.newPassword && pwdFields.newPassword.length > 0) ||
      (pwdFields.confirmPassword && pwdFields.confirmPassword.length > 0);

    if (!anyTyped) {
      setPwdErrors({});
      setValidFields((prev) => ({
        ...prev,
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
      }));
      return;
    }

    const errs = validatePasswordFieldsFor(pwdFields);
    setPwdErrors(errs);

    // actualizar validFields para que labelClassPwd y estilos de inputs muestren correcto/incorrecto
    setValidFields((prev) => ({
      ...prev,
      currentPassword: !errs.currentPassword && !!pwdFields.currentPassword,
      newPassword: !errs.newPassword && !!pwdFields.newPassword,
      confirmPassword: !errs.confirmPassword && !!pwdFields.confirmPassword,
    }));
  }, [pwdFields, changingPassword]);

  // cuando salimos de modo cambiar contraseña, limpiar los estados de validacion relacionados
  useEffect(() => {
    if (changingPassword) return;
    setValidFields((prev) => ({
      ...prev,
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    }));
    setPwdErrors({});
  }, [changingPassword]);

  const handleToggleSection = (name: string) => {
    // Si estamos en modo edición o cambiando contraseña, bloquear cualquier cambio de sección
    if (isEditing || changingPassword) return;
    setOpenSection((s) => (s === name ? "" : name));
  };

  // Cerrar sesión
  const handleLogout = () => {
    try {
      // Dinamicamente importar el módulo de auth y llamar a logoutAndNotify
      import("../logic/auth").then((m) => {
        m.logoutAndNotify();
        window.location.href = "/";
      });
    } catch {
      try {
        localStorage.removeItem("lvup_user_session");
      } catch {}
      window.location.href = "/";
    }
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <section className="main-profile">
      <div className="profile-card">
        <div className="profile-header">
          <AvatarSection
            avatar={userData.avatar}
            nombre={userData.nombre}
            apellido={userData.apellidos}
            email={userData.email}
            userId={userId}
            copyMsg={copyMsg}
            isEditing={isEditing}
            avatarInputRef={avatarInputRef}
            onAvatarChange={handleAvatarChange}
            onClickChangeAvatar={handleClickChangeAvatar}
            onCopyId={handleCopyId}
          />
        </div>

        <div className="profile-content">
          <div className="profile-accordions">
            <div className="accordion">
              <button
                aria-expanded={openSection === "personal"}
                className="accordion-toggle"
                aria-disabled={isEditing || changingPassword ? "true" : "false"}
                onClick={() => handleToggleSection("personal")}
              >
                Información Personal
              </button>
              <div
                className={`accordion-panel ${
                  openSection === "personal" ? "open" : "closed"
                }`}
              >
                <PersonalInfoForm
                  userData={userData}
                  isEditing={isEditing}
                  errors={errors}
                  validFields={validFields}
                  handleInputChange={handleInputChange}
                  handleFieldBlur={handleFieldBlur}
                />
                <div className="personal-actions">
                  {!isEditing ? (
                    <button
                      className="boton-menu deco-levelup edit-profile-btn"
                      onClick={() => {
                        setIsEditing(true);
                        setOpenSection("personal");
                      }}
                    >
                      <i className="bi bi-pencil"></i>
                      Editar Perfil
                    </button>
                  ) : (
                    <div className="edit-actions">
                      <button
                        className="boton-menu deco-levelup save-btn"
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        aria-disabled={isSaving}
                      >
                        <i className="bi bi-check"></i>
                        {isSaving ? "Guardando..." : "Guardar"}
                      </button>
                      <button
                        className="boton-menu border-levelup cancel-btn"
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        aria-disabled={isSaving}
                      >
                        <i className="bi bi-x"></i>
                        Cancelar
                      </button>
                      {userData.avatar && (
                        <button
                          type="button"
                          className="boton-menu border-levelup remove-avatar-inline"
                          onClick={handleRemoveAvatar}
                          disabled={isSaving}
                          aria-label="Eliminar foto de perfil"
                        >
                          <i className="bi bi-trash"></i>
                          Eliminar foto
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="accordion">
              <button
                aria-expanded={openSection === "orders"}
                className="accordion-toggle"
                aria-disabled={isEditing || changingPassword ? "true" : "false"}
                onClick={() => handleToggleSection("orders")}
              >
                Historial de Pedidos
              </button>
              <div
                className={`accordion-panel ${
                  openSection === "orders" ? "open" : "closed"
                }`}
              >
                <div className="order-history-section">
                  <h3>Historial de Pedidos</h3>
                  <div className="orders-list">{/* lista de pedidos */}</div>
                </div>
              </div>
            </div>

            <div className="accordion">
              <button
                aria-expanded={openSection === "points"}
                className="accordion-toggle"
                aria-disabled={isEditing || changingPassword ? "true" : "false"}
                onClick={() => handleToggleSection("points")}
              >
                Puntos Level-Up
              </button>
              <div
                className={`accordion-panel ${
                  openSection === "points" ? "open" : "closed"
                }`}
              >
                <div className="points-section">
                  <PointsSection
                    referralCode={userData.referralCode}
                    points={userData.points}
                    copyMsgReferral={copyMsgReferral}
                    onCopyReferral={handleCopyReferral}
                  />
                </div>
              </div>
            </div>

            <div className="accordion">
              <button
                aria-expanded={openSection === "settings"}
                className="accordion-toggle"
                aria-disabled={isEditing || changingPassword ? "true" : "false"}
                onClick={() => handleToggleSection("settings")}
              >
                Configuración de Cuenta
              </button>
              <div
                className={`accordion-panel ${
                  openSection === "settings" ? "open" : "closed"
                }`}
              >
                <SettingsSection
                  setChangingPassword={setChangingPassword}
                  changingPassword={changingPassword}
                  pwdFields={pwdFields}
                  setPwdFields={setPwdFields}
                  pwdErrors={pwdErrors}
                  labelClassPwd={labelClassPwd}
                  validFields={validFields}
                  handlePwdChangeSubmit={handlePwdChangeSubmit}
                  handleLogout={handleLogout}
                  handleDeleteAccount={handleDeleteAccount}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
