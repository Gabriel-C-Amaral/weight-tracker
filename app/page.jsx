"use client";
import { useState, useEffect, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ReferenceLine, ResponsiveContainer,
} from "recharts";

const GABRIEL_START = 96.6;
const MELISSA_START = 106.05;
const GABRIEL_TARGET = 70;
const MELISSA_TARGET = 65;

function parseDate(str) {
  const [d, m, y] = str.split("/").map(Number);
  return new Date(2000 + y, m - 1, d);
}

function mergeData(gArr, mArr) {
  const allDates = [...new Set([...gArr.map(d => d.date), ...mArr.map(d => d.date)])]
    .sort((a, b) => parseDate(a) - parseDate(b));
  return allDates.map(date => ({
    date,
    gabriel: gArr.find(d => d.date === date)?.gabriel,
    melissa: mArr.find(d => d.date === date)?.melissa,
  }));
}

function sortByDate(arr) {
  return [...arr].sort((a, b) => parseDate(a.date) - parseDate(b.date));
}

function todayFormatted() {
  const now = new Date();
  return `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getFullYear()).slice(2)}`;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(8,8,20,0.97)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 16px", fontSize: 13 }}>
      <p style={{ color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>{label}</p>
      {payload.map(p => p.value != null && (
        <p key={p.dataKey} style={{ color: p.color, margin: "2px 0" }}>
          {p.dataKey === "gabriel" ? "🔵 Gabriel" : "🌻 Melissa"}: <strong>{p.value.toFixed(2)} kg</strong>
        </p>
      ))}
    </div>
  );
};

function Stat({ label, value, color = "#cbd5e1" }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function ProgressBar({ current, total, color }) {
  const pct = Math.min(100, (current / total) * 100);
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b", marginBottom: 5 }}>
        <span>Progresso até a meta</span>
        <span style={{ color, fontWeight: 700 }}>{pct.toFixed(1)}%</span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 999, height: 8 }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 999, background: `linear-gradient(90deg, ${color}55, ${color})`, transition: "width 1s ease", boxShadow: `0 0 8px ${color}66` }} />
      </div>
    </div>
  );
}

