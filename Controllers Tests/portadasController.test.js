// ===============================
// TEST: portadasController.test.js
// Controlador: portadasController.js
// Este archivo contiene 5 pruebas unitarias completas,
// agrupadas en describes para cada método clave.
// ===============================

const {
  uploadPortada,
  downloadPortada,
  listPortadas,
  deletePortada
} = require('../controllers/portadasController');

const minioClient = require('../config/minioClient');

// --- Hacemos mock del cliente de MinIO ---
jest.mock('../config/minioClient', () => ({
  putObject: jest.fn(),
  getObject: jest.fn(),
  removeObject: jest.fn(),
  listObjects: jest.fn()
}));

// ==========================================
// 1) TEST: uploadPortada
// ==========================================
describe('uploadPortada', () => {

  test('Debe subir un archivo correctamente (200)', async () => {
    // --- PREPARACIÓN ---
    const req = {
      files: {
        file: {
          name: 'portada.jpg',
          mimetype: 'image/jpeg',
          data: Buffer.from('fake-image-file')
        }
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    minioClient.putObject.mockResolvedValue(true);

    // --- EJECUCIÓN ---
    await uploadPortada(req, res);

    // --- ASSERT ---
    expect(minioClient.putObject).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Archivo portada.jpg subido correctamente"
    });
  });

});


// ==========================================
// 2) TEST: downloadPortada
// ==========================================
describe('downloadPortada', () => {

  test('Debe descargar un archivo correctamente', async () => {
    // --- PREPARACIÓN ---
    const mockStream = {
      pipe: jest.fn()
    };

    minioClient.getObject.mockResolvedValue(mockStream);

    const req = { params: { fileName: 'portada.jpg' } };

    const res = {
      setHeader: jest.fn(),
      pipe: jest.fn()
    };

    // --- EJECUCIÓN ---
    await downloadPortada(req, res);

    // --- ASSERT ---
    expect(minioClient.getObject).toHaveBeenCalledWith('portadas', 'portada.jpg');
    expect(res.setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'attachment; filename=portada.jpg'
    );
    expect(mockStream.pipe).toHaveBeenCalledWith(res);
  });

});


// ==========================================
// 3) TEST: listPortadas
// ==========================================
describe('listPortadas', () => {

  test('Debe listar archivos correctamente (200)', () => {
    // --- PREPARACIÓN ---
    const req = {};

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const mockStream = {
      on: jest.fn((event, callback) => {
        if (event === 'data') {
          callback({ name: 'foto1.jpg' });
          callback({ name: 'foto2.png' });
        }
        if (event === 'end') {
          callback();
        }
      })
    };

    minioClient.listObjects.mockReturnValue(mockStream);

    // --- EJECUCIÓN ---
    listPortadas(req, res);

    // --- ASSERT ---
    expect(minioClient.listObjects).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      files: ['foto1.jpg', 'foto2.png']
    });
  });

});


// ==========================================
// 4) TEST: deletePortada
// ==========================================
describe('deletePortada', () => {

  test('Debe eliminar un archivo correctamente (200)', async () => {
    // --- PREPARACIÓN ---
    minioClient.removeObject.mockResolvedValue(true);

    const req = { params: { fileName: 'portada.jpg' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // --- EJECUCIÓN ---
    await deletePortada(req, res);

    // --- ASSERT ---
    expect(minioClient.removeObject)
      .toHaveBeenCalledWith('portadas', 'portada.jpg');

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Archivo portada.jpg eliminado correctamente"
    });
  });

});


// ==========================================
// 5) TEST EXTRA: uploadPortada sin archivo (400)
// ==========================================
describe('uploadPortada - error sin archivo', () => {

  test('Debe devolver 400 si no se envía un archivo', async () => {
    // --- PREPARACIÓN ---
    const req = { files: null };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // --- EJECUCIÓN ---
    await uploadPortada(req, res);

    // --- ASSERT ---
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'No se encontró un archivo en la solicitud'
    });
  });

});
