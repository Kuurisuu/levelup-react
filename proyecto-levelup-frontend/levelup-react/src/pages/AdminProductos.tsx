import React, { useMemo, useState } from "react";
import {
  AdminSidebar,
  AdminTable as AdminTableComp,
  Modal as AdminModal,
} from "../components/Admin";
import { InputField } from "../components/common";
import useLocalStorage from "../hooks/useLocalStorage";
import {
  Producto,
  obtenerProductos,
  crearProductoApi,
  actualizarProductoApi,
  eliminarProductoApi,
  obtenerCategoriasYSubcategorias,
} from "../data/catalogo";
import "../styles/admin.css";

type ProductForm = Omit<
  Partial<Producto>,
  "precio" | "stock" | "descuento" | "rating"
> & {
  imagenFile?: File | null;
  categoriaId?: string;
  subcategoriaNombre?: string;
  subcategoriaId?: string;
  precio?: string | number;
  stock?: string | number;
  descuento?: string | number;
  rating?: string | number;
};

const AdminProductos: React.FC = () => {
  const [products, setProducts] = useLocalStorage<Producto[]>("lvup_products", []);

  // Cargar desde API con fallback a persisted
  useEffect(() => {
    const load = async () => {
      try {
        const api = await obtenerProductos();
        if (Array.isArray(api) && api.length > 0) {
          setProducts(api);
          return;
        }
      } catch {}
      try {
        const raw =
          localStorage.getItem("lvup_products") ||
          localStorage.getItem("catalogo-base") ||
          "[]";
        setProducts(JSON.parse(raw) as Producto[]);
      } catch {
        setProducts([]);
      }
    };
    void load();
  }, [setProducts]);

  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cats, setCats] = useState<{ id: string; nombre: string }[]>([]);
  const [subs, setSubs] = useState<{ id: string; nombre: string; categoria: { id: string; nombre: string } }[]>([]);

  useEffect(() => {
    const loadCats = async () => {
      const { categorias, subcategorias } = await obtenerCategoriasYSubcategorias();
      setCats(categorias);
      setSubs(subcategorias);
    };
    void loadCats();
  }, []);

  const [editing, setEditing] = useState<ProductForm | null>(null);
  const [selected, setSelected] = useState<Producto | null>(null);

  const handleEdit = (p: Producto) => {
    const normalizeImageUrl = (url?: string) => {
      if (!url) return "";
      if (url.startsWith("data:")) return url;
      if (url.startsWith("/")) return url;
      return url.replace(/^\.\//, "/");
    };

    setEditing({ ...p, imagenUrl: normalizeImageUrl(p.imagenUrl) });
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

  const confirmDelete = async () => {
    if (!selected) return;
    try {
      await eliminarProductoApi(String(selected.id));
      setProducts((prev) => prev.filter((x) => x.id !== selected.id));
      window.dispatchEvent(new Event("lvup:products"));
    } catch (e) {
      // fallback local si falla la API
      setProducts((prev) => prev.filter((x) => x.id !== selected.id));
    }
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
      <div className="actions-grid">
        <div className="actions-top">
          <button className="btn-view" onClick={() => handleView(p)}>
            Ver
          </button>
          <button className="btn-edit" onClick={() => handleEdit(p)}>
            Editar
          </button>
        </div>
        <div className="actions-bottom">
          <button className="btn-delete" onClick={() => handleDelete(p)}>
            Eliminar
          </button>
        </div>
      </div>
    ),
  }));

  const openAdd = () => {
    setEditing({});
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!editing) return;

    if (!editing.nombre || !editing.precio) {
      alert("Nombre y precio son requeridos");
      return;
    }

    const nowId = editing.id || `${Date.now()}`;

    const categoriaObj =
      (editing.categoriaId && cats.find((c) => c.id === editing.categoriaId)) ||
      (cats.length > 0 ? cats[0] : undefined);

    const newProd: Producto = {
      id: nowId,
      nombre: String(editing.nombre),
      descripcion: String(editing.descripcion || ""),
      precio: Number(editing.precio) || 0,
      imagenUrl: String(editing.imagenUrl || ""),
      categoria: categoriaObj as any,
      subcategoria: editing.subcategoriaId
        ? subs.find((s) => s.id === editing.subcategoriaId)
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

    // Persistir vía API (crear o actualizar)
    try {
      let saved: Producto;
      if (editing.id) {
        saved = await actualizarProductoApi(String(editing.id), newProd);
      } else {
        saved = await crearProductoApi(newProd);
      }
      setProducts((prev) => {
        const exists = prev.find((p) => p.id === saved.id);
        if (exists) return prev.map((p) => (p.id === saved.id ? saved : p));
        return [saved, ...prev];
      });
      window.dispatchEvent(new Event("lvup:products"));
    } catch (e) {
      // fallback local si la API falla
      setProducts((prev) => {
        const exists = prev.find((p) => p.id === newProd.id);
        if (exists) return prev.map((p) => (p.id === newProd.id ? newProd : p));
        return [newProd, ...prev];
      });
    }

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
        <div className="product-form-grid">
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
            options={cats.map((c) => ({ value: c.id, label: c.nombre }))}
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
              .filter((s) => s.categoria.id === (editing?.categoriaId || editing?.categoria?.id))
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
                className="product-image-preview"
              />
            )}
            <div className="product-form-actions">
              <button onClick={() => setEditing({})} className="btn-secondary">
                Limpiar
              </button>
              <button onClick={handleSave} className="btn-primary btn-save">
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
          <div className="product-view-grid">
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
              className="product-view-image"
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
        <div className="confirm-actions">
          <button onClick={() => setConfirmOpen(false)} className="btn-secondary">
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
