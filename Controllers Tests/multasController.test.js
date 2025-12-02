// multasController.test.js
// Pruebas unitarias del controller: src/controllers/multasController.js

const controller = require('../src/controllers/multasController');
const multasService = require('../src/services/multasService');

jest.mock('../src/services/multasService'); // Mock al service

describe('multasController - pruebas unitarias', () => {

  // Helper para crear mocks de res
  const makeRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  test('1) getAllMultas - retorna lista correctamente', async () => {
    // PREPARACIÓN
    const mockMultas = [
      { id: 1, monto: 20 },
      { id: 2, monto: 50 }
    ];
    multasService.getAllMultas.mockResolvedValue(mockMultas);

    const req = {};
    const res = makeRes();

    // EJECUCIÓN
    await controller.getAllMultas(req, res);

    // ASSERT
    expect(multasService.getAllMultas).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockMultas);
  });

  test('2) getMultasById - multa no encontrada devuelve 404', async () => {
    // PREPARACIÓN
    multasService.getMultasById.mockResolvedValue(null);

    const req = { params: { id: '10' } };
    const res = makeRes();

    // EJECUCIÓN
    await controller.getMultasById(req, res);

    // ASSERT
    expect(multasService.getMultasById).toHaveBeenCalledWith('10');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Multa no encontrado' });
  });

  test('3) createMultas - crea correctamente y responde 201', async () => {
    // PREPARACIÓN
    const nuevaMulta = { monto: 80, motivo: 'Retraso' };
    const creada = { id: 5, ...nuevaMulta };

    multasService.createMultas.mockResolvedValue(creada);

    const req = { body: nuevaMulta };
    const res = makeRes();

    // EJECUCIÓN
    await controller.createMultas(req, res);

    // ASSERT
    expect(multasService.createMultas).toHaveBeenCalledWith(nuevaMulta);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(creada);
  });

  test('4) updateMultas - si service retorna null → 404', async () => {
    // PREPARACIÓN
    multasService.updateMultas.mockResolvedValue(null);

    const req = { params: { id: '3' }, body: { monto: 100 } };
    const res = makeRes();

    // EJECUCIÓN
    await controller.updateMultas(req, res);

    // ASSERT
    expect(multasService.updateMultas).toHaveBeenCalledWith('3', { monto: 100 });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Multa no encontrado' });
  });

  test('5) deleteMultas - elimina correctamente cuando existe', async () => {
    // PREPARACIÓN
    const mockDeleteResult = { id: 9, monto: 40 };

    multasService.deleteMultas.mockResolvedValue(mockDeleteResult);

    const req = { params: { id: '9' } };
    const res = makeRes();

    // EJECUCIÓN
    await controller.deleteMultas(req, res);

    // ASSERT
    expect(multasService.deleteMultas).toHaveBeenCalledWith('9');
    expect(res.json).toHaveBeenCalledWith({ message: 'Multa eliminado' });
  });

});
