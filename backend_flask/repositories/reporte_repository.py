from database import fetch_all, fetch_one
from db_config import UMBRAL_APROBACION

def obtener_boleta_alumno(matricula_alumno):
    alumno_query = "SELECT id_alumno, matricula, nombre_completo, grado FROM Alumnos WHERE matricula = %s"
    alumno = fetch_one(alumno_query, (matricula_alumno,))
    if not alumno:
        return None

    calificaciones_query = """
        SELECT asig.nombre_asignatura, c.valor_calificacion
        FROM Calificaciones c
        JOIN Asignaturas asig ON c.id_asignatura = asig.id_asignatura
        WHERE c.id_alumno = %s
        ORDER BY asig.nombre_asignatura
    """
    calificaciones = fetch_all(calificaciones_query, (alumno['id_alumno'],))

    promedio_general = 0
    if calificaciones:
        promedio_general = sum(cal['valor_calificacion'] for cal in calificaciones) / len(calificaciones)

    return {
        "alumno": alumno,
        "calificaciones": calificaciones,
        "promedio_general": round(promedio_general, 2)
    }

def obtener_calificaciones_y_promedio_asignatura(id_asignatura):
    asignatura_query = "SELECT id_asignatura, nombre_asignatura, grado_imparte FROM Asignaturas WHERE id_asignatura = %s"
    asignatura = fetch_one(asignatura_query, (id_asignatura,))
    if not asignatura:
        return None

    calificaciones_query = """
        SELECT a.matricula AS alumno_matricula, a.nombre_completo AS alumno_nombre, c.valor_calificacion
        FROM Calificaciones c
        JOIN Alumnos a ON c.id_alumno = a.id_alumno
        WHERE c.id_asignatura = %s
        ORDER BY a.nombre_completo
    """
    calificaciones_lista = fetch_all(calificaciones_query, (id_asignatura,))

    promedio_asignatura = 0
    if calificaciones_lista:
        promedio_asignatura = sum(cal['valor_calificacion'] for cal in calificaciones_lista) / len(calificaciones_lista)

    return {
        "asignatura": asignatura,
        "calificaciones": calificaciones_lista,
        "promedio_asignatura": round(promedio_asignatura, 2)
    }

def obtener_alumnos_regulares(grado_filtro=None):
    # Subconsulta para contar reprobadas por alumno
    # Un alumno es regular si NO tiene calificaciones < UMBRAL_APROBACION
    # O si no tiene calificaciones registradas (implícitamente regular hasta que se califique)
    
    query = """
        SELECT a.id_alumno, a.matricula, a.nombre_completo, a.grado, a.correo_electronico
        FROM Alumnos a
        LEFT JOIN (
            SELECT id_alumno, COUNT(*) as num_reprobadas
            FROM Calificaciones
            WHERE valor_calificacion < %s
            GROUP BY id_alumno
        ) r ON a.id_alumno = r.id_alumno
        WHERE COALESCE(r.num_reprobadas, 0) = 0
    """
    params = [UMBRAL_APROBACION]

    if grado_filtro:
        query += " AND a.grado = %s"
        params.append(int(grado_filtro))
    
    query += " ORDER BY a.grado, a.nombre_completo"
    
    alumnos = fetch_all(query, tuple(params))
    
    # Agrupar por grado
    regulares_por_grado = {}
    for alumno in alumnos:
        grado = alumno['grado']
        if grado not in regulares_por_grado:
            regulares_por_grado[grado] = []
        regulares_por_grado[grado].append({
            "matricula": alumno['matricula'],
            "nombre_completo": alumno['nombre_completo'],
            "correo_electronico": alumno['correo_electronico']
        })
    return regulares_por_grado


def obtener_alumnos_irregulares(grado_filtro=None):
    # Un alumno es irregular si tiene AL MENOS UNA calificación < UMBRAL_APROBACION
    query = """
        SELECT a.id_alumno, a.matricula, a.nombre_completo, a.grado, a.correo_electronico,
               COUNT(CASE WHEN c.valor_calificacion < %s THEN 1 END) as reprobadas
        FROM Alumnos a
        JOIN Calificaciones c ON a.id_alumno = c.id_alumno
        WHERE c.valor_calificacion < %s
    """
    params = [UMBRAL_APROBACION, UMBRAL_APROBACION]

    if grado_filtro:
        query += " AND a.grado = %s"
        params.append(int(grado_filtro))
    
    query += " GROUP BY a.id_alumno, a.matricula, a.nombre_completo, a.grado, a.correo_electronico"
    query += " HAVING COUNT(CASE WHEN c.valor_calificacion < %s THEN 1 END) > 0"
    params.append(UMBRAL_APROBACION)
    
    query += " ORDER BY a.grado, a.nombre_completo"
    
    alumnos = fetch_all(query, tuple(params))

    irregulares_por_grado = {}
    for alumno in alumnos:
        grado = alumno['grado']
        if grado not in irregulares_por_grado:
            irregulares_por_grado[grado] = []
        irregulares_por_grado[grado].append({
            "matricula": alumno['matricula'],
            "nombre_completo": alumno['nombre_completo'],
            "correo_electronico": alumno['correo_electronico'],
            "reprobadas": alumno['reprobadas']
        })
    return irregulares_por_grado