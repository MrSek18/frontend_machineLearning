import { useState, useEffect, useCallback } from 'react';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import { listarTramites, actualizarEstadoTramite } from '../services/api';

// ---- Catálogos en duro como fallback (coinciden con la BD) ----
const ESTADOS_TRAMITE = [
  { id: 1, codigo: 'recibido',             descripcion: 'Trámite recibido, pendiente de revisión' },
  { id: 2, codigo: 'en_revision',          descripcion: 'En revisión por el área responsable' },
  { id: 3, codigo: 'pendiente_documentos', descripcion: 'Esperando documentos adicionales del ciudadano' },
  { id: 4, codigo: 'en_proceso',           descripcion: 'En proceso de resolución' },
  { id: 5, codigo: 'aprobado',             descripcion: 'Trámite aprobado' },
  { id: 6, codigo: 'observado',            descripcion: 'Trámite observado, requiere corrección' },
  { id: 7, codigo: 'rechazado',            descripcion: 'Trámite rechazado' },
  { id: 8, codigo: 'cerrado',              descripcion: 'Trámite cerrado definitivamente' },
];

const PRIORIDADES = [
  { codigo: '',        label: 'Todas' },
  { codigo: 'critico', label: 'Crítico' },
  { codigo: 'alto',    label: 'Alto' },
  { codigo: 'medio',   label: 'Medio' },
  { codigo: 'bajo',    label: 'Bajo' },
];

