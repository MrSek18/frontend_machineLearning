export default Header;

function Header() {
  return (
    <header className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white shadow-lg shadow-indigo-900/20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          {/* Escudo / Logo placeholder */}
          <div className="w-10 h-10 rounded-xl bg-indigo-800/60 border border-indigo-600/50 flex items-center justify-center
                          shadow-inner shadow-indigo-950/50 flex-shrink-0">
            <svg className="w-6 h-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight leading-tight">
              MUNICIPALIDAD DISTRITAL DE YAUYOS
            </h1>
            <p className="text-[11px] text-indigo-300/80 tracking-wide">
              Módulo de Priorización y Enrutamiento Asistido por Machine Learning
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Badge de estado */}
          <div className="bg-indigo-800/60 px-3 py-1.5 rounded-xl border border-indigo-700/50 text-xs font-medium text-indigo-200 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            Sistema Activo
          </div>
        </div>
      </div>
    </header>
  );
}