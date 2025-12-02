// -------------------------------------------------------
// TESTS DE TDD PARA estadosService.js
// -------------------------------------------------------

const estadosService = require('../src/services/estadosService');

// Mock del modelo Estado
jest.mock('../src/models/estadosModel', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn()
}));

const Estado = require('../src/models/estadosModel');

describe("TDD - estadosService.js", () => {

  // -------------------------------------------------------------------
  // 1) getAllDev() debe retornar una lista de estados
  // -------------------------------------------------------------------
  test("getAllDev - retorna todos los estados", async () => {
    // Arrange
    Estado.findAll.mockResolvedValue([
      { id: 1, nombre: "Pendiente" },
      { id: 2, nombre: "Aprobado" }
    ]);

    // Act
    const result = await estadosService.getAllDev();

    // Assert
    expect(result.length).toBe(2);
    expect(Estado.findAll).toHaveBeenCalledTimes(1);
  });

  // -------------------------------------------------------------------
  // 2) getDevById() cuando el estado existe
  // -------------------------------------------------------------------
  test("getDevById - retorna un estado por ID", async () => {
    // Arrange
    Estado.findByPk.mockResolvedValue({ id: 10, nombre: "Rechazado" });

    // Act
    const result = await estadosService.getDevById(10);

    // Assert
    expect(result).toEqual({ id: 10, nombre: "Rechazado" });
    expect(Estado.findByPk).toHaveBeenCalledWith(10);
  });

  // -------------------------------------------------------------------
  // 3) getDevById() cuando NO existe debe devolver null
  // -------------------------------------------------------------------
  test("getDevById - retorna null si no existe el estado", async () => {
    // Arrange
    Estado.findByPk.mockResolvedValue(null);

    // Act
    const result = await estadosService.getDevById(999);

    // Assert
    expect(result).toBeNull();
  });

  // -------------------------------------------------------------------
  // 4) updateDev() cuando el estado existe
  // -------------------------------------------------------------------
  test("updateDev - actualiza un estado existente", async () => {
    // Arrange: simulamos un estado encontrado con método update()
    const mockState = {
      id: 3,
      nombre: "Inicial",
      update: jest.fn().mockResolvedValue({ id: 3, nombre: "Modificado" })
    };

    Estado.findByPk.mockResolvedValue(mockState);

    // Act
    const result = await estadosService.updateDev(3, { nombre: "Modificado" });

    // Assert
    expect(mockState.update).toHaveBeenCalledWith({ nombre: "Modificado" });
    expect(result.nombre).toBe("Modificado");
  });

  // -------------------------------------------------------------------
  // 5) deleteDev() cuando el estado no existe
  // -------------------------------------------------------------------
  test("deleteDev - retorna null si no se encuentra el estado", async () => {
    // Arrange
    Estado.findByPk.mockResolvedValue(null);

    // Act
    const result = await estadosService.deleteDev(500);

    // Assert
    expect(result).toBeNull();
  });
});
