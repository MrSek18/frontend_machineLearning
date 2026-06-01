export default StatusBadge;

const ESTADO_STYLES = {
  recibido:             'bg-gray-100 text-gray-700 border-gray-300',
  en_revision:          'bg-yellow-100 text-yellow-700 border-yellow-300',
  pendiente_documentos: 'bg-orange-100 text-orange-700 border-orange-300',
  en_proceso:           'bg-blue-100 text-blue-700 border-blue-300',
  aprobado:             'bg-emerald-100 text-emerald-700 border-emerald-300',
  observado:            'bg-amber-100 text-amber-700 border-amber-300',
  rechazado:            'bg-red-100 text-red-700 border-red-300',
  cerrado:              'bg-slate-200 text-slate-600 border-slate-400',
};

const ESTADO_LABELS = {
  recibido:             'Recibido',
  en_revision:          'En Revisión',
  pendiente_documentos: 'Pendiente Docs.',
  en_proceso:           'En Proceso',
  aprobado:             'Aprobado',
  observado:            'Observado',
  rechazado:            'Rechazado',
  cerrado:              'Cerrado',
};

function StatusBadge({ estado, className = '' }) {
  const style = ESTADO_STYLES[estado] || 'bg-gray-100 text-gray-600 border-gray-200';
  const label = ESTADO_LABELS[estado] || estado;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${style} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}
