// libroController.test.js
// Pruebas unitarias del controller: src/controllers/libroController.js

const controller = require('../src/controllers/libroController');
const libroService = require('../src/services/libroService');

jest.mock('../src/services/libroService');

describe('libroController - pruebas variadas', () => {

  const makeRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  test('1) getAllLibros - devuelve lista correctamente', async () => {
    // Preparación
    const mockLibros = [
      { id: 1, titulo: 'Libro A' },
      { id: 2, titulo: 'Libro B' }
    ];
    libroService.getAllLibros.mockResolvedValue(mockLibros);

    const req = {};
    const res = makeRes();

    // Ejecución
    await controller.getAllLibros(req, res);

    // Assert
    expect(libroService.getAllLibros).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockLibros);
  });

  test('2) getLibroById - libro no encontrado devuelve 404', async () => {
    // Preparación
    libroService.getLibroById.mockResolvedValue(null);

    const req = { params: { id: '50' } };
    const res = makeRes();

    // Ejecución
    await controller.getLibroById(req, res);

    // Assert
    expect(libroService.getLibroById).toHaveBeenCalledWith('50');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Libro no encontrado' });
  });

  test('3) createLibro - crea correctamente y devuelve status 201', async () => {
    // Preparación
    const input = { titulo: 'Nuevo libro', autor: 'Anonimo' };
    const creado = { id: 99, ...input };

    libroService.createLibro.mockResolvedValue(creado);

    const req = { body: input };
    const res = makeRes();

    // Ejecución
    await controller.createLibro(req, res);

    // Assert
    expect(libroService.createLibro).toHaveBeenCalledWith(input);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(creado);
  });

  test('4) updateLibro - cuando service devuelve null -> 404 Libro no encontrado', async () => {
    // Preparación
    libroService.updateLibro.mockResolvedValue(null);

    const req = { params: { id: '10' }, body: { titulo: 'Nuevo titulo' } };
    const res = makeRes();

    // Ejecución
    await controller.updateLibro(req, res);

    // Assert
    expect(libroService.updateLibro).toHaveBeenCalledWith('10', { titulo: 'Nuevo titulo' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Libro no encontrado' });
  });

  test('5) updateEstadoLibro - actualiza el estado y ejecuta .save()', async () => {
    // ⚡ Esta es la prueba más especial porque updateEstadoLibro usa:
    // 1) libroService.getLibroById()
    // 2) luego edita libro.idestado
    // 3) luego llama libro.save()

    // Preparación
    const libroMock = {
      id: 7,
      titulo: 'Libro X',
      idestado: 1,
      save: jest.fn().mockResolvedValue(true)  // simulamos .save()
    };

    libroService.getLibroById.mockResolvedValue(libroMock);

    const req = { params: { id: '7' }, body: { estado: 5 } };
    const res = makeRes();

    // Ejecución
    await controller.updateEstadoLibro(req, res);

    // Assert
    expect(libroService.getLibroById).toHaveBeenCalledWith('7');
    expect(libroMock.idestado).toBe(5); // Se actualizó el estado
    expect(libroMock.save).toHaveBeenCalled(); // Importante
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(libroMock);
  });

});
