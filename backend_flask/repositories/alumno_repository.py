from database import fetch_all, fetch_one, execute_query

def crear_alumno(matricula, nombre_completo, grado, correo_electronico):
    query = """
        INSERT INTO Alumnos (matricula, nombre_completo, grado, correo_electronico)
        VALUES (%s, %s, %s, %s)
    """
    params = (matricula, nombre_completo, grado, correo_electronico)
    last_id, _ = execute_query(query, params)
    if last_id:
        return obtener_alumno_por_id(last_id)
    return None

def obtener_alumnos():
    query = "SELECT id_alumno, matricula, nombre_completo, grado, correo_electronico FROM Alumnos ORDER BY nombre_completo"
    return fetch_all(query)

def obtener_alumno_por_id(id_alumno):
    query = "SELECT id_alumno, matricula, nombre_completo, grado, correo_electronico FROM Alumnos WHERE id_alumno = %s"
    return fetch_one(query, (id_alumno,))

def obtener_alumno_por_matricula(matricula):
    query = "SELECT id_alumno, matricula, nombre_completo, grado, correo_electronico FROM Alumnos WHERE matricula = %s"
    return fetch_one(query, (matricula,))

def actualizar_alumno(matricula_original, nombre_completo, grado, correo_electronico, nueva_matricula):
    alumno = obtener_alumno_por_matricula(matricula_original)
    if not alumno:
        return None
    
    query = """
        UPDATE Alumnos
        SET nombre_completo = %s, grado = %s, correo_electronico = %s, matricula = %s
        WHERE matricula = %s
    """
    params = (nombre_completo, grado, correo_electronico, nueva_matricula, matricula_original)
    _, rowcount = execute_query(query, params)
    if rowcount > 0:
        return obtener_alumno_por_matricula(nueva_matricula)
    return None


def eliminar_alumno(matricula):
    query = "DELETE FROM Alumnos WHERE matricula = %s"
    _, rowcount = execute_query(query, (matricula,))
    return rowcount > 0