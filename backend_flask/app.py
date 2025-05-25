from flask import Flask, request, jsonify
from flask_cors import CORS
from repositories import alumno_repository, asignatura_repository, calificacion_repository, reporte_repository
from db_config import UMBRAL_APROBACION
import re # Para validación de correo

app = Flask(__name__)
CORS(app) # Habilita CORS para todas las rutas

# --- Validación Helpers ---
def is_valid_email(email):
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(pattern, email) is not None

def validate_alumno_data(data, is_update=False, matricula_original=None):
    errors = {}
    required_fields = ['nombre_completo', 'grado', 'correo_electronico']
    if not is_update:
        required_fields.append('matricula')

    for field in required_fields:
        if field not in data or not data[field]:
            errors[field] = f"{field} es requerido."
    
    if 'matricula' in data and not data.get('matricula'):
         errors['matricula'] = "Matrícula es requerida."

    if 'grado' in data and not isinstance(data.get('grado'), int):
        try:
            data['grado'] = int(data['grado'])
        except ValueError:
             errors['grado'] = "Grado debe ser un número."

    if 'grado' in data and data.get('grado') not in range(1, 7):
        errors['grado'] = "Grado debe estar entre 1 y 6."
    
    if 'correo_electronico' in data and not is_valid_email(data.get('correo_electronico')):
        errors['correo_electronico'] = "Correo electrónico inválido."
    
    # Validar unicidad de matrícula y correo (solo si no es el mismo alumno al actualizar)
    if 'matricula' in data and data.get('matricula'):
        existing_by_matricula = alumno_repository.obtener_alumno_por_matricula(data['matricula'])
        if existing_by_matricula and (not is_update or (is_update and data['matricula'] != matricula_original)):
            errors['matricula'] = "La matrícula ya existe."

    if 'correo_electronico' in data and data.get('correo_electronico'):
        # Esta validación es un poco más compleja si se permite cambiar el correo y ya existe para otro.
        # Para simplificar, asumimos que se verifica contra todos.
        # Debería ser: si el correo nuevo es diferente al original y ya existe en otro alumno.
        # Por ahora, si existe y no es el alumno actual (si es update), da error.
        conn = alumno_repository.fetch_all("SELECT id_alumno FROM Alumnos WHERE correo_electronico = %s", (data['correo_electronico'],))
        if conn:
            is_self = False
            if is_update and matricula_original:
                current_alumno = alumno_repository.obtener_alumno_por_matricula(matricula_original)
                if current_alumno and current_alumno['id_alumno'] == conn[0]['id_alumno']:
                    is_self = True
            if not is_self:
                 errors['correo_electronico'] = "El correo electrónico ya está en uso."


    return errors

def validate_asignatura_data(data, is_update=False, id_asignatura_original=None):
    errors = {}
    required_fields = ['nombre_asignatura', 'grado_imparte']
    for field in required_fields:
        if field not in data or not data[field]:
            errors[field] = f"{field} es requerido."
    
    if 'grado_imparte' in data and not isinstance(data.get('grado_imparte'), int):
        try:
            data['grado_imparte'] = int(data['grado_imparte'])
        except ValueError:
            errors['grado_imparte'] = "Grado debe ser un número."

    if 'grado_imparte' in data and data.get('grado_imparte') not in range(1, 7):
        errors['grado_imparte'] = "Grado en que se imparte debe estar entre 1 y 6."

    # Validar unicidad de nombre_asignatura y grado_imparte
    if 'nombre_asignatura' in data and 'grado_imparte' in data:
        existente = asignatura_repository.fetch_one(
            "SELECT id_asignatura FROM Asignaturas WHERE nombre_asignatura = %s AND grado_imparte = %s",
            (data['nombre_asignatura'], data['grado_imparte'])
        )
        if existente and (not is_update or (is_update and existente['id_asignatura'] != id_asignatura_original)):
            errors['combinacion'] = "Ya existe una asignatura con ese nombre para ese grado."
    return errors