// ---- Helpers de formato ----
const formatDateTime = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
};
const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export default function TramitesTable() {
  // ---- Estado ----
  const [tramites, setTramites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros (valores inmediatos de los inputs)
  const [filtroPrioridad, setFiltroPrioridad] = useState('');
  const [filtroDni, setFiltroDni] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroFechaDesde, setFiltroFechaDesde] = useState('');
  const [filtroFechaHasta, setFiltroFechaHasta] = useState('');

  // Filtros con debounce (se actualizan con retraso para evitar llamadas excesivas)
  const [debouncedDni, setDebouncedDni] = useState('');
  const [debouncedNombre, setDebouncedNombre] = useState('');

  // Cambio de estado
  const [updatingId, setUpdatingId] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(null);

  // ---- Debounce para DNI y Nombre (300ms) ----
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedDni(filtroDni), 300);
    return () => clearTimeout(timer);
  }, [filtroDni]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedNombre(filtroNombre), 300);
    return () => clearTimeout(timer);
  }, [filtroNombre]);

  // ---- Carga de datos (se dispara con filtros debounced) ----
  const cargarTramites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('[TramitesTable] Solicitando trámites con filtros:', {
        prioridad: filtroPrioridad, dni: debouncedDni, nombre: debouncedNombre,
        fecha_desde: filtroFechaDesde, fecha_hasta: filtroFechaHasta
      });
      // Enviar DNI parcial para búsqueda incremental
      const dniValido = debouncedDni || undefined;
      const lista = await listarTramites({
        prioridad:   filtroPrioridad || undefined,
        dni:         dniValido,
        nombre:      debouncedNombre || undefined,
        fecha_desde: filtroFechaDesde || undefined,
        fecha_hasta: filtroFechaHasta || undefined,
      });
      console.log('[TramitesTable] Recibidos', lista.length, 'trámites:', lista.slice(0, 2));
      setTramites(lista);
    } catch (err) {
      console.error('[TramitesTable] Error:', err);
      setError(err.message);
      setTramites([]);
    } finally {
      setLoading(false);
    }
  }, [filtroPrioridad, debouncedDni, debouncedNombre, filtroFechaDesde, filtroFechaHasta]);

  useEffect(() => {
    console.log('[TramitesTable] Montado/refrescado, cargando datos...');
    cargarTramites();
  }, [cargarTramites]);

  // Debug: log cuando cambia el estado
  useEffect(() => {
    console.log('[TramitesTable] Estado actual — tramites:', tramites.length, 'loading:', loading, 'error:', error);
  }, [tramites, loading, error]);

  // ---- Cambiar estado ----
  const handleCambiarEstado = async (tramiteId, nuevoEstadoId) => {
    setUpdatingId(tramiteId);
    try {
      await actualizarEstadoTramite(tramiteId, nuevoEstadoId);
      // Reflejar cambio localmente
      const nuevoEstado = ESTADOS_TRAMITE.find(e => e.id === nuevoEstadoId);
      setTramites(prev =>
        prev.map(t =>
          t.id === tramiteId
            ? { ...t, estado: nuevoEstado?.codigo || t.estado, estado_id: nuevoEstadoId }
            : t
        )
      );
      setShowStatusModal(null);
    } catch (err) {
      alert('Error al cambiar estado: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // ---- Render ----
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Encabezado */}
      <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50/60 to-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800">📋 Bandeja de Trámites</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {tramites.length} trámite{tramites.length !== 1 ? 's' : ''} encontrado{tramites.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={cargarTramites}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg
                       bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200
                       disabled:opacity-50 transition-colors cursor-pointer"
          >
            <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-100">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Prioridad */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Prioridad</label>
            <select
              value={filtroPrioridad}
              onChange={e => setFiltroPrioridad(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500
                         bg-white transition-shadow"
            >
              {PRIORIDADES.map(p => (
                <option key={p.codigo} value={p.codigo}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* DNI */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">
              DNI {filtroDni && <span className="text-indigo-400 font-normal">({filtroDni.length}/8)</span>}
            </label>
            <input
              type="text"
              placeholder="Buscar DNI…"
              maxLength={8}
              value={filtroDni}
              onChange={e => setFiltroDni(e.target.value.replace(/\D/g, ''))}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500
                         placeholder:text-slate-400 transition-shadow"
            />
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Nombre</label>
            <input
              type="text"
              placeholder="Buscar…"
              value={filtroNombre}
              onChange={e => setFiltroNombre(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500
                         placeholder:text-slate-400 transition-shadow"
            />
          </div>

          {/* Fecha desde */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Desde</label>
            <input
              type="date"
              value={filtroFechaDesde}
              onChange={e => setFiltroFechaDesde(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500
                         transition-shadow"
            />
          </div>

          {/* Fecha hasta */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Hasta</label>
            <input
              type="date"
              value={filtroFechaHasta}
              onChange={e => setFiltroFechaHasta(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500
                         transition-shadow"
            />
          </div>

          {/* Limpiar filtros */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setFiltroPrioridad('');
                setFiltroDni('');
                setFiltroNombre('');
                setFiltroFechaDesde('');
                setFiltroFechaHasta('');
                setDebouncedDni('');
                setDebouncedNombre('');
              }}
              className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg
                         bg-white text-slate-600 hover:bg-slate-100 border border-slate-300
                         transition-colors cursor-pointer"
            >
              ✕ Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <th className="p-3 whitespace-nowrap">ID</th>
              <th className="p-3 whitespace-nowrap">Ciudadano</th>
              <th className="p-3 whitespace-nowrap">Área</th>
              <th className="p-3 whitespace-nowrap">N° Expediente</th>
              <th className="p-3 whitespace-nowrap text-center">Estado</th>
              <th className="p-3 whitespace-nowrap text-center">Prioridad</th>
              <th className="p-3 whitespace-nowrap">F. Ingreso</th>
              <th className="p-3 whitespace-nowrap">F. Límite</th>
              <th className="p-3 whitespace-nowrap">Creado</th>
              <th className="p-3 whitespace-nowrap">Actualizado</th>
              <th className="p-3 whitespace-nowrap text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {(() => {
              // Loading
              if (loading) {
                return (
                  <tr>
                    <td colSpan={11} className="p-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        <span className="text-slate-400 font-medium">Cargando trámites…</span>
                      </div>
                    </td>
                  </tr>
                );
              }

              // Error
              if (error) {
                return (
                  <tr>
                    <td colSpan={11} className="p-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-3xl">⚠️</span>
                        <span className="text-red-500 font-medium">{error}</span>
                        <button
                          onClick={cargarTramites}
                          className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                        >
                          Reintentar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }

              // Vacío
              if (tramites.length === 0) {
                return (
                  <tr>
                    <td colSpan={11} className="p-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl">📭</span>
                        <span className="text-slate-400 font-medium">No se encontraron trámites</span>
                        <span className="text-xs text-slate-400">Ajusta los filtros o registra un nuevo trámite</span>
                      </div>
                    </td>
                  </tr>
                );
              }

              // Filas de datos
              return tramites.map((t) => (
                <tr key={t.id} className="hover:bg-indigo-50/30 transition-colors duration-100">
                  <td className="p-3 font-mono text-[11px] text-slate-400 max-w-[100px] truncate" title={t.id}>
                    {t.id?.substring(0, 8)}…
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-800 text-xs">
                      {t.nombre_ciudadano || t.nombre_completo || `${t.nombres || ''} ${t.apellidos || ''}`.trim() || '—'}
                    </div>
                    {t.dni && (
                      <div className="text-[10px] text-slate-400 mt-0.5">DNI: {t.dni}</div>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="text-xs text-slate-600 font-medium">
                      {t.area_nombre || t.area || '—'}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-xs font-bold text-indigo-700">
                    {t.numero_expediente || '—'}
                  </td>
                  <td className="p-3 text-center">
                    <StatusBadge estado={t.estado || t.estado_codigo} />
                  </td>
                  <td className="p-3 text-center">
                    <PriorityBadge
                      prioridad={t.prioridad || t.prioridad_codigo}
                      categoria={t.categoria_ia || t.prioridad_nombre}
                    />
                  </td>
                  <td className="p-3 text-xs text-slate-500 whitespace-nowrap">
                    {formatDateTime(t.fecha_ingreso)}
                  </td>
                  <td className="p-3 text-xs whitespace-nowrap">
                    {t.fecha_limite ? (
                      <span className={`font-semibold ${new Date(t.fecha_limite) < new Date() ? 'text-red-600' : 'text-slate-600'}`}>
                        {formatDate(t.fecha_limite)}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="p-3 text-xs text-slate-400 whitespace-nowrap">
                    {formatDateTime(t.created_at)}
                  </td>
                  <td className="p-3 text-xs text-slate-400 whitespace-nowrap">
                    {formatDateTime(t.updated_at)}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setShowStatusModal({ tramite: t, estados: ESTADOS_TRAMITE })}
                      disabled={updatingId === t.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg
                                 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200
                                 disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap"
                      title="Cambiar estado"
                    >
                      {updatingId === t.id ? (
                        <span className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      )}
                      Estado
                    </button>
                  </td>
                </tr>
              ));
            })()}
          </tbody>
        </table>
      </div>

      {/* Modal de cambio de estado */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowStatusModal(null)}
          />
          {/* Panel */}
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-white">
              <h3 className="text-base font-bold text-slate-800">Cambiar Estado del Trámite</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Expediente: <span className="font-mono font-bold text-indigo-700">{showStatusModal.tramite.numero_expediente}</span>
              </p>
            </div>

            {/* Lista de estados */}
            <div className="p-4 space-y-1.5 max-h-[60vh] overflow-y-auto">
              {showStatusModal.estados.map((est) => {
                const isCurrent = showStatusModal.tramite.estado_id === est.id
                  || showStatusModal.tramite.estado === est.codigo;
                return (
                  <button
                    key={est.id}
                    onClick={() => handleCambiarEstado(showStatusModal.tramite.id, est.id)}
                    disabled={isCurrent || updatingId === showStatusModal.tramite.id}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-150 cursor-pointer
                      ${isCurrent
                        ? 'bg-indigo-50 border-2 border-indigo-300 ring-2 ring-indigo-100'
                        : 'bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-sm'}
                      disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    <StatusBadge estado={est.codigo} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-700">
                        {est.descripcion}
                        {isCurrent && <span className="ml-2 text-[10px] text-indigo-500 font-normal">(Actual)</span>}
                      </div>
                    </div>
                    {!isCurrent && (
                      <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/80 flex justify-end">
              <button
                onClick={() => setShowStatusModal(null)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-white text-slate-600
                           hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
