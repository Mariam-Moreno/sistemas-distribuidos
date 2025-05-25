import React, { useState } from 'react';
import { getBoletaAlumno } from '../../api';

function BoletaAlumno() {
    const [matricula, setMatricula] = useState('');
    const [boleta, setBoleta] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!matricula) {
            setError("Por favor, ingrese una matrícula.");
            setBoleta(null);
            return;
        }
        setLoading(true);
        setError('');
        setBoleta(null);
        try {
            const response = await getBoletaAlumno(matricula);
            setBoleta(response.data);
        } catch (err) {
            console.error("Error fetching boleta:", err);
            setError(err.response?.data?.error || "Alumno no encontrado o error al generar boleta.");
            setBoleta(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="report-section">
            <h3>Boleta de Calificaciones por Alumno</h3>
            <form onSubmit={handleSearch}>
                <div>
                    <label>Matrícula del Alumno:</label>
                    <input type="text" value={matricula} onChange={(e) => setMatricula(e.target.value)} placeholder="Ej: A001" />
                </div>
                <button type="submit" disabled={loading}>{loading ? "Buscando..." : "Generar Boleta"}</button>
            </form>

            {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}

            {boleta && (
                <div>
                    <h4>Boleta de: {boleta.alumno.nombre_completo} (Matrícula: {boleta.alumno.matricula})</h4>
                    <p>Grado: {boleta.alumno.grado}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Asignatura</th>
                                <th>Calificación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {boleta.calificaciones.map((cal, index) => (
                                <tr key={index}>
                                    <td>{cal.nombre_asignatura}</td>
                                    <td>{cal.valor_calificacion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h4>Promedio General: {boleta.promedio_general.toFixed(2)}</h4>
                </div>
            )}
        </div>
    );
}

export default BoletaAlumno;