def validate_calificacion_data(data):
    errors = {}
    required_fields = ['matricula_alumno', 'id_asignatura', 'valor_calificacion']
    for field in required_fields:
        if field not in data or data.get(field) is None: # None para valor_calificacion = 0
             if field == 'valor_calificacion' and data.get(field) == 0:
                 pass # 0 es válido
             else:
                errors[field] = f"{field} es requerido."

    if 'valor_calificacion' in data and data.get('valor_calificacion') is not None:
        try:
            val = int(data['valor_calificacion'])
            if not (0 <= val <= 100):
                errors['valor_calificacion'] = "La calificación debe estar entre 0 y 100."
        except ValueError:
            errors['valor_calificacion'] = "La calificación debe ser un número."
    return errors

# --- Rutas de Alumnos ---
@app.route('/alumnos', methods=['POST'])
def crear_alumno_route():
    data = request.get_json()
    errors = validate_alumno_data(data)
    if errors:
        return jsonify({"errors": errors}), 400

    alumno = alumno_repository.crear_alumno(
        data['matricula'], data['nombre_completo'], data['grado'], data['correo_electronico']
    )
    if alumno:
        return jsonify(alumno), 201
    return jsonify({"error": "No se pudo crear el alumno, matrícula o correo podrían ya existir"}), 500


@app.route('/alumnos', methods=['GET'])
def obtener_alumnos_route():
    alumnos = alumno_repository.obtener_alumnos()
    return jsonify(alumnos)

@app.route('/alumnos/<string:matricula>', methods=['GET'])
def obtener_alumno_route(matricula):
    alumno = alumno_repository.obtener_alumno_por_matricula(matricula)
    if alumno:
        return jsonify(alumno)
    return jsonify({"error": "Alumno no encontrado"}), 404

@app.route('/alumnos/<string:matricula>', methods=['PUT'])
def actualizar_alumno_route(matricula):
    data = request.get_json()
    # Asegurar que la nueva matricula esté en data si se va a cambiar.
    # Si no viene, se asume que la matricula no cambia.
    nueva_matricula = data.get('matricula', matricula) 

    errors = validate_alumno_data(data, is_update=True, matricula_original=matricula)
    if errors:
        return jsonify({"errors": errors}), 400

    alumno_actualizado = alumno_repository.actualizar_alumno(
        matricula, data['nombre_completo'], data['grado'], data['correo_electronico'], nueva_matricula
    )
    if alumno_actualizado:
        return jsonify(alumno_actualizado)
    return jsonify({"error": "Alumno no encontrado o no se pudo actualizar"}), 404

@app.route('/alumnos/<string:matricula>', methods=['DELETE'])
def eliminar_alumno_route(matricula):
    if alumno_repository.eliminar_alumno(matricula):
        return '', 204
    return jsonify({"error": "Alumno no encontrado o no se pudo eliminar"}), 404

# --- Rutas de Asignaturas ---
@app.route('/asignaturas', methods=['POST'])
def crear_asignatura_route():
    data = request.get_json()
    errors = validate_asignatura_data(data)
    if errors:
        return jsonify({"errors": errors}), 400
        
    asignatura = asignatura_repository.crear_asignatura(
        data['nombre_asignatura'], data['grado_imparte']
    )
    if asignatura:
        return jsonify(asignatura), 201
    return jsonify({"error": "No se pudo crear la asignatura, combinación nombre/grado ya existe"}), 500

@app.route('/asignaturas', methods=['GET'])
def obtener_asignaturas_route():
    grado = request.args.get('grado')
    asignaturas = asignatura_repository.obtener_asignaturas(grado)
    return jsonify(asignaturas)

@app.route('/asignaturas/<int:id_asignatura>', methods=['GET'])
def obtener_asignatura_route(id_asignatura):
    asignatura = asignatura_repository.obtener_asignatura_por_id(id_asignatura)
    if asignatura:
        return jsonify(asignatura)
    return jsonify({"error": "Asignatura no encontrada"}), 404

@app.route('/asignaturas/<int:id_asignatura>', methods=['PUT'])
def actualizar_asignatura_route(id_asignatura):
    data = request.get_json()
    errors = validate_asignatura_data(data, is_update=True, id_asignatura_original=id_asignatura)
    if errors:
        return jsonify({"errors": errors}), 400

    asignatura_actualizada = asignatura_repository.actualizar_asignatura(
        id_asignatura, data['nombre_asignatura'], data['grado_imparte']
    )
    if asignatura_actualizada:
        return jsonify(asignatura_actualizada)
    return jsonify({"error": "Asignatura no encontrada o no se pudo actualizar"}), 404

@app.route('/asignaturas/<int:id_asignatura>', methods=['DELETE'])
def eliminar_asignatura_route(id_asignatura):
    if asignatura_repository.eliminar_asignatura(id_asignatura):
        return '', 204
    return jsonify({"error": "Asignatura no encontrada o no se pudo eliminar"}), 404

# --- Rutas de Calificaciones ---
@app.route('/calificaciones', methods=['POST'])
def registrar_calificacion_route():
    data = request.get_json()
    errors = validate_calificacion_data(data)
    if errors:
        return jsonify({"errors": errors}), 400

    alumno = alumno_repository.obtener_alumno_por_matricula(data['matricula_alumno'])
    if not alumno:
        return jsonify({"error": "Alumno no encontrado"}), 404
    
    asignatura = asignatura_repository.obtener_asignatura_por_id(data['id_asignatura'])
    if not asignatura:
        return jsonify({"error": "Asignatura no encontrada"}), 404

    calificacion, msg = calificacion_repository.registrar_calificacion(
        alumno['id_alumno'], asignatura['id_asignatura'], int(data['valor_calificacion'])
    )
    if calificacion:
        return jsonify({"message": msg, "data": calificacion}), 201
    return jsonify({"error": msg}), 400 # O 500 si es error de BD

@app.route('/calificaciones/alumno/<string:matricula_alumno>', methods=['GET'])
def obtener_calificaciones_alumno_route(matricula_alumno):
    alumno = alumno_repository.obtener_alumno_por_matricula(matricula_alumno)
    if not alumno:
        return jsonify({"error": "Alumno no encontrado"}), 404
    
    calificaciones = calificacion_repository.obtener_calificaciones_por_alumno(alumno['id_alumno'])
    return jsonify(calificaciones)

@app.route('/calificaciones/asignatura/<int:id_asignatura>', methods=['GET'])
def obtener_calificaciones_asignatura_route(id_asignatura):
    asignatura = asignatura_repository.obtener_asignatura_por_id(id_asignatura)
    if not asignatura:
        return jsonify({"error": "Asignatura no encontrada"}), 404

    calificaciones = calificacion_repository.obtener_calificaciones_por_asignatura(id_asignatura)
    return jsonify(calificaciones)


# --- Rutas de Reportes ---
@app.route('/reportes/boleta/<string:matricula_alumno>', methods=['GET'])
def reporte_boleta_route(matricula_alumno):
    boleta = reporte_repository.obtener_boleta_alumno(matricula_alumno)
    if boleta:
        return jsonify(boleta)
    return jsonify({"error": "Alumno no encontrado para generar boleta"}), 404

@app.route('/reportes/asignatura/<int:id_asignatura>/calificaciones', methods=['GET'])
def reporte_calificaciones_asignatura_route(id_asignatura):
    reporte = reporte_repository.obtener_calificaciones_y_promedio_asignatura(id_asignatura)
    if reporte:
        return jsonify(reporte)
    return jsonify({"error": "Asignatura no encontrada para generar reporte"}), 404

@app.route('/reportes/alumnos/regulares', methods=['GET'])
def reporte_alumnos_regulares_route():
    grado = request.args.get('grado')
    reporte = reporte_repository.obtener_alumnos_regulares(grado)
    return jsonify(reporte)

@app.route('/reportes/alumnos/irregulares', methods=['GET'])
def reporte_alumnos_irregulares_route():
    grado = request.args.get('grado')
    reporte = reporte_repository.obtener_alumnos_irregulares(grado)
    return jsonify(reporte)

if __name__ == '__main__':
    app.run(debug=True, port=5001) # Puerto 5001 para no colisionar con React