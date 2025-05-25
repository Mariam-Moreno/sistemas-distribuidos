import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCalificacionesByAlumno, getAlumnoByMatricula } from '../../api';

function CalificacionesPorAlumno() {
    const [calificaciones, setCalificaciones] = useState([]);
    const [alumno, setAlumno] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { matricula } = useParams();

    useEffect(() => {
        const fetchCalificaciones = async () => {
            setLoading(true);
            setError('');
            try {
                const alumnoRes = await getAlumnoByMatricula(matricula);
                setAlumno(alumnoRes.data);
                const califRes = await getCalificacionesByAlumno(matricula);
                setCalificaciones(califRes.data);
            } catch (err) {
                console.error("Error fetching calificaciones:", err);
                setError("Error al cargar calificaciones o alumno no encontrado.");
            } finally {
                setLoading(false);
            }
        };
        if (matricula) {
            fetchCalificaciones();
        }
    }, [matricula]);

    if (loading) return <p>Cargando calificaciones...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!alumno) return <p>Alumno no encontrado.</p>;

    return (
        <div>
            <h2>Calificaciones de: {alumno.nombre_completo} ({alumno.matricula})</h2>
            {calificaciones.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Asignatura</th>
                            <th>Calificación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {calificaciones.map((cal, index) => (
                            <tr key={index}> {/* Idealmente, usar cal.id_asignatura si es único en la lista */}
                                <td>{cal.nombre_asignatura}</td>
                                <td>{cal.valor_calificacion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Este alumno aún no tiene calificaciones registradas.</p>
            )}
        </div>
    );
}

export default CalificacionesPorAlumno;