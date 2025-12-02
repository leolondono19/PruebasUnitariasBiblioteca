// -------------------------------------------------------
// TESTS DE TDD PARA devolucionesService.js
// -------------------------------------------------------

// 1. Importamos el servicio a probar
const devolucionesService = require('../src/services/devolucionesService');

// 2. Mockeamos el modelo Sequelize
jest.mock('../src/models/devolucionesModel', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn()
}));

const Devolucion = require('../src/models/devolucionesModel');

describe("TDD - devolucionesService.js", () => {

  // -------------------------------------------------------------------
  // 1) PRUEBA: getAllDev() debería devolver un array de devoluciones
  // -------------------------------------------------------------------
  test("getAllDev - retorna todas las devoluciones", async () => {
    // Arrange: el modelo debe devolver un array
    Devolucion.findAll.mockResolvedValue([
      { id: 1, motivo: "Producto defectuoso" },
      { id: 2, motivo: "No era lo esperado" }
    ]);

    // Act
    const result = await devolucionesService.getAllDev();

    // Assert
    expect(result.length).toBe(2);
    expect(Devolucion.findAll).toHaveBeenCalledTimes(1);
  });

  // -------------------------------------------------------------------
  // 2) PRUEBA: getDevById() cuando la devolución existe
  // -------------------------------------------------------------------
  test("getDevById - retorna una devolución por ID", async () => {
    // Arrange
    Devolucion.findByPk.mockResolvedValue({ id: 5, motivo: "Daño" });

    // Act
    const result = await devolucionesService.getDevById(5);

    // Assert
    expect(result).toEqual({ id: 5, motivo: "Daño" });
    expect(Devolucion.findByPk).toHaveBeenCalledWith(5);
  });

  // -------------------------------------------------------------------
  // 3) PRUEBA: getDevById() cuando NO existe → debe retornar null
  // -------------------------------------------------------------------
  test("getDevById - retorna null si no existe", async () => {
    // Arrange
    Devolucion.findByPk.mockResolvedValue(null);

    // Act
    const result = await devolucionesService.getDevById(99);

    // Assert
    expect(result).toBeNull();
  });


  // -------------------------------------------------------------------
  // 4) PRUEBA: updateDev() cuando existe → debe actualizar
  // -------------------------------------------------------------------
  test("updateDev - actualiza una devolución existente", async () => {
    // Arrange: simulamos que el registro existe y tiene un método update()
    const mockDev = {
      id: 1,
      motivo: "Inicial",
      update: jest.fn().mockResolvedValue({ id: 1, motivo: "Actualizado" })
    };

    Devolucion.findByPk.mockResolvedValue(mockDev);

    // Act
    const result = await devolucionesService.updateDev(1, { motivo: "Actualizado" });

    // Assert
    expect(mockDev.update).toHaveBeenCalledWith({ motivo: "Actualizado" });
    expect(result.motivo).toBe("Actualizado");
  });

  // -------------------------------------------------------------------
  // 5) PRUEBA: deleteDev() cuando NO existe → debe retornar null
  // -------------------------------------------------------------------
  test("deleteDev - retorna null si la devolución no existe", async () => {
    // Arrange
    Devolucion.findByPk.mockResolvedValue(null);

    // Act
    const result = await devolucionesService.deleteDev(500);

    // Assert
    expect(result).toBeNull();
  });
});
