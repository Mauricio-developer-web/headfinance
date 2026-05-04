import React, { useEffect, useMemo, useState } from "react";

const DEFAULT_ORGANIZERS = ["Lastiri", "Leo F", "Juan", "Matias", "Mauricio"];

const DEFAULT_TEAMS = [
  { id: 1, name: "Equipo 1", members: ["Daniela", "Ximena", "Daniel", "Santos"] },
  { id: 2, name: "Equipo 2", members: ["Patricio", "Iker Ramiro", "Rodrigo", "Juan Carlos"] },
  { id: 4, name: "Equipo 4", members: ["Paolo", "Leonardo G", "Alvaro", "Fernando"] },
];

const DEFAULT_CONCEPTS = [
  {
    word: "Inventarios perpetuos",
    category: "Sistemas contables",
    hints: [
      "Tengo relación con mercancías.",
      "Actualizo inventario en cada compra y venta.",
      "Reconozco costo de ventas en cada venta.",
    ],
    extra: {
      question: "En inventarios perpetuos, una compra de mercancía de contado se registra como:",
      options: ["Debe Inventarios / Haber Bancos", "Debe Compras / Haber Bancos", "Debe Bancos / Haber Ventas"],
      answer: 0,
    },
  },
  {
    word: "Sistema analítico o pormenorizado",
    category: "Sistemas contables",
    hints: [
      "Uso cuentas separadas para mercancías.",
      "Trabajo con Compras, devoluciones y rebajas.",
      "El costo de ventas se determina al cierre.",
    ],
    extra: {
      question: "En este sistema, una compra de mercancía normalmente se registra en:",
      options: ["Inventarios", "Compras", "Costo de ventas"],
      answer: 1,
    },
  },
  {
    word: "Estado de resultados",
    category: "Estados financieros",
    hints: [
      "No soy una cuenta, soy un estado financiero.",
      "Muestro ingresos, costos y gastos.",
      "Sirvo para conocer utilidad o pérdida.",
    ],
    extra: {
      question: "Si las ventas son $25,000 y el costo de ventas es $14,000, la utilidad bruta es:",
      options: ["$39,000", "$11,000", "$14,000"],
      answer: 1,
    },
  },
  {
    word: "Estado de situación financiera",
    category: "Estados financieros",
    hints: [
      "También me conocen como balance general.",
      "Muestro activos, pasivos y capital.",
      "Me baso en Activo = Pasivo + Capital.",
    ],
    extra: {
      question: "La ecuación básica de este estado es:",
      options: ["Activo = Pasivo + Capital", "Ventas - Gastos = Caja", "Debe = Haber + Ventas"],
      answer: 0,
    },
  },
  {
    word: "Estado de flujo de efectivo",
    category: "Estados financieros",
    hints: [
      "Muestro entradas y salidas de dinero.",
      "Clasifico operación, inversión y financiamiento.",
      "Ayudo a entender cómo se movió el efectivo.",
    ],
    extra: {
      question: "El cobro a clientes normalmente es flujo de:",
      options: ["Inversión", "Operación", "Financiamiento"],
      answer: 1,
    },
  },
  {
    word: "Estado de origen y aplicación",
    category: "Estados financieros",
    hints: [
      "Analizo recursos.",
      "Digo de dónde vino el dinero y en qué se usó.",
      "Un préstamo recibido puede ser origen.",
    ],
    extra: {
      question: "Un préstamo bancario recibido representa:",
      options: ["Aplicación de recursos", "Origen de recursos", "Gasto de operación"],
      answer: 1,
    },
  },
  {
    word: "Bancos",
    category: "Cuentas T",
    hints: ["Soy una cuenta de activo.", "Represento efectivo disponible.", "Aumento normalmente en el Debe."],
    extra: {
      question: "Si entra efectivo por una venta, Bancos se registra en:",
      options: ["Debe", "Haber", "No se registra"],
      answer: 0,
    },
  },
  {
    word: "Inventarios",
    category: "Cuentas T",
    hints: ["Soy una cuenta de activo.", "Represento mercancía disponible para vender.", "En perpetuos aumento cuando se compra mercancía."],
    extra: {
      question: "En una compra de mercancía de contado con sistema perpetuo, Inventarios va en:",
      options: ["Debe", "Haber", "Solo en flujo de efectivo"],
      answer: 0,
    },
  },
  {
    word: "Proveedores",
    category: "Cuentas T",
    hints: ["Soy una cuenta de pasivo.", "Represento deudas por compras a crédito.", "Disminuyo cuando se paga la deuda."],
    extra: {
      question: "Si compras mercancía a crédito, normalmente aumenta:",
      options: ["Bancos", "Proveedores", "Capital"],
      answer: 1,
    },
  },
  {
    word: "Ventas",
    category: "Cuentas T",
    hints: ["Soy una cuenta de ingresos.", "Me relaciono con vender mercancía o servicios.", "Aparezco en el Estado de resultados."],
    extra: {
      question: "Ventas pertenece principalmente al:",
      options: ["Estado de resultados", "Estado de situación financiera", "Estado de origen y aplicación"],
      answer: 0,
    },
  },
  {
    word: "Costo de ventas",
    category: "Cuentas T",
    hints: ["Me relaciono con la mercancía vendida.", "Resto a ventas para obtener utilidad bruta.", "En perpetuos se reconoce en cada venta."],
    extra: {
      question: "Ventas menos costo de ventas es:",
      options: ["Utilidad bruta", "Activo total", "Flujo neto"],
      answer: 0,
    },
  },
  {
    word: "Compras",
    category: "Sistema analítico",
    hints: ["Soy una cuenta usada en el sistema analítico.", "Registro adquisición de mercancías.", "No soy la cuenta principal en perpetuos."],
    extra: {
      question: "Compras se usa principalmente en el sistema:",
      options: ["Analítico o pormenorizado", "Perpetuo", "Bancario"],
      answer: 0,
    },
  },
  {
    word: "Activo",
    category: "Elementos financieros",
    hints: ["Represento recursos de la empresa.", "Incluyo bancos e inventarios.", "Formo parte del Estado de situación financiera."],
    extra: {
      question: "¿Cuál de estas cuentas es un activo?",
      options: ["Bancos", "Proveedores", "Ventas"],
      answer: 0,
    },
  },
  {
    word: "Pasivo",
    category: "Elementos financieros",
    hints: ["Represento obligaciones de la empresa.", "Incluyo deudas con proveedores o bancos.", "Estoy en el Estado de situación financiera."],
    extra: {
      question: "Proveedores es una cuenta de:",
      options: ["Activo", "Pasivo", "Ingreso"],
      answer: 1,
    },
  },
  {
    word: "Capital",
    category: "Elementos financieros",
    hints: ["Represento el patrimonio de los dueños.", "Estoy en el Estado de situación financiera.", "Formo parte de Activo = Pasivo + Capital."],
    extra: {
      question: "En la ecuación contable, capital se relaciona con:",
      options: ["Patrimonio de los dueños", "Solo gastos", "Solo efectivo"],
      answer: 0,
    },
  },
];

