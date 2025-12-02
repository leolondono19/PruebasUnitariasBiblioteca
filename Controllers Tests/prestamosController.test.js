// ===============================================
// TEST: prestamosController.test.js
// Controlador: prestamosController.js
// Pruebas unitarias usando Jest con mocks de prestamoService
// ===============================================

const {
  getAllPrestamos,
  getPrestamoById,
  createPrestamo,
  updatePrestamo,
  deletePrestamo,
  updateEstadoPrestamo
} = require('../controllers/prestamosController');

const prestamoService = require('../services/prestamoService');

// Mock del service
jest.mock('../services/prestamoService', () => ({
  getAllPrestamos: jest.fn(),
  getPrestamoById: jest.fn(),
  createPrestamo: jest.fn(),
  updatePrestamo: jest.fn(),
  deletePrestamo: jest.fn()
}));


// =======================================================
// 1) TEST: getAllPrestamos debe devolver lista (200)
// =======================================================
describe('getAllPrestamos', () => {

  test('Debe devolver todos los préstamos correctamente', async () => {
    // ARRANGE
    const prestamosMock = [
      { id: 1, usuario: 'Juan' },
      { id: 2, usuario: 'Ana' }
    ];

    prestamoService.getAllPrestamos.mockResolvedValue(prestamosMock);

    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    // ACT
    await getAllPrestamos(req, res);

    // ASSERT
    expect(prestamoService.getAllPrestamos).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(prestamosMock);
  });

});


// =======================================================
// 2) TEST: getPrestamoById (200)
// =======================================================
describe('getPrestamoById', () => {

  test('Debe devolver un préstamo si existe (200)', async () => {
    // ARRANGE
    const prestamoMock = { id: 10, usuario: 'Carlos' };

    prestamoService.getPrestamoById.mockResolvedValue(prestamoMock);

    const req = { params: { id: 10 } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    // ACT
    await getPrestamoById(req, res);

    // ASSERT
    expect(prestamoService.getPrestamoById).toHaveBeenCalledWith(10);
    expect(res.json).toHaveBeenCalledWith(prestamoMock);
  });

});


// =======================================================
// 3) TEST: getPrestamoById (404)
// =======================================================
describe('getPrestamoById - NOT FOUND', () => {

  test('Debe devolver 404 si el préstamo NO existe', async () => {
    // ARRANGE
    prestamoService.getPrestamoById.mockResolvedValue(null);

    const req = { params: { id: 99 } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    // ACT
    await getPrestamoById(req, res);

    // ASSERT
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Prestamo no encontrado' });
  });

});


// =======================================================
// 4) TEST: updateEstadoPrestamo (200)
// =======================================================
describe('updateEstadoPrestamo', () => {

  test('Debe actualizar el estado del préstamo (200)', async () => {
    // ARRANGE
    const prestamoMock = {
      id: 5,
      estados_idestado: 1,
      save: jest.fn()
    };

    prestamoService.getPrestamoById.mockResolvedValue(prestamoMock);

    const req = {
      params: { id: 5 },
      body: { estado: 3 }
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    // ACT
    await updateEstadoPrestamo(req, res);

    // ASSERT
    expect(prestamoService.getPrestamoById).toHaveBeenCalledWith(5);
    expect(prestamoMock.estados_idestado).toBe(3);
    expect(prestamoMock.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(prestamoMock);
  });

});


// =======================================================
// 5) TEST: createPrestamo (201)
// =======================================================
describe('createPrestamo', () => {

  test('Debe crear un préstamo nuevo (201)', async () => {
    // ARRANGE
    const nuevoPrestamo = { usuario: 'Mario', libro: 8 };

    prestamoService.createPrestamo.mockResolvedValue(nuevoPrestamo);

    const req = { body: nuevoPrestamo };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    // ACT
    await createPrestamo(req, res);

    // ASSERT
    expect(prestamoService.createPrestamo).toHaveBeenCalledWith(nuevoPrestamo);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(nuevoPrestamo);
  });

});

