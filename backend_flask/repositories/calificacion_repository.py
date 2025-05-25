from database import fetch_all, fetch_one, execute_query
from .alumno_repository import obtener_alumno_por_id
from .asignatura_repository import obtener_asignatura_por_id

def registrar_calificacion(id_alumno, id_asignatura, valor_calificacion):
    # Validar que la asignatura corresponda al grado del alumno
    alumno = obtener_alumno_por_id(id_alumno)
    asignatura = obtener_asignatura_por_id(id_asignatura)

    if not alumno or not asignatura:
        return None, "Alumno o asignatura no encontrados."
    
    if alumno['grado'] != asignatura['grado_imparte']:
        return None, "La asignatura no corresponde al grado del alumno."

    # Verificar si ya existe una calificación
    existente = fetch_one(
        "SELECT id_calificacion FROM Calificaciones WHERE id_alumno = %s AND id_asignatura = %s",
        (id_alumno, id_asignatura)
    )
    if existente: # Actualizar si ya existe
        query_update = "UPDATE Calificaciones SET valor_calificacion = %s WHERE id_alumno = %s AND id_asignatura = %s"
        params_update = (valor_calificacion, id_alumno, id_asignatura)
        _, rowcount = execute_query(query_update, params_update)
        if rowcount > 0:
            return obtener_calificacion_por_alumno_asignatura(id_alumno, id_asignatura), "Calificación actualizada."
        return None, "Error al actualizar la calificación."

    # Si no existe, insertar
    query_insert = """
        INSERT INTO Calificaciones (id_alumno, id_asignatura, valor_calificacion)
        VALUES (%s, %s, %s)
    """
    params_insert = (id_alumno, id_asignatura, valor_calificacion)
    last_id, _ = execute_query(query_insert, params_insert)
    if last_id:
        return obtener_calificacion_por_id(last_id), "Calificación registrada."
    return None, "Error al registrar la calificación."


def obtener_calificacion_por_id(id_calificacion):
    query = """
        SELECT c.id_calificacion, c.valor_calificacion,
               a.id_alumno, a.matricula, a.nombre_completo AS nombre_alumno,
               asig.id_asignatura, asig.nombre_asignatura
        FROM Calificaciones c
        JOIN Alumnos a ON c.id_alumno = a.id_alumno
        JOIN Asignaturas asig ON c.id_asignatura = asig.id_asignatura
        WHERE c.id_calificacion = %s
    """
    return fetch_one(query, (id_calificacion,))

def obtener_calificacion_por_alumno_asignatura(id_alumno, id_asignatura):
    query = """
        SELECT c.id_calificacion, c.valor_calificacion,
               a.id_alumno, a.matricula, a.nombre_completo AS nombre_alumno,
               asig.id_asignatura, asig.nombre_asignatura
        FROM Calificaciones c
        JOIN Alumnos a ON c.id_alumno = a.id_alumno
        JOIN Asignaturas asig ON c.id_asignatura = asig.id_asignatura
        WHERE c.id_alumno = %s AND c.id_asignatura = %s
    """
    return fetch_one(query, (id_alumno, id_asignatura))


def obtener_calificaciones_por_alumno(id_alumno):
    query = """
        SELECT asig.nombre_asignatura, asig.id_asignatura, c.valor_calificacion
        FROM Calificaciones c
        JOIN Asignaturas asig ON c.id_asignatura = asig.id_asignatura
        WHERE c.id_alumno = %s
        ORDER BY asig.nombre_asignatura
    """
    return fetch_all(query, (id_alumno,))

def obtener_calificaciones_por_asignatura(id_asignatura):
    query = """
        SELECT a.matricula, a.nombre_completo AS nombre_alumno, c.valor_calificacion
        FROM Calificaciones c
        JOIN Alumnos a ON c.id_alumno = a.id_alumno
        WHERE c.id_asignatura = %s
        ORDER BY a.nombre_completo
    """
    return fetch_all(query, (id_asignatura,))