const DEFAULT_FINAL_CHALLENGES = [
  {
    title: "Caso final 1",
    prompt: "La empresa vende mercancía en efectivo por $12,000. El costo fue de $7,000. Usa sistema perpetuo.",
    answers: ["Estado principal: Estado de resultados", "Debe: Bancos", "Haber: Ventas", "Extra: registrar costo de ventas y disminuir inventarios"],
  },
  {
    title: "Caso final 2",
    prompt: "La empresa recibe un préstamo bancario por $20,000.",
    answers: ["Estado relacionado: Estado de origen y aplicación", "Tipo: origen de recursos", "Debe: Bancos", "Haber: Préstamo bancario"],
  },
  {
    title: "Caso final 3",
    prompt: "En sistema analítico, la empresa compra mercancía a crédito por $8,000.",
    answers: ["Sistema: analítico o pormenorizado", "Debe: Compras", "Haber: Proveedores", "Costo de ventas: se determina al cierre"],
  },
];

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

function cls(...classes) {
  return classes.filter(Boolean).join(" ");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-sky-300"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-sky-300"
      />
    </label>
  );
}

function TeamScoreCard({ team, score, active, currentPlayer, onPrevPlayer, onNextPlayer, onAddPoint, onRemovePoint }) {
  return (
    <div className={cls("rounded-2xl border p-4 transition", active ? "border-sky-400/50 bg-sky-400/10 shadow-lg" : "border-white/10 bg-white/5")}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold">{team.name}</h3>
          <p className="mt-1 truncate text-sm text-slate-300">{currentPlayer}</p>
          <p className="mt-1 truncate text-xs text-slate-500">{team.members.join(" · ")}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Pts</p>
          <p className="text-4xl font-black">{score}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button onClick={onPrevPlayer} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10">← Jugador</button>
        <button onClick={onNextPlayer} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10">Jugador →</button>
        <button onClick={onRemovePoint} className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-400/15">-1</button>
        <button onClick={onAddPoint} className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-400/15">+1</button>
      </div>
    </div>
  );
}

