// -------------------------------------------------------
// TESTS DE TDD PARA libroService.js
// -------------------------------------------------------

const libroService = require('../src/services/libroService');

// Mock del modelo Libro
jest.mock('../src/models/libroModel', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn()
}));

const Libro = require('../src/models/libroModel');

describe("TDD - libroService.js", () => {

  // -------------------------------------------------------------------
  // 1) getAllLibros() debe retornar todos los libros
  // -------------------------------------------------------------------
  test("getAllLibros - retorna lista de libros", async () => {
    // Arrange
    Libro.findAll.mockResolvedValue([
      { id: 1, titulo: "El Quijote" },
      { id: 2, titulo: "Cien años de soledad" }
    ]);

    // Act
    const result = await libroService.getAllLibros();

    // Assert
    expect(result.length).toBe(2);
    expect(Libro.findAll).toHaveBeenCalledTimes(1);
  });

  // -------------------------------------------------------------------
  // 2) getLibroById() retorna un libro existente
  // -------------------------------------------------------------------
  test("getLibroById - retorna un libro cuando existe", async () => {
    // Arrange
    Libro.findByPk.mockResolvedValue({ id: 5, titulo: "La Odisea" });

    // Act
    const result = await libroService.getLibroById(5);

    // Assert
    expect(result).toEqual({ id: 5, titulo: "La Odisea" });
    expect(Libro.findByPk).toHaveBeenCalledWith(5);
  });

  // -------------------------------------------------------------------
  // 3) getLibroById() retorna null si el libro NO existe
  // -------------------------------------------------------------------
  test("getLibroById - retorna null cuando el libro no existe", async () => {
    // Arrange
    Libro.findByPk.mockResolvedValue(null);

    // Act
    const result = await libroService.getLibroById(999);

    // Assert
    expect(result).toBeNull();
  });

  // -------------------------------------------------------------------
  // 4) updateLibro() cuando el libro existe
  // -------------------------------------------------------------------
  test("updateLibro - actualiza un libro existente", async () => {
    // Arrange
    const mockLibro = {
      id: 3,
      titulo: "Antiguo",
      update: jest.fn().mockResolvedValue({ id: 3, titulo: "Nuevo título" })
    };

    Libro.findByPk.mockResolvedValue(mockLibro);

    // Act
    const result = await libroService.updateLibro(3, { titulo: "Nuevo título" });

    // Assert
    expect(mockLibro.update).toHaveBeenCalledWith({ titulo: "Nuevo título" });
    expect(result.titulo).toBe("Nuevo título");
  });

  // -------------------------------------------------------------------
  // 5) deleteLibro() retorna null cuando el libro NO existe
  // -------------------------------------------------------------------
  test("deleteLibro - retorna null si el libro no existe", async () => {
    // Arrange
    Libro.findByPk.mockResolvedValue(null);

    // Act
    const result = await libroService.deleteLibro(404);

    // Assert
    expect(result).toBeNull();
  });

});
