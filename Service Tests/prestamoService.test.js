// -------------------------------------------------------
// TESTS TDD PARA prestamoService.js
// -------------------------------------------------------

const prestamoService = require('../src/services/prestamoService');

// Mock del modelo Prestamo
jest.mock('../src/models/prestamoModel', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn()
}));

const Prestamo = require('../src/models/prestamoModel');

describe("TDD - prestamoService.js", () => {

  // -------------------------------------------------------------------
  // 1) getAllPrestamos() → debe obtener todos los préstamos
  // -------------------------------------------------------------------
  test("getAllPrestamos - retorna todos los préstamos", async () => {
    // PREPARACIÓN
    Prestamo.findAll.mockResolvedValue([
      { id: 1, libro_id: 3 },
      { id: 2, libro_id: 8 }
    ]);

    // LÓGICA
    const result = await prestamoService.getAllPrestamos();

    // ASSERT
    expect(result.length).toBe(2);
    expect(Prestamo.findAll).toHaveBeenCalledTimes(1);
  });

  // -------------------------------------------------------------------
  // 2) getPrestamoById() → retorna un préstamo existente
  // -------------------------------------------------------------------
  test("getPrestamoById - retorna préstamo existente", async () => {
    // PREPARACIÓN
    Prestamo.findByPk.mockResolvedValue({ id: 10, libro_id: 5 });

    // LÓGICA
    const result = await prestamoService.getPrestamoById(10);

    // ASSERT
    expect(result).toEqual({ id: 10, libro_id: 5 });
    expect(Prestamo.findByPk).toHaveBeenCalledWith(10);
  });

  // -------------------------------------------------------------------
  // 3) getPrestamoById() → retorna null si no existe
  // -------------------------------------------------------------------
  test("getPrestamoById - retorna null si el préstamo no existe", async () => {
    // PREPARACIÓN
    Prestamo.findByPk.mockResolvedValue(null);

    // LÓGICA
    const result = await prestamoService.getPrestamoById(999);

    // ASSERT
    expect(result).toBeNull();
  });

  // -------------------------------------------------------------------
  // 4) updatePrestamo() → actualiza un préstamo existente
  // -------------------------------------------------------------------
  test("updatePrestamo - actualiza préstamo existente", async () => {
    // PREPARACIÓN
    const mockPrestamo = {
      id: 3,
      libro_id: 10,
      update: jest.fn().mockResolvedValue({ id: 3, libro_id: 20 })
    };

    Prestamo.findByPk.mockResolvedValue(mockPrestamo);

    // LÓGICA
    const result = await prestamoService.updatePrestamo(3, { libro_id: 20 });

    // ASSERT
    expect(mockPrestamo.update).toHaveBeenCalledWith({ libro_id: 20 });
    expect(result.libro_id).toBe(20);
  });

  // -------------------------------------------------------------------
  // 5) deletePrestamo() → retorna null si NO existe el préstamo
  // -------------------------------------------------------------------
  test("deletePrestamo - retorna null si el préstamo no existe", async () => {
    // PREPARACIÓN
    Prestamo.findByPk.mockResolvedValue(null);

    // LÓGICA
    const result = await prestamoService.deletePrestamo(888);

    // ASSERT
    expect(result).toBeNull();
  });

});
