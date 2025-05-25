import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <nav>
            <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/alumnos">Alumnos</Link></li>
                <li><Link to="/asignaturas">Asignaturas</Link></li>
                <li><Link to="/calificaciones/registrar">Registrar Calificación</Link></li>
                <li><Link to="/reportes">Reportes</Link></li>
            </ul>
        </nav>
    );
}

export default Navigation;