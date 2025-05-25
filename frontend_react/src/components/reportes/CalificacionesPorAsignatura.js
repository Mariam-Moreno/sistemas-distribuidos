import React, { useState, useEffect } from 'react';
import { getAsignaturas, getReporteCalificacionesAsignatura } from '../../api';

function CalificacionesPorAsignatura() {
    const [idAsignatura, setIdAsignatura] = useState('');
    const [asignaturas, setAsignaturas] = useState([]);
    const [reporte, setReporte] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAsignaturas = async () => {
            try {
                const response = await getAsignaturas();
                setAsignaturas(response.data);
            } catch (err) {
                console.error("Error fetching asignaturas:", err);
                setError("Error al cargar la lista de asignaturas.");
            }
        };
        fetchAsignaturas();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!idAsignatura) {
            setError("Por favor, seleccione una asignatura.");
            setReporte(null);
            return;
        }
        setLoading(true);
        setError('');
        setReporte(null);
        try {
            const response = await getReporteCalificacionesAsignatura(idAsignatura);
            setReporte(response.data);
        } catch (err) {
            console.error("Error fetching reporte asignatura:", err);
            setError(err.response?.data?.error || "Asignatura no encontrada o error al generar reporte.");
            setReporte(null);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="report-section">
            <h3>Lista de Calificaciones por Asignatura</h3>
            <form onSubmit={handleSearch}>
                <div>
                    <label>Seleccione Asignatura:</label>
                    <select value={idAsignatura} onChange={(e) => setIdAsignatura(e.target.value)}>
                        <option value="">-- Seleccionar --</option>
                        {asignaturas.map(asig => (
                            <option key={asig.id_asignatura} value={asig.id_asignatura}>
                                {asig.nombre_asignatura} (Grado: {asig.grado_imparte})
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" disabled={loading}>{loading ? "Generando..." : "Ver Reporte"}</button>
            </form>

            {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}

            {reporte && (
                <div>
                    <h4>Reporte de: {reporte.asignatura.nombre_asignatura} (Grado: {reporte.asignatura.grado_imparte})</h4>
                     <table>
                        <thead>
                            <tr>
                                <th>Matrícula Alumno</th>
                                <th>Nombre Alumno</th>
                                <th>Calificación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reporte.calificaciones.map((cal, index) => (
                                <tr key={index}>
                                    <td>{cal.alumno_matricula}</td>
                                    <td>{cal.alumno_nombre}</td>
                                    <td>{cal.valor_calificacion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h4>Promedio de la Asignatura: {reporte.promedio_asignatura.toFixed(2)}</h4>
                </div>
            )}
        </div>
    );
}

export default CalificacionesPorAsignatura;