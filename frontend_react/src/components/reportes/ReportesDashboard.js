import React from 'react';
import { Link } from 'react-router-dom';

function ReportesDashboard() {
    return (
        <div>
            <h2>Reportes Escolares</h2>
            <ul>
                <li><Link to="/reportes/boleta">Generar Boleta de Alumno</Link></li>
                <li><Link to="/reportes/asignatura">Ver Calificaciones por Asignatura</Link></li>
                <li><Link to="/reportes/regulares">Listar Alumnos Regulares</Link></li>
                <li><Link to="/reportes/irregulares">Listar Alumnos Irregulares</Link></li>
            </ul>
        </div>
    );
}

export default ReportesDashboard;