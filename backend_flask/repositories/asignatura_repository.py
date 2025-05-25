from database import fetch_all, fetch_one, execute_query

def crear_asignatura(nombre_asignatura, grado_imparte):
    query = """
        INSERT INTO Asignaturas (nombre_asignatura, grado_imparte)
        VALUES (%s, %s)
    """
    params = (nombre_asignatura, grado_imparte)
    last_id, _ = execute_query(query, params)
    if last_id:
        return obtener_asignatura_por_id(last_id)
    return None

def obtener_asignaturas(grado=None):
    base_query = "SELECT id_asignatura, nombre_asignatura, grado_imparte FROM Asignaturas"
    params = []
    if grado:
        base_query += " WHERE grado_imparte = %s"
        params.append(grado)
    base_query += " ORDER BY grado_imparte, nombre_asignatura"
    return fetch_all(base_query, params)

def obtener_asignatura_por_id(id_asignatura):
    query = "SELECT id_asignatura, nombre_asignatura, grado_imparte FROM Asignaturas WHERE id_asignatura = %s"
    return fetch_one(query, (id_asignatura,))

def actualizar_asignatura(id_asignatura, nombre_asignatura, grado_imparte):
    asignatura = obtener_asignatura_por_id(id_asignatura)
    if not asignatura:
        return None
        
    query = """
        UPDATE Asignaturas
        SET nombre_asignatura = %s, grado_imparte = %s
        WHERE id_asignatura = %s
    """
    params = (nombre_asignatura, grado_imparte, id_asignatura)
    _, rowcount = execute_query(query, params)
    if rowcount > 0:
        return obtener_asignatura_por_id(id_asignatura)
    return None

def eliminar_asignatura(id_asignatura):
    query = "DELETE FROM Asignaturas WHERE id_asignatura = %s"
    _, rowcount = execute_query(query, (id_asignatura,))
    return rowcount > 0