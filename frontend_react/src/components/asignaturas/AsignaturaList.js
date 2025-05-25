import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAsignaturas, deleteAsignatura } from '../../api';

function AsignaturaList() {
    const [asignaturas, setAsignaturas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAsignaturas();
    }, []);

    const fetchAsignaturas = async () => {
        try {
            const response = await getAsignaturas();
            setAsignaturas(response.data);
        } catch (error) {
            console.error("Error fetching asignaturas:", error);
        }
    };

    const handleDelete = async (id_asignatura) => {
        if (window.confirm(`¿Está seguro de eliminar la asignatura?`)) {
            try {
                await deleteAsignatura(id_asignatura);
                fetchAsignaturas(); // Recargar lista
            } catch (error) {
                console.error("Error deleting asignatura:", error);
                alert("Error al eliminar la asignatura. Puede tener calificaciones asociadas.");
            }
        }
    };

    return (
        <div>
            <h2>Lista de Asignaturas</h2>
            <Link to="/asignaturas/nueva"><button>Registrar Nueva Asignatura</button></Link>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Grado Imparte</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {asignaturas.map(asig => (
                        <tr key={asig.id_asignatura}>
                            <td>{asig.id_asignatura}</td>
                            <td>{asig.nombre_asignatura}</td>
                            <td>{asig.grado_imparte}</td>
                            <td>
                                <button className="edit" onClick={() => navigate(`/asignaturas/editar/${asig.id_asignatura}`)}>Editar</button>
                                <button className="delete" onClick={() => handleDelete(asig.id_asignatura)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AsignaturaList;