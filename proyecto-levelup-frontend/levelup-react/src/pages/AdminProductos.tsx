import React, { useMemo, useState } from "react";
import {
  AdminSidebar,
  AdminTable as AdminTableComp,
  Modal as AdminModal,
} from "../components/Admin";
import { InputField } from "../components/common";
import useLocalStorage from "../hooks/useLocalStorage";
import { Producto, categorias, subcategorias } from "../data/catalogo";
import "../styles/admin.css";

type ProductForm = Omit<
  Partial<Producto>,
  "precio" | "stock" | "descuento" | "rating"
> & {
  imagenFile?: File | null;
  categoriaId?: string;
  subcategoriaNombre?: string;
  subcategoriaId?: string;
  // during editing we keep number-like fields as strings to avoid caret issues
  precio?: string | number;
  stock?: string | number;
  descuento?: string | number;
  rating?: string | number;
};

const AdminProductos: React.FC = () => {
  // try to initialize from 'lvup_products' else from 'catalogo-base'
  const initialProducts = useMemo(() => {
    try {
      const raw =
        localStorage.getItem("lvup_products") ||
        localStorage.getItem("catalogo-base") ||
        "[]";
      return JSON.parse(raw) as Producto[];
    } catch {
      return [];
    }
  }, []);

  const [products, setProducts] = useLocalStorage<Producto[]>(
    "lvup_products",
    initialProducts
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [editing, setEditing] = useState<ProductForm | null>(null);
  const [selected, setSelected] = useState<Producto | null>(null);

  // helpers for CRUD actions
  const handleEdit = (p: Producto) => {
    setEditing({ ...p });
    setModalOpen(true);
  };

  const handleView = (p: Producto) => {
    setSelected(p);
    setViewOpen(true);
  };

  const handleDelete = (p: Producto) => {
    setSelected(p);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!selected) return;
    setProducts((prev) => prev.filter((x) => x.id !== selected.id));
    // Notificar a otras partes de la app que los productos han sido actualizados
    try {
      window.dispatchEvent(new Event("lvup:products"));
    } catch (e) {}
    setConfirmOpen(false);
    setSelected(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    setEditing((prev) => ({ ...(prev || {}), imagenFile: f || null }));
    if (f) {
      const fr = new FileReader();
      fr.onload = () =>
        setEditing((prev) => ({
          ...(prev || {}),
          imagenUrl: String(fr.result),
          imagenesUrls: [String(fr.result)],
        }));
      fr.readAsDataURL(f);
    } else {
      setEditing((prev) => ({
        ...(prev || {}),
        imagenUrl: "",
        imagenesUrls: [],
      }));
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "nombre", label: "Nombre" },
    {
      key: "precio",
      label: "Precio",
      render: (r: Producto) => `$ ${r.precio}`,
    },
    { key: "stock", label: "Stock" },
    {
      key: "disponible",
      label: "Disponible",
      render: (r: Producto) => (r.disponible ? "Sí" : "No"),
    },
  ];

  const dataWithActions = products.map((p) => ({
    ...p,
    __actions: (
      <>
        <button className="btn-view" onClick={() => handleView(p)}>
          Ver
        </button>
        <button className="btn-edit" onClick={() => handleEdit(p)}>
          Editar
        </button>
        <button className="btn-delete" onClick={() => handleDelete(p)}>
          Eliminar
        </button>
      </>
    ),
  }));

  const openAdd = () => {
    setEditing({});
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!editing) return;

    // basic validation
    if (!editing.nombre || !editing.precio) {
      alert("Nombre y precio son requeridos");
      return;
    }

    const nowId = editing.id || `${Date.now()}`;

    const categoriaObj =
      (editing.categoriaId &&
        categorias.find((c) => c.id === editing.categoriaId)) ||
      categorias[0];

    const newProd: Producto = {
      id: nowId,
      nombre: String(editing.nombre),
      descripcion: String(editing.descripcion || ""),
      precio: Number(editing.precio) || 0,
      imagenUrl: String(editing.imagenUrl || ""),
      categoria: categoriaObj,
      subcategoria: editing.subcategoriaId
        ? subcategorias.find((s) => s.id === editing.subcategoriaId)
        : (editing.subcategoria as any) || undefined,
      rating: editing.rating ? Number(editing.rating) : 0,
      disponible: editing.disponible ?? true,
      destacado: editing.destacado ?? false,
      stock: editing.stock ? Number(editing.stock) : 0,
      imagenesUrls:
        editing.imagenesUrls && editing.imagenesUrls.length
          ? editing.imagenesUrls
          : editing.imagenUrl
          ? [String(editing.imagenUrl)]
          : [],
      fabricante: editing.fabricante,
      distribuidor: editing.distribuidor,
      descuento: editing.descuento ? Number(editing.descuento) : undefined,
      reviews: editing.reviews || [],
      productosRelacionados: editing.productosRelacionados || [],
      precioConDescuento: editing.descuento
        ? Number(editing.precio) * (1 - Number(editing.descuento) / 100)
        : undefined,
      ratingPromedio: editing.rating ? Number(editing.rating) : 0,
    };

    // handle image file -> dataURL
    if (editing.imagenFile) {
      const file = editing.imagenFile;
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(String(fr.result));
        fr.onerror = reject;
        fr.readAsDataURL(file);
      });
      newProd.imagenUrl = dataUrl;
      newProd.imagenesUrls = [dataUrl];
    }

    setProducts((prev) => {
      const exists = prev.find((p) => p.id === newProd.id);
      if (exists) return prev.map((p) => (p.id === newProd.id ? newProd : p));
      return [newProd, ...prev];
    });

    // notify other parts of the app that products have been updated
    try {
      window.dispatchEvent(new Event("lvup:products"));
    } catch (e) {}

    setModalOpen(false);
    setEditing(null);
  };

  return (
    <div className="admin-page">
      <AdminSidebar />

      <section className="admin-main">
        <div className="admin-actions">
          <h2>Productos</h2>
          <div>
            <button onClick={openAdd} className="btn-primary">
              Añadir Producto
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
        title={editing?.id ? "Editar Producto" : "Añadir Producto"}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
          }}
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
            required
          />
          <InputField
            label="Precio"
            name="precio"
            type="number"
            value={editing?.precio ?? ""}
            onChange={(
              e: React.ChangeEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
              >
            ) =>
              setEditing((prev) => ({
                ...(prev || {}),
                // keep as string while editing to avoid numeric coercion issues
                precio: (e.target as HTMLInputElement).value,
              }))
            }
            required
          />
          <InputField
            label="Stock"
            name="stock"
            type="number"
            value={editing?.stock ?? ""}
            onChange={(
              e: React.ChangeEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
              >
            ) =>
              setEditing((prev) => ({
                ...(prev || {}),
                stock: (e.target as HTMLInputElement).value,
              }))
            }
          />
          <InputField
            label="Fabricante"
            name="fabricante"
            value={editing?.fabricante || ""}
            onChange={(
              e: React.ChangeEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
              >
            ) =>
              setEditing((prev) => ({
                ...(prev || {}),
                fabricante: e.target.value,
              }))
            }
          />
          <InputField
            label="Categoría"
            name="categoria"
            as="select"
            value={
              editing?.categoriaId ||
              (editing?.categoria && editing.categoria.id) ||
              ""
            }
            options={categorias.map((c) => ({ value: c.id, label: c.nombre }))}
            onChange={(e) =>
              setEditing((prev) => ({
                ...(prev || {}),
                categoriaId: e.target.value,
                subcategoriaId: undefined,
              }))
            }
            required
          />
          <InputField
            label="Subcategoría"
            name="subcategoria"
            as="select"
            value={
              editing?.subcategoriaId ||
              (editing?.subcategoria && editing.subcategoria.id) ||
              ""
            }
            options={subcategorias
              .filter(
                (s) =>
                  s.categoria.id ===
                  (editing?.categoriaId || editing?.categoria?.id)
              )
              .map((s) => ({ value: s.id, label: s.nombre }))}
            onChange={(e) =>
              setEditing((prev) => ({
                ...(prev || {}),
                subcategoriaId: e.target.value,
              }))
            }
          />
          <InputField
            label="Distribuidor"
            name="distribuidor"
            value={editing?.distribuidor || ""}
            onChange={(e) =>
              setEditing((prev) => ({
                ...(prev || {}),
                distribuidor: e.target.value,
              }))
            }
          />
          <InputField
            label="Destacado"
            name="destacado"
            as="select"
            value={editing?.destacado ? "si" : "no"}
            options={[
              { value: "si", label: "Sí" },
              { value: "no", label: "No" },
            ]}
            onChange={(e) =>
              setEditing((prev) => ({
                ...(prev || {}),
                destacado: e.target.value === "si",
              }))
            }
          />
          <InputField
            label="Descuento (%)"
            name="descuento"
            type="number"
            value={editing?.descuento ?? ""}
            onChange={(e) =>
              setEditing((prev) => ({
                ...(prev || {}),
                descuento: (e.target as HTMLInputElement).value,
              }))
            }
          />
          <InputField
            label="Descripción"
            name="descripcion"
            as="textarea"
            value={editing?.descripcion || ""}
            onChange={(e) =>
              setEditing((prev) => ({
                ...(prev || {}),
                descripcion: e.target.value,
              }))
            }
          />

          <div>
            <label>Imagen</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {editing?.imagenUrl && (
              <img
                src={editing.imagenUrl}
                alt="preview"
                style={{
                  width: 120,
                  height: 80,
                  objectFit: "cover",
                  marginTop: 8,
                  borderRadius: 6,
                }}
              />
            )}
            <div style={{ marginTop: 8 }}>
              <button onClick={() => setEditing({})} className="btn-secondary">
                Limpiar
              </button>
              <button
                onClick={handleSave}
                className="btn-primary"
                style={{ marginLeft: 8 }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </AdminModal>

      <AdminModal
        visible={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Ver Producto"
      >
        {selected ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "160px 1fr",
              gap: 12,
            }}
          >
            <img
              src={
                selected.imagenUrl
                  ? selected.imagenUrl.startsWith("data:")
                    ? selected.imagenUrl
                    : selected.imagenUrl.startsWith("/")
                    ? selected.imagenUrl
                    : selected.imagenUrl.replace(/^\.\//, "/")
                  : ""
              }
              alt={selected.nombre}
              style={{
                width: 160,
                height: 120,
                objectFit: "cover",
                borderRadius: 6,
              }}
            />
            <div>
              <h3>{selected.nombre}</h3>
              <p>{selected.descripcion}</p>
              <p>
                <strong>Precio:</strong> $ {selected.precio}
              </p>
              <p>
                <strong>Stock:</strong> {selected.stock}
              </p>
            </div>
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
        <p>¿Eliminar el producto {selected?.nombre}?</p>
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

export default AdminProductos;
