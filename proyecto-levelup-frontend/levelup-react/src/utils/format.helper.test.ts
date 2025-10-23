import { describe, expect, test } from "vitest";
import {
  formatCLP,
  capitalize,
  truncateText,
  isValidEmail,
  generateSlug,
} from "./format.helper";

describe("Format Helper - formatCLP", () => {
  test("Debe formatear un número a CLP correctamente", () => {
    //! 1 - Arrange
    const valor = 10000;

    //! 2 - Act
    const resultado = formatCLP(valor);

    //! 3 - Assert
    expect(resultado).toBe("$10.000 CLP");
  });

  test("Debe formatear números grandes correctamente", () => {
    //! 1 - Arrange
    const valor = 1500000;

    //! 2 - Act
    const resultado = formatCLP(valor);

    //! 3 - Assert
    expect(resultado).toBe("$1.500.000 CLP");
  });

  test("Debe manejar valor 0", () => {
    //! 1 - Arrange
    const valor = 0;

    //! 2 - Act
    const resultado = formatCLP(valor);

    //! 3 - Assert
    expect(resultado).toBe("$0 CLP");
  });

  test("Debe manejar valores no numéricos", () => {
    //! 1 - Arrange
    const valor = NaN;

    //! 2 - Act
    const resultado = formatCLP(valor);

    //! 3 - Assert
    expect(resultado).toBe("$0 CLP");
  });
});

describe("Format Helper - capitalize", () => {
  test("Debe capitalizar la primera letra", () => {
    //! 1 - Arrange
    const texto = "hola mundo";

    //! 2 - Act
    const resultado = capitalize(texto);

    //! 3 - Assert
    expect(resultado).toBe("Hola mundo");
  });

  test("Debe manejar textos ya capitalizados", () => {
    //! 1 - Arrange
    const texto = "HOLA";

    //! 2 - Act
    const resultado = capitalize(texto);

    //! 3 - Assert
    expect(resultado).toBe("Hola");
  });

  test("Debe manejar strings vacíos", () => {
    //! 1 - Arrange
    const texto = "";

    //! 2 - Act
    const resultado = capitalize(texto);

    //! 3 - Assert
    expect(resultado).toBe("");
  });
});

describe("Format Helper - truncateText", () => {
  test("Debe truncar texto largo", () => {
    //! 1 - Arrange
    const texto = "Este es un texto muy largo que necesita ser truncado";
    const longitud = 20;

    //! 2 - Act
    const resultado = truncateText(texto, longitud);

    //! 3 - Assert
    expect(resultado).toBe("Este es un texto muy...");
  });

  test("No debe truncar texto corto", () => {
    //! 1 - Arrange
    const texto = "Texto corto";
    const longitud = 50;

    //! 2 - Act
    const resultado = truncateText(texto, longitud);

    //! 3 - Assert
    expect(resultado).toBe("Texto corto");
  });

  test("Debe usar sufijo personalizado", () => {
    //! 1 - Arrange
    const texto = "Este es un texto largo";
    const longitud = 10;
    const sufijo = ">>>";

    //! 2 - Act
    const resultado = truncateText(texto, longitud, sufijo);

    //! 3 - Assert
    expect(resultado).toBe("Este es un>>>");
  });
});

describe("Format Helper - isValidEmail", () => {
  test("Debe validar email correcto", () => {
    //! 1 - Arrange
    const email = "usuario@ejemplo.com";

    //! 2 - Act
    const resultado = isValidEmail(email);

    //! 3 - Assert
    expect(resultado).toBe(true);
  });

  test("Debe rechazar email sin @", () => {
    //! 1 - Arrange
    const email = "usuarioejemplo.com";

    //! 2 - Act
    const resultado = isValidEmail(email);

    //! 3 - Assert
    expect(resultado).toBe(false);
  });

  test("Debe rechazar email sin dominio", () => {
    //! 1 - Arrange
    const email = "usuario@";

    //! 2 - Act
    const resultado = isValidEmail(email);

    //! 3 - Assert
    expect(resultado).toBe(false);
  });

  test("Debe rechazar email con espacios", () => {
    //! 1 - Arrange
    const email = "usuario @ejemplo.com";

    //! 2 - Act
    const resultado = isValidEmail(email);

    //! 3 - Assert
    expect(resultado).toBe(false);
  });
});

// RUT helpers and tests removed per project decision.

describe("Format Helper - generateSlug", () => {
  test("Debe generar slug de texto simple", () => {
    //! 1 - Arrange
    const texto = "Hola Mundo";

    //! 2 - Act
    const resultado = generateSlug(texto);

    //! 3 - Assert
    expect(resultado).toBe("hola-mundo");
  });

  test("Debe remover acentos", () => {
    //! 1 - Arrange
    const texto = "Título con acentos";

    //! 2 - Act
    const resultado = generateSlug(texto);

    //! 3 - Assert
    expect(resultado).toBe("titulo-con-acentos");
  });

  test("Debe remover caracteres especiales", () => {
    //! 1 - Arrange
    const texto = "Texto con @#$ símbolos!";

    //! 2 - Act
    const resultado = generateSlug(texto);

    //! 3 - Assert
    expect(resultado).toBe("texto-con-simbolos");
  });

  test("Debe manejar múltiples espacios", () => {
    //! 1 - Arrange
    const texto = "Texto    con    espacios";

    //! 2 - Act
    const resultado = generateSlug(texto);

    //! 3 - Assert
    expect(resultado).toBe("texto-con-espacios");
  });

  test("Debe remover guiones al inicio y final", () => {
    //! 1 - Arrange
    const texto = "  Texto con espacios  ";

    //! 2 - Act
    const resultado = generateSlug(texto);

    //! 3 - Assert
    expect(resultado).toBe("texto-con-espacios");
  });
});
