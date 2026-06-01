import { useState } from 'react';
import Header from './components/Header';
import TramiteForm from './components/TramiteForm';
import ExpedientesTable from './components/ExpedientesTable';
import TramitesTable from './components/TramitesTable';
import { registrarTramite } from './services/api';

const TABS = [
  { id: 'registrar', label: '📁 Registrar Trámite', icon: '📝' },
  { id: 'bandeja',  label: '📋 Bandeja de Trámites', icon: '🔍' },
  { id: 'sesion',   label: '📂 Sesión Actual', icon: '📌' },
];

function App() {
  const [activeTab, setActiveTab] = useState('bandeja');
  const [expedientes, setExpedientes] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRegistroExitoso = (apiResponse, originalForm) => {
    const nuevoExpediente = {
      numero_expediente: apiResponse.numero_expediente,
      categoria_ia: apiResponse.categoria_ia,
      prioridad_codigo: apiResponse.prioridad_codigo,
      nombre_completo: `${originalForm.nombre_ciudadano} ${originalForm.apellidos_ciudadano}`,
      dni: originalForm.dni_ciudadano,
      edad: originalForm.edad_ciudadano,
      descripcion: originalForm.descripcion_tramite
    };

    setExpedientes((prev) => [nuevoExpediente, ...prev]);
    // Forzar refresco de la bandeja principal
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/30 to-slate-100 text-slate-800 font-sans">
      <Header />

      {/* Tabs de navegación */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <nav className="flex gap-1 p-1 bg-white rounded-2xl shadow-sm border border-slate-200 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
                ${activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-slate-600 hover:text-indigo-700 hover:bg-indigo-50'
                }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'registrar' && (
          <div className="max-w-2xl mx-auto">
            <TramiteForm
              onRegistroExitoso={handleRegistroExitoso}
              registrarApiFn={registrarTramite}
            />
          </div>
        )}

        {activeTab === 'bandeja' && (
          <TramitesTable key={refreshKey} />
        )}

        {activeTab === 'sesion' && (
          <ExpedientesTable expedientes={expedientes} />
        )}
      </main>

      {/* Footer sutil */}
      <footer className="max-w-7xl mx-auto px-4 py-6 text-center text-[11px] text-slate-400 border-t border-slate-200 mt-8">
        Municipalidad Distrital de Yauyos — Módulo de Priorización ML &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;