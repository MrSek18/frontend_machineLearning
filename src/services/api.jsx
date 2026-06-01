const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// ============================================================
//  TRÁMITES – REGISTRO (existente)
// ============================================================
export const registrarTramite = async (formFields, archivoPdf) => {
  const formDataPayload = new FormData();
  
  Object.keys(formFields).forEach(key => {
    formDataPayload.append(key, formFields[key]);
  });
  
  formDataPayload.append('archivo_pdf', archivoPdf);

  const response = await fetch(`${API_BASE_URL}/tramites/registrar`, {
    method: 'POST',
    body: formDataPayload
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error al registrar trámite:', errorData.detail);
    throw new Error(errorData.detail || 'Error al procesar el PDF y el trámite en el servidor.');
  }

  return await response.json();
};

// ============================================================
//  TRÁMITES – LISTAR TODOS (con filtros)
// ============================================================
export const listarTramites = async (filtros = {}) => {
  const params = new URLSearchParams();

  if (filtros.prioridad)   params.append('prioridad', filtros.prioridad);
  if (filtros.dni)         params.append('dni', filtros.dni);
  if (filtros.nombre)      params.append('nombre', filtros.nombre);
  if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
  if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
  if (filtros.estado)      params.append('estado', filtros.estado);

  const queryString = params.toString();
  const url = `${API_BASE_URL}/tramites/${queryString ? '?' + queryString : ''}`;

  console.log('[API] GET', url);

  const response = await fetch(url, { method: 'GET' });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    // FastAPI 422 devuelve { detail: [{ msg: "...", ... }] }
    const detail = Array.isArray(errorData.detail)
      ? errorData.detail.map(d => d.msg).join('; ')
      : (errorData.detail || `Error HTTP ${response.status}`);
    throw new Error(detail);
  }

  const result = await response.json();
  console.log('[API] Respuesta cruda:', result);

  // Backend devuelve { data: [...], total: N } o array directo
  const lista = Array.isArray(result) ? result : (result.data || []);
  console.log('[API] Trámites normalizados:', lista.length, 'items');
  return lista;
};

// ============================================================
//  TRÁMITES – ACTUALIZAR ESTADO
// ============================================================
export const actualizarEstadoTramite = async (tramiteId, nuevoEstadoId) => {
  const response = await fetch(`${API_BASE_URL}/tramites/${tramiteId}/estado`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado_id: nuevoEstadoId })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Error al actualizar el estado del trámite.');
  }

  return await response.json();
};

// ============================================================
//  CATÁLOGOS – Obtener estados y prioridades
// ============================================================
export const obtenerEstadosTramite = async () => {
  const response = await fetch(`${API_BASE_URL}/catalogos/estados-tramite`);
  if (!response.ok) throw new Error('Error al obtener catálogo de estados.');
  return await response.json();
};

export const obtenerPrioridadesML = async () => {
  const response = await fetch(`${API_BASE_URL}/catalogos/prioridades-ml`);
  if (!response.ok) throw new Error('Error al obtener catálogo de prioridades.');
  return await response.json();
};