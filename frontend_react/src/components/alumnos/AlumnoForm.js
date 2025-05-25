import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createAlumno, getAlumnoByMatricula, updateAlumno } from '../../api';

function AlumnoForm() {
    const [alumno, setAlumno] = useState({
        matricula: '',
        nombre_completo: '',
        grado: 1,
        correo_electronico: ''
    });
    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const { matricula: paramMatricula } = useParams(); // Matrícula original para editar

    useEffect(() => {
        if (paramMatricula) {
            setIsEditing(true);
            const fetchAlumno = async () => {
                try {
                    const response = await getAlumnoByMatricula(paramMatricula);
                    setAlumno(response.data);
                } catch (error) {
                    console.error("Error fetching alumno:", error);
                    // Manejar error, ej. redirigir si no se encuentra
                }
            };
            fetchAlumno();
        }
    }, [paramMatricula]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAlumno(prev => ({ ...prev, [name]: name === 'grado' ? parseInt(value) : value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Limpiar errores previos
        try {
            if (isEditing) {
                await updateAlumno(paramMatricula, alumno); // Usa la matrícula original para el endpoint
            } else {
                await createAlumno(alumno);
            }
            navigate('/alumnos');
        } catch (error) {
            console.error("Error saving alumno:", error.response?.data);
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: "Ocurrió un error inesperado." });
            }
        }
    };

    return (
        <div>
            <h2>{isEditing ? 'Editar' : 'Registrar'} Alumno</h2>
            {errors.general && <p className="error-message">{errors.general}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Matrícula:</label>
                    <input type="text" name="matricula" value={alumno.matricula} onChange={handleChange} disabled={isEditing && paramMatricula === alumno.matricula} />
                    {errors.matricula && <p className="error-message">{errors.matricula}</p>}
                </div>
                <div>
                    <label>Nombre Completo:</label>
                    <input type="text" name="nombre_completo" value={alumno.nombre_completo} onChange={handleChange} />
                    {errors.nombre_completo && <p className="error-message">{errors.nombre_completo}</p>}
                </div>
                <div>
                    <label>Grado:</label>
                    <select name="grado" value={alumno.grado} onChange={handleChange}>
                        {[1, 2, 3, 4, 5, 6].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    {errors.grado && <p className="error-message">{errors.grado}</p>}
                </div>
                <div>
                    <label>Correo Electrónico:</label>
                    <input type="email" name="correo_electronico" value={alumno.correo_electronico} onChange={handleChange} />
                    {errors.correo_electronico && <p className="error-message">{errors.correo_electronico}</p>}
                </div>
                <button type="submit">{isEditing ? 'Actualizar' : 'Guardar'}</button>
                <button type="button" onClick={() => navigate('/alumnos')}>Cancelar</button>
            </form>
        </div>
    );
}

export default AlumnoForm;