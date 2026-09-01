(() => {
  "use strict";

  const STORAGE_KEY = "stop-the-time.state.v1";
  const THEME_KEY = "stop-the-time.theme";
  const LANGUAGE_KEY = "stop-the-time.language";
  const SAVE_DELAY_MS = 120;
  const ALARM_DURATION_SECONDS = 5;
  const SOUND_VALUES = ["beep", "chime", "bell", "ring", "buzzer", "mute"];
  const DEFAULT_COLORS = ["#2563eb", "#13895f", "#7c3aed", "#c2413a", "#b7791f", "#0891b2"];
  const DEFAULT_SHORTCUTS = [
    { code: "KeyA", label: "A" },
    { code: "KeyS", label: "S" },
    { code: "KeyD", label: "D" },
  ];
  const GLOBAL_RESERVED = new Map([
    ["Space", "Space is reserved for Start / Stop All."],
    ["KeyL", "L is reserved for Lap All."],
  ]);
  const PANEL_IDS = ["stopwatchPanel", "timerPanel"];
  const LANGUAGE_VALUES = ["nl", "en", "de"];
  const SYSTEM_SENSITIVE = new Set([
    "Tab",
    "Escape",
    "Enter",
    "Backspace",
    "Delete",
    "F5",
    "F11",
    "F12",
    "PrintScreen",
  ]);
  const TRANSLATIONS = {
    en: {
      addStopwatch: "+ Stopwatch",
      addTimer: "+ Timer",
      appearance: "Appearance",
      clear: "Clear",
      complete: "Complete",
      confirmNewSession: "Start a new session and clear the current event log? Export it first if you need this data.",
      confirmRemoveStopwatch: "Remove this stopwatch? This cannot be undone.",
      confirmRemoveTimer: "Remove this timer? This cannot be undone.",
      confirmResetEventLog: "Reset the event log and start a clean session? This removes all recorded events. Export it first if you need this data.",
      countdownHeading: "Timers",
      eventCount: "{count} {eventWord} recorded",
      eventSingular: "event",
      eventPlural: "events",
      eventTimerComplete: "timer completed",
      eventTimerReset: "timer reset",
      eventTimerStart: "timer started",
      eventTimerStop: "timer stopped",
      eventStopwatchLap: "lap",
      eventStopwatchReset: "stopwatch reset",
      eventStopwatchStart: "stopwatch started",
      eventStopwatchStop: "stopwatch stopped",
      exit: "Exit",
      exitClockFullscreen: "Exit full screen clock",
      exitFullscreen: "Exit fullscreen countdown",
      csvDate: "Date",
      csvElapsed: "Elapsed",
      csvEnd: "End",
      csvEvent: "Event",
      csvLap: "Lap",
      csvLapElapsed: "Lap {number} time",
      csvLapNumber: "Lap {number}",
      csvLapTotal: "Lap {number} total",
      csvName: "Name",
      csvRemaining: "Remaining",
      csvSplit: "Split",
      csvStopwatch: "Stopwatch",
      csvStart: "Start",
      csvTime: "Time",
      csvTimer: "Timer",
      csvType: "Type",
      exportCsv: "Export Event Log as CSV",
      fullscreen: "FULLSCREEN",
      fullscreenTimerControls: "Fullscreen timer controls",
      globalStopwatchControls: "Global stopwatch controls",
      globalTimerControls: "Global timer controls",
      idle: "Idle",
      language: "Language",
      lap: "LAP",
      lapAll: "LAP ALL",
      lapShortcut: "Lap All",
      laps: "Laps",
      newSession: "New Session",
      noEvents: "No events yet",
      noLaps: "No laps recorded",
      navStopwatch: "Stopwatch",
      navTimer: "Timer",
      openClockFullscreen: "Open full screen clock",
      openTimerPip: "Open timer in Picture-in-Picture",
      overallVolumeLabel: "Overall volume",
      paused: "Stopped",
      pause: "PAUSE",
      pictureInPicture: "PIP",
      pipUnavailable: "Picture-in-Picture is not available in this browser",
      reset: "RESET",
      resetAll: "RESET ALL",
      resetEventLog: "Reset event log",
      recentEventLog: "Recent event log",
      removeStopwatch: "DELETE",
      removeTimer: "DELETE",
      restart: "RESTART",
      running: "Running",
      sessionLogHeading: "Event Log",
      sessionMeta: "{stopwatches} {stopwatchWord} - {running} running - {events} {eventWord}",
      setKey: "Set key",
      shortcut: "Shortcut",
      shortcutAction: "Action",
      shortcutPressKey: "Press a key...",
      shortcutStartStop: "Start / stop",
      soundBeep: "Beep",
      soundBell: "Bell",
      soundBuzzer: "Buzzer",
      soundChime: "Chime",
      soundLabel: "Sound",
      soundMute: "Mute",
      soundRing: "Ring",
      skipLink: "Skip to timers",
      spaceShortcut: "Start / Stop All",
      start: "START",
      startAll: "START ALL",
      startAllTimers: "START ALL TIMERS",
      stop: "STOP",
      stopAll: "STOP ALL",
      stopAllTimers: "STOP ALL TIMERS",
      pauseAllTimers: "PAUSE ALL TIMERS",
      stopwatchDefaultName: "Stopwatch",
      stopwatchHeading: "Stopwatches",
      stopwatchPlural: "stopwatches",
      stopwatchSingular: "stopwatch",
      tableElapsed: "Elapsed",
      tableEvent: "Event",
      tableLap: "Lap",
      tableTime: "Time",
      tableTimer: "Timer",
      test: "TEST",
      testSound: "Test sound",
      timerDefaultName: "Timer",
      timerMeta: "{timers} {timerWord} - {running} running",
      timerPlural: "timers",
      timerSingular: "timer",
      timerShortcutName: "controls",
      volumeLabel: "Volume",
    },
    nl: {
      addStopwatch: "+ Stopwatch",
      addTimer: "+ Timer",
      appearance: "Weergave",
      clear: "Wissen",
      complete: "Klaar",
      confirmNewSession: "Nieuwe sessie starten en het huidige eventlog wissen? Exporteer het eerst als je deze gegevens nodig hebt.",
      confirmRemoveStopwatch: "Deze stopwatch verwijderen? Dit kan niet ongedaan worden gemaakt.",
      confirmRemoveTimer: "Deze timer verwijderen? Dit kan niet ongedaan worden gemaakt.",
      confirmResetEventLog: "Eventlog resetten en een schone sessie starten? Dit verwijdert alle opgenomen gebeurtenissen. Exporteer het eerst als je deze gegevens nodig hebt.",
      countdownHeading: "Timers",
      eventCount: "{count} {eventWord} opgenomen",
      eventSingular: "event",
      eventPlural: "events",
      eventTimerComplete: "timer klaar",
      eventTimerReset: "timer teruggezet",
      eventTimerStart: "timer gestart",
      eventTimerStop: "timer gestopt",
      eventStopwatchLap: "ronde",
      eventStopwatchReset: "stopwatch teruggezet",
      eventStopwatchStart: "stopwatch gestart",
      eventStopwatchStop: "stopwatch gestopt",
      exit: "Sluiten",
      exitClockFullscreen: "Sluit klok volledig scherm",
      exitFullscreen: "Sluit timer volledig scherm",
      csvDate: "Datum",
      csvElapsed: "Verstreken tijd",
      csvEnd: "Stop / einde",
      csvEvent: "Gebeurtenis",
      csvLap: "Ronde",
      csvLapElapsed: "Ronde {number} tijd",
      csvLapNumber: "Ronde {number}",
      csvLapTotal: "Ronde {number} totaal",
      csvName: "Naam",
      csvRemaining: "Resterende tijd",
      csvSplit: "Tussentijd",
      csvStopwatch: "Stopwatch",
      csvStart: "Start",
      csvTime: "Tijd",
      csvTimer: "Timer",
      csvType: "Soort",
      exportCsv: "Exporteer Eventlog als CSV",
      fullscreen: "VOLLEDIG SCHERM",
      fullscreenTimerControls: "Timerbediening in volledig scherm",
      globalStopwatchControls: "Algemene stopwatchbediening",
      globalTimerControls: "Algemene timerbediening",
      idle: "Klaar",
      language: "Taal",
      lap: "RONDE",
      lapAll: "ALLE RONDES",
      lapShortcut: "Alle rondes",
      laps: "Rondes",
      newSession: "Nieuwe sessie",
      noEvents: "Nog geen events",
      noLaps: "Nog geen rondes",
      navStopwatch: "Stopwatch",
      navTimer: "Timer",
      openClockFullscreen: "Open klok volledig scherm",
      openTimerPip: "Open timer in Picture-in-Picture",
      overallVolumeLabel: "Algemeen volume",
      paused: "Gestopt",
      pause: "PAUZE",
      pictureInPicture: "PIP",
      pipUnavailable: "Picture-in-Picture is niet beschikbaar in deze browser",
      reset: "RESET",
      resetAll: "RESET ALLES",
      resetEventLog: "Eventlog resetten",
      recentEventLog: "Recent eventlog",
      removeStopwatch: "VERWIJDER",
      removeTimer: "VERWIJDER",
      restart: "HERSTART",
      running: "Loopt",
      sessionLogHeading: "Eventlog",
      sessionMeta: "{stopwatches} {stopwatchWord} - {running} actief - {events} {eventWord}",
      setKey: "Kies toets",
      shortcut: "Toets",
      shortcutAction: "Actie",
      shortcutPressKey: "Druk een toets...",
      shortcutStartStop: "Start / stop",
      soundBeep: "Beep",
      soundBell: "Bel",
      soundBuzzer: "Buzzer",
      soundChime: "Chime",
      soundLabel: "Geluid",
      soundMute: "Stil",
      soundRing: "Tring",
      skipLink: "Ga naar timers",
      spaceShortcut: "Alles starten / stoppen",
      start: "START",
      startAll: "START ALLES",
      startAllTimers: "START ALLE TIMERS",
      stop: "STOP",
      stopAll: "STOP ALLES",
      stopAllTimers: "STOP ALLE TIMERS",
      pauseAllTimers: "PAUZEER ALLE TIMERS",
      stopwatchDefaultName: "Stopwatch",
      stopwatchHeading: "Stopwatches",
      stopwatchPlural: "stopwatches",
      stopwatchSingular: "stopwatch",
      tableElapsed: "Verstreken",
      tableEvent: "Event",
      tableLap: "Ronde",
      tableTime: "Tijd",
      tableTimer: "Timer",
      test: "TEST",
      testSound: "Test geluid",
      timerDefaultName: "Timer",
      timerMeta: "{timers} {timerWord} - {running} actief",
      timerPlural: "timers",
      timerSingular: "timer",
      timerShortcutName: "bediening",
      volumeLabel: "Volume",
    },
    de: {
      addStopwatch: "+ Stoppuhr",
      addTimer: "+ Timer",
      appearance: "Darstellung",
      clear: "Löschen",
      complete: "Fertig",
      confirmNewSession: "Neue Sitzung starten und das aktuelle Ereignisprotokoll löschen? Exportiere es zuerst, wenn du diese Daten brauchst.",
      confirmRemoveStopwatch: "Diese Stoppuhr löschen? Das kann nicht rückgängig gemacht werden.",
      confirmRemoveTimer: "Diesen Timer löschen? Das kann nicht rückgängig gemacht werden.",
      confirmResetEventLog: "Ereignisprotokoll zurücksetzen und eine saubere Sitzung starten? Das entfernt alle aufgezeichneten Ereignisse. Exportiere es zuerst, wenn du diese Daten brauchst.",
      countdownHeading: "Timer",
      eventCount: "{count} {eventWord} aufgezeichnet",
      eventSingular: "Event",
      eventPlural: "Events",
      eventTimerComplete: "Timer abgelaufen",
      eventTimerReset: "Timer zurückgesetzt",
      eventTimerStart: "Timer gestartet",
      eventTimerStop: "Timer gestoppt",
      eventStopwatchLap: "Runde",
      eventStopwatchReset: "Stoppuhr zurückgesetzt",
      eventStopwatchStart: "Stoppuhr gestartet",
      eventStopwatchStop: "Stoppuhr gestoppt",
      exit: "Schließen",
      exitClockFullscreen: "Uhr im Vollbild schließen",
      exitFullscreen: "Timer-Vollbild schließen",
      csvDate: "Datum",
      csvElapsed: "Verstrichene Zeit",
      csvEnd: "Stopp / Ende",
      csvEvent: "Ereignis",
      csvLap: "Runde",
      csvLapElapsed: "Runde {number} Zeit",
      csvLapNumber: "Runde {number}",
      csvLapTotal: "Runde {number} gesamt",
      csvName: "Name",
      csvRemaining: "Restzeit",
      csvSplit: "Zwischenzeit",
      csvStopwatch: "Stoppuhr",
      csvStart: "Start",
      csvTime: "Uhrzeit",
      csvTimer: "Timer",
      csvType: "Typ",
      exportCsv: "Ereignisprotokoll als CSV exportieren",
      fullscreen: "VOLLBILD",
      fullscreenTimerControls: "Timer-Steuerung im Vollbild",
      globalStopwatchControls: "Globale Stoppuhr-Steuerung",
      globalTimerControls: "Globale Timer-Steuerung",
      idle: "Bereit",
      language: "Sprache",
      lap: "RUNDE",
      lapAll: "ALLE RUNDEN",
      lapShortcut: "Alle Runden",
      laps: "Runden",
      newSession: "Neue Sitzung",
      noEvents: "Noch keine Events",
      noLaps: "Noch keine Runden",
      navStopwatch: "Stoppuhr",
      navTimer: "Timer",
      openClockFullscreen: "Uhr im Vollbild öffnen",
      openTimerPip: "Timer in Picture-in-Picture öffnen",
      overallVolumeLabel: "Gesamtlautstärke",
      paused: "Gestoppt",
      pause: "PAUSE",
      pictureInPicture: "PIP",
      pipUnavailable: "Picture-in-Picture ist in diesem Browser nicht verfügbar",
      reset: "RESET",
      resetAll: "ALLE ZURÜCKSETZEN",
      resetEventLog: "Ereignisprotokoll zurücksetzen",
      recentEventLog: "Letztes Ereignisprotokoll",
      removeStopwatch: "LÖSCHEN",
      removeTimer: "LÖSCHEN",
      restart: "NEUSTART",
      running: "Läuft",
      sessionLogHeading: "Ereignisprotokoll",
      sessionMeta: "{stopwatches} {stopwatchWord} - {running} aktiv - {events} {eventWord}",
      setKey: "Taste wählen",
      shortcut: "Taste",
      shortcutAction: "Aktion",
      shortcutPressKey: "Taste drücken...",
      shortcutStartStop: "Start / Stopp",
      soundBeep: "Beep",
      soundBell: "Glocke",
      soundBuzzer: "Summer",
      soundChime: "Chime",
      soundLabel: "Klang",
      soundMute: "Stumm",
      soundRing: "Klingeln",
      skipLink: "Zu Timern springen",
      spaceShortcut: "Alle starten / stoppen",
      start: "STARTEN",
      startAll: "ALLE STARTEN",
      startAllTimers: "ALLE TIMER STARTEN",
      stop: "STOPPEN",
      stopAll: "ALLE STOPPEN",
      stopAllTimers: "ALLE TIMER STOPPEN",
      pauseAllTimers: "ALLE TIMER PAUSIEREN",
      stopwatchDefaultName: "Stoppuhr",
      stopwatchHeading: "Stoppuhren",
      stopwatchPlural: "Stoppuhren",
      stopwatchSingular: "Stoppuhr",
      tableElapsed: "Verstrichen",
      tableEvent: "Event",
      tableLap: "Runde",
      tableTime: "Zeit",
      tableTimer: "Timer",
      test: "TEST",
      testSound: "Klang testen",
      timerDefaultName: "Timer",
      timerMeta: "{timers} {timerWord} - {running} aktiv",
      timerPlural: "Timer",
      timerSingular: "Timer",
      timerShortcutName: "Steuerung",
      volumeLabel: "Lautstärke",
    },
  };

  const THEME_LABELS = {
    light: { en: "Light mode", nl: "Lichte modus", de: "Heller Modus" },
    auto: { en: "Match system", nl: "Volg systeem", de: "System folgen" },
    dark: { en: "Dark mode", nl: "Donkere modus", de: "Dunkler Modus" },
  };

  const LANGUAGE_LABELS = {
    nl: "Nederlands",
    en: "English",
    de: "Deutsch",
  };

  const escapeMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  const elements = {};
  let state = loadState();
  let saveTimer = 0;
  let audioContext = null;
  let activeAlarmMaster = null;
  let activeAlarmTimeout = 0;
  let activeAlarmRequest = 0;
  let capturingStopwatchId = null;
  let pendingExpiredCountdownEvents = [];
  let activeFullscreenTimerId = null;
  let activePictureInPictureTimerId = null;
  let timerPictureInPictureWindow = null;
  let timerPictureInPictureVideo = null;
  let timerPictureInPictureCanvas = null;
  let pseudoFullscreenActive = false;

  function init() {
    cacheElements();
    normalizeLoadedState();
    bindEvents();
    applyTheme(state.theme);
    applyLanguage(state.language);
    render();
    updateClock();
    setInterval(updateClock, 250);
    requestAnimationFrame(animationLoop);
    registerServiceWorker();

    if (pendingExpiredCountdownEvents.length) {
      pendingExpiredCountdownEvents.forEach((countdown) => {
        appendEvent({
          stopwatchId: countdown.id,
          stopwatchName: countdown.name,
          eventType: "countdown_complete",
          elapsedMs: countdown.durationMs,
          remainingMs: 0,
        });
      });
      pendingExpiredCountdownEvents = [];
      render();
      scheduleSave();
    }
  }

  function cacheElements() {
    elements.html = document.documentElement;
    elements.metaTheme = document.querySelector('meta[name="theme-color"]');
    elements.headerMenuLinks = Array.from(document.querySelectorAll(".menu-link"));
    elements.viewPanels = PANEL_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    elements.liveClockBtn = document.getElementById("liveClockBtn");
    elements.liveClock = document.getElementById("liveClock");
    elements.newSessionBtn = document.getElementById("newSessionBtn");
    elements.themeButtons = Array.from(document.querySelectorAll(".theme-option"));
    elements.languageButtons = Array.from(document.querySelectorAll(".language-option"));
    elements.i18nText = Array.from(document.querySelectorAll("[data-i18n]"));
    elements.i18nAria = Array.from(document.querySelectorAll("[data-i18n-aria]"));
    elements.sessionMeta = document.getElementById("sessionMeta");
    elements.startAllBtn = document.getElementById("startAllBtn");
    elements.stopAllBtn = document.getElementById("stopAllBtn");
    elements.lapAllBtn = document.getElementById("lapAllBtn");
    elements.resetAllBtn = document.getElementById("resetAllBtn");
    elements.addStopwatchBtn = document.getElementById("addStopwatchBtn");
    elements.stopwatchList = document.getElementById("stopwatchList");
    elements.countdownSection = document.querySelector(".countdown-section");
    elements.countdownMeta = document.getElementById("countdownMeta");
    elements.countdownStatus = document.getElementById("countdownStatus");
    elements.startAllTimersBtn = document.getElementById("startAllTimersBtn");
    elements.pauseAllTimersBtn = document.getElementById("pauseAllTimersBtn");
    elements.stopAllTimersBtn = document.getElementById("stopAllTimersBtn");
    elements.addTimerBtn = document.getElementById("addTimerBtn");
    elements.countdownList = document.getElementById("countdownList");
    elements.volumeInput = document.getElementById("volumeInput");
    elements.volumeValue = document.getElementById("volumeValue");
    elements.shortcutMessage = document.getElementById("shortcutMessage");
    elements.resetEventLogBtn = document.getElementById("resetEventLogBtn");
    elements.exportCsvBtn = document.getElementById("exportCsvBtn");
    elements.eventCount = document.getElementById("eventCount");
    elements.eventRows = document.getElementById("eventRows");
    elements.fullscreenCountdown = document.getElementById("fullscreenCountdown");
    elements.exitFullscreenBtn = document.getElementById("exitFullscreenBtn");
    elements.fullscreenToggleBtn = document.getElementById("fullscreenToggleBtn");
    elements.fullscreenResetBtn = document.getElementById("fullscreenResetBtn");
    elements.fullscreenCountdownName = document.getElementById("fullscreenCountdownName");
    elements.fullscreenCountdownDisplay = document.getElementById("fullscreenCountdownDisplay");
    elements.fullscreenProgressBar = document.getElementById("fullscreenProgressBar");
    elements.fullscreenClock = document.getElementById("fullscreenClock");
    elements.exitClockFullscreenBtn = document.getElementById("exitClockFullscreenBtn");
    elements.fullscreenClockTime = document.getElementById("fullscreenClockTime");
    elements.fullscreenClockDate = document.getElementById("fullscreenClockDate");
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return createDefaultState();
      }
      return { ...createDefaultState(), ...JSON.parse(raw) };
    } catch {
      return createDefaultState();
    }
  }

  function createDefaultState() {
    return {
      version: 1,
      sessionId: makeId("session"),
      createdAt: new Date().toISOString(),
      theme: localStorage.getItem(THEME_KEY) || "auto",
      language: localStorage.getItem(LANGUAGE_KEY) || getPreferredLanguage(),
      stopwatches: [0].map((index) =>
        createStopwatch(`Stopwatch ${index + 1}`, DEFAULT_COLORS[index], DEFAULT_SHORTCUTS[index])
      ),
      countdowns: [createCountdown("Timer 1", 0, 5, 0)],
      timerSettings: {
        volume: 100,
      },
      eventLog: [],
    };
  }

  function createCountdown(name, hours, minutes, seconds) {
    const durationMs = durationFromParts(hours, minutes, seconds);
    return {
      id: makeId("timer"),
      name,
      hours,
      minutes,
      seconds,
      durationMs,
      remainingMs: durationMs,
      status: "idle",
      startedAtPerf: null,
      startedAtEpoch: null,
      endAtPerf: null,
      endAtEpoch: null,
      sound: "beep",
    };
  }

  function createStopwatch(name, color, shortcut) {
    return {
      id: makeId("stopwatch"),
      name,
      color: sanitizeColor(color),
      status: "idle",
      baseElapsedMs: 0,
      startedAtPerf: null,
      startedAtEpoch: null,
      shortcutCode: shortcut ? shortcut.code : "",
      shortcutLabel: shortcut ? shortcut.label : "",
      shortcutAction: "toggle",
      lapsOpen: true,
      laps: [],
    };
  }

  function normalizeLoadedState() {
    const nowEpochValue = Date.now();
    const nowPerfValue = performance.now();

    state.theme = ["auto", "dark", "light"].includes(state.theme) ? state.theme : "auto";
    state.language = LANGUAGE_VALUES.includes(state.language) ? state.language : getPreferredLanguage();
    state.sessionId = typeof state.sessionId === "string" ? state.sessionId : makeId("session");
    state.createdAt = typeof state.createdAt === "string" ? state.createdAt : new Date().toISOString();
    state.eventLog = Array.isArray(state.eventLog) ? state.eventLog.map(normalizeEvent) : [];

    const savedStopwatches = Array.isArray(state.stopwatches) && state.stopwatches.length
      ? state.stopwatches
      : createDefaultState().stopwatches;

    state.stopwatches = savedStopwatches.map((stopwatch, index) => {
      const normalized = {
        ...createStopwatch(`Stopwatch ${index + 1}`, DEFAULT_COLORS[index % DEFAULT_COLORS.length], null),
        ...stopwatch,
      };
      normalized.id = typeof normalized.id === "string" ? normalized.id : makeId("stopwatch");
      normalized.name = String(normalized.name || `Stopwatch ${index + 1}`);
      normalized.color = sanitizeColor(normalized.color);
      normalized.status = ["idle", "running", "stopped"].includes(normalized.status)
        ? normalized.status
        : "idle";
      normalized.baseElapsedMs = toSafeNumber(normalized.baseElapsedMs);
      normalized.lapsOpen = normalized.lapsOpen !== false;
      normalized.laps = Array.isArray(normalized.laps)
        ? normalized.laps.map(normalizeLap).filter(Boolean)
        : [];
      normalized.shortcutCode = typeof normalized.shortcutCode === "string" ? normalized.shortcutCode : "";
      normalized.shortcutLabel = typeof normalized.shortcutLabel === "string" ? normalized.shortcutLabel : "";
      normalized.shortcutAction = normalized.shortcutAction === "lap" ? "lap" : "toggle";

      if (normalized.status === "running") {
        const carriedMs = Math.max(0, nowEpochValue - toSafeNumber(normalized.startedAtEpoch, nowEpochValue));
        normalized.baseElapsedMs += carriedMs;
        normalized.startedAtPerf = nowPerfValue;
        normalized.startedAtEpoch = nowEpochValue;
      } else {
        normalized.startedAtPerf = null;
        normalized.startedAtEpoch = null;
      }

      return normalized;
    });

    const savedCountdowns = Array.isArray(state.countdowns) && state.countdowns.length
      ? state.countdowns
      : [state.countdown || createCountdown("Timer 1", 0, 5, 0)];
    const legacyTimerSettings = normalizeTimerSettings(state.timerSettings || state.countdown || {});
    state.countdowns = savedCountdowns.map((countdown, index) => (
      normalizeCountdown(countdown, index, legacyTimerSettings.sound)
    ));
    state.timerSettings = { volume: legacyTimerSettings.volume };
    delete state.countdown;
    scheduleSave();
  }

  function normalizeEvent(event) {
    return {
      sessionId: String(event.sessionId || state.sessionId || ""),
      eventId: String(event.eventId || makeId("event")),
      timestamp: String(event.timestamp || new Date().toISOString()),
      stopwatchId: String(event.stopwatchId || ""),
      stopwatchName: String(event.stopwatchName || ""),
      eventType: String(event.eventType || ""),
      elapsedMs: Math.max(0, Math.round(toSafeNumber(event.elapsedMs))),
      lapNumber: event.lapNumber === "" || event.lapNumber === null || event.lapNumber === undefined
        ? ""
        : Math.max(0, Math.round(toSafeNumber(event.lapNumber))),
      splitMs: event.splitMs === "" || event.splitMs === null || event.splitMs === undefined
        ? ""
        : Math.max(0, Math.round(toSafeNumber(event.splitMs))),
      remainingMs: event.remainingMs === "" || event.remainingMs === null || event.remainingMs === undefined
        ? ""
        : Math.max(0, Math.round(toSafeNumber(event.remainingMs))),
    };
  }

  function normalizeLap(lap) {
    if (!lap) {
      return null;
    }
    return {
      lapNumber: Math.max(1, Math.round(toSafeNumber(lap.lapNumber, 1))),
      elapsedMs: Math.max(0, Math.round(toSafeNumber(lap.elapsedMs))),
      splitMs: Math.max(0, Math.round(toSafeNumber(lap.splitMs))),
      timestamp: String(lap.timestamp || new Date().toISOString()),
      eventId: String(lap.eventId || ""),
    };
  }

  function normalizeCountdown(saved, index, fallbackSound) {
    const fallback = createCountdown(`Timer ${index + 1}`, 0, 5, 0);
    const countdown = { ...fallback, ...saved };
    countdown.id = typeof countdown.id === "string" ? countdown.id : makeId("timer");
    countdown.name = String(countdown.name || `Timer ${index + 1}`);
    countdown.hours = clamp(Math.round(toSafeNumber(countdown.hours)), 0, 99);
    countdown.minutes = clamp(Math.round(toSafeNumber(countdown.minutes)), 0, 59);
    countdown.seconds = clamp(Math.round(toSafeNumber(countdown.seconds)), 0, 59);
    countdown.durationMs = durationFromParts(countdown.hours, countdown.minutes, countdown.seconds);
    countdown.remainingMs = clamp(toSafeNumber(countdown.remainingMs, countdown.durationMs), 0, Math.max(countdown.durationMs, 1));
    countdown.status = ["idle", "running", "paused", "complete"].includes(countdown.status)
      ? countdown.status
      : "idle";
    countdown.sound = SOUND_VALUES.includes(countdown.sound) ? countdown.sound : fallbackSound;
    if (countdown.status === "running") {
      const remaining = Math.max(0, toSafeNumber(countdown.endAtEpoch) - Date.now());
      if (remaining <= 0) {
        countdown.status = "complete";
        countdown.remainingMs = 0;
        countdown.startedAtPerf = null;
        countdown.startedAtEpoch = null;
        countdown.endAtPerf = null;
        countdown.endAtEpoch = null;
        pendingExpiredCountdownEvents.push({
          id: countdown.id,
          name: countdown.name,
          durationMs: countdown.durationMs,
        });
      } else {
        countdown.remainingMs = remaining;
        countdown.startedAtPerf = performance.now();
        countdown.startedAtEpoch = Date.now();
        countdown.endAtPerf = performance.now() + remaining;
        countdown.endAtEpoch = Date.now() + remaining;
      }
    } else {
      countdown.startedAtPerf = null;
      countdown.startedAtEpoch = null;
      countdown.endAtPerf = null;
      countdown.endAtEpoch = null;
      if (countdown.status === "idle") {
        countdown.remainingMs = countdown.durationMs;
      } else if (countdown.status === "complete") {
        countdown.remainingMs = 0;
      }
    }

    return countdown;
  }

  function normalizeTimerSettings(saved) {
    return {
      sound: SOUND_VALUES.includes(saved.sound) ? saved.sound : "beep",
      volume: clamp(Math.round(toSafeNumber(saved.volume, 100)), 0, 100),
    };
  }

  function bindEvents() {
    elements.themeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        applyTheme(button.dataset.themeValue);
        state.theme = button.dataset.themeValue;
        localStorage.setItem(THEME_KEY, state.theme);
        scheduleSave();
      });
    });
    elements.languageButtons.forEach((button) => {
      button.addEventListener("click", () => {
        applyLanguage(button.dataset.languageValue);
        localStorage.setItem(LANGUAGE_KEY, state.language);
        render();
        scheduleSave();
      });
    });
    elements.headerMenuLinks.forEach((link) => {
      link.addEventListener("click", () => setActiveMenuTarget(link.dataset.menuTarget, true));
    });

    elements.liveClockBtn.addEventListener("click", enterClockFullscreen);
    elements.newSessionBtn.addEventListener("click", createNewSession);
    elements.addStopwatchBtn.addEventListener("click", addStopwatch);
    elements.startAllBtn.addEventListener("click", startAllStopwatches);
    elements.stopAllBtn.addEventListener("click", stopAllStopwatches);
    elements.lapAllBtn.addEventListener("click", lapAllStopwatches);
    elements.resetAllBtn.addEventListener("click", resetAllStopwatches);
    elements.startAllTimersBtn.addEventListener("click", startAllCountdowns);
    elements.pauseAllTimersBtn.addEventListener("click", pauseAllCountdowns);
    elements.stopAllTimersBtn.addEventListener("click", stopAndResetAllCountdowns);
    elements.addTimerBtn.addEventListener("click", addCountdown);
    elements.resetEventLogBtn.addEventListener("click", resetEventLog);
    elements.exportCsvBtn.addEventListener("click", exportCsv);

    elements.stopwatchList.addEventListener("click", onStopwatchClick);
    elements.stopwatchList.addEventListener("input", onStopwatchInput);
    elements.stopwatchList.addEventListener("toggle", onLapToggle, true);
    elements.countdownList.addEventListener("click", onCountdownClick);
    elements.countdownList.addEventListener("input", onCountdownInput);
    elements.countdownList.addEventListener("change", onCountdownChange);
    elements.countdownList.addEventListener("focusin", onCountdownFocusIn);
    elements.countdownList.addEventListener("focusout", onCountdownFocusOut);
    elements.countdownList.addEventListener("keydown", onCountdownSegmentKeydown);
    elements.exitFullscreenBtn.addEventListener("click", exitCountdownFullscreen);
    elements.exitClockFullscreenBtn.addEventListener("click", exitClockFullscreen);
    elements.fullscreenToggleBtn.addEventListener("click", onFullscreenCountdownToggle);
    elements.fullscreenResetBtn.addEventListener("click", onFullscreenCountdownReset);

    elements.volumeInput.addEventListener("input", () => {
      state.timerSettings.volume = clamp(Math.round(toSafeNumber(elements.volumeInput.value, 100)), 0, 100);
      elements.volumeValue.textContent = `${state.timerSettings.volume}%`;
      elements.volumeInput.style.setProperty("--volume-progress", `${state.timerSettings.volume}%`);
      scheduleSave();
    });

    document.addEventListener("keydown", onDocumentKeydown);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onColorSchemeChange = () => {
      if (state.theme === "auto") {
        updateThemeMeta();
      }
    };
    if (typeof colorSchemeQuery.addEventListener === "function") {
      colorSchemeQuery.addEventListener("change", onColorSchemeChange);
    } else if (typeof colorSchemeQuery.addListener === "function") {
      colorSchemeQuery.addListener(onColorSchemeChange);
    }
    setActiveMenuTarget(getInitialPanelTarget(), false);
    window.addEventListener("hashchange", () => {
      setActiveMenuTarget(getInitialPanelTarget(), false);
    });
    window.addEventListener("beforeunload", persistNow);
  }

  function onStopwatchClick(event) {
    if (event.target.closest("[data-shortcut-action]")) {
      onShortcutClick(event);
      return;
    }

    const button = event.target.closest("[data-stopwatch-action]");
    if (!button) {
      return;
    }

    const stopwatch = getStopwatch(button.dataset.stopwatchId);
    if (!stopwatch) {
      return;
    }

    const action = button.dataset.stopwatchAction;
    if (action === "start") {
      startStopwatch(stopwatch);
    } else if (action === "lap") {
      lapStopwatch(stopwatch);
    } else if (action === "stop") {
      stopStopwatch(stopwatch);
    } else if (action === "reset") {
      resetStopwatch(stopwatch);
    } else if (action === "remove") {
      removeStopwatch(stopwatch);
    }
  }

  function onStopwatchInput(event) {
    const target = event.target;
    const stopwatch = getStopwatch(target.dataset.stopwatchId);
    if (!stopwatch) {
      return;
    }

    if (target.matches(".stopwatch-name-input")) {
      stopwatch.name = target.value.trim() || "Stopwatch";
      updateShortcutName(stopwatch);
      scheduleSave();
    } else if (target.matches(".stopwatch-color")) {
      stopwatch.color = sanitizeColor(target.value);
      const row = target.closest(".stopwatch-row");
      if (row) {
        row.style.setProperty("--stopwatch-accent", stopwatch.color);
      }
      scheduleSave();
    }
  }

  function onLapToggle(event) {
    if (!event.target.matches(".lap-history")) {
      return;
    }
    const stopwatch = getStopwatch(event.target.dataset.stopwatchId);
    if (stopwatch) {
      stopwatch.lapsOpen = event.target.open;
      scheduleSave();
    }
  }

  function onCountdownClick(event) {
    const button = event.target.closest("[data-countdown-action]");
    if (!button) {
      return;
    }

    const countdown = getCountdown(button.dataset.timerId);
    if (!countdown) {
      return;
    }

    const action = button.dataset.countdownAction;
    if (action === "toggle") {
      startOrStopCountdown(countdown);
    } else if (action === "stop") {
      resetCountdown(countdown);
    } else if (action === "remove") {
      removeCountdown(countdown);
    } else if (action === "fullscreen") {
      enterCountdownFullscreen(countdown);
    } else if (action === "pip") {
      openCountdownPictureInPicture(countdown);
    } else if (action === "test-sound") {
      playCountdownSound(countdown);
    }
  }

  function onCountdownInput(event) {
    const target = event.target;
    const countdown = getCountdown(target.dataset.timerId);
    if (!countdown) {
      return;
    }

    if (target.matches(".countdown-name-input")) {
      countdown.name = target.value.trim() || getDefaultCountdownName(countdown);
      updateCountdownTimerDisplays(countdown);
      scheduleSave();
    } else if (target.matches(".countdown-segment-input")) {
      updateCountdownDurationFromInputs(countdown);
    }
  }

  function onCountdownChange(event) {
    const target = event.target;
    if (!target.matches(".countdown-sound-select")) {
      return;
    }

    const countdown = getCountdown(target.dataset.timerId);
    if (countdown) {
      countdown.sound = SOUND_VALUES.includes(target.value) ? target.value : "beep";
      scheduleSave();
    }
  }

  function onCountdownFocusIn(event) {
    if (event.target.matches(".countdown-segment-input")) {
      event.target.select();
    }
  }

  function onCountdownFocusOut(event) {
    const target = event.target;
    if (!target.matches(".countdown-segment-input")) {
      return;
    }

    const countdown = getCountdown(target.dataset.timerId);
    if (countdown) {
      updateCountdownDurationFromInputs(countdown);
      updateCountdownTimerDisplays(countdown, true);
    }
  }

  function onShortcutClick(event) {
    const keyButton = event.target.closest("[data-shortcut-action]");
    if (!keyButton) {
      return;
    }

    const stopwatch = getStopwatch(keyButton.dataset.stopwatchId);
    if (!stopwatch) {
      return;
    }

    if (keyButton.dataset.shortcutAction === "capture") {
      capturingStopwatchId = stopwatch.id;
      setShortcutMessage(`${stopwatch.name}: press a key...`);
      renderStopwatches();
      focusShortcutButton(stopwatch.id);
    } else if (keyButton.dataset.shortcutAction === "clear") {
      stopwatch.shortcutCode = "";
      stopwatch.shortcutLabel = "";
      if (capturingStopwatchId === stopwatch.id) {
        capturingStopwatchId = null;
      }
      setShortcutMessage(`${stopwatch.name}: shortcut cleared.`);
      renderStopwatches();
      scheduleSave();
    } else if (keyButton.dataset.shortcutAction === "mode") {
      stopwatch.shortcutAction = keyButton.dataset.shortcutMode === "lap" ? "lap" : "toggle";
      renderStopwatches();
      scheduleSave();
    }
  }

  function onDocumentKeydown(event) {
    if (capturingStopwatchId) {
      captureShortcut(event);
      return;
    }

    if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || isEditableTarget(event.target)) {
      return;
    }

    if (event.code === "Space") {
      event.preventDefault();
      toggleAllStopwatches();
      return;
    }

    if (event.code === "KeyL") {
      event.preventDefault();
      lapAllStopwatches();
      return;
    }

    const stopwatch = state.stopwatches.find((item) => item.shortcutCode === event.code);
    if (stopwatch) {
      event.preventDefault();
      if (stopwatch.shortcutAction === "lap") {
        lapStopwatch(stopwatch);
      } else {
        toggleStopwatch(stopwatch);
      }
    }
  }

  function captureShortcut(event) {
    event.preventDefault();
    event.stopPropagation();

    if (event.code === "Escape") {
      capturingStopwatchId = null;
      setShortcutMessage("Shortcut edit cancelled.");
      renderStopwatches();
      return;
    }

    if (event.ctrlKey || event.metaKey || event.altKey) {
      setShortcutMessage("Use a single key without Ctrl, Alt, or Command.");
      return;
    }

    const stopwatch = getStopwatch(capturingStopwatchId);
    if (!stopwatch) {
      capturingStopwatchId = null;
      renderStopwatches();
      return;
    }

    if (event.code === "Backspace" || event.code === "Delete") {
      stopwatch.shortcutCode = "";
      stopwatch.shortcutLabel = "";
      capturingStopwatchId = null;
      setShortcutMessage(`${stopwatch.name}: shortcut cleared.`);
      renderStopwatches();
      scheduleSave();
      return;
    }

    if (GLOBAL_RESERVED.has(event.code)) {
      setShortcutMessage(GLOBAL_RESERVED.get(event.code));
      return;
    }

    if (SYSTEM_SENSITIVE.has(event.code)) {
      setShortcutMessage(`${displayKeyLabel(event)} is reserved for browser or system use.`);
      return;
    }

    const existing = state.stopwatches.find((item) => item.id !== stopwatch.id && item.shortcutCode === event.code);
    if (existing) {
      setShortcutMessage(`${displayKeyLabel(event)} is already assigned to ${existing.name}.`);
      return;
    }

    stopwatch.shortcutCode = event.code;
    stopwatch.shortcutLabel = displayKeyLabel(event);
    capturingStopwatchId = null;
    setShortcutMessage(`${stopwatch.name}: ${stopwatch.shortcutLabel} assigned.`);
    renderStopwatches();
    scheduleSave();
  }

  function startStopwatch(stopwatch, shouldRender = true) {
    if (stopwatch.status === "running") {
      return false;
    }

    const elapsedMs = getStopwatchElapsed(stopwatch);
    stopwatch.baseElapsedMs = elapsedMs;
    stopwatch.startedAtPerf = performance.now();
    stopwatch.startedAtEpoch = Date.now();
    stopwatch.status = "running";

    appendEvent({
      stopwatchId: stopwatch.id,
      stopwatchName: stopwatch.name,
      eventType: "start",
      elapsedMs,
    });

    if (shouldRender) {
      render();
    }
    return true;
  }

  function stopStopwatch(stopwatch, shouldRender = true) {
    if (stopwatch.status !== "running") {
      return false;
    }

    const elapsedMs = getStopwatchElapsed(stopwatch);
    stopwatch.baseElapsedMs = elapsedMs;
    stopwatch.startedAtPerf = null;
    stopwatch.startedAtEpoch = null;
    stopwatch.status = "stopped";

    appendEvent({
      stopwatchId: stopwatch.id,
      stopwatchName: stopwatch.name,
      eventType: "stop",
      elapsedMs,
    });

    if (shouldRender) {
      render();
    }
    return true;
  }

  function lapStopwatch(stopwatch, shouldRender = true) {
    if (stopwatch.status !== "running") {
      return false;
    }

    const elapsedMs = getStopwatchElapsed(stopwatch);
    const lastLap = stopwatch.laps[stopwatch.laps.length - 1];
    const splitMs = lastLap ? elapsedMs - lastLap.elapsedMs : elapsedMs;
    const lapNumber = stopwatch.laps.length + 1;
    const eventId = makeId("event");
    const timestamp = new Date().toISOString();

    stopwatch.laps.push({
      lapNumber,
      elapsedMs,
      splitMs,
      timestamp,
      eventId,
    });

    appendEvent({
      eventId,
      timestamp,
      stopwatchId: stopwatch.id,
      stopwatchName: stopwatch.name,
      eventType: "lap",
      elapsedMs,
      lapNumber,
      splitMs,
    });

    if (shouldRender) {
      render();
    }
    return true;
  }

  function resetStopwatch(stopwatch, shouldRender = true) {
    const elapsedMs = getStopwatchElapsed(stopwatch);
    stopwatch.baseElapsedMs = 0;
    stopwatch.startedAtPerf = null;
    stopwatch.startedAtEpoch = null;
    stopwatch.status = "idle";
    stopwatch.laps = [];

    appendEvent({
      stopwatchId: stopwatch.id,
      stopwatchName: stopwatch.name,
      eventType: "reset",
      elapsedMs,
    });

    if (shouldRender) {
      render();
    }
    return true;
  }

  function toggleStopwatch(stopwatch) {
    if (stopwatch.status === "running") {
      stopStopwatch(stopwatch);
    } else {
      startStopwatch(stopwatch);
    }
  }

  function startAllStopwatches() {
    let changed = false;
    state.stopwatches.forEach((stopwatch) => {
      changed = startStopwatch(stopwatch, false) || changed;
    });
    if (changed) {
      render();
    }
  }

  function stopAllStopwatches() {
    let changed = false;
    state.stopwatches.forEach((stopwatch) => {
      changed = stopStopwatch(stopwatch, false) || changed;
    });
    if (changed) {
      render();
    }
  }

  function lapAllStopwatches() {
    let changed = false;
    state.stopwatches.forEach((stopwatch) => {
      changed = lapStopwatch(stopwatch, false) || changed;
    });
    if (changed) {
      render();
    }
  }

  function resetAllStopwatches() {
    state.stopwatches.forEach((stopwatch) => resetStopwatch(stopwatch, false));
    render();
  }

  function toggleAllStopwatches() {
    if (state.stopwatches.some((stopwatch) => stopwatch.status === "running")) {
      stopAllStopwatches();
    } else {
      startAllStopwatches();
    }
  }

  function addStopwatch() {
    const number = state.stopwatches.length + 1;
    state.stopwatches.push(createStopwatch(`Stopwatch ${number}`, DEFAULT_COLORS[number % DEFAULT_COLORS.length], null));
    render();
    scheduleSave();
  }

  function removeStopwatch(stopwatch) {
    if (!stopwatch || state.stopwatches.length <= 1 || !window.confirm(t("confirmRemoveStopwatch"))) {
      return;
    }

    if (capturingStopwatchId === stopwatch.id) {
      capturingStopwatchId = null;
    }
    state.stopwatches = state.stopwatches.filter((item) => item.id !== stopwatch.id);
    render();
    scheduleSave();
  }

  function addCountdown() {
    const number = state.countdowns.length + 1;
    const countdown = createCountdown(`${t("timerDefaultName")} ${number}`, 0, 5, 0);
    state.countdowns.push(countdown);
    render();
    scheduleSave();

    requestAnimationFrame(() => {
      const row = getCountdownRow(countdown.id);
      const nameInput = row ? row.querySelector(".countdown-name-input") : null;
      if (nameInput) {
        nameInput.focus();
        nameInput.select();
      }
    });
  }

  function removeCountdown(countdown) {
    if (!countdown || state.countdowns.length <= 1 || !window.confirm(t("confirmRemoveTimer"))) {
      return;
    }

    if (activeFullscreenTimerId === countdown.id) {
      exitCountdownFullscreen();
    }
    state.countdowns = state.countdowns.filter((item) => item.id !== countdown.id);
    render();
    scheduleSave();
  }

  function createNewSession() {
    const hasEvents = state.eventLog.length > 0;
    if (hasEvents && !window.confirm(t("confirmNewSession"))) {
      return;
    }

    startCleanSession();
  }

  function resetEventLog() {
    if (!state.eventLog.length) {
      return;
    }

    const confirmed = window.confirm(t("confirmResetEventLog"));
    if (!confirmed) {
      return;
    }

    startCleanSession();
  }

  function startCleanSession() {
    state.stopwatches = state.stopwatches.map((stopwatch) => ({
      ...stopwatch,
      status: "idle",
      baseElapsedMs: 0,
      startedAtPerf: null,
      startedAtEpoch: null,
      laps: [],
    }));
    state.sessionId = makeId("session");
    state.createdAt = new Date().toISOString();
    state.eventLog = [];
    state.countdowns.forEach((countdown) => resetCountdown(countdown, false, false));
    activeFullscreenTimerId = null;
    render();
    persistNow();
  }

  function startOrStopCountdown(countdown) {
    if (countdown.status === "running") {
      stopCountdown(countdown);
    } else {
      startCountdown(countdown);
    }
  }

  function startCountdown(countdown, shouldRender = true) {
    if (!countdown || countdown.status === "running") {
      return false;
    }

    const remainingMs = countdown.status === "paused" ? countdown.remainingMs : countdown.durationMs;
    if (remainingMs <= 0) {
      return false;
    }

    ensureAudioContext().catch(() => {});
    countdown.status = "running";
    countdown.remainingMs = remainingMs;
    countdown.startedAtPerf = performance.now();
    countdown.startedAtEpoch = Date.now();
    countdown.endAtPerf = performance.now() + remainingMs;
    countdown.endAtEpoch = Date.now() + remainingMs;

    appendEvent({
      stopwatchId: countdown.id,
      stopwatchName: countdown.name,
      eventType: "countdown_start",
      elapsedMs: countdown.durationMs - remainingMs,
      remainingMs,
    });

    if (shouldRender) {
      renderCountdown();
      renderEventLog();
      scheduleSave();
    }
    return true;
  }

  function stopCountdown(countdown, shouldRender = true) {
    if (!countdown || countdown.status !== "running") {
      return false;
    }

    countdown.remainingMs = getCountdownRemaining(countdown);
    countdown.status = "paused";
    countdown.startedAtPerf = null;
    countdown.startedAtEpoch = null;
    countdown.endAtPerf = null;
    countdown.endAtEpoch = null;

    appendEvent({
      stopwatchId: countdown.id,
      stopwatchName: countdown.name,
      eventType: "countdown_stop",
      elapsedMs: countdown.durationMs - countdown.remainingMs,
      remainingMs: countdown.remainingMs,
    });

    if (shouldRender) {
      renderCountdown();
      renderEventLog();
      scheduleSave();
    }
    return true;
  }

  function startAllCountdowns() {
    let changed = false;
    state.countdowns.forEach((countdown) => {
      changed = startCountdown(countdown, false) || changed;
    });

    if (changed) {
      renderCountdown();
      renderEventLog();
      scheduleSave();
    }
  }

  function pauseAllCountdowns() {
    let changed = false;
    state.countdowns.forEach((countdown) => {
      changed = stopCountdown(countdown, false) || changed;
    });

    if (changed) {
      renderCountdown();
      renderEventLog();
      scheduleSave();
    }
  }

  function stopAndResetAllCountdowns() {
    const changed = state.countdowns.some((countdown) => countdown.status !== "idle");
    if (!changed) {
      return;
    }

    state.countdowns.forEach((countdown) => resetCountdown(countdown, true, false));
    renderCountdown();
    renderEventLog();
    scheduleSave();
  }

  function resetCountdown(countdown, shouldLog = true, shouldRender = true) {
    if (!countdown) {
      return false;
    }

    const remainingMs = getCountdownRemaining(countdown);
    const elapsedMs = countdown.durationMs - remainingMs;
    countdown.status = "idle";
    countdown.remainingMs = countdown.durationMs;
    countdown.startedAtPerf = null;
    countdown.startedAtEpoch = null;
    countdown.endAtPerf = null;
    countdown.endAtEpoch = null;

    if (shouldLog) {
      appendEvent({
        stopwatchId: countdown.id,
        stopwatchName: countdown.name,
        eventType: "countdown_reset",
        elapsedMs,
        remainingMs,
      });
    }

    if (activeFullscreenTimerId === countdown.id) {
      updateFullscreenCountdown();
    }

    if (shouldRender) {
      renderCountdown();
      renderEventLog();
      scheduleSave();
    }
    return true;
  }

  function completeCountdown(countdown, shouldRender = true) {
    if (!countdown || countdown.status !== "running") {
      return false;
    }

    countdown.status = "complete";
    countdown.remainingMs = 0;
    countdown.startedAtPerf = null;
    countdown.startedAtEpoch = null;
    countdown.endAtPerf = null;
    countdown.endAtEpoch = null;

    appendEvent({
      stopwatchId: countdown.id,
      stopwatchName: countdown.name,
      eventType: "countdown_complete",
      elapsedMs: countdown.durationMs,
      remainingMs: 0,
    });

    playCountdownSound(countdown);
    if (shouldRender) {
      renderCountdown();
      renderEventLog();
      scheduleSave();
    }
    return true;
  }

  function onCountdownSegmentKeydown(event) {
    const target = event.target;
    if (!target.matches(".countdown-segment-input")) {
      return;
    }

    const countdown = getCountdown(target.dataset.timerId);
    if (!countdown || countdown.status === "running") {
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      target.blur();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      target.value = target.dataset.committedValue || "00";
      updateCountdownDurationFromInputs(countdown);
      target.blur();
      return;
    }

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      nudgeCountdownSegment(target, countdown, event.key === "ArrowUp" ? 1 : -1, event.shiftKey ? 10 : 1);
    }
  }

  function updateCountdownDurationFromInputs(countdown) {
    const row = getCountdownRow(countdown.id);
    if (!row || countdown.status === "running") {
      return false;
    }

    const hours = readCountdownSegment(row.querySelector("[data-segment='hours']"), 99);
    const minutes = readCountdownSegment(row.querySelector("[data-segment='minutes']"), 59);
    const seconds = readCountdownSegment(row.querySelector("[data-segment='seconds']"), 59);
    const durationMs = durationFromParts(hours, minutes, seconds);

    countdown.hours = hours;
    countdown.minutes = minutes;
    countdown.seconds = seconds;
    countdown.durationMs = durationMs;
    countdown.status = "idle";
    countdown.remainingMs = durationMs;
    countdown.startedAtPerf = null;
    countdown.startedAtEpoch = null;
    countdown.endAtPerf = null;
    countdown.endAtEpoch = null;

    updateCountdownTimerDisplays(countdown);
    scheduleSave();
    return true;
  }

  function readCountdownSegment(input, max) {
    if (!input) {
      return 0;
    }

    const cleanValue = input.value.replace(/\D/g, "").slice(0, 2);
    if (input.value !== cleanValue) {
      input.value = cleanValue;
    }
    return clamp(Math.round(toSafeNumber(cleanValue)), 0, max);
  }

  function nudgeCountdownSegment(input, countdown, direction, step) {
    const max = input.dataset.segment === "hours" ? 99 : 59;
    const current = readCountdownSegment(input, max);
    input.value = pad(clamp(current + (direction * step), 0, max));
    updateCountdownDurationFromInputs(countdown);
    input.select();
  }

  function getStopwatchElapsed(stopwatch) {
    if (stopwatch.status !== "running" || typeof stopwatch.startedAtPerf !== "number") {
      return Math.max(0, stopwatch.baseElapsedMs);
    }
    return Math.max(0, stopwatch.baseElapsedMs + (performance.now() - stopwatch.startedAtPerf));
  }

  function getCountdownRemaining(countdown) {
    if (countdown.status !== "running" || typeof countdown.endAtPerf !== "number") {
      return Math.max(0, countdown.remainingMs);
    }
    return Math.max(0, countdown.endAtPerf - performance.now());
  }

  function appendEvent(event) {
    state.eventLog.push(normalizeEvent({
      sessionId: state.sessionId,
      eventId: event.eventId || makeId("event"),
      timestamp: event.timestamp || new Date().toISOString(),
      stopwatchId: event.stopwatchId,
      stopwatchName: event.stopwatchName,
      eventType: event.eventType,
      elapsedMs: event.elapsedMs,
      lapNumber: event.lapNumber,
      splitMs: event.splitMs,
      remainingMs: event.remainingMs,
    }));
    scheduleSave();
  }

  function render() {
    renderSessionMeta();
    renderStopwatches();
    renderCountdown();
    renderEventLog();
  }

  function renderSessionMeta() {
    const running = state.stopwatches.filter((stopwatch) => stopwatch.status === "running").length;
    elements.sessionMeta.textContent = formatText("sessionMeta", {
      stopwatches: state.stopwatches.length,
      stopwatchWord: pluralWord(state.stopwatches.length, "stopwatchSingular", "stopwatchPlural"),
      running,
      events: state.eventLog.length,
      eventWord: pluralWord(state.eventLog.length, "eventSingular", "eventPlural"),
    });
  }

  function renderStopwatches() {
    elements.stopwatchList.innerHTML = state.stopwatches.map((stopwatch) => {
      const isCapturing = capturingStopwatchId === stopwatch.id;
      const shortcutLabel = isCapturing ? t("shortcutPressKey") : stopwatch.shortcutLabel || t("setKey");
      const laps = stopwatch.laps.length
        ? stopwatch.laps.map((lap) => `
            <li class="lap-item">
              <strong>${escapeHtml(t("tableLap"))} ${lap.lapNumber}</strong>
              <span class="lap-time">${formatStopwatch(lap.elapsedMs)}</span>
              <span>Split ${formatStopwatch(lap.splitMs)}</span>
            </li>
          `).join("")
        : `<li class="empty-state">${escapeHtml(t("noLaps"))}</li>`;

      return `
        <article class="stopwatch-row" data-status="${escapeHtml(stopwatch.status)}" data-stopwatch-id="${escapeHtml(stopwatch.id)}" style="--stopwatch-accent: ${escapeHtml(stopwatch.color)}">
          <div class="stopwatch-meta">
            <span class="status-wrap">
              <span class="status-dot" aria-hidden="true"></span>
              <span data-status-label="${escapeHtml(stopwatch.id)}">${escapeHtml(statusLabel(stopwatch.status))}</span>
            </span>
            <input
              class="stopwatch-name-input"
              type="text"
              value="${escapeHtml(stopwatch.name)}"
              aria-label="Stopwatch name"
              data-stopwatch-id="${escapeHtml(stopwatch.id)}"
              spellcheck="false"
              autocomplete="off"
            >
            <input
              class="stopwatch-color"
              type="color"
              value="${escapeHtml(stopwatch.color)}"
              aria-label="Stopwatch color"
              data-stopwatch-id="${escapeHtml(stopwatch.id)}"
            >
            <div class="stopwatch-shortcut" aria-label="${escapeHtml(stopwatch.name)} keyboard shortcut">
              <span>${escapeHtml(t("shortcut"))}</span>
              <button
                class="shortcut-key"
                type="button"
                data-shortcut-action="capture"
                data-stopwatch-id="${escapeHtml(stopwatch.id)}"
                aria-label="Set shortcut for ${escapeHtml(stopwatch.name)}"
                aria-pressed="${isCapturing ? "true" : "false"}"
              >${escapeHtml(shortcutLabel)}</button>
              <button
                class="button button-secondary clear-shortcut"
                type="button"
                data-shortcut-action="clear"
                data-stopwatch-id="${escapeHtml(stopwatch.id)}"
                ${stopwatch.shortcutCode ? "" : "disabled"}
              >${escapeHtml(t("clear"))}</button>
              <span class="shortcut-mode-label">${escapeHtml(t("shortcutAction"))}</span>
              <div class="shortcut-mode" role="group" aria-label="${escapeHtml(stopwatch.name)} ${escapeHtml(t("shortcutAction"))}">
                <button
                  class="shortcut-mode-button"
                  type="button"
                  data-shortcut-action="mode"
                  data-shortcut-mode="toggle"
                  data-stopwatch-id="${escapeHtml(stopwatch.id)}"
                  aria-pressed="${stopwatch.shortcutAction === "toggle" ? "true" : "false"}"
                >${escapeHtml(t("shortcutStartStop"))}</button>
                <button
                  class="shortcut-mode-button"
                  type="button"
                  data-shortcut-action="mode"
                  data-shortcut-mode="lap"
                  data-stopwatch-id="${escapeHtml(stopwatch.id)}"
                  aria-pressed="${stopwatch.shortcutAction === "lap" ? "true" : "false"}"
                >${escapeHtml(t("lap"))}</button>
              </div>
            </div>
          </div>

          <output class="timer-display" data-time-id="${escapeHtml(stopwatch.id)}">${formatStopwatch(getStopwatchElapsed(stopwatch))}</output>

          <div class="timer-actions" role="group" aria-label="${escapeHtml(stopwatch.name)} controls">
            <button class="button button-primary" type="button" data-stopwatch-action="start" data-stopwatch-id="${escapeHtml(stopwatch.id)}" ${stopwatch.status === "running" ? "disabled" : ""}>${escapeHtml(t("start"))}</button>
            <button class="button button-secondary" type="button" data-stopwatch-action="lap" data-stopwatch-id="${escapeHtml(stopwatch.id)}" ${stopwatch.status !== "running" ? "disabled" : ""}>${escapeHtml(t("lap"))}</button>
            <button class="button button-danger" type="button" data-stopwatch-action="stop" data-stopwatch-id="${escapeHtml(stopwatch.id)}" ${stopwatch.status !== "running" ? "disabled" : ""}>${escapeHtml(t("stop"))}</button>
            <button class="button button-secondary" type="button" data-stopwatch-action="reset" data-stopwatch-id="${escapeHtml(stopwatch.id)}">${escapeHtml(t("reset"))}</button>
            <button class="button button-quiet remove-stopwatch-button" type="button" data-stopwatch-action="remove" data-stopwatch-id="${escapeHtml(stopwatch.id)}" title="${escapeHtml(t("removeStopwatch"))}" ${state.stopwatches.length <= 1 ? "disabled" : ""}>${escapeHtml(t("removeStopwatch"))}</button>
          </div>

          <details class="lap-history" data-stopwatch-id="${escapeHtml(stopwatch.id)}" ${stopwatch.lapsOpen ? "open" : ""}>
            <summary>${escapeHtml(t("laps"))} (${stopwatch.laps.length})</summary>
            <ol class="lap-list">${laps}</ol>
          </details>
        </article>
      `;
    }).join("");
  }

  function renderCountdown() {
    elements.countdownList.innerHTML = state.countdowns.map(renderCountdownRow).join("");
    setValueUnlessFocused(elements.volumeInput, String(state.timerSettings.volume));
    elements.volumeValue.textContent = `${state.timerSettings.volume}%`;
    elements.volumeInput.style.setProperty("--volume-progress", `${state.timerSettings.volume}%`);
    renderCountdownSummary();
    updateFullscreenCountdown();
  }

  function renderCountdownRow(countdown) {
    const parts = countdownPartsFromMs(getCountdownRemaining(countdown));
    const actionLabel = getCountdownActionLabel(countdown);
    const actionDisabled = countdown.durationMs <= 0 && countdown.status !== "running";

    return `
      <article class="countdown-row" data-status="${escapeHtml(countdown.status)}" data-timer-id="${escapeHtml(countdown.id)}">
        <div class="countdown-meta">
          <span class="status-wrap">
            <span class="status-dot" aria-hidden="true"></span>
            <span data-countdown-status="${escapeHtml(countdown.id)}">${escapeHtml(statusLabel(countdown.status))}</span>
          </span>
          <input
            class="countdown-name-input"
            type="text"
            value="${escapeHtml(countdown.name)}"
            aria-label="${escapeHtml(t("tableTimer"))} name"
            data-timer-id="${escapeHtml(countdown.id)}"
            spellcheck="false"
            autocomplete="off"
          >
        </div>

        <div class="countdown-display" role="group" aria-label="${escapeHtml(countdown.name)} duration">
          <input class="countdown-segment-input" type="text" inputmode="numeric" maxlength="2" aria-label="${escapeHtml(countdown.name)} hours" data-timer-id="${escapeHtml(countdown.id)}" data-segment="hours" data-committed-value="${pad(parts.hours)}" value="${pad(parts.hours)}" ${countdown.status === "running" ? "disabled" : ""}>
          <span class="time-separator" aria-hidden="true">:</span>
          <input class="countdown-segment-input" type="text" inputmode="numeric" maxlength="2" aria-label="${escapeHtml(countdown.name)} minutes" data-timer-id="${escapeHtml(countdown.id)}" data-segment="minutes" data-committed-value="${pad(parts.minutes)}" value="${pad(parts.minutes)}" ${countdown.status === "running" ? "disabled" : ""}>
          <span class="time-separator" aria-hidden="true">:</span>
          <input class="countdown-segment-input" type="text" inputmode="numeric" maxlength="2" aria-label="${escapeHtml(countdown.name)} seconds" data-timer-id="${escapeHtml(countdown.id)}" data-segment="seconds" data-committed-value="${pad(parts.seconds)}" value="${pad(parts.seconds)}" ${countdown.status === "running" ? "disabled" : ""}>
          <span class="time-format-label" aria-hidden="true">H:m:s</span>
        </div>

        <div class="countdown-sound">
          <div class="countdown-sound-heading">
            <span class="countdown-sound-label">${escapeHtml(t("soundLabel"))}</span>
            <button class="button button-quiet countdown-sound-test" type="button" data-countdown-action="test-sound" data-timer-id="${escapeHtml(countdown.id)}">${escapeHtml(t("test"))}</button>
          </div>
          <select class="countdown-sound-select" data-timer-id="${escapeHtml(countdown.id)}" aria-label="${escapeHtml(countdown.name)} ${escapeHtml(t("soundLabel"))}">
            <option value="beep" ${countdown.sound === "beep" ? "selected" : ""}>${escapeHtml(t("soundBeep"))}</option>
            <option value="chime" ${countdown.sound === "chime" ? "selected" : ""}>${escapeHtml(t("soundChime"))}</option>
            <option value="bell" ${countdown.sound === "bell" ? "selected" : ""}>${escapeHtml(t("soundBell"))}</option>
            <option value="ring" ${countdown.sound === "ring" ? "selected" : ""}>${escapeHtml(t("soundRing"))}</option>
            <option value="buzzer" ${countdown.sound === "buzzer" ? "selected" : ""}>${escapeHtml(t("soundBuzzer"))}</option>
            <option value="mute" ${countdown.sound === "mute" ? "selected" : ""}>${escapeHtml(t("soundMute"))}</option>
          </select>
        </div>

        <div class="countdown-actions" role="group" aria-label="${escapeHtml(countdown.name)} ${escapeHtml(t("timerShortcutName"))}">
          <button class="button button-primary" type="button" data-countdown-action="toggle" data-timer-id="${escapeHtml(countdown.id)}" ${actionDisabled ? "disabled" : ""}>${escapeHtml(actionLabel)}</button>
          <button class="button button-danger" type="button" data-countdown-action="stop" data-timer-id="${escapeHtml(countdown.id)}">${escapeHtml(t("stop"))}</button>
          <div class="countdown-display-actions">
            <button class="button button-quiet" type="button" data-countdown-action="fullscreen" data-timer-id="${escapeHtml(countdown.id)}">${escapeHtml(t("fullscreen"))}</button>
            <button class="button button-quiet" type="button" data-countdown-action="pip" data-timer-id="${escapeHtml(countdown.id)}" title="${escapeHtml(isTimerPictureInPictureSupported() ? t("openTimerPip") : t("pipUnavailable"))}" aria-label="${escapeHtml(t("openTimerPip"))}" aria-pressed="${activePictureInPictureTimerId === countdown.id ? "true" : "false"}" ${isTimerPictureInPictureSupported() ? "" : "disabled"}>${escapeHtml(t("pictureInPicture"))}</button>
          </div>
          <button class="button button-quiet remove-timer-button" type="button" data-countdown-action="remove" data-timer-id="${escapeHtml(countdown.id)}" title="${escapeHtml(t("removeTimer"))}" ${state.countdowns.length <= 1 ? "disabled" : ""}>${escapeHtml(t("removeTimer"))}</button>
        </div>
      </article>
    `;
  }

  function renderEventLog() {
    const count = state.eventLog.length;
    elements.eventCount.textContent = formatText("eventCount", {
      count,
      eventWord: pluralWord(count, "eventSingular", "eventPlural"),
    });
    elements.resetEventLogBtn.disabled = count === 0;

    if (!count) {
      elements.eventRows.innerHTML = `<tr><td colspan="5">${escapeHtml(t("noEvents"))}</td></tr>`;
      return;
    }

    const recent = state.eventLog.slice(-12).reverse();
    elements.eventRows.innerHTML = recent.map((event) => `
      <tr>
        <td>${escapeHtml(formatEventTime(event.timestamp))}</td>
        <td>${escapeHtml(event.stopwatchName)}</td>
        <td>${escapeHtml(eventLabel(event.eventType))}</td>
        <td>${escapeHtml(formatStopwatch(event.elapsedMs))}</td>
        <td>${event.lapNumber === "" ? "" : escapeHtml(String(event.lapNumber))}</td>
      </tr>
    `).join("");
    renderSessionMeta();
  }

  function updateShortcutName(stopwatch) {
    const row = elements.stopwatchList.querySelector(`[data-stopwatch-id="${cssEscape(stopwatch.id)}"]`);
    const shortcutPanel = row ? row.querySelector(".stopwatch-shortcut") : null;
    const captureButton = row ? row.querySelector("[data-shortcut-action='capture']") : null;
    const timerActions = row ? row.querySelector(".timer-actions") : null;

    if (shortcutPanel) {
      shortcutPanel.setAttribute("aria-label", `${stopwatch.name} keyboard shortcut`);
    }
    if (captureButton) {
      captureButton.setAttribute("aria-label", `Set shortcut for ${stopwatch.name}`);
    }
    if (timerActions) {
      timerActions.setAttribute("aria-label", `${stopwatch.name} controls`);
    }
  }

  function focusShortcutButton(stopwatchId) {
    const button = elements.stopwatchList.querySelector(
      `[data-stopwatch-id="${cssEscape(stopwatchId)}"] [data-shortcut-action="capture"]`
    );
    if (button) {
      button.focus();
    }
  }

  function updateRunningStopwatchDisplays() {
    state.stopwatches.forEach((stopwatch) => {
      const display = elements.stopwatchList.querySelector(`[data-time-id="${cssEscape(stopwatch.id)}"]`);
      if (display) {
        display.textContent = formatStopwatch(getStopwatchElapsed(stopwatch));
      }
    });
  }

  function renderCountdownSummary() {
    const running = state.countdowns.filter((countdown) => countdown.status === "running").length;
    const aggregateStatus = getCountdownAggregateStatus();

    elements.countdownMeta.textContent = formatText("timerMeta", {
      timers: state.countdowns.length,
      timerWord: pluralWord(state.countdowns.length, "timerSingular", "timerPlural"),
      running,
    });
    elements.countdownStatus.textContent = statusLabel(aggregateStatus);
    elements.countdownSection.dataset.status = aggregateStatus;
    elements.startAllTimersBtn.disabled = !state.countdowns.some(
      (countdown) => countdown.status !== "running" && countdown.durationMs > 0
    );
    elements.pauseAllTimersBtn.disabled = running === 0;
    elements.stopAllTimersBtn.disabled = !state.countdowns.some((countdown) => countdown.status !== "idle");
  }

  function updateCountdownTimerDisplays(countdown, forceSegmentRender = false) {
    const row = getCountdownRow(countdown.id);
    if (!row) {
      return;
    }

    const remainingMs = getCountdownRemaining(countdown);
    const parts = countdownPartsFromMs(remainingMs);
    row.dataset.status = countdown.status;

    const nameInput = row.querySelector(".countdown-name-input");
    const status = row.querySelector(`[data-countdown-status="${cssEscape(countdown.id)}"]`);
    const actionButton = row.querySelector("[data-countdown-action='toggle']");
    const segmentInputs = Array.from(row.querySelectorAll(".countdown-segment-input"));

    if (nameInput) {
      setValueUnlessFocused(nameInput, countdown.name);
    }
    if (status) {
      status.textContent = statusLabel(countdown.status);
    }
    if (actionButton) {
      actionButton.textContent = getCountdownActionLabel(countdown);
      actionButton.disabled = countdown.durationMs <= 0 && countdown.status !== "running";
    }

    segmentInputs.forEach((input) => {
      input.disabled = countdown.status === "running";
      if (input.dataset.segment === "hours") {
        setCountdownSegment(input, parts.hours, forceSegmentRender);
      } else if (input.dataset.segment === "minutes") {
        setCountdownSegment(input, parts.minutes, forceSegmentRender);
      } else if (input.dataset.segment === "seconds") {
        setCountdownSegment(input, parts.seconds, forceSegmentRender);
      }
    });

    renderCountdownSummary();
    updateFullscreenCountdown();
  }

  function updateFullscreenCountdown() {
    const countdown = getCountdown(activeFullscreenTimerId) || state.countdowns[0];
    if (!countdown) {
      elements.fullscreenCountdown.hidden = true;
      return;
    }

    const remainingMs = getCountdownRemaining(countdown);
    elements.fullscreenCountdownDisplay.textContent = formatCountdown(remainingMs);
    elements.fullscreenCountdownName.textContent = countdown.name.toUpperCase();
    elements.fullscreenToggleBtn.textContent = getCountdownActionLabel(countdown);
    elements.fullscreenToggleBtn.disabled = countdown.durationMs <= 0 && countdown.status !== "running";
    elements.fullscreenResetBtn.disabled = countdown.durationMs <= 0;
    elements.fullscreenCountdown.classList.toggle("countdown-complete", countdown.status === "complete");

    const duration = Math.max(1, countdown.durationMs);
    const progress = countdown.status === "complete" ? 0 : clamp(remainingMs / duration, 0, 1);
    elements.fullscreenProgressBar.style.transform = `scaleX(${progress})`;
    updateCountdownPictureInPicture();
  }

  function isDocumentPictureInPictureSupported() {
    return Boolean(
      window.documentPictureInPicture
      && typeof window.documentPictureInPicture.requestWindow === "function"
    );
  }

  function isVideoPictureInPictureSupported() {
    return Boolean(
      document.pictureInPictureEnabled
      && HTMLVideoElement.prototype.requestPictureInPicture
    );
  }

  function isTimerPictureInPictureSupported() {
    return isDocumentPictureInPictureSupported() || isVideoPictureInPictureSupported();
  }

  async function openCountdownPictureInPicture(countdown) {
    if (!countdown || !isTimerPictureInPictureSupported()) {
      return;
    }

    if (!isDocumentPictureInPictureSupported()) {
      openVideoPictureInPicture(countdown);
      return;
    }

    try {
      if (timerPictureInPictureWindow && !timerPictureInPictureWindow.closed) {
        timerPictureInPictureWindow.close();
      }

      activePictureInPictureTimerId = countdown.id;
      timerPictureInPictureWindow = await window.documentPictureInPicture.requestWindow({
        width: 420,
        height: 190,
      });
      const pipDocument = timerPictureInPictureWindow.document;
      pipDocument.title = countdown.name;
      pipDocument.body.innerHTML = `
        <main class="pip-timer" aria-live="polite">
          <p id="pipTimerName" class="pip-timer-name"></p>
          <output id="pipTimerTime" class="pip-timer-time">00:00:00</output>
          <div class="pip-timer-progress" aria-hidden="true"><span id="pipTimerProgress"></span></div>
        </main>
      `;
      pipDocument.head.innerHTML = `
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          :root { color-scheme: light dark; }
          * { box-sizing: border-box; }
          body { margin: 0; background: #10141f; color: #f4f7fb; font-family: Inter, system-ui, sans-serif; }
          .pip-timer { display: grid; gap: 0.85rem; min-height: 100vh; padding: 1.1rem 1.25rem; align-content: center; text-align: center; }
          .pip-timer-name { margin: 0; color: #b5c0d2; font-size: 0.9rem; font-weight: 750; overflow-wrap: anywhere; text-transform: uppercase; }
          .pip-timer-time { color: #f4f7fb; font-family: Consolas, "Liberation Mono", monospace; font-size: clamp(2.4rem, 14vw, 5.2rem); font-variant-numeric: tabular-nums; font-weight: 800; line-height: 0.95; }
          .pip-timer-progress { height: 0.45rem; overflow: hidden; border-radius: 99px; background: #303a4a; }
          .pip-timer-progress span { display: block; width: 100%; height: 100%; background: #6da4ff; transform-origin: left center; }
          .pip-timer.complete .pip-timer-time { color: #ff776d; }
        </style>
      `;
      timerPictureInPictureWindow.addEventListener("pagehide", () => {
        activePictureInPictureTimerId = null;
        timerPictureInPictureWindow = null;
        renderCountdown();
      }, { once: true });
      updateCountdownPictureInPicture();
      renderCountdown();
    } catch {
      activePictureInPictureTimerId = null;
      timerPictureInPictureWindow = null;
      renderCountdown();
    }
  }

  async function openVideoPictureInPicture(countdown) {
    try {
      closeTimerPictureInPicture();
      activePictureInPictureTimerId = countdown.id;
      timerPictureInPictureCanvas = document.createElement("canvas");
      timerPictureInPictureCanvas.width = 960;
      timerPictureInPictureCanvas.height = 360;
      timerPictureInPictureVideo = document.createElement("video");
      timerPictureInPictureVideo.muted = true;
      timerPictureInPictureVideo.playsInline = true;
      timerPictureInPictureVideo.setAttribute("aria-hidden", "true");
      timerPictureInPictureVideo.style.cssText = "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;";
      timerPictureInPictureVideo.srcObject = timerPictureInPictureCanvas.captureStream(30);
      timerPictureInPictureVideo.addEventListener("leavepictureinpicture", () => {
        closeTimerPictureInPicture();
        renderCountdown();
      }, { once: true });
      document.body.append(timerPictureInPictureVideo);
      drawCountdownPictureInPicture(countdown);
      await timerPictureInPictureVideo.play();
      await timerPictureInPictureVideo.requestPictureInPicture();
      renderCountdown();
    } catch {
      closeTimerPictureInPicture();
      renderCountdown();
    }
  }

  function updateCountdownPictureInPicture() {
    const countdown = getCountdown(activePictureInPictureTimerId);
    if (!countdown) {
      closeTimerPictureInPicture();
      return;
    }

    if (timerPictureInPictureCanvas) {
      drawCountdownPictureInPicture(countdown);
      return;
    }
    if (!timerPictureInPictureWindow || timerPictureInPictureWindow.closed) {
      return;
    }

    const pipDocument = timerPictureInPictureWindow.document;
    const remainingMs = getCountdownRemaining(countdown);
    const duration = Math.max(1, countdown.durationMs);
    const progress = countdown.status === "complete" ? 0 : clamp(remainingMs / duration, 0, 1);
    pipDocument.title = countdown.name;
    pipDocument.getElementById("pipTimerName").textContent = countdown.name;
    pipDocument.getElementById("pipTimerTime").textContent = formatCountdown(remainingMs);
    pipDocument.getElementById("pipTimerProgress").style.transform = `scaleX(${progress})`;
    pipDocument.querySelector(".pip-timer").classList.toggle("complete", countdown.status === "complete");
  }

  function drawCountdownPictureInPicture(countdown) {
    if (!timerPictureInPictureCanvas) {
      return;
    }

    const context = timerPictureInPictureCanvas.getContext("2d");
    const width = timerPictureInPictureCanvas.width;
    const height = timerPictureInPictureCanvas.height;
    const remainingMs = getCountdownRemaining(countdown);
    const duration = Math.max(1, countdown.durationMs);
    const progress = countdown.status === "complete" ? 0 : clamp(remainingMs / duration, 0, 1);
    context.fillStyle = "#10141f";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#b5c0d2";
    context.font = "700 34px system-ui";
    context.textAlign = "center";
    context.fillText(countdown.name.toUpperCase(), width / 2, 68, width - 80);
    context.fillStyle = countdown.status === "complete" ? "#ff776d" : "#f4f7fb";
    context.font = "800 154px Consolas, monospace";
    context.fillText(formatCountdown(remainingMs), width / 2, 220);
    context.fillStyle = "#303a4a";
    context.fillRect(72, 284, width - 144, 14);
    context.fillStyle = "#6da4ff";
    context.fillRect(72, 284, (width - 144) * progress, 14);
  }

  function closeTimerPictureInPicture() {
    if (timerPictureInPictureWindow && !timerPictureInPictureWindow.closed) {
      timerPictureInPictureWindow.close();
    }
    if (timerPictureInPictureVideo) {
      const stream = timerPictureInPictureVideo.srcObject;
      if (stream && typeof stream.getTracks === "function") {
        stream.getTracks().forEach((track) => track.stop());
      }
      timerPictureInPictureVideo.remove();
    }
    timerPictureInPictureWindow = null;
    timerPictureInPictureVideo = null;
    timerPictureInPictureCanvas = null;
    activePictureInPictureTimerId = null;
  }

  function onFullscreenCountdownToggle() {
    const countdown = getCountdown(activeFullscreenTimerId) || state.countdowns[0];
    if (countdown) {
      startOrStopCountdown(countdown);
    }
  }

  function onFullscreenCountdownReset() {
    const countdown = getCountdown(activeFullscreenTimerId) || state.countdowns[0];
    if (countdown) {
      resetCountdown(countdown);
    }
  }

  function setCountdownSegment(input, value, forceSegmentRender) {
    const max = input.dataset.segment === "hours" ? 99 : 59;
    const text = pad(clamp(value, 0, max));
    input.dataset.committedValue = text;
    if (forceSegmentRender || document.activeElement !== input) {
      input.value = text;
    }
  }

  function animationLoop() {
    updateRunningStopwatchDisplays();

    let countdownChanged = false;
    state.countdowns.forEach((countdown) => {
      if (countdown.status !== "running") {
        return;
      }

      countdown.remainingMs = getCountdownRemaining(countdown);
      if (countdown.remainingMs <= 0) {
        countdownChanged = completeCountdown(countdown, false) || countdownChanged;
      } else {
        updateCountdownTimerDisplays(countdown);
      }
    });

    if (countdownChanged) {
      renderCountdown();
      renderEventLog();
      scheduleSave();
    } else {
      updateFullscreenCountdown();
    }

    requestAnimationFrame(animationLoop);
  }

  function updateClock() {
    const date = new Date();
    const timeText = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    const dateText = `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
    elements.liveClock.textContent = `${timeText} ${dateText}`;
    elements.liveClock.dateTime = date.toISOString();
    elements.fullscreenClockTime.textContent = timeText;
    elements.fullscreenClockTime.dateTime = date.toISOString();
    elements.fullscreenClockDate.textContent = dateText;
  }

  function getInitialPanelTarget() {
    const hashTarget = window.location.hash.replace("#", "");
    return PANEL_IDS.includes(hashTarget) ? hashTarget : PANEL_IDS[0];
  }

  function setActiveMenuTarget(targetId, shouldUpdateHash) {
    const activeTarget = PANEL_IDS.includes(targetId) ? targetId : PANEL_IDS[0];

    elements.headerMenuLinks.forEach((link) => {
      const isActive = link.dataset.menuTarget === activeTarget;
      link.setAttribute("aria-pressed", String(isActive));
    });

    elements.viewPanels.forEach((panel) => {
      panel.hidden = panel.id !== activeTarget;
    });

    if (shouldUpdateHash) {
      history.replaceState(null, "", `#${activeTarget}`);
    }
  }

  function exportCsv() {
    const exportRuns = buildExportRuns();
    const lapCount = exportRuns.reduce((maximum, run) => Math.max(maximum, run.laps.length), 0);
    const header = [
      t("csvDate"),
      t("csvType"),
      t("csvName"),
      t("csvStart"),
      ...Array.from({ length: lapCount }, (_, index) => [
        formatText("csvLapElapsed", { number: index + 1 }),
        formatText("csvLapTotal", { number: index + 1 }),
      ]).flat(),
      t("csvEnd"),
      t("csvElapsed"),
      t("csvRemaining"),
    ];
    const rows = exportRuns.map((run) => [
      run.date,
      run.type,
      run.name,
      run.start,
      ...run.laps.flatMap((lap) => [lap.elapsed, lap.total]),
      ...Array(Math.max(0, lapCount - run.laps.length) * 2).fill(""),
      run.end,
      run.elapsed,
      run.remaining,
    ]);
    const csv = ["sep=,", header, ...rows].map((row) => (
      Array.isArray(row) ? row.map(csvEscape).join(",") : row
    )).join("\r\n");
    const blob = new Blob([`\uFEFF${csv}\r\n`], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `stop-the-time-session-${formatFilenameDate(new Date())}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 2000);
  }

  function buildExportRuns() {
    const runs = [];
    const activeRuns = new Map();

    state.eventLog.forEach((event) => {
      const eventType = String(event.eventType || "");
      const isTimer = isCountdownEvent(event);
      const key = `${isTimer ? "timer" : "stopwatch"}:${event.stopwatchId}`;

      if (eventType === "start" || eventType === "countdown_start") {
        const run = createExportRun(event);
        runs.push(run);
        activeRuns.set(key, run);
        return;
      }

      if (eventType === "lap") {
        const run = activeRuns.get(key) || createExportRun(event);
        if (!activeRuns.has(key)) {
          runs.push(run);
          activeRuns.set(key, run);
        }
        run.laps.push({
          elapsed: formatExportElapsed(event.splitMs, isTimer),
          total: formatExportElapsed(event.elapsedMs, isTimer),
        });
        return;
      }

      if (eventType === "stop" || eventType === "countdown_stop" || eventType === "countdown_complete" || eventType === "countdown_reset") {
        const run = activeRuns.get(key);
        if (run) {
          run.end = formatEventTime(event.timestamp);
          run.elapsed = formatExportElapsed(event.elapsedMs, isTimer);
          run.remaining = isTimer ? formatExportRemaining(event.remainingMs) : "";
          activeRuns.delete(key);
        }
      }
    });

    return runs;
  }

  function createExportRun(event) {
    return {
      date: formatCsvDate(event.timestamp),
      type: isCountdownEvent(event) ? t("csvTimer") : t("csvStopwatch"),
      name: event.stopwatchName,
      start: formatEventTime(event.timestamp),
      laps: [],
      end: "",
      elapsed: "",
      remaining: isCountdownEvent(event) ? formatExportRemaining(event.remainingMs) : "",
    };
  }

  function formatExportElapsed(ms, isTimer) {
    return isTimer ? formatElapsedHms(ms) : formatElapsedHmsMs(ms);
  }

  function formatExportRemaining(ms) {
    return ms === "" || ms === null || ms === undefined ? "" : formatElapsedHms(ms);
  }

  function applyLanguage(language) {
    state.language = LANGUAGE_VALUES.includes(language) ? language : "en";
    elements.html.lang = state.language;

    elements.languageButtons.forEach((button) => {
      const isActive = button.dataset.languageValue === state.language;
      const label = LANGUAGE_LABELS[button.dataset.languageValue] || button.dataset.languageValue.toUpperCase();
      button.setAttribute("aria-pressed", String(isActive));
      button.setAttribute("aria-label", label);
      button.title = label;
    });

    elements.i18nText.forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    elements.i18nAria.forEach((element) => {
      element.setAttribute("aria-label", t(element.dataset.i18nAria));
    });
    elements.themeButtons.forEach((button) => {
      const label = getThemeLabel(button.dataset.themeValue);
      button.setAttribute("aria-label", label);
      button.title = label;
    });
  }

  function applyTheme(mode) {
    state.theme = ["auto", "dark", "light"].includes(mode) ? mode : "auto";
    elements.html.dataset.theme = state.theme;
    elements.themeButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.themeValue === state.theme));
    });
    updateThemeMeta();
  }

  function updateThemeMeta() {
    const dark = state.theme === "dark" || (state.theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (elements.metaTheme) {
      elements.metaTheme.setAttribute("content", dark ? "#10141f" : "#f6f7fb");
    }
  }

  function enterCountdownFullscreen(countdown) {
    activeFullscreenTimerId = countdown ? countdown.id : (state.countdowns[0] && state.countdowns[0].id);
    elements.fullscreenCountdown.hidden = false;
    pseudoFullscreenActive = false;
    updateFullscreenCountdown();

    if (elements.fullscreenCountdown.requestFullscreen) {
      elements.fullscreenCountdown.requestFullscreen().catch(() => {
        pseudoFullscreenActive = true;
      });
    } else {
      pseudoFullscreenActive = true;
    }
  }

  function exitCountdownFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }
    activeFullscreenTimerId = null;
    elements.fullscreenCountdown.hidden = true;
    pseudoFullscreenActive = false;
  }

  function onFullscreenChange() {
    if (document.fullscreenElement === elements.fullscreenCountdown) {
      elements.fullscreenCountdown.hidden = false;
      pseudoFullscreenActive = false;
    } else if (document.fullscreenElement === elements.fullscreenClock) {
      elements.fullscreenClock.hidden = false;
      pseudoFullscreenActive = false;
    } else if (!pseudoFullscreenActive) {
      activeFullscreenTimerId = null;
      elements.fullscreenCountdown.hidden = true;
      elements.fullscreenClock.hidden = true;
    }
  }

  function enterClockFullscreen() {
    elements.fullscreenClock.hidden = false;
    pseudoFullscreenActive = false;
    updateClock();

    if (elements.fullscreenClock.requestFullscreen) {
      elements.fullscreenClock.requestFullscreen().catch(() => {
        pseudoFullscreenActive = true;
      });
    } else {
      pseudoFullscreenActive = true;
    }
  }

  function exitClockFullscreen() {
    if (document.fullscreenElement === elements.fullscreenClock) {
      document.exitFullscreen();
      return;
    }
    elements.fullscreenClock.hidden = true;
    pseudoFullscreenActive = false;
  }

  function playCountdownSound(countdown) {
    const sound = countdown && SOUND_VALUES.includes(countdown.sound) ? countdown.sound : "beep";
    const volume = state.timerSettings.volume;
    const requestId = ++activeAlarmRequest;
    stopActiveCountdownSound();

    if (sound === "mute" || volume <= 0) {
      return;
    }

    ensureAudioContext()
      .then((context) => {
        if (!context || requestId !== activeAlarmRequest) {
          return;
        }

        const outputVolume = clamp(volume / 100, 0, 1) * 0.42;
        const master = context.createGain();
        master.gain.setValueAtTime(outputVolume, context.currentTime);
        const compressor = context.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-18, context.currentTime);
        compressor.knee.setValueAtTime(18, context.currentTime);
        compressor.ratio.setValueAtTime(8, context.currentTime);
        compressor.attack.setValueAtTime(0.004, context.currentTime);
        compressor.release.setValueAtTime(0.18, context.currentTime);
        master.connect(compressor);
        compressor.connect(context.destination);
        activeAlarmMaster = master;

        if (sound === "chime") {
          for (let offset = 0; offset < ALARM_DURATION_SECONDS; offset += 1.15) {
            scheduleChime(context, master, offset);
          }
        } else if (sound === "bell") {
          for (let offset = 0; offset < ALARM_DURATION_SECONDS; offset += 1.05) {
            scheduleBell(context, master, offset);
          }
        } else if (sound === "ring") {
          for (let offset = 0; offset < ALARM_DURATION_SECONDS; offset += 0.625) {
            scheduleRing(context, master, offset);
          }
        } else if (sound === "buzzer") {
          scheduleBuzzer(context, master, 0, ALARM_DURATION_SECONDS);
        } else {
          for (let offset = 0; offset < ALARM_DURATION_SECONDS; offset += 0.82) {
            scheduleSignal(context, master, offset);
          }
        }

        activeAlarmTimeout = window.setTimeout(() => {
          if (requestId === activeAlarmRequest) {
            stopActiveCountdownSound();
          }
        }, (ALARM_DURATION_SECONDS + 0.4) * 1000);
      })
      .catch(() => {});
  }

  function stopActiveCountdownSound() {
    if (activeAlarmTimeout) {
      window.clearTimeout(activeAlarmTimeout);
      activeAlarmTimeout = 0;
    }
    if (activeAlarmMaster) {
      activeAlarmMaster.disconnect();
      activeAlarmMaster = null;
    }
  }

  async function ensureAudioContext() {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) {
      return null;
    }
    if (!audioContext) {
      audioContext = new AudioCtor();
    }
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }
    return audioContext;
  }

  function scheduleSignal(context, output, offset) {
    scheduleTone(context, output, 587.33, offset, 0.2, "triangle", 0.62);
    scheduleTone(context, output, 880, offset + 0.23, 0.3, "sine", 0.72);
    scheduleTone(context, output, 1760, offset + 0.23, 0.16, "sine", 0.16);
  }

  function scheduleChime(context, output, offset) {
    scheduleTone(context, output, 523.25, offset, 0.58, "sine", 0.42);
    scheduleTone(context, output, 659.25, offset + 0.12, 0.62, "sine", 0.34);
    scheduleTone(context, output, 783.99, offset + 0.24, 0.82, "sine", 0.3);
    scheduleTone(context, output, 1567.98, offset + 0.25, 0.4, "sine", 0.1);
  }

  function scheduleBell(context, output, offset) {
    scheduleTone(context, output, 659.25, offset, 0.88, "sine", 0.4);
    scheduleTone(context, output, 830.61, offset + 0.01, 0.68, "sine", 0.26);
    scheduleTone(context, output, 1318.51, offset + 0.02, 0.48, "sine", 0.16);
    scheduleTone(context, output, 1975.53, offset + 0.025, 0.3, "sine", 0.08);
  }

  function scheduleRing(context, output, offset) {
    const strikes = [1174.66, 1396.91, 1174.66, 1396.91, 1174.66];
    strikes.forEach((frequency, index) => {
      const strikeOffset = offset + (index * 0.12);
      scheduleAlarmBellStrike(context, output, frequency, strikeOffset);
    });
  }

  function scheduleBuzzer(context, output, offset, duration) {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const tremolo = context.createOscillator();
    const tremoloGain = context.createGain();
    const start = context.currentTime + offset;
    const end = start + duration;

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(2400, start);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(0.54, start + 0.004);
    envelope.gain.exponentialRampToValueAtTime(0.0001, end);
    tremolo.type = "square";
    tremolo.frequency.setValueAtTime(18, start);
    tremoloGain.gain.setValueAtTime(0.18, start);
    tremolo.connect(tremoloGain);
    tremoloGain.connect(envelope.gain);
    oscillator.connect(envelope);
    envelope.connect(output);
    oscillator.start(start);
    tremolo.start(start);
    oscillator.stop(end + 0.03);
    tremolo.stop(end + 0.03);
  }

  function scheduleAlarmBellStrike(context, output, frequency, offset) {
    const modes = [
      [1, 0.18, 0.27],
      [1.46, 0.2, 0.24],
      [2.31, 0.17, 0.2],
      [3.77, 0.11, 0.14],
      [5.13, 0.06, 0.09],
    ];

    modes.forEach(([ratio, peak, duration], index) => {
      scheduleTone(context, output, frequency * ratio, offset + (index * 0.0015), duration, "sine", peak, 0.002);
    });
    scheduleBellHammer(context, output, frequency, offset);
  }

  function scheduleBellHammer(context, output, frequency, offset) {
    const duration = 0.018;
    const length = Math.max(1, Math.floor(context.sampleRate * duration));
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let index = 0; index < length; index += 1) {
      samples[index] = (Math.random() * 2 - 1) * (1 - index / length);
    }

    const source = context.createBufferSource();
    const highPass = context.createBiquadFilter();
    const resonator = context.createBiquadFilter();
    const gain = context.createGain();
    const start = context.currentTime + offset;
    const end = start + duration;

    highPass.type = "highpass";
    highPass.frequency.setValueAtTime(frequency * 0.7, start);
    resonator.type = "bandpass";
    resonator.frequency.setValueAtTime(frequency * 1.55, start);
    resonator.Q.setValueAtTime(8, start);
    gain.gain.setValueAtTime(0.11, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    source.buffer = buffer;
    source.connect(highPass);
    highPass.connect(resonator);
    resonator.connect(gain);
    gain.connect(output);
    source.start(start);
    source.stop(end + 0.01);
  }

  function scheduleTone(context, output, frequency, offset, duration, type, peak = 1, attack = 0.018) {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const start = context.currentTime + offset;
    const end = start + duration;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(peak, start + Math.min(attack, duration * 0.35));
    envelope.gain.exponentialRampToValueAtTime(0.0001, end);
    oscillator.connect(envelope);
    envelope.connect(output);
    oscillator.start(start);
    oscillator.stop(end + 0.03);
  }

  function scheduleSave() {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(persistNow, SAVE_DELAY_MS);
  }

  function persistNow() {
    window.clearTimeout(saveTimer);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeState()));
    } catch {
      // Storage can be blocked in private browsing; the app still runs in memory.
    }
  }

  function serializeState() {
    const serialized = {
      ...state,
      stopwatches: state.stopwatches.map((stopwatch) => ({
        ...stopwatch,
        startedAtPerf: null,
      })),
      countdowns: state.countdowns.map((countdown) => ({
        ...countdown,
        remainingMs: getCountdownRemaining(countdown),
        startedAtPerf: null,
        endAtPerf: null,
      })),
      timerSettings: { ...state.timerSettings },
    };
    delete serialized.countdown;
    return serialized;
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      return;
    }
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").catch(() => {
        // Offline support is progressive; keep the timer usable if registration fails.
      });
    });
  }

  function getStopwatch(id) {
    return state.stopwatches.find((stopwatch) => stopwatch.id === id);
  }

  function getCountdown(id) {
    return state.countdowns.find((countdown) => countdown.id === id);
  }

  function getCountdownRow(id) {
    return elements.countdownList.querySelector(`[data-timer-id="${cssEscape(id)}"]`);
  }

  function getDefaultCountdownName(countdown) {
    const index = state.countdowns.indexOf(countdown);
    return `${t("timerDefaultName")} ${index >= 0 ? index + 1 : state.countdowns.length}`;
  }

  function getCountdownActionLabel(countdown) {
    if (countdown.status === "running") {
      return t("pause");
    }
    if (countdown.status === "complete") {
      return t("restart");
    }
    return t("start");
  }

  function getCountdownAggregateStatus() {
    if (state.countdowns.some((countdown) => countdown.status === "running")) {
      return "running";
    }
    if (state.countdowns.some((countdown) => countdown.status === "complete")) {
      return "complete";
    }
    if (state.countdowns.some((countdown) => countdown.status === "paused")) {
      return "paused";
    }
    return "idle";
  }

  function setShortcutMessage(message) {
    elements.shortcutMessage.textContent = message;
  }

  function setValueUnlessFocused(input, value) {
    if (document.activeElement !== input) {
      input.value = value;
    }
  }

  function isEditableTarget(target) {
    if (!target) {
      return false;
    }
    if (target.isContentEditable) {
      return true;
    }
    const tagName = target.tagName;
    return tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT";
  }

  function displayKeyLabel(event) {
    if (event.code === "Space") {
      return "Space";
    }
    if (/^Key[A-Z]$/.test(event.code)) {
      return event.code.slice(3);
    }
    if (/^Digit[0-9]$/.test(event.code)) {
      return event.code.slice(5);
    }
    if (/^Numpad[0-9]$/.test(event.code)) {
      return `Num ${event.code.slice(6)}`;
    }
    if (/^Arrow/.test(event.code)) {
      return event.code.replace("Arrow", "Arrow ");
    }
    if (event.key && event.key.length === 1) {
      return event.key.toUpperCase();
    }
    return event.key || event.code;
  }

  function t(key) {
    const language = LANGUAGE_VALUES.includes(state.language) ? state.language : "en";
    return (TRANSLATIONS[language] && TRANSLATIONS[language][key]) || TRANSLATIONS.en[key] || key;
  }

  function formatText(key, values) {
    return t(key).replace(/\{(\w+)\}/g, (match, name) => (
      Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : match
    ));
  }

  function pluralWord(count, singularKey, pluralKey) {
    return t(count === 1 ? singularKey : pluralKey);
  }

  function statusLabel(status) {
    return t(status);
  }

  function eventLabel(eventType) {
    const labels = {
      countdown_complete: "eventTimerComplete",
      countdown_reset: "eventTimerReset",
      countdown_start: "eventTimerStart",
      countdown_stop: "eventTimerStop",
      lap: "eventStopwatchLap",
      reset: "eventStopwatchReset",
      start: "eventStopwatchStart",
      stop: "eventStopwatchStop",
    };
    return labels[eventType] ? t(labels[eventType]) : eventType.replace(/^countdown_/, "timer_").replace(/_/g, " ");
  }

  function isCountdownEvent(event) {
    return String(event.eventType || "").startsWith("countdown_");
  }

  function exportEventLabel(event) {
    if (isCountdownEvent(event)) {
      return eventLabel(event.eventType);
    }
    const labels = {
      start: t("start"),
      stop: t("stop"),
      lap: t("lap"),
      reset: t("reset"),
    };
    return labels[event.eventType] || eventLabel(event.eventType);
  }

  function getThemeLabel(mode) {
    const labels = THEME_LABELS[mode] || THEME_LABELS.auto;
    return labels[state.language] || labels.en;
  }

  function getPreferredLanguage() {
    const browserLanguage = (navigator.language || "en").toLowerCase();
    return LANGUAGE_VALUES.find((language) => browserLanguage.startsWith(language)) || "en";
  }

  function formatStopwatch(ms) {
    const totalMs = Math.max(0, Math.floor(ms));
    const hundredths = Math.floor((totalMs % 1000) / 10);
    const totalSeconds = Math.floor(totalMs / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(hundredths)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}.${pad(hundredths)}`;
  }

  function formatElapsedHms(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  function formatElapsedHmsMs(ms) {
    const totalMs = Math.max(0, Math.floor(ms));
    const hundredths = Math.floor((totalMs % 1000) / 10);
    const totalSeconds = Math.floor(totalMs / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(hundredths)}`;
  }

  function formatCountdown(ms) {
    const parts = countdownPartsFromMs(ms);
    return `${pad(parts.hours)}:${pad(parts.minutes)}:${pad(parts.seconds)}`;
  }

  function countdownPartsFromMs(ms) {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    return {
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor(totalSeconds / 60) % 60,
      seconds: totalSeconds % 60,
    };
  }

  function formatEventTime(timestamp) {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  function formatCsvDate(timestamp) {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
  }

  function formatFilenameDate(date) {
    return [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate()),
      pad(date.getHours()),
      pad(date.getMinutes()),
      pad(date.getSeconds()),
    ].join("-");
  }

  function durationFromParts(hours, minutes, seconds) {
    return ((hours * 60 * 60) + (minutes * 60) + seconds) * 1000;
  }

  function csvEscape(value) {
    const text = value === null || value === undefined ? "" : String(value);
    if (/[",\r\n]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => escapeMap[char]);
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === "function") {
      return window.CSS.escape(value);
    }
    return String(value).replace(/"/g, '\\"');
  }

  function sanitizeColor(value) {
    return /^#[0-9a-f]{6}$/i.test(String(value)) ? String(value) : DEFAULT_COLORS[0];
  }

  function toSafeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function pad(value) {
    return String(Math.floor(Math.abs(value))).padStart(2, "0");
  }

  function makeId(prefix) {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return `${prefix}-${window.crypto.randomUUID()}`;
    }
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function titleCase(value) {
    return String(value).slice(0, 1).toUpperCase() + String(value).slice(1);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
