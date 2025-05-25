CREATE DATABASE IF NOT EXISTS escuela_db;
USE escuela_db;

-- Tabla de Alumnos
CREATE TABLE IF NOT EXISTS Alumnos (
    id_alumno INT AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(20) UNIQUE NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    grado INT NOT NULL CHECK (grado BETWEEN 1 AND 6),
    correo_electronico VARCHAR(100) UNIQUE NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Asignaturas
CREATE TABLE IF NOT EXISTS Asignaturas (
    id_asignatura INT AUTO_INCREMENT PRIMARY KEY,
    nombre_asignatura VARCHAR(100) NOT NULL,
    grado_imparte INT NOT NULL CHECK (grado_imparte BETWEEN 1 AND 6),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (nombre_asignatura, grado_imparte)
);

-- Tabla de Calificaciones
CREATE TABLE IF NOT EXISTS Calificaciones (
    id_calificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_alumno INT NOT NULL,
    id_asignatura INT NOT NULL,
    valor_calificacion INT NOT NULL CHECK (valor_calificacion BETWEEN 0 AND 100),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_alumno) REFERENCES Alumnos(id_alumno) ON DELETE CASCADE,
    FOREIGN KEY (id_asignatura) REFERENCES Asignaturas(id_asignatura) ON DELETE CASCADE,
    UNIQUE (id_alumno, id_asignatura)
);

-- Insertar algunos datos de ejemplo (opcional)
-- Alumnos
INSERT INTO Alumnos (matricula, nombre_completo, grado, correo_electronico) VALUES
('A001', 'Juan Perez Garcia', 1, 'juan.perez@example.com'),
('A002', 'Ana Lopez Rodriguez', 1, 'ana.lopez@example.com'),
('A003', 'Carlos Sanchez Martinez', 2, 'carlos.sanchez@example.com'),
('A004', 'Laura Fernandez Diaz', 2, 'laura.fernandez@example.com'),
('A005', 'Pedro Gomez Morales', 1, 'pedro.gomez@example.com');

-- Asignaturas
INSERT INTO Asignaturas (nombre_asignatura, grado_imparte) VALUES
('Matemáticas I', 1),
('Español I', 1),
('Ciencias Naturales I', 1),
('Matemáticas II', 2),
('Español II', 2);

-- Calificaciones
-- Juan (A001) - Grado 1
INSERT INTO Calificaciones (id_alumno, id_asignatura, valor_calificacion) VALUES
((SELECT id_alumno FROM Alumnos WHERE matricula = 'A001'), (SELECT id_asignatura FROM Asignaturas WHERE nombre_asignatura = 'Matemáticas I' AND grado_imparte = 1), 85),
((SELECT id_alumno FROM Alumnos WHERE matricula = 'A001'), (SELECT id_asignatura FROM Asignaturas WHERE nombre_asignatura = 'Español I' AND grado_imparte = 1), 90),
((SELECT id_alumno FROM Alumnos WHERE matricula = 'A001'), (SELECT id_asignatura FROM Asignaturas WHERE nombre_asignatura = 'Ciencias Naturales I' AND grado_imparte = 1), 75);

-- Ana (A002) - Grado 1
INSERT INTO Calificaciones (id_alumno, id_asignatura, valor_calificacion) VALUES
((SELECT id_alumno FROM Alumnos WHERE matricula = 'A002'), (SELECT id_asignatura FROM Asignaturas WHERE nombre_asignatura = 'Matemáticas I' AND grado_imparte = 1), 95),
((SELECT id_alumno FROM Alumnos WHERE matricula = 'A002'), (SELECT id_asignatura FROM Asignaturas WHERE nombre_asignatura = 'Español I' AND grado_imparte = 1), 88);

-- Carlos (A003) - Grado 2
INSERT INTO Calificaciones (id_alumno, id_asignatura, valor_calificacion) VALUES
((SELECT id_alumno FROM Alumnos WHERE matricula = 'A003'), (SELECT id_asignatura FROM Asignaturas WHERE nombre_asignatura = 'Matemáticas II' AND grado_imparte = 2), 70),
((SELECT id_alumno FROM Alumnos WHERE matricula = 'A003'), (SELECT id_asignatura FROM Asignaturas WHERE nombre_asignatura = 'Español II' AND grado_imparte = 2), 65);

-- Laura (A004) - Grado 2 (una reprobada)
INSERT INTO Calificaciones (id_alumno, id_asignatura, valor_calificacion) VALUES
((SELECT id_alumno FROM Alumnos WHERE matricula = 'A004'), (SELECT id_asignatura FROM Asignaturas WHERE nombre_asignatura = 'Matemáticas II' AND grado_imparte = 2), 50),
((SELECT id_alumno FROM Alumnos WHERE matricula = 'A004'), (SELECT id_asignatura FROM Asignaturas WHERE nombre_asignatura = 'Español II' AND grado_imparte = 2), 75);

-- Pedro (A005) - Grado 1 (una reprobada)
INSERT INTO Calificaciones (id_alumno, id_asignatura, valor_calificacion) VALUES
((SELECT id_alumno FROM Alumnos WHERE matricula = 'A005'), (SELECT id_asignatura FROM Asignaturas WHERE nombre_asignatura = 'Matemáticas I' AND grado_imparte = 1), 40),
((SELECT id_alumno FROM Alumnos WHERE matricula = 'A005'), (SELECT id_asignatura FROM Asignaturas WHERE nombre_asignatura = 'Español I' AND grado_imparte = 1), 80);