import React, { useEffect, useRef } from "react";

interface ModalProps {
  title?: string;
  visible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, visible, onClose, children }) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const hasAutoFocused = useRef(false); // 🟢 evita que vuelva a enfocar en cada render

  useEffect(() => {
    if (!visible) {
      hasAutoFocused.current = false;
      return;
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();

      // focus trap dentro del modal
      if (e.key === "Tab" && overlayRef.current) {
        const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    if (!hasAutoFocused.current) {
      const firstInput = overlayRef.current?.querySelector<HTMLElement>(
        ".modal .modal-body input:not([disabled]), .modal .modal-body textarea:not([disabled]), .modal .modal-body select:not([disabled])"
      );
      if (firstInput) firstInput.focus();
      hasAutoFocused.current = true;
    }

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      ref={overlayRef}
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className="modal"
        role="document"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button aria-label="Cerrar" className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
