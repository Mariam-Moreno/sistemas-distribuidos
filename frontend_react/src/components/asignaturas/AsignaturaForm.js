import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createAsignatura, getAsignaturaById, updateAsignatura } from '../../api';

function AsignaturaForm() {
    const [asignatura, setAsignatura] = useState({
        nombre_asignatura: '',
        grado_imparte: 1
    });
    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams(); // ID de la asignatura para editar

    useEffect(() => {
        if (id) {
            setIsEditing(true);
            const fetchAsignatura = async () => {
                try {
                    const response = await getAsignaturaById(id);
                    setAsignatura(response.data);
                } catch (error) {
                    console.error("Error fetching asignatura:", error);
                }
            };
            fetchAsignatura();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAsignatura(prev => ({ ...prev, [name]: name === 'grado_imparte' ? parseInt(value) : value }));
         if (errors[name] || errors.combinacion) {
            setErrors(prev => ({ ...prev, [name]: null, combinacion: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            if (isEditing) {
                await updateAsignatura(id, asignatura);
            } else {
                await createAsignatura(asignatura);
            }
            navigate('/asignaturas');
        } catch (error) {
            console.error("Error saving asignatura:", error.response?.data);
             if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: "Ocurrió un error inesperado." });
            }
        }
    };

    return (
        <div>
            <h2>{isEditing ? 'Editar' : 'Registrar'} Asignatura</h2>
            {errors.general && <p className="error-message">{errors.general}</p>}
            {errors.combinacion && <p className="error-message">{errors.combinacion}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre de la Asignatura:</label>
                    <input type="text" name="nombre_asignatura" value={asignatura.nombre_asignatura} onChange={handleChange} />
                    {errors.nombre_asignatura && <p className="error-message">{errors.nombre_asignatura}</p>}
                </div>
                <div>
                    <label>Grado en que se Imparte:</label>
                    <select name="grado_imparte" value={asignatura.grado_imparte} onChange={handleChange}>
                        {[1, 2, 3, 4, 5, 6].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    {errors.grado_imparte && <p className="error-message">{errors.grado_imparte}</p>}
                </div>
                <button type="submit">{isEditing ? 'Actualizar' : 'Guardar'}</button>
                <button type="button" onClick={() => navigate('/asignaturas')}>Cancelar</button>
            </form>
        </div>
    );
}

export default AsignaturaForm;