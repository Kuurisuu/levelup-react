/**
 * Configuración inicial para los tests con Vitest
 * Este archivo se ejecuta antes de cada suite de tests
 */
// Matchers adicionales (toBeDisabled, toBeVisible, etc.)
import "@testing-library/jest-dom";
import { beforeEach } from "vitest";

// Mock de localStorage para pruebas
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Limpiar localStorage antes de cada test
beforeEach(() => {
  localStorage.clear();
});
