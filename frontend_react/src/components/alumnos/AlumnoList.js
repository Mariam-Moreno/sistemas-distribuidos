import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAlumnos, deleteAlumno } from '../../api';

function AlumnoList() {
    const [alumnos, setAlumnos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAlumnos();
    }, []);

    const fetchAlumnos = async () => {
        try {
            const response = await getAlumnos();
            setAlumnos(response.data);
        } catch (error) {
            console.error("Error fetching alumnos:", error);
        }
    };

    const handleDelete = async (matricula) => {
        if (window.confirm(`¿Está seguro de eliminar al alumno con matrícula ${matricula}?`)) {
            try {
                await deleteAlumno(matricula);
                fetchAlumnos(); // Recargar lista
            } catch (error) {
                console.error("Error deleting alumno:", error);
                alert("Error al eliminar el alumno. Puede tener calificaciones asociadas.");
            }
        }
    };

    return (
        <div>
            <h2>Lista de Alumnos</h2>
            <Link to="/alumnos/nuevo"><button>Registrar Nuevo Alumno</button></Link>
            <table>
                <thead>
                    <tr>
                        <th>Matrícula</th>
                        <th>Nombre Completo</th>
                        <th>Grado</th>
                        <th>Correo Electrónico</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {alumnos.map(alumno => (
                        <tr key={alumno.id_alumno}>
                            <td>{alumno.matricula}</td>
                            <td>{alumno.nombre_completo}</td>
                            <td>{alumno.grado}</td>
                            <td>{alumno.correo_electronico}</td>
                            <td>
                                <button className="edit" onClick={() => navigate(`/alumnos/editar/${alumno.matricula}`)}>Editar</button>
                                <button className="delete" onClick={() => handleDelete(alumno.matricula)}>Eliminar</button>
                                <button onClick={() => navigate(`/alumnos/${alumno.matricula}/calificaciones`)}>Ver Calificaciones</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AlumnoList;