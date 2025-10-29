import React, { useMemo, useState } from "react";
import {
  AdminSidebar,
  AdminTable as AdminTableComp,
  Modal as AdminModal,
} from "../components/Admin";
import { InputField } from "../components/common";
import useLocalStorage from "../hooks/useLocalStorage";
import "../styles/admin.css";

interface User {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  telefono?: string; // optional
  direccion?: string; // optional
  role?: string;
  avatar?: string;
  fechaNacimiento: string;
  region?: string;
  comuna?: string;
  referralCode?: string;
  points?: number;
  redeemedCodes?: string[];
  referredBy?: string;
}

const AdminUsuarios: React.FC = () => {
  const initial = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("lvup_users") || "[]") as User[];
    } catch {
      return [];
    }
  }, []);

  const [users, setUsers] = useLocalStorage<User[]>("lvup_users", initial);

  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [editing, setEditing] = useState<Partial<User> | null>(null);
  const [selected, setSelected] = useState<User | null>(null);

  const openAdd = () => {
    setEditing({});
    setModalOpen(true);
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setEditing((prev) => ({
        ...(prev || {}),
        avatar: String(reader.result || ""),
      }));
    };
    reader.readAsDataURL(file);
  };

  // Validators copied from Register logic for realtime validation
  const validateNombre = (v: any) => {
    const s = String(v || "").trim();
    if (!s) return "El nombre es requerido";
    if (s.length < 2) return "El nombre debe tener al menos 2 caracteres";
    return null;
  };

  const validateApellidos = (v: any) => {
    const s = String(v || "").trim();
    if (!s) return "Los apellidos son requeridos";
    if (s.length < 2) return "Los apellidos deben tener al menos 2 caracteres";
    return null;
  };

  const validateEmail = (v: any) => {
    const s = String(v || "").trim();
    if (!s) return "El email es requerido";
    if (!/\S+@\S+\.\S+/.test(s)) return "El email no es válido";
    return null;
  };

  const validatePassword = (v: any) => {
    const s = String(v || "");
    if (!s) return "La contraseña es requerida";
    if (s.length < 4 || s.length > 10)
      return "La contraseña debe tener entre 4 y 10 caracteres";
    return null;
  };

  const validateFechaNacimiento = (v: any) => {
    const s = String(v || "");
    if (!s) return "La fecha de nacimiento es requerida";
    const today = new Date();
    const birth = new Date(s);
    const age = today.getFullYear() - birth.getFullYear();
    if (age < 18) return "El usuario debe ser mayor de 18 años";
    return null;
  };

  const validateTelefono = (v: any) => {
    if (!v) return null; // optional
    if (!/^\+?[0-9\s-()]+$/.test(String(v)))
      return "Formato de teléfono inválido";
    return null;
  };

  // regiones y comunas (copiado de Register)
  const regionesYComunas: Record<string, string[]> = {
    "Región Metropolitana": [
      "Santiago",
      "Las Condes",
      "Providencia",
      "Ñuñoa",
      "Maipú",
      "La Florida",
      "Puente Alto",
    ],
    Valparaíso: [
      "Valparaíso",
      "Viña del Mar",
      "Concón",
      "Quilpué",
      "Villa Alemana",
      "San Antonio",
    ],
    Biobío: ["Concepción", "Talcahuano", "Chillán", "Los Ángeles", "Coronel"],
    Coquimbo: ["La Serena", "Coquimbo", "Ovalle", "Illapel"],
    Antofagasta: ["Antofagasta", "Calama", "Tocopilla", "Mejillones"],
    Tarapacá: ["Iquique", "Alto Hospicio", "Pozo Almonte"],
    "Arica y Parinacota": ["Arica", "Putre", "Camarones"],
  };

  const validateRegion = (v: any) => {
    if (!v) return "Selecciona una región";
    return null;
  };

  const validateComuna = (v: any) => {
    if (!v) return "Selecciona una comuna";
    return null;
  };

  const generateUserId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const generateReferralCode = (nombre: string): string => {
    const raw = nombre.replace(/\s+/g, "").toUpperCase();
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    const namepart = raw.slice(0, 6);
    return namepart + rand;
  };

  const handleSave = () => {
    if (!editing) return;

    // validations similar to Register
    const email = String(editing.email || "").trim();
    const nombre = String(editing.nombre || "").trim();
    const apellidos = String(editing.apellidos || "").trim();
    const password = String(editing.password || "");
    const fechaNacimiento = String(editing.fechaNacimiento || "");

    if (!nombre || nombre.length < 2) {
      alert("El nombre es requerido y debe tener al menos 2 caracteres");
      return;
    }

    if (!apellidos || apellidos.length < 2) {
      alert("Los apellidos son requeridos y deben tener al menos 2 caracteres");
      return;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert("Email inválido");
      return;
    }

    // Evitar duplicados de email: si estamos creando un usuario nuevo y el
    // email ya existe, o si estamos editando y el email pertenece a otro
    // usuario, impedir la operación.
    const emailLower = email.toLowerCase();
    const conflict = users.find(
      (u) => u.email && u.email.toLowerCase() === emailLower
    );
    if (editing?.id) {
      // editing existing user: conflict is only an issue if it belongs to a different id
      if (conflict && conflict.id !== editing.id) {
        alert("El email ya está registrado en otra cuenta");
        return;
      }
    } else {
      // creating new user: any existing with same email is a conflict
      if (conflict) {
        alert("El email ya está registrado");
        return;
      }
    }

    if (!password || password.length < 4 || password.length > 10) {
      alert("La contraseña debe tener entre 4 y 10 caracteres");
      return;
    }

    if (!fechaNacimiento) {
      alert("La fecha de nacimiento es requerida");
      return;
    } else {
      const today = new Date();
      const birth = new Date(fechaNacimiento);
      const age = today.getFullYear() - birth.getFullYear();
      if (age < 18) {
        alert("El usuario debe ser mayor de 18 años");
        return;
      }
    }

    // teléfono opcional with format
    if (
      editing.telefono &&
      !/^\+?[0-9\s-()]+$/.test(String(editing.telefono))
    ) {
      alert("Formato de teléfono inválido");
      return;
    }

    // validar region/comuna (como en Register)
    if (!editing.region) {
      alert("Selecciona una región");
      return;
    }
    if (!editing.comuna) {
      alert("Selecciona una comuna");
      return;
    }

    const id = editing.id || generateUserId();
    const referralCode = editing.referralCode || generateReferralCode(nombre);

    const newUser: User = {
      id,
      nombre,
      apellidos,
      email,
      password,
      telefono: editing.telefono || undefined,
      direccion: editing.direccion || undefined,
      role: editing.role || undefined,
      avatar: editing.avatar || undefined,
      fechaNacimiento,
      region: editing.region || undefined,
      comuna: editing.comuna || undefined,
      referralCode,
      points: editing.points || 0,
      redeemedCodes: editing.redeemedCodes || [],
      referredBy: editing.referredBy || undefined,
    };

    setUsers((prev) => {
      const exists = prev.find((u) => u.id === id);
      if (exists) {
        // merge to ensure we don't accidentally drop fields and to guarantee
        // the updated `apellidos` is applied
        return prev.map((u) => (u.id === id ? { ...u, ...newUser } : u));
      }
      return [newUser, ...prev];
    });

    setModalOpen(false);
    setEditing(null);
  };

  const handleEdit = (u: User) => {
    setEditing(u);
    setModalOpen(true);
  };
  const handleView = (u: User) => {
    setSelected(u);
    setViewOpen(true);
  };
  const handleDelete = (u: User) => {
    setSelected(u);
    setConfirmOpen(true);
  };
  const confirmDelete = () => {
    if (!selected) return;
    setUsers((prev) => prev.filter((u) => u.id !== selected.id));
    setConfirmOpen(false);
    setSelected(null);
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "nombre", label: "Nombre" },
    { key: "email", label: "Email" },
    { key: "role", label: "Rol" },
  ];

  const dataWithActions = users.map((u) => ({
    ...u,
    __actions: (
      <>
        <button className="btn-view" onClick={() => handleView(u)}>
          Ver
        </button>
        <button className="btn-edit" onClick={() => handleEdit(u)}>
          Editar
        </button>
        <button className="btn-delete" onClick={() => handleDelete(u)}>
          Eliminar
        </button>
      </>
    ),
  }));

  return (
    <div className="admin-page">
      <AdminSidebar />

      <section className="admin-main">
        <div className="admin-actions">
          <h2>Usuarios</h2>
          <div>
            <button onClick={openAdd} className="btn-primary">
              Añadir Usuario
            </button>
          </div>
        </div>

        <AdminTableComp
          columns={columns as any}
          data={dataWithActions as any}
        />
      </section>

      <AdminModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing?.id ? "Editar Usuario" : "Añadir Usuario"}
      >
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <InputField
            label="Nombre"
            name="nombre"
            value={editing?.nombre || ""}
            onChange={(
              e: React.ChangeEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
              >
            ) =>
              setEditing((prev) => ({
                ...(prev || {}),
                nombre: e.target.value,
              }))
            }
            validator={validateNombre}
            required
          />
          <InputField
            label="Apellidos"
            name="apellidos"
            value={editing?.apellidos || ""}
            onChange={(
              e: React.ChangeEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
              >
            ) =>
              setEditing((prev) => ({
                ...(prev || {}),
                apellidos: e.target.value,
              }))
            }
            validator={validateApellidos}
            required
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={editing?.email || ""}
            onChange={(
              e: React.ChangeEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
              >
            ) =>
              setEditing((prev) => ({ ...(prev || {}), email: e.target.value }))
            }
            validator={validateEmail}
            required
          />
          <InputField
            label="Teléfono"
            name="telefono"
            value={editing?.telefono || ""}
            onChange={(
              e: React.ChangeEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
              >
            ) =>
              setEditing((prev) => ({
                ...(prev || {}),
                telefono: e.target.value,
              }))
            }
            validator={validateTelefono}
          />
          <InputField
            label="Dirección"
            name="direccion"
            value={editing?.direccion || ""}
            onChange={(
              e: React.ChangeEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
              >
            ) =>
              setEditing((prev) => ({
                ...(prev || {}),
                direccion: e.target.value,
              }))
            }
          />
          <InputField
            label="Contraseña"
            name="password"
            type="password"
            value={editing?.password || ""}
            onChange={(
              e: React.ChangeEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
              >
            ) =>
              setEditing((prev) => ({
                ...(prev || {}),
                password: e.target.value,
              }))
            }
            validator={validatePassword}
            required
          />
          <InputField
            label="Fecha de Nacimiento"
            name="fechaNacimiento"
            type="date"
            value={editing?.fechaNacimiento || ""}
            onChange={(e) =>
              setEditing((prev) => ({
                ...(prev || {}),
                fechaNacimiento: e.target.value,
              }))
            }
            validator={validateFechaNacimiento}
            required
          />
          <InputField
            label="Región"
            name="region"
            as="select"
            value={editing?.region || ""}
            options={Object.keys(regionesYComunas).map((r) => ({
              value: r,
              label: r,
            }))}
            onChange={(e) =>
              setEditing((prev) => ({
                ...(prev || {}),
                region: e.target.value,
                comuna: "",
              }))
            }
            validator={validateRegion}
            required
          />
          <InputField
            label="Comuna"
            name="comuna"
            as="select"
            value={editing?.comuna || ""}
            options={
              editing?.region && regionesYComunas[editing.region]
                ? regionesYComunas[editing.region].map((c) => ({
                    value: c,
                    label: c,
                  }))
                : []
            }
            onChange={(e) =>
              setEditing((prev) => ({
                ...(prev || {}),
                comuna: e.target.value,
              }))
            }
            validator={validateComuna}
            required
          />
          <div>
            <label>Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarFileChange}
              className="input-control"
            />
            {editing?.avatar ? (
              <div style={{ marginTop: 8 }}>
                <img
                  src={editing.avatar}
                  alt="avatar-preview"
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </div>
            ) : null}
          </div>
          <InputField
            label="Rol"
            name="role"
            as="select"
            options={[
              { value: "", label: "(No asignado)" },
              { value: "cliente", label: "Cliente" },
              { value: "vendedor", label: "Vendedor" },
              { value: "administrador", label: "Administrador" },
            ]}
            value={editing?.role || ""}
            onChange={(e) =>
              setEditing((prev) => ({ ...(prev || {}), role: e.target.value }))
            }
          />

          <div style={{ gridColumn: "1 / -1" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setEditing({})} className="btn-secondary">
                Limpiar
              </button>
              <button onClick={handleSave} className="btn-primary">
                Guardar
              </button>
            </div>
          </div>
        </div>
      </AdminModal>

      <AdminModal
        visible={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Ver Usuario"
      >
        {selected ? (
          <div>
            <h3>
              {selected.nombre} {selected.apellidos}
            </h3>
            <p>
              <strong>Email:</strong> {selected.email}
            </p>
            <p>
              <strong>Teléfono:</strong> {selected.telefono}
            </p>
            <p>
              <strong>Rol:</strong> {selected.role}
            </p>
          </div>
        ) : (
          <div>No seleccionado</div>
        )}
      </AdminModal>

      <AdminModal
        visible={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirmar eliminación"
      >
        <p>¿Eliminar el usuario {selected?.nombre}?</p>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button
            onClick={() => setConfirmOpen(false)}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button onClick={confirmDelete} className="btn-delete">
            Eliminar
          </button>
        </div>
      </AdminModal>
    </div>
  );
};

export default AdminUsuarios;
