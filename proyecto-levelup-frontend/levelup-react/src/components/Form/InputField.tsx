import React, { useEffect, useState } from "react";
import "../../styles/inputfield.css";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: any;
  placeholder?: string;
  required?: boolean;
  validator?: (value: any) => string | null;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  as?: "input" | "textarea" | "select";
  options?: { value: string; label: string }[];
  min?: number | string;
  max?: number | string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  placeholder,
  required = false,
  validator,
  onChange,
  as = "input",
  options = [],
  min,
  max,
}) => {
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (validator) setError(validator(value));
    else if (required) setError(!value ? "Este campo es requerido" : null);
    else setError(null);
  }, [value, touched, validator, required]);

  const handleBlur = () => setTouched(true);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!touched) setTouched(true);
    onChange(e);
  };

  const className = error
    ? "input-control invalid"
    : touched && !error
    ? "input-control valid"
    : "input-control";

  return (
    <div className="input-field">
      <label htmlFor={name}>
        {label}
        {required ? " *" : ""}
      </label>
      {as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={className}
        />
      ) : as === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={className}
        >
          <option value="">-- Seleccionar --</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : 
      type === "date" ? (
        <div className="date-input-wrapper">
          <input
            ref={inputRef}
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className={className}
          />
          <button
            type="button"
            className="date-trigger"
            onClick={() => {
              const el = inputRef.current as any;
              if (!el) return;
              if (typeof el.showPicker === "function") {
                try {
                  el.showPicker();
                  return;
                } catch (_) {
                }
              }
              el.focus();
            }}
            aria-label={`Abrir selector de fecha para ${label}`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M7 3v2M17 3v2M3 7h18v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={className}
          min={min}
          max={max}
        />
      )}

      <div
        className={`supporting-text ${error ? "error" : "ok"}`}
        role="status"
        aria-live="polite"
      >
        {error || (touched && !error ? "OK" : "")}
      </div>
    </div>
  );
};

export default InputField;
