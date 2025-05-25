import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import AlumnoList from './components/alumnos/AlumnoList';
import AlumnoForm from './components/alumnos/AlumnoForm';
import AsignaturaList from './components/asignaturas/AsignaturaList';
import AsignaturaForm from './components/asignaturas/AsignaturaForm';
import CalificacionForm from './components/calificaciones/CalificacionForm';
import CalificacionesPorAlumno from './components/calificaciones/CalificacionesPorAlumno';
import BoletaAlumno from './components/reportes/BoletaAlumno';
import CalificacionesPorAsignatura from './components/reportes/CalificacionesPorAsignatura';
import AlumnosRegulares from './components/reportes/AlumnosRegulares';
import AlumnosIrregulares from './components/reportes/AlumnosIrregulares';
import ReportesDashboard from './components/reportes/ReportesDashboard'; // Un componente para agrupar reportes

function App() {
  return (
    <Router>
      <Navigation />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/alumnos" element={<AlumnoList />} />
          <Route path="/alumnos/nuevo" element={<AlumnoForm />} />
          <Route path="/alumnos/editar/:matricula" element={<AlumnoForm />} />
          <Route path="/alumnos/:matricula/calificaciones" element={<CalificacionesPorAlumno />} /> 
          
          <Route path="/asignaturas" element={<AsignaturaList />} />
          <Route path="/asignaturas/nueva" element={<AsignaturaForm />} />
          <Route path="/asignaturas/editar/:id" element={<AsignaturaForm />} />

          <Route path="/calificaciones/registrar" element={<CalificacionForm />} />
          
          <Route path="/reportes" element={<ReportesDashboard />} />
          <Route path="/reportes/boleta" element={<BoletaAlumno />} /> {/* Para búsqueda */}
          <Route path="/reportes/asignatura" element={<CalificacionesPorAsignatura />} /> {/* Para búsqueda */}
          <Route path="/reportes/regulares" element={<AlumnosRegulares />} />
          <Route path="/reportes/irregulares" element={<AlumnosIrregulares />} />

        </Routes>
      </div>
    </Router>
  );
}

// Componente simple para la página de reportes (opcional)
export default App;