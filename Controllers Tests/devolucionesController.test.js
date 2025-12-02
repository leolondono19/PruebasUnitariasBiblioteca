// devolucionesController.test.js
// Tests para controllers/devolucionesController.js
// Framework: Jest
// NOTA: Mockeamos ../services/devolucionesService para aislar el controller

const controller = require('../src/controllers/devolucionesController');
const devService = require('../src/services/devolucionesService');

jest.mock('../src/services/devolucionesService');

describe('devolucionesController - pruebas seleccionadas', () => {

  // Helper: crea un objeto res con status().json() encadenables y spies
  const makeRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  test('1) getAllDev - devuelve lista correctamente (200 -> res.json llamado con datos)', async () => {
    // Preparación
    const mockData = [{ id: 1, motivo: 'rotura' }, { id: 2, motivo: 'error' }];
    devService.getAllDev.mockResolvedValue(mockData);

    const req = {}; // getAllDev no usa req
    const res = makeRes();

    // Ejecución
    await controller.getAllDev(req, res);

    // Verificaciones / Assert
    expect(devService.getAllDev).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  test('2) getAllDev - service lanza error -> responde 500 con mensaje', async () => {
    // Preparación
    const error = new Error('DB fallo');
    devService.getAllDev.mockRejectedValue(error);

    const req = {};
    const res = makeRes();

    // Ejecución
    await controller.getAllDev(req, res);

    // Assert
    expect(devService.getAllDev).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });

  test('3) getDevById - no existe el id -> responde 404 con mensaje "Dev no encontrado"', async () => {
    // Preparación
    devService.getDevById.mockResolvedValue(null); // no encontrado

    const req = { params: { id: '123' } };
    const res = makeRes();

    // Ejecución
    await controller.getDevById(req, res);

    // Assert
    expect(devService.getDevById).toHaveBeenCalledWith('123');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Dev no encontrado' });
  });

  test('4) createDev - crea correctamente -> responde 201 con el objeto creado', async () => {
    // Preparación
    const input = { motivo: 'defecto', cantidad: 1 };
    const created = { id: 'abc', ...input };
    devService.createDev.mockResolvedValue(created);

    const req = { body: input };
    const res = makeRes();

    // Ejecución
    await controller.createDev(req, res);

    // Assert
    expect(devService.createDev).toHaveBeenCalledWith(input);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  test('5) updateDev - service lanza error de validación -> responde 400 con mensaje', async () => {
    // Preparación
    const validationError = new Error('Datos inválidos');
    devService.updateDev.mockRejectedValue(validationError);

    const req = { params: { id: 'xyz' }, body: { cantidad: -5 } };
    const res = makeRes();

    // Ejecución
    await controller.updateDev(req, res);

    // Assert
    expect(devService.updateDev).toHaveBeenCalledWith('xyz', { cantidad: -5 });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: validationError.message });
  });

});