export default function App() {
  const [gabrielData, setGabrielData] = useState([]);
  const [melissaData, setMelissaData] = useState([]);
  const [view, setView] = useState("both");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ person: "gabriel", date: todayFormatted(), weight: "" });
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/weights");
      const { gabriel, melissa } = await res.json();
      setGabrielData(sortByDate(gabriel));
      setMelissaData(sortByDate(melissa));
    } catch {
      setFeedback({ type: "error", msg: "Erro ao carregar dados." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleAdd() {
    const w = parseFloat(form.weight.replace(",", "."));
    if (!form.date.match(/^\d{2}\/\d{2}\/\d{2}$/) || isNaN(w) || w < 30 || w > 300) {
      setFeedback({ type: "error", msg: "Data inválida ou peso fora do intervalo (30–300kg)." });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/weights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ person: form.person, date: form.date, weight: w }),
      });

      if (!res.ok) throw new Error();
      const { data } = await res.json();

      if (form.person === "gabriel") setGabrielData(data);
      else setMelissaData(data);

      const name = form.person === "gabriel" ? "Gabriel" : "Melissa";
      setFeedback({ type: "ok", msg: `✓ ${name}: ${w.toFixed(2)} kg em ${form.date}` });
      setForm(f => ({ ...f, weight: "", date: todayFormatted() }));
      setTimeout(() => setFeedback(null), 4000);
    } catch {
      setFeedback({ type: "error", msg: "Erro ao salvar. Tente novamente." });
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setSaving(false);
    }
  }

  const merged = mergeData(gabrielData, melissaData);
  const gabrielLast = gabrielData.at(-1)?.gabriel ?? 0;
  const melissaLast = melissaData.at(-1)?.melissa ?? 0;
  const lastUpdated = merged.at(-1)?.date ?? "—";
  const showGabriel = view === "both" || view === "gabriel";
  const showMelissa  = view === "both" || view === "melissa";

  const inputStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "9px 14px", color: "#e8eaf6", fontSize: 14, outline: "none", fontFamily: "inherit" };
  const labelStyle = { display: "block", fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 };

  if (loading) {
    return (
      <div style={{ background: "linear-gradient(135deg, #0d0d1a 0%, #0a1628 100%)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 16 }}>
        Carregando dados...
      </div>
    );
  }

  return (
    <div style={{ background: "linear-gradient(135deg, #0d0d1a 0%, #0a1628 100%)", minHeight: "100vh", width: "100%", boxSizing: "border-box", padding: "32px 40px", fontFamily: "'Inter', -apple-system, sans-serif", color: "#e8eaf6" }}>
      <div style={{ width: "100%", boxSizing: "border-box" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, margin: 0, background: "linear-gradient(90deg, #60a5fa, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Jornada de Emagrecimento
          </h1>
          <p style={{ color: "#94a3b8", marginTop: 6, fontSize: 14 }}>
            Acompanhamento desde 26 de outubro de 2025 · Atualizado em {lastUpdated}
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          {/* Gabriel */}
          <div style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(37,99,235,0.06))", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 16, padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#60a5fa", boxShadow: "0 0 8px #60a5fa" }} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>Gabriel</span>
              <span style={{ marginLeft: "auto", fontSize: 22, fontWeight: 800, color: "#60a5fa" }}>{gabrielLast.toFixed(2)} kg</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Stat label="Início" value={`${GABRIEL_START} kg`} />
              <Stat label="Perdeu" value={`↓ ${(GABRIEL_START - gabrielLast).toFixed(2)} kg`} color="#4ade80" />
              <Stat label="Progresso" value={`${((GABRIEL_START - gabrielLast) / GABRIEL_START * 100).toFixed(1)}%`} color="#4ade80" />
              <Stat label="Meta" value={`${GABRIEL_TARGET} kg`} color="#fbbf24" />
              <Stat label="Falta" value={`${(gabrielLast - GABRIEL_TARGET).toFixed(2)} kg`} color="#fb923c" />
            </div>
            <ProgressBar current={GABRIEL_START - gabrielLast} total={GABRIEL_START - GABRIEL_TARGET} color="#60a5fa" />
          </div>

          {/* Melissa */}
          <div style={{ background: "linear-gradient(135deg, rgba(244,114,182,0.15), rgba(219,39,119,0.06))", border: "1px solid rgba(244,114,182,0.3)", borderRadius: 16, padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f472b6", boxShadow: "0 0 8px #f472b6" }} />
              <span style={{ fontWeight: 700, fontSize: 16 }}>Melissa 🌻</span>
              <span style={{ marginLeft: "auto", fontSize: 22, fontWeight: 800, color: "#f472b6" }}>{melissaLast.toFixed(2)} kg</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Stat label="Início" value={`${MELISSA_START} kg`} />
              <Stat label="Perdeu" value={`↓ ${(MELISSA_START - melissaLast).toFixed(2)} kg`} color="#4ade80" />
              <Stat label="Progresso" value={`${((MELISSA_START - melissaLast) / MELISSA_START * 100).toFixed(1)}%`} color="#4ade80" />
              <Stat label="Meta" value={`${MELISSA_TARGET} kg`} color="#fbbf24" />
              <Stat label="Falta" value={`${(melissaLast - MELISSA_TARGET).toFixed(2)} kg`} color="#fb923c" />
            </div>
            <ProgressBar current={MELISSA_START - melissaLast} total={MELISSA_START - MELISSA_TARGET} color="#f472b6" />
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {[["both", "Ambos"], ["gabriel", "Gabriel"], ["melissa", "Melissa 🌻"]].map(([v, label]) => (
              <button key={v} onClick={() => setView(v)} style={{ padding: "8px 20px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: view === v ? (v === "gabriel" ? "#3b82f6" : v === "melissa" ? "#ec4899" : "linear-gradient(90deg,#3b82f6,#ec4899)") : "rgba(255,255,255,0.07)", color: view === v ? "#fff" : "#94a3b8" }}>{label}</button>
            ))}
          </div>
          <button onClick={() => setShowForm(f => !f)} style={{ padding: "9px 22px", borderRadius: 20, cursor: "pointer", fontWeight: 700, fontSize: 13, background: showForm ? "rgba(255,255,255,0.07)" : "rgba(74,222,128,0.12)", color: showForm ? "#94a3b8" : "#4ade80", border: `1px solid ${showForm ? "rgba(255,255,255,0.1)" : "rgba(74,222,128,0.3)"}` }}>
            {showForm ? "✕ Fechar" : "+ Registrar peso"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: "20px 24px", marginBottom: 20, display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
            <div>
              <label style={labelStyle}>Pessoa</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[["gabriel", "🔵 Gabriel"], ["melissa", "🌻 Melissa"]].map(([v, label]) => (
                  <button key={v} onClick={() => setForm(f => ({ ...f, person: v }))} style={{ padding: "8px 16px", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 13, background: form.person === v ? (v === "gabriel" ? "rgba(59,130,246,0.25)" : "rgba(244,114,182,0.25)") : "rgba(255,255,255,0.05)", color: form.person === v ? (v === "gabriel" ? "#60a5fa" : "#f472b6") : "#64748b", border: `1px solid ${form.person === v ? (v === "gabriel" ? "rgba(96,165,250,0.4)" : "rgba(244,114,182,0.4)") : "transparent"}` }}>{label}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Data (DD/MM/AA)</label>
              <input value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} placeholder="04/03/26" style={{ ...inputStyle, width: 120 }} />
            </div>
            <div>
              <label style={labelStyle}>Peso (kg)</label>
              <input value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleAdd()} placeholder="80,00" style={{ ...inputStyle, width: 110 }} />
            </div>
            <button onClick={handleAdd} disabled={saving} style={{ padding: "10px 28px", borderRadius: 10, border: "none", cursor: saving ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 14, opacity: saving ? 0.6 : 1, background: form.person === "gabriel" ? "linear-gradient(135deg,#3b82f6,#1d4ed8)" : "linear-gradient(135deg,#ec4899,#be185d)", color: "#fff" }}>
              {saving ? "Salvando..." : "Salvar"}
            </button>
            {feedback && (
              <div style={{ padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, background: feedback.type === "ok" ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)", color: feedback.type === "ok" ? "#4ade80" : "#f87171", border: `1px solid ${feedback.type === "ok" ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}` }}>
                {feedback.msg}
              </div>
            )}
          </div>
        )}

        {/* Chart */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "24px 16px 16px" }}>
          <ResponsiveContainer width="100%" height={420}>
            <LineChart data={merged} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} interval={4} angle={-40} textAnchor="end" height={55} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} domain={[60, 110]} width={35} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={v => v === "gabriel" ? "Gabriel" : "Melissa 🌻"} wrapperStyle={{ color: "#94a3b8", fontSize: 13, paddingTop: 12 }} />
              {showGabriel && <ReferenceLine y={GABRIEL_TARGET} stroke="#60a5fa" strokeDasharray="5 4" strokeOpacity={0.4} label={{ value: `Meta Gabriel (${GABRIEL_TARGET}kg)`, position: "insideTopLeft", fill: "#60a5fa", fontSize: 10 }} />}
              {showMelissa  && <ReferenceLine y={MELISSA_TARGET}  stroke="#f472b6" strokeDasharray="5 4" strokeOpacity={0.4} label={{ value: `Meta Melissa (${MELISSA_TARGET}kg)`,  position: "insideTopLeft", fill: "#f472b6", fontSize: 10 }} />}
              {showGabriel && <Line type="monotone" dataKey="gabriel" stroke="#60a5fa" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#60a5fa", stroke: "#fff", strokeWidth: 2 }} connectNulls />}
              {showMelissa  && <Line type="monotone" dataKey="melissa"  stroke="#f472b6" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#f472b6", stroke: "#fff", strokeWidth: 2 }} connectNulls />}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <p style={{ textAlign: "center", color: "#334155", fontSize: 12, marginTop: 16 }}>
          Dados registrados diariamente via WhatsApp
        </p>
      </div>
    </div>
  );
}
