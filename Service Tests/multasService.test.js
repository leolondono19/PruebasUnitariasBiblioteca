// -------------------------------------------------------
// TESTS TDD PARA multasService.js
// -------------------------------------------------------

const multasService = require('../src/services/multasService');

// Mock del modelo Multa
jest.mock('../src/models/multasModel', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn()
}));

const Multa = require('../src/models/multasModel');

describe("TDD - multasService.js", () => {

  // -------------------------------------------------------------------
  // 1) getAllMultas() → debe devolver todas las multas
  // -------------------------------------------------------------------
  test("getAllMultas - retorna lista de multas", async () => {
    // PREPARACIÓN
    Multa.findAll.mockResolvedValue([
      { id: 1, descripcion: "Retraso" },
      { id: 2, descripcion: "Daño de libro" }
    ]);

    // LÓGICA
    const result = await multasService.getAllMultas();

    // ASSERT
    expect(result.length).toBe(2);
    expect(Multa.findAll).toHaveBeenCalledTimes(1);
  });

  // -------------------------------------------------------------------
  // 2) getMultasById() → encuentra una multa existente
  // -------------------------------------------------------------------
  test("getMultasById - retorna una multa existente", async () => {
    // PREPARACIÓN
    Multa.findByPk.mockResolvedValue({ id: 10, descripcion: "Pérdida" });

    // LÓGICA
    const result = await multasService.getMultasById(10);

    // ASSERT
    expect(result).toEqual({ id: 10, descripcion: "Pérdida" });
    expect(Multa.findByPk).toHaveBeenCalledWith(10);
  });

  // -------------------------------------------------------------------
  // 3) getMultasById() → retorna null si no existe
  // -------------------------------------------------------------------
  test("getMultasById - retorna null si la multa no existe", async () => {
    // PREPARACIÓN
    Multa.findByPk.mockResolvedValue(null);

    // LÓGICA
    const result = await multasService.getMultasById(999);

    // ASSERT
    expect(result).toBeNull();
  });

  // -------------------------------------------------------------------
  // 4) updateMultas() → actualiza una multa cuando existe
  // -------------------------------------------------------------------
  test("updateMultas - actualiza datos de una multa existente", async () => {
    // PREPARACIÓN
    const mockMulta = {
      id: 3,
      descripcion: "Antigua",
      update: jest.fn().mockResolvedValue({ id: 3, descripcion: "Nueva descripción" })
    };

    Multa.findByPk.mockResolvedValue(mockMulta);

    // LÓGICA
    const result = await multasService.updateMultas(3, { descripcion: "Nueva descripción" });

    // ASSERT
    expect(mockMulta.update).toHaveBeenCalledWith({ descripcion: "Nueva descripción" });
    expect(result.descripcion).toBe("Nueva descripción");
  });

  // -------------------------------------------------------------------
  // 5) deleteMultas() → retorna null si NO existe
  // -------------------------------------------------------------------
  test("deleteMultas - retorna null si la multa no existe", async () => {
    // PREPARACIÓN
    Multa.findByPk.mockResolvedValue(null);

    // LÓGICA
    const result = await multasService.deleteMultas(777);

    // ASSERT
    expect(result).toBeNull();
  });

});