export default function HeadFinance() {
  const [screen, setScreen] = useState("home");
  const [organizers, setOrganizers] = useState(() => clone(DEFAULT_ORGANIZERS));
  const [teams, setTeams] = useState(() => clone(DEFAULT_TEAMS));
  const [concepts, setConcepts] = useState(() => clone(DEFAULT_CONCEPTS));
  const [finalChallenges, setFinalChallenges] = useState(() => clone(DEFAULT_FINAL_CHALLENGES));
  const [regularRounds, setRegularRounds] = useState(6);
  const [roundTime, setRoundTime] = useState(45);

  const [deck, setDeck] = useState(() => shuffle(DEFAULT_CONCEPTS));
  const [scores, setScores] = useState(() => DEFAULT_TEAMS.map(() => 0));
  const [teamIndex, setTeamIndex] = useState(0);
  const [playerIndices, setPlayerIndices] = useState(() => DEFAULT_TEAMS.map(() => 0));
  const [round, setRound] = useState(1);
  const [timer, setTimer] = useState(45);
  const [running, setRunning] = useState(false);
  const [showConcept, setShowConcept] = useState(true);
  const [hintCount, setHintCount] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const [selectedExtra, setSelectedExtra] = useState(null);
  const [finalTeamIndex, setFinalTeamIndex] = useState(0);
  const [showFinalAnswers, setShowFinalAnswers] = useState(false);
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState("");
  const [editingConceptIndex, setEditingConceptIndex] = useState(0);
  const [editingFinalIndex, setEditingFinalIndex] = useState(0);

  const currentTeam = teams[teamIndex] || teams[0];
  const currentPlayer = currentTeam?.members?.[playerIndices[teamIndex] % currentTeam.members.length] || "Jugador";
  const currentConcept = deck[(round - 1) % deck.length] || concepts[0];
  const currentFinal = finalChallenges[finalTeamIndex % finalChallenges.length] || finalChallenges[0];

  const winners = useMemo(() => {
    const maxScore = Math.max(...scores);
    return teams.filter((team, position) => scores[position] === maxScore);
  }, [scores, teams]);

  useEffect(() => {
    if (!running || screen !== "game" || answered || showExtra) return;
    if (timer <= 0) {
      setRunning(false);
      setAnswered(true);
      setToast("Tiempo terminado");
      return;
    }
    const id = setTimeout(() => setTimer((value) => value - 1), 1000);
    return () => clearTimeout(id);
  }, [running, timer, screen, answered, showExtra]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(id);
  }, [toast]);

  const syncGameArrays = (nextTeams) => {
    setScores(nextTeams.map((team, position) => scores[position] || 0));
    setPlayerIndices(nextTeams.map((team, position) => playerIndices[position] || 0));
    setTeamIndex((value) => Math.min(value, Math.max(nextTeams.length - 1, 0)));
  };

  const resetAll = () => {
    const nextDeck = shuffle(concepts);
    setDeck(nextDeck);
    setScores(teams.map(() => 0));
    setTeamIndex(0);
    setPlayerIndices(teams.map(() => 0));
    setRound(1);
    setTimer(roundTime);
    setRunning(false);
    setShowConcept(true);
    setHintCount(0);
    setAnswered(false);
    setShowExtra(false);
    setSelectedExtra(null);
    setFinalTeamIndex(0);
    setShowFinalAnswers(false);
    setHistory([]);
    setScreen("game");
  };

  const resetTurnState = () => {
    setTimer(roundTime);
    setRunning(false);
    setShowConcept(true);
    setHintCount(0);
    setAnswered(false);
    setShowExtra(false);
    setSelectedExtra(null);
  };

  const currentPoints = () => {
    let points = 3;
    if (timer <= Math.floor(roundTime / 2)) points = 2;
    points -= hintCount;
    return Math.max(points, 1);
  };

  const changeTeam = (delta) => {
    setTeamIndex((value) => mod(value + delta, teams.length));
  };

  const changePlayer = (delta) => {
    setPlayerIndices((previous) =>
      previous.map((value, position) =>
        position === teamIndex ? mod(value + delta, teams[teamIndex].members.length) : value
      )
    );
  };

  const adjustScore = (position, delta) => {
    setScores((previous) => previous.map((score, scorePosition) => (scorePosition === position ? Math.max(0, score + delta) : score)));
  };

  const useHint = () => {
    if (hintCount >= currentConcept.hints.length) return;
    setHintCount((value) => value + 1);
  };

  const markCorrect = () => {
    const pts = currentPoints();
    setScores((previous) => previous.map((score, position) => (position === teamIndex ? score + pts : score)));
    setHistory((previous) => [
      ...previous,
      { team: currentTeam.name, player: currentPlayer, concept: currentConcept.word, result: "Correcto", points: pts },
    ]);
    setRunning(false);
    setAnswered(true);
    setShowExtra(true);
    setToast(`+${pts} puntos`);
  };

  const markFail = () => {
    setHistory((previous) => [
      ...previous,
      { team: currentTeam.name, player: currentPlayer, concept: currentConcept.word, result: "Falló", points: 0 },
    ]);
    setRunning(false);
    setAnswered(true);
    setToast("Sin puntos");
  };

  const answerExtra = (optionPosition) => {
    if (selectedExtra !== null) return;
    setSelectedExtra(optionPosition);
    if (optionPosition === currentConcept.extra.answer) {
      setScores((previous) => previous.map((score, position) => (position === teamIndex ? score + 1 : score)));
      setToast("Reto extra +1");
    } else {
      setToast("Reto extra incorrecto");
    }
  };

  const nextTurn = () => {
    const currentTeamLength = teams[teamIndex].members.length;
    setPlayerIndices((previous) =>
      previous.map((value, position) => (position === teamIndex ? mod(value + 1, currentTeamLength) : value))
    );

    if (round >= regularRounds) {
      setFinalTeamIndex(0);
      setShowFinalAnswers(false);
      setScreen("final");
      setRunning(false);
      return;
    }

    setRound((value) => value + 1);
    setTeamIndex((value) => mod(value + 1, teams.length));
    resetTurnState();
  };

  const awardFinalPoints = (points) => {
    setScores((previous) => previous.map((score, position) => (position === finalTeamIndex ? score + points : score)));
    setToast(`${teams[finalTeamIndex].name}: +${points}`);
  };

  const nextFinalTeam = () => {
    setShowFinalAnswers(false);
    if (finalTeamIndex >= teams.length - 1) {
      setScreen("results");
      return;
    }
    setFinalTeamIndex((value) => value + 1);
  };

  const updateTeam = (position, nextTeam) => {
    const nextTeams = teams.map((team, index) => (index === position ? nextTeam : team));
    setTeams(nextTeams);
    syncGameArrays(nextTeams);
  };

  const updateTeamMember = (teamPosition, memberPosition, value) => {
    const nextTeam = clone(teams[teamPosition]);
    nextTeam.members[memberPosition] = value;
    updateTeam(teamPosition, nextTeam);
  };

  const addMember = (teamPosition) => {
    const nextTeam = clone(teams[teamPosition]);
    nextTeam.members.push("Nuevo jugador");
    updateTeam(teamPosition, nextTeam);
  };

  const removeMember = (teamPosition, memberPosition) => {
    const nextTeam = clone(teams[teamPosition]);
    if (nextTeam.members.length <= 1) return;
    nextTeam.members = nextTeam.members.filter((member, position) => position !== memberPosition);
    updateTeam(teamPosition, nextTeam);
  };

  const addTeam = () => {
    const nextTeams = [...teams, { id: Date.now(), name: `Equipo ${teams.length + 1}`, members: ["Nuevo jugador"] }];
    setTeams(nextTeams);
    syncGameArrays(nextTeams);
  };

  const removeTeam = (position) => {
    if (teams.length <= 1) return;
    const nextTeams = teams.filter((team, teamPosition) => teamPosition !== position);
    setTeams(nextTeams);
    syncGameArrays(nextTeams);
  };

  const updateConcept = (position, field, value) => {
    setConcepts((previous) => previous.map((concept, conceptPosition) => (conceptPosition === position ? { ...concept, [field]: value } : concept)));
  };

  const updateConceptHint = (position, hintPosition, value) => {
    setConcepts((previous) => previous.map((concept, conceptPosition) => {
      if (conceptPosition !== position) return concept;
      const hints = [...concept.hints];
      hints[hintPosition] = value;
      return { ...concept, hints };
    }));
  };

  const updateConceptExtra = (position, field, value) => {
    setConcepts((previous) => previous.map((concept, conceptPosition) => {
      if (conceptPosition !== position) return concept;
      return { ...concept, extra: { ...concept.extra, [field]: value } };
    }));
  };

  const updateConceptExtraOption = (position, optionPosition, value) => {
    setConcepts((previous) => previous.map((concept, conceptPosition) => {
      if (conceptPosition !== position) return concept;
      const options = [...concept.extra.options];
      options[optionPosition] = value;
      return { ...concept, extra: { ...concept.extra, options } };
    }));
  };

  const addConcept = () => {
    const next = {
      word: "Nuevo concepto",
      category: "Categoría",
      hints: ["Pista 1", "Pista 2", "Pista 3"],
      extra: { question: "Pregunta extra", options: ["Opción A", "Opción B", "Opción C"], answer: 0 },
    };
    setConcepts((previous) => [...previous, next]);
    setEditingConceptIndex(concepts.length);
  };

  const removeConcept = (position) => {
    if (concepts.length <= 1) return;
    setConcepts((previous) => previous.filter((concept, conceptPosition) => conceptPosition !== position));
    setEditingConceptIndex(0);
  };

  const updateFinalChallenge = (position, field, value) => {
    setFinalChallenges((previous) => previous.map((challenge, challengePosition) => (challengePosition === position ? { ...challenge, [field]: value } : challenge)));
  };

  const updateFinalAnswer = (position, answerPosition, value) => {
    setFinalChallenges((previous) => previous.map((challenge, challengePosition) => {
      if (challengePosition !== position) return challenge;
      const answers = [...challenge.answers];
      answers[answerPosition] = value;
      return { ...challenge, answers };
    }));
  };

  const restoreDefaults = () => {
    const nextTeams = clone(DEFAULT_TEAMS);
    setOrganizers(clone(DEFAULT_ORGANIZERS));
    setTeams(nextTeams);
    setConcepts(clone(DEFAULT_CONCEPTS));
    setFinalChallenges(clone(DEFAULT_FINAL_CHALLENGES));
    setRegularRounds(6);
    setRoundTime(45);
    setScores(nextTeams.map(() => 0));
    setPlayerIndices(nextTeams.map(() => 0));
    setTeamIndex(0);
    setToast("Configuración restaurada");
  };

  const goHome = () => {
    setRunning(false);
    setScreen("home");
  };

  const Button = ({ children, onClick, variant = "default", disabled = false, className = "" }) => {
    const styles = {
      default: "bg-sky-400 text-slate-950 hover:bg-sky-300",
      ghost: "border border-white/10 bg-white/5 text-white hover:bg-white/10",
      success: "bg-emerald-400 text-slate-950 hover:bg-emerald-300",
      danger: "bg-rose-500 text-white hover:bg-rose-400",
      warn: "bg-amber-300 text-slate-950 hover:bg-amber-200",
    };
    return (
      <button onClick={onClick} disabled={disabled} className={cls("rounded-xl px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40", styles[variant], className)}>
        {children}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.11),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_30%),linear-gradient(to_bottom,#020617,#0f172a)]" />

      {toast && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-900/95 px-5 py-3 text-sm font-semibold shadow-xl">
          {toast}
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-6">
        <header className="mb-5 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-sky-300">HeadFinance</p>
            <h1 className="text-2xl font-black tracking-tight md:text-4xl">Juego financiero digital</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setScreen("home")} variant="ghost">Inicio</Button>
            <Button onClick={() => setScreen("setup")} variant="ghost">Editar</Button>
            <Button onClick={resetAll}>Presentar</Button>
          </div>
        </header>

        {screen === "home" && (
          <main className="grid min-h-[72vh] gap-5 lg:grid-cols-[1.15fr_.85fr]">
            <section className="flex flex-col justify-center rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10">
              <p className="mb-3 inline-flex w-fit rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-300">Listo para proyectar</p>
              <h2 className="text-5xl font-black tracking-tight md:text-7xl">Head<span className="text-sky-300">Finance</span></h2>
              <p className="mt-5 max-w-2xl text-lg text-slate-300">Juego digital tipo Headbanz adaptado a Información Financiera. Equipos, jugadores, conceptos, tiempo y rondas son editables al momento.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button onClick={resetAll} className="px-6 py-4 text-base">Iniciar presentación</Button>
                <Button onClick={() => setScreen("setup")} variant="ghost" className="px-6 py-4 text-base">Editar antes de iniciar</Button>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold">Equipos jugadores</h3>
                <Button onClick={() => setScreen("setup")} variant="ghost">Modificar</Button>
              </div>
              <div className="space-y-3">
                {teams.map((team, position) => (
                  <div key={team.id} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold">{team.name}</p>
                        <p className="mt-1 text-sm text-slate-400">{team.members.join(" · ")}</p>
                      </div>
                      <p className="text-2xl font-black">{scores[position] || 0}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                <p className="text-sm text-slate-400">Organizadores</p>
                <p className="mt-1 text-slate-200">{organizers.join(" · ")}</p>
              </div>
            </section>
          </main>
        )}

        {screen === "setup" && (
          <main className="space-y-5">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-black">Panel de edición</h2>
                  <p className="text-sm text-slate-400">Cambia nombres, equipos, jugadores, rondas, tiempo, conceptos y casos.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={restoreDefaults} variant="ghost">Restaurar</Button>
                  <Button onClick={resetAll}>Guardar e iniciar</Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Rondas regulares" value={String(regularRounds)} onChange={(value) => setRegularRounds(Math.max(1, Number(value) || 1))} />
                <Field label="Segundos por turno" value={String(roundTime)} onChange={(value) => setRoundTime(Math.max(10, Number(value) || 45))} />
                <Field label="Organizadores" value={organizers.join(", ")} onChange={(value) => setOrganizers(value.split(",").map((item) => item.trim()).filter(Boolean))} />
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="text-xl font-black">Equipos</h3>
                <Button onClick={addTeam} variant="ghost">+ Equipo</Button>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                {teams.map((team, teamPosition) => (
                  <div key={team.id} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <Field label="Nombre del equipo" value={team.name} onChange={(value) => updateTeam(teamPosition, { ...team, name: value })} />
                      <button onClick={() => removeTeam(teamPosition)} className="mt-5 rounded-xl border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-sm font-bold text-rose-200 hover:bg-rose-400/15">Quitar</button>
                    </div>
                    <div className="space-y-2">
                      {team.members.map((member, memberPosition) => (
                        <div key={`${team.id}-${memberPosition}`} className="flex gap-2">
                          <input value={member} onChange={(event) => updateTeamMember(teamPosition, memberPosition, event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-sky-300" />
                          <button onClick={() => removeMember(teamPosition, memberPosition)} className="rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-bold hover:bg-white/10">×</button>
                        </div>
                      ))}
                    </div>
                    <Button onClick={() => addMember(teamPosition)} variant="ghost" className="mt-3 w-full">+ Jugador</Button>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-[.38fr_.62fr]">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-black">Conceptos</h3>
                  <Button onClick={addConcept} variant="ghost">+</Button>
                </div>
                <div className="max-h-[520px] space-y-2 overflow-auto pr-1">
                  {concepts.map((concept, position) => (
                    <button key={`${concept.word}-${position}`} onClick={() => setEditingConceptIndex(position)} className={cls("w-full rounded-xl border px-3 py-2 text-left text-sm", editingConceptIndex === position ? "border-sky-400/50 bg-sky-400/10" : "border-white/10 bg-slate-950/35 hover:bg-white/10")}>
                      <p className="font-bold">{concept.word}</p>
                      <p className="text-xs text-slate-400">{concept.category}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                {concepts[editingConceptIndex] && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-xl font-black">Editar concepto</h3>
                      <Button onClick={() => removeConcept(editingConceptIndex)} variant="danger">Eliminar</Button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Concepto" value={concepts[editingConceptIndex].word} onChange={(value) => updateConcept(editingConceptIndex, "word", value)} />
                      <Field label="Categoría" value={concepts[editingConceptIndex].category} onChange={(value) => updateConcept(editingConceptIndex, "category", value)} />
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      {concepts[editingConceptIndex].hints.map((hint, hintPosition) => (
                        <Field key={hintPosition} label={`Pista ${hintPosition + 1}`} value={hint} onChange={(value) => updateConceptHint(editingConceptIndex, hintPosition, value)} />
                      ))}
                    </div>
                    <TextAreaField label="Pregunta extra" value={concepts[editingConceptIndex].extra.question} onChange={(value) => updateConceptExtra(editingConceptIndex, "question", value)} />
                    <div className="grid gap-3 md:grid-cols-3">
                      {concepts[editingConceptIndex].extra.options.map((option, optionPosition) => (
                        <Field key={optionPosition} label={`Opción ${optionPosition + 1}`} value={option} onChange={(value) => updateConceptExtraOption(editingConceptIndex, optionPosition, value)} />
                      ))}
                    </div>
                    <Field label="Respuesta correcta: 0, 1 o 2" value={String(concepts[editingConceptIndex].extra.answer)} onChange={(value) => updateConceptExtra(editingConceptIndex, "answer", Math.max(0, Math.min(2, Number(value) || 0)))} />
                  </div>
                )}
              </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-[.38fr_.62fr]">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <h3 className="mb-4 text-xl font-black">Casos finales</h3>
                <div className="space-y-2">
                  {finalChallenges.map((challenge, position) => (
                    <button key={`${challenge.title}-${position}`} onClick={() => setEditingFinalIndex(position)} className={cls("w-full rounded-xl border px-3 py-2 text-left text-sm", editingFinalIndex === position ? "border-sky-400/50 bg-sky-400/10" : "border-white/10 bg-slate-950/35 hover:bg-white/10")}>
                      <p className="font-bold">{challenge.title}</p>
                      <p className="truncate text-xs text-slate-400">{challenge.prompt}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                {finalChallenges[editingFinalIndex] && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-black">Editar caso final</h3>
                    <Field label="Título" value={finalChallenges[editingFinalIndex].title} onChange={(value) => updateFinalChallenge(editingFinalIndex, "title", value)} />
                    <TextAreaField label="Caso" value={finalChallenges[editingFinalIndex].prompt} onChange={(value) => updateFinalChallenge(editingFinalIndex, "prompt", value)} rows={4} />
                    <div className="grid gap-3 md:grid-cols-2">
                      {finalChallenges[editingFinalIndex].answers.map((answer, answerPosition) => (
                        <Field key={answerPosition} label={`Respuesta ${answerPosition + 1}`} value={answer} onChange={(value) => updateFinalAnswer(editingFinalIndex, answerPosition, value)} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </main>
        )}

        {screen === "game" && (
          <main className="space-y-5">
            <section className="grid gap-5 lg:grid-cols-[1fr_.95fr]">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Ronda {round} de {regularRounds}</p>
                    <h2 className="text-3xl font-black md:text-5xl">{currentTeam.name}</h2>
                    <p className="mt-1 text-xl font-bold text-sky-300">{currentPlayer}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                      <p className="text-xs text-slate-400">Tiempo</p>
                      <p className={cls("text-4xl font-black", timer <= 10 ? "text-rose-300" : "text-sky-300")}>{formatTime(timer)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                      <p className="text-xs text-slate-400">Pistas</p>
                      <p className="text-4xl font-black text-amber-300">{hintCount}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                      <p className="text-xs text-slate-400">Puntos</p>
                      <p className="text-4xl font-black text-emerald-300">{currentPoints()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex min-h-[330px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-slate-950/35 p-6 text-center">
                  {showConcept ? (
                    <>
                      <p className="mb-4 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">{currentConcept.category}</p>
                      <h3 className="text-5xl font-black tracking-tight text-sky-100 md:text-7xl">{currentConcept.word}</h3>
                    </>
                  ) : (
                    <>
                      <div className="text-7xl">🙈</div>
                      <h3 className="mt-4 text-4xl font-black">Concepto oculto</h3>
                    </>
                  )}
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {currentConcept.hints.map((hint, hintPosition) => (
                    <div key={`${hint}-${hintPosition}`} className={cls("rounded-2xl border p-4 text-sm", hintPosition < hintCount ? "border-amber-400/20 bg-amber-400/10 text-amber-100" : "border-white/10 bg-slate-950/35 text-slate-500")}>
                      {hintPosition < hintCount ? hint : `Pista ${hintPosition + 1}`}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <h3 className="mb-4 text-xl font-black">Control</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={() => changeTeam(-1)} variant="ghost">← Equipo</Button>
                    <Button onClick={() => changeTeam(1)} variant="ghost">Equipo →</Button>
                    <Button onClick={() => changePlayer(-1)} variant="ghost">← Jugador</Button>
                    <Button onClick={() => changePlayer(1)} variant="ghost">Jugador →</Button>
                    <Button onClick={() => setRunning(true)} disabled={answered || showExtra}>Iniciar</Button>
                    <Button onClick={() => setRunning(false)} variant="ghost">Pausar</Button>
                    <Button onClick={() => { setTimer(roundTime); setRunning(false); }} variant="ghost">Reiniciar tiempo</Button>
                    <Button onClick={() => setShowConcept((value) => !value)} variant="ghost">{showConcept ? "Ocultar" : "Mostrar"}</Button>
                  </div>
                  <div className="mt-3 grid gap-2">
                    <Button onClick={useHint} variant="warn" disabled={hintCount >= currentConcept.hints.length || answered || showExtra}>Pista</Button>
                    <Button onClick={markCorrect} variant="success" disabled={answered || showExtra}>Correcto</Button>
                    <Button onClick={markFail} variant="danger" disabled={answered || showExtra}>Incorrecto</Button>
                    <Button onClick={nextTurn} variant="ghost">Siguiente turno</Button>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <h3 className="mb-4 text-xl font-black">Marcador</h3>
                  <div className="space-y-3">
                    {teams.map((team, position) => (
                      <TeamScoreCard
                        key={team.id}
                        team={team}
                        score={scores[position] || 0}
                        active={position === teamIndex}
                        currentPlayer={team.members[playerIndices[position] % team.members.length]}
                        onPrevPlayer={() => setPlayerIndices((previous) => previous.map((value, playerPosition) => (playerPosition === position ? mod(value - 1, team.members.length) : value)))}
                        onNextPlayer={() => setPlayerIndices((previous) => previous.map((value, playerPosition) => (playerPosition === position ? mod(value + 1, team.members.length) : value)))}
                        onAddPoint={() => adjustScore(position, 1)}
                        onRemovePoint={() => adjustScore(position, -1)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {showExtra && (
              <section className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-black">Reto extra</h3>
                  <Button onClick={nextTurn} variant="ghost">Continuar</Button>
                </div>
                <p className="mb-4 text-lg font-semibold text-slate-100">{currentConcept.extra.question}</p>
                <div className="grid gap-3 md:grid-cols-3">
                  {currentConcept.extra.options.map((option, optionPosition) => (
                    <button key={`${option}-${optionPosition}`} onClick={() => answerExtra(optionPosition)} disabled={selectedExtra !== null} className={cls("rounded-2xl border px-4 py-4 text-left font-semibold", selectedExtra === optionPosition ? optionPosition === currentConcept.extra.answer ? "border-emerald-300 bg-emerald-400/20" : "border-rose-300 bg-rose-400/20" : "border-white/10 bg-white/5 hover:bg-white/10")}>
                      {option}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </main>
        )}

        {screen === "final" && (
          <main className="flex min-h-[72vh] items-center justify-center">
            <section className="w-full max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-center">
                <p className="text-sm font-semibold text-sky-300">Caso final</p>
                <h2 className="mt-2 text-4xl font-black md:text-5xl">{teams[finalTeamIndex]?.name}</h2>
              </div>
              <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/35 p-6">
                <p className="text-sm text-slate-400">{currentFinal.title}</p>
                <p className="mt-3 text-2xl font-bold">{currentFinal.prompt}</p>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {currentFinal.answers.map((answer, answerPosition) => (
                  <div key={`${answer}-${answerPosition}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    {showFinalAnswers ? <p className="font-semibold text-emerald-300">{answer}</p> : <p className="text-slate-500">Respuesta oculta</p>}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button onClick={() => setShowFinalAnswers((value) => !value)} variant="ghost">{showFinalAnswers ? "Ocultar respuestas" : "Mostrar respuestas"}</Button>
                <Button onClick={() => awardFinalPoints(3)} variant="success">Correcto +3</Button>
                <Button onClick={() => awardFinalPoints(1)} variant="warn">Parcial +1</Button>
                <Button onClick={nextFinalTeam}>Siguiente equipo</Button>
              </div>
            </section>
          </main>
        )}

        {screen === "results" && (
          <main className="space-y-5">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <div className="text-7xl">🏆</div>
              <p className="mt-3 text-sm text-slate-400">Resultado final</p>
              <h2 className="mt-2 text-4xl font-black md:text-6xl">{winners.map((winner) => winner.name).join(" y ")}</h2>
            </section>
            <section className="grid gap-4 md:grid-cols-3">
              {teams.map((team, position) => (
                <div key={team.id} className={cls("rounded-3xl border p-5", winners.some((winner) => winner.id === team.id) ? "border-emerald-400/30 bg-emerald-400/10" : "border-white/10 bg-white/5")}>
                  <p className="text-xl font-bold">{team.name}</p>
                  <p className="mt-3 text-5xl font-black">{scores[position]}</p>
                  <p className="mt-3 text-sm text-slate-400">{team.members.join(" · ")}</p>
                </div>
              ))}
            </section>
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-4 text-xl font-black">Historial</h3>
              <div className="max-h-64 space-y-2 overflow-auto">
                {history.length === 0 ? <p className="text-slate-400">Sin historial.</p> : history.map((item, position) => (
                  <div key={`${item.team}-${position}`} className="rounded-xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm">
                    <b>{item.team}</b> · {item.player} · {item.concept} · {item.result} · {item.points} pts
                  </div>
                ))}
              </div>
            </section>
            <div className="flex justify-center gap-3">
              <Button onClick={resetAll}>Jugar otra vez</Button>
              <Button onClick={goHome} variant="ghost">Inicio</Button>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}

