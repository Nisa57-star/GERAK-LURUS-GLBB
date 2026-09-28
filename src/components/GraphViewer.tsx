import React from 'react';
import { GraphDefinition } from '../types/game';

interface GraphViewerProps {
  graph: GraphDefinition;
}

export const GraphViewer: React.FC<GraphViewerProps> = ({ graph }) => {
  const { kind, title, yAxisLabel, xAxisLabel, values } = graph;

  return (
    <div className="bg-slate-950/80 border border-slate-700/60 rounded-xl p-2.5 flex flex-col items-center justify-center my-2 shadow-inner">
      {title && (
        <div className="text-[11px] font-bold text-slate-400 mb-1 tracking-wide uppercase">
          {title}
        </div>
      )}
      <svg
        viewBox="0 0 260 140"
        className="w-full max-w-[280px] h-[120px] select-none overflow-visible"
      >
        <defs>
          {/* Subtle grid pattern */}
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.3" />
          </pattern>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Background Grid */}
        <rect x="40" y="15" width="200" height="100" fill="url(#grid)" />

        {/* Origin 'O' */}
        <text x="32" y="122" fill="#94a3b8" fontSize="10" fontWeight="bold">0</text>

        {/* Main Axes */}
        {/* Y Axis */}
        <line x1="40" y1="115" x2="40" y2="15" stroke="#94a3b8" strokeWidth="2" />
        <polygon points="40,10 36,18 44,18" fill="#94a3b8" />
        <text
          x="35"
          y="12"
          fill="#38bdf8"
          fontSize="11"
          fontWeight="bold"
          textAnchor="end"
        >
          {yAxisLabel}
        </text>

        {/* X Axis */}
        <line x1="40" y1="115" x2="245" y2="115" stroke="#94a3b8" strokeWidth="2" />
        <polygon points="250,115 242,111 242,119" fill="#94a3b8" />
        <text
          x="248"
          y="130"
          fill="#38bdf8"
          fontSize="11"
          fontWeight="bold"
          textAnchor="end"
        >
          {xAxisLabel}
        </text>

        {/* --- GRAPH CURVES BASED ON KIND --- */}

        {/* 1. v-t GLB (Kecepatan tetap - garis mendatar) */}
        {kind === 'vt-glb' && (
          <g>
            <line x1="40" y1="55" x2="225" y2="55" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
            {/* Guide line to Y */}
            <line x1="37" y1="55" x2="40" y2="55" stroke="#38bdf8" strokeWidth="2" />
            <text x="32" y="59" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="end">
              {values?.vt ?? 'v'}
            </text>
            <circle cx="40" cy="55" r="3" fill="#38bdf8" />
            <circle cx="225" cy="55" r="3" fill="#38bdf8" />
            {/* Annotation badge */}
            <rect x="85" y="32" width="100" height="18" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <text x="135" y="44" fill="#38bdf8" fontSize="9.5" fontWeight="bold" textAnchor="middle">
              v = konstan (GLB)
            </text>
          </g>
        )}

        {/* 2. s-t GLB (Garis lurus miring naik) */}
        {kind === 'st-glb' && (
          <g>
            <line x1="40" y1="115" x2="220" y2="25" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" />
            {/* Dashed end guides */}
            <line x1="220" y1="25" x2="220" y2="115" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="40" y1="25" x2="220" y2="25" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
            <text x="32" y="29" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="end">
              {values?.s ?? 's'}
            </text>
            <text x="220" y="128" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="middle">
              {values?.t ?? 't'}
            </text>
            <circle cx="40" cy="115" r="3" fill="#34d399" />
            <circle cx="220" cy="25" r="3" fill="#34d399" />
          </g>
        )}

        {/* 3. v-t GLBB (Kecepatan Berubah Teratur - Garis Miring) */}
        {kind === 'vt-glbb' && (
          <g>
            {/* Acceleration line */}
            <line x1="40" y1="115" x2="220" y2="30" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
            {/* Dashed markers */}
            <line x1="220" y1="30" x2="220" y2="115" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="40" y1="30" x2="220" y2="30" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
            <text x="32" y="34" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="end">
              {values?.vt ?? 'vt'}
            </text>
            <text x="220" y="128" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="middle">
              {values?.t ?? 't'}
            </text>
            <circle cx="40" cy="115" r="3" fill="#f59e0b" />
            <circle cx="220" cy="30" r="3" fill="#f59e0b" />
            <text x="120" y="65" fill="#f59e0b" fontSize="10" fontWeight="bold">
              Kecepatan berubah teratur (GLBB)
            </text>
          </g>
        )}

        {/* 4. s-t Compare (Perbandingan Kelajuan Mobil A vs Mobil B) */}
        {kind === 'st-compare' && (
          <g>
            {/* Car A (Steeper line) */}
            <line x1="40" y1="115" x2="160" y2="25" stroke="#06b6d4" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="160" cy="25" r="3" fill="#06b6d4" />
            <text x="168" y="28" fill="#06b6d4" fontSize="11" fontWeight="bold">Mobil A</text>

            {/* Car B (Gentler slope line) */}
            <line x1="40" y1="115" x2="220" y2="60" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="220" cy="60" r="3" fill="#f59e0b" />
            <text x="228" y="63" fill="#f59e0b" fontSize="11" fontWeight="bold">Mobil B</text>

            {/* Label helper */}
            <rect x="70" y="15" width="80" height="18" rx="4" fill="#0f172a" stroke="#06b6d4" strokeWidth="0.8" />
            <text x="110" y="27" fill="#06b6d4" fontSize="9" fontWeight="bold" textAnchor="middle">
              Kemiringan = Kelajuan
            </text>
          </g>
        )}

        {/* 5. s-t Hitung Kelajuan (v = s / t) */}
        {kind === 'st-calc-speed' && (
          <g>
            <line x1="40" y1="115" x2="210" y2="35" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="210" y1="35" x2="210" y2="115" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="40" y1="35" x2="210" y2="35" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
            <text x="32" y="39" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="end">
              {values?.s ?? 50}
            </text>
            <text x="210" y="130" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
              {values?.t ?? 5}
            </text>
            <circle cx="40" cy="115" r="3" fill="#34d399" />
            <circle cx="210" cy="35" r="3" fill="#34d399" />
            <text x="100" y="70" fill="#34d399" fontSize="10.5" fontWeight="bold">
              v = s / t
            </text>
          </g>
        )}

        {/* 6. a-t GLB (a = 0 sepanjang sumbu t) */}
        {kind === 'at-glb' && (
          <g>
            <line x1="40" y1="115" x2="225" y2="115" stroke="#38bdf8" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="40" cy="115" r="4" fill="#38bdf8" />
            <circle cx="225" cy="115" r="4" fill="#38bdf8" />
            <rect x="75" y="65" width="120" height="22" rx="5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <text x="135" y="79" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
              a = 0 (Tidak Ada Percepatan)
            </text>
          </g>
        )}

        {/* 7. a-t GLBB (a konstan positif) */}
        {kind === 'at-glbb' && (
          <g>
            <line x1="40" y1="60" x2="225" y2="60" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="36" y1="60" x2="40" y2="60" stroke="#f59e0b" strokeWidth="2" />
            <text x="32" y="64" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="end">
              {values?.a ?? '3'}
            </text>
            <circle cx="40" cy="60" r="3" fill="#f59e0b" />
            <circle cx="225" cy="60" r="3" fill="#f59e0b" />
            <text x="135" y="48" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">
              a = konstan &gt; 0
            </text>
          </g>
        )}

        {/* 8. v-t Hitung Jarak (Luas Daerah s = v * t) */}
        {kind === 'vt-calc-distance' && (
          <g>
            {/* Shaded area */}
            <polygon
              points="40,115 40,55 200,55 200,115"
              fill="url(#areaGrad)"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />
            <line x1="40" y1="55" x2="200" y2="55" stroke="#38bdf8" strokeWidth="3.5" />
            {/* Values on axes */}
            <line x1="36" y1="55" x2="40" y2="55" stroke="#38bdf8" strokeWidth="2" />
            <text x="32" y="59" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="end">
              {values?.vt ?? 10}
            </text>
            <line x1="200" y1="115" x2="200" y2="120" stroke="#38bdf8" strokeWidth="2" />
            <text x="200" y="130" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
              {values?.t ?? 6}
            </text>
            <text x="120" y="88" fill="#38bdf8" fontSize="11" fontWeight="extrabold" textAnchor="middle">
              Luas = s
            </text>
          </g>
        )}

        {/* 9. v-t Hitung Percepatan (Kemiringan Δv / Δt) */}
        {kind === 'vt-calc-accel' && (
          <g>
            <line
              x1="40"
              y1={values?.v0 === 0 ? 115 : 85}
              x2="210"
              y2="35"
              stroke="#f59e0b"
              strokeWidth="3.5"
            />
            {/* Dashed guidelines */}
            <line x1="210" y1="35" x2="210" y2="115" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="40" y1="35" x2="210" y2="35" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
            {values?.v0 && values.v0 > 0 && (
              <line x1="36" y1="85" x2="40" y2="85" stroke="#f59e0b" strokeWidth="2" />
            )}
            <text x="32" y="39" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="end">
              {values?.vt ?? 16}
            </text>
            {values?.v0 && values.v0 > 0 && (
              <text x="32" y="89" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="end">
                {values.v0}
              </text>
            )}
            <line x1="210" y1="115" x2="210" y2="120" stroke="#f59e0b" strokeWidth="2" />
            <text x="210" y="130" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
              {values?.t ?? 4}
            </text>
            <circle cx="40" cy={values?.v0 === 0 ? 115 : 85} r="3" fill="#f59e0b" />
            <circle cx="210" cy="35" r="3" fill="#f59e0b" />
          </g>
        )}
      </svg>
    </div>
  );
};
