import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAlumnos, getAsignaturas, registrarCalificacion } from '../../api';

function CalificacionForm() {
    const [formData, setFormData] = useState({
        matricula_alumno: '',
        id_asignatura: '',
        valor_calificacion: ''
    });
    const [alumnos, setAlumnos] = useState([]);
    const [asignaturas, setAsignaturas] = useState([]);
    const [asignaturasFiltradas, setAsignaturasFiltradas] = useState([]);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const alumnosRes = await getAlumnos();
                setAlumnos(alumnosRes.data);
                const asignaturasRes = await getAsignaturas(); // Todas inicialmente
                setAsignaturas(asignaturasRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        // Filtrar asignaturas cuando se selecciona un alumno
        if (formData.matricula_alumno && alumnos.length > 0 && asignaturas.length > 0) {
            const alumnoSeleccionado = alumnos.find(a => a.matricula === formData.matricula_alumno);
            if (alumnoSeleccionado) {
                const filtradas = asignaturas.filter(asig => asig.grado_imparte === alumnoSeleccionado.grado);
                setAsignaturasFiltradas(filtradas);
                // Resetear asignatura si la seleccionada no es válida para el nuevo alumno
                if (formData.id_asignatura && !filtradas.find(as => as.id_asignatura === parseInt(formData.id_asignatura))) {
                    setFormData(prev => ({ ...prev, id_asignatura: ''}));
                }
            } else {
                setAsignaturasFiltradas([]);
            }
        } else {
            setAsignaturasFiltradas([]); // O mostrar todas si no hay alumno
        }
    }, [formData.matricula_alumno, alumnos, asignaturas]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setMessage('');
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: null}));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setMessage('');
        try {
            const payload = {
                ...formData,
                id_asignatura: parseInt(formData.id_asignatura),
                valor_calificacion: parseInt(formData.valor_calificacion)
            };
            const response = await registrarCalificacion(payload);
            setMessage(response.data.message || "Calificación registrada/actualizada exitosamente.");
            // Opcional: resetear formulario
            setFormData({ matricula_alumno: '', id_asignatura: '', valor_calificacion: '' });
        } catch (error) {
            console.error("Error saving calificacion:", error.response?.data);
            if (error.response && error.response.data) {
                if(error.response.data.errors) setErrors(error.response.data.errors);
                if(error.response.data.error) setErrors({general: error.response.data.error});
            } else {
                setErrors({ general: "Ocurrió un error inesperado." });
            }
        }
    };

    return (
        <div>
            <h2>Registrar/Actualizar Calificación</h2>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {errors.general && <p className="error-message">{errors.general}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Alumno:</label>
                    <select name="matricula_alumno" value={formData.matricula_alumno} onChange={handleChange} required>
                        <option value="">Seleccione un alumno</option>
                        {alumnos.map(a => <option key={a.id_alumno} value={a.matricula}>{a.nombre_completo} (Grado: {a.grado})</option>)}
                    </select>
                    {errors.matricula_alumno && <p className="error-message">{errors.matricula_alumno}</p>}
                </div>
                <div>
                    <label>Asignatura:</label>
                    <select name="id_asignatura" value={formData.id_asignatura} onChange={handleChange} required disabled={!formData.matricula_alumno}>
                        <option value="">Seleccione una asignatura</option>
                        {asignaturasFiltradas.map(as => <option key={as.id_asignatura} value={as.id_asignatura}>{as.nombre_asignatura}</option>)}
                    </select>
                    {errors.id_asignatura && <p className="error-message">{errors.id_asignatura}</p>}
                </div>
                <div>
                    <label>Calificación (0-100):</label>
                    <input type="number" name="valor_calificacion" value={formData.valor_calificacion} onChange={handleChange} min="0" max="100" required />
                    {errors.valor_calificacion && <p className="error-message">{errors.valor_calificacion}</p>}
                </div>
                <button type="submit">Guardar Calificación</button>
            </form>
        </div>
    );
}

export default CalificacionForm;