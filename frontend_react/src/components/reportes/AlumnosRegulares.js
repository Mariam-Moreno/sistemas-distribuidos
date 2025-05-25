import React, { useState, useEffect } from 'react';
import { getAlumnosRegulares } from '../../api';

function AlumnosRegulares() {
    const [reporte, setReporte] = useState(null);
    const [gradoFiltro, setGradoFiltro] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchReporte = async (grado = null) => {
        setLoading(true);
        setError('');
        setReporte(null);
        try {
            const response = await getAlumnosRegulares(grado);
            setReporte(response.data);
        } catch (err) {
            console.error("Error fetching alumnos regulares:", err);
            setError("Error al generar el reporte de alumnos regulares.");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchReporte(); // Cargar todos al inicio
    }, []);

    const handleFilter = () => {
        fetchReporte(gradoFiltro || null);
    };

    return (
        <div className="report-section">
            <h3>Lista de Alumnos Regulares</h3>
            <div>
                <label>Filtrar por Grado (opcional): </label>
                <select value={gradoFiltro} onChange={(e) => setGradoFiltro(e.target.value)}>
                    <option value="">Todos los Grados</option>
                    {[1, 2, 3, 4, 5, 6].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <button onClick={handleFilter} disabled={loading} style={{marginLeft: '10px'}}>Filtrar</button>
            </div>

            {loading && <p>Cargando...</p>}
            {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}

            {reporte && Object.keys(reporte).length > 0 ? (
                Object.entries(reporte).map(([grado, alumnos]) => (
                    alumnos.length > 0 && ( // Solo mostrar grado si tiene alumnos
                        <div key={grado}>
                            <h4>Grado: {grado}</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Matrícula</th>
                                        <th>Nombre Completo</th>
                                        <th>Correo Electrónico</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alumnos.map(alumno => (
                                        <tr key={alumno.matricula}>
                                            <td>{alumno.matricula}</td>
                                            <td>{alumno.nombre_completo}</td>
                                            <td>{alumno.correo_electronico}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                ))
            ) : (
                !loading && <p>No se encontraron alumnos regulares con los filtros aplicados.</p>
            )}
             {reporte && Object.keys(reporte).length === 0 && !loading && (
                <p>No hay alumnos regulares registrados.</p>
            )}
        </div>
    );
}

export default AlumnosRegulares;