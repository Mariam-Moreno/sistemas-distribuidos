import axios from 'axios';

const API_URL = 'http://localhost:5001'; // URL de tu backend Flask

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Alumnos
export const getAlumnos = () => apiClient.get('/alumnos');
export const getAlumnoByMatricula = (matricula) => apiClient.get(`/alumnos/${matricula}`);
export const createAlumno = (alumnoData) => apiClient.post('/alumnos', alumnoData);
export const updateAlumno = (matricula, alumnoData) => apiClient.put(`/alumnos/${matricula}`, alumnoData);
export const deleteAlumno = (matricula) => apiClient.delete(`/alumnos/${matricula}`);

// Asignaturas
export const getAsignaturas = (grado = null) => {
    let url = '/asignaturas';
    if (grado) {
        url += `?grado=${grado}`;
    }
    return apiClient.get(url);
};
export const getAsignaturaById = (id) => apiClient.get(`/asignaturas/${id}`);
export const createAsignatura = (asignaturaData) => apiClient.post('/asignaturas', asignaturaData);
export const updateAsignatura = (id, asignaturaData) => apiClient.put(`/asignaturas/${id}`, asignaturaData);
export const deleteAsignatura = (id) => apiClient.delete(`/asignaturas/${id}`);

// Calificaciones
export const registrarCalificacion = (calificacionData) => apiClient.post('/calificaciones', calificacionData);
export const getCalificacionesByAlumno = (matricula) => apiClient.get(`/calificaciones/alumno/${matricula}`);
export const getCalificacionesByAsignatura = (idAsignatura) => apiClient.get(`/calificaciones/asignatura/${idAsignatura}`);

// Reportes
export const getBoletaAlumno = (matricula) => apiClient.get(`/reportes/boleta/${matricula}`);
export const getReporteCalificacionesAsignatura = (idAsignatura) => apiClient.get(`/reportes/asignatura/${idAsignatura}/calificaciones`);
export const getAlumnosRegulares = (grado = null) => {
    let url = '/reportes/alumnos/regulares';
    if (grado) {
        url += `?grado=${grado}`;
    }
    return apiClient.get(url);
};
export const getAlumnosIrregulares = (grado = null) => {
    let url = '/reportes/alumnos/irregulares';
    if (grado) {
        url += `?grado=${grado}`;
    }
    return apiClient.get(url);
};

export default apiClient;