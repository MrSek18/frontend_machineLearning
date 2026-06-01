export default PriorityBadge;

const PRIORITY_STYLES = {
  critico:      'bg-rose-100 text-rose-700 border-rose-300',
  alto:         'bg-orange-100 text-orange-700 border-orange-300',
  medio:        'bg-amber-100 text-amber-700 border-amber-200',
  bajo:         'bg-blue-100 text-blue-700 border-blue-200',
  sin_calcular: 'bg-gray-100 text-gray-500 border-gray-200',
};

const PRIORITY_ICONS = {
  critico: '🔴',
  alto:    '🟠',
  medio:   '🟡',
  bajo:    '🔵',
};

const PRIORITY_LABELS = {
  critico:      'Crítico',
  alto:         'Alto',
  medio:        'Medio',
  bajo:         'Bajo',
  sin_calcular: 'Sin Calcular',
};

// Mapeo de IDs numéricos actualizado (prioridad_ml.id en BD: 1=bajo, 2=medio, 3=alto, 4=critico)
const ID_TO_CODE = {
  1: 'bajo',
  2: 'medio',
  3: 'alto',
  4: 'critico',
};

/** Convierte cualquier representación (número, string) a código canónico */
function normalizarCodigo(valor) {
  if (valor === null || valor === undefined) return 'sin_calcular';
  // Si es número, usar el mapeo ID → código
  if (typeof valor === 'number') {
    return ID_TO_CODE[valor] || 'sin_calcular';
  }
  // Si es string, pasar a minúsculas y validar
  const lower = String(valor).toLowerCase().trim();
  if (PRIORITY_STYLES[lower]) return lower;
  // Último intento: parsear como número
  const num = parseInt(lower, 10);
  if (!isNaN(num)) return ID_TO_CODE[num] || 'sin_calcular';
  return 'sin_calcular';
}

function PriorityBadge({ prioridad, categoria, className = '' }) {
  const key = normalizarCodigo(prioridad || categoria);
  const style = PRIORITY_STYLES[key] || PRIORITY_STYLES.sin_calcular;
  const icon = PRIORITY_ICONS[key] || '⚪';
  const label = PRIORITY_LABELS[key] || (categoria || prioridad || 'Sin Calcular');

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${style} ${className}`}>
      <span className="text-[10px]">{icon}</span>
      {label}
    </span>
  );
}