import PriorityBadge from './PriorityBadge';

export default ExpedientesTable;

function ExpedientesTable({ expedientes }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Cabecera */}
      <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-amber-50/60 to-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>📂</span> Bandeja de Expedientes (Sesión Actual)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {expedientes.length} expediente{expedientes.length !== 1 ? 's' : ''} procesado{expedientes.length !== 1 ? 's' : ''} en esta sesión
            </p>
          </div>
          {expedientes.length > 0 && (
            <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              Solo sesión actual
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <th className="p-3 whitespace-nowrap">Expediente</th>
              <th className="p-3 whitespace-nowrap">Ciudadano</th>
              <th className="p-3 whitespace-nowrap">Descripción Breve</th>
              <th className="p-3 whitespace-nowrap text-center">Prioridad IA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {expedientes.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-4xl">📭</span>
                    <span className="text-slate-400 font-medium">No hay solicitudes procesadas en esta sesión</span>
                    <span className="text-xs text-slate-400">Registra un nuevo trámite para verlo aquí</span>
                  </div>
                </td>
              </tr>
            ) : (
              expedientes.map((exp, index) => (
                <tr key={index} className="hover:bg-indigo-50/30 transition-colors duration-100">
                  <td className="p-3 font-mono font-bold text-indigo-700 text-xs">
                    {exp.numero_expediente}
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-800 text-xs">{exp.nombre_completo}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      DNI: {exp.dni} • {exp.edad} años
                    </div>
                  </td>
                  <td className="p-3 text-xs text-slate-500 max-w-xs">
                    <span className="line-clamp-2" title={exp.descripcion}>
                      {exp.descripcion}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <PriorityBadge prioridad={exp.prioridad_codigo} categoria={exp.categoria_ia} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}