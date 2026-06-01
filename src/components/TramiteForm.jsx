import { useState } from 'react';

export default TramiteForm;

function TramiteForm({ onRegistroExitoso, registrarApiFn }) {
  const initialFormState = {
    dni_ciudadano: '',
    nombre_ciudadano: '',
    apellidos_ciudadano: '',
    telefono: '',
    email: '',
    edad_ciudadano: '',
    tipo_tramite_id: 'tt000001-0000-0000-0000-000000000001',  // Intervención por Emergencia
    area_id: 'aa000001-0000-0000-0000-000000000001'            // Mesa de Partes General
  };

  const [formData, setFormData] = useState(initialFormState);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === 'edad_ciudadano' ? (value ? parseInt(value) : '') : value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      alert("Por favor, adjunte un archivo PDF con el sustento del trámite.");
      return;
    }
    setLoading(true);

    try {
      const data = await registrarApiFn(formData, pdfFile);
      
      const metadataTramite = {
        ...formData,
        descripcion_tramite: `Documento PDF: ${pdfFile.name} (Analizado automáticamente por IA)`
      };
      
      onRegistroExitoso(data, metadataTramite);
      alert(`¡Trámite Radicado! Expediente: ${data.numero_expediente}`);
      
      setFormData(initialFormState);
      setPdfFile(null);
      document.getElementById('archivo_pdf').value = "";
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Cabecera del formulario */}
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-50/80 to-white border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="text-xl">📁</span>
          Registro de Trámite con Sustento PDF
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">Complete los datos del ciudadano y adjunte el documento</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* DNI + Edad */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label htmlFor="dni_ciudadano" className="block text-xs font-semibold text-slate-600 mb-1.5">
              DNI <span className="text-red-400">*</span>
            </label>
            <input type="text" id="dni_ciudadano" required maxLength={8}
              value={formData.dni_ciudadano} onChange={handleChange}
              placeholder="12345678"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                         placeholder:text-slate-400 transition-shadow" />
          </div>
          <div>
            <label htmlFor="edad_ciudadano" className="block text-xs font-semibold text-slate-600 mb-1.5">
              Edad <span className="text-red-400">*</span>
            </label>
            <input type="number" id="edad_ciudadano" required min={18} max={120}
              value={formData.edad_ciudadano} onChange={handleChange}
              placeholder="18"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                         placeholder:text-slate-400 transition-shadow" />
          </div>
        </div>

        {/* Nombres + Apellidos */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="nombre_ciudadano" className="block text-xs font-semibold text-slate-600 mb-1.5">
              Nombres <span className="text-red-400">*</span>
            </label>
            <input type="text" id="nombre_ciudadano" required
              value={formData.nombre_ciudadano} onChange={handleChange}
              placeholder="Juan Carlos"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                         placeholder:text-slate-400 transition-shadow" />
          </div>
          <div>
            <label htmlFor="apellidos_ciudadano" className="block text-xs font-semibold text-slate-600 mb-1.5">
              Apellidos <span className="text-red-400">*</span>
            </label>
            <input type="text" id="apellidos_ciudadano" required
              value={formData.apellidos_ciudadano} onChange={handleChange}
              placeholder="Pérez García"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                         placeholder:text-slate-400 transition-shadow" />
          </div>
        </div>

        {/* Teléfono + Email */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="telefono" className="block text-xs font-semibold text-slate-600 mb-1.5">
              Teléfono <span className="text-red-400">*</span>
            </label>
            <input type="text" id="telefono" required
              value={formData.telefono} onChange={handleChange}
              placeholder="999 888 777"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                         placeholder:text-slate-400 transition-shadow" />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-600 mb-1.5">
              Email <span className="text-red-400">*</span>
            </label>
            <input type="email" id="email" required
              value={formData.email} onChange={handleChange}
              placeholder="correo@ejemplo.com"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                         placeholder:text-slate-400 transition-shadow" />
          </div>
        </div>

        {/* Upload de PDF con drag & drop visual */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Adjuntar Solicitud / FUT (Formato PDF) <span className="text-red-400">*</span>
          </label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files.length > 0) {
                setPdfFile(e.dataTransfer.files[0]);
                // Sincronizar con el input file
                const input = document.getElementById('archivo_pdf');
                if (input) {
                  const dt = new DataTransfer();
                  dt.items.add(e.dataTransfer.files[0]);
                  input.files = dt.files;
                }
              }
            }}
            className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 cursor-pointer
              ${dragOver
                ? 'border-indigo-400 bg-indigo-50/50 shadow-inner shadow-indigo-100'
                : 'border-slate-300 bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/30'
              }`}
          >
            <input 
              type="file" 
              id="archivo_pdf" 
              required 
              accept=".pdf" 
              onChange={handleFileChange} 
              className="hidden" 
            />
            <label htmlFor="archivo_pdf" className="cursor-pointer block">
              {pdfFile ? (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">📄</span>
                  <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                    ✓ {pdfFile.name}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {(pdfFile.size / 1024).toFixed(1)} KB — Click para cambiar
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">📥</span>
                  <span className="text-sm font-medium text-slate-600">
                    <span className="text-indigo-600 font-bold underline">Selecciona un archivo PDF</span> o arrástralo aquí
                  </span>
                  <span className="text-[11px] text-slate-400">Solo archivos .pdf</span>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Botón de submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800
                     text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-indigo-200
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                     cursor-pointer active:scale-[0.98]"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Extrayendo y Analizando PDF…
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <span>🚀</span> Subir y Clasificar con IA
            </span>
          )}
        </button>
      </form>
    </section>
  );
}