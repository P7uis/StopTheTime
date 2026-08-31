(() => {
  "use strict";

  const STORAGE_KEY = "stop-the-time.state.v1";
  const THEME_KEY = "stop-the-time.theme";
  const SAVE_DELAY_MS = 120;
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
  const STATUS_LABEL = {
    idle: "Idle",
    running: "Running",
    stopped: "Stopped",
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
  let capturingStopwatchId = null;
  let pendingExpiredCountdownEvent = false;
  let pseudoFullscreenActive = false;

  function init() {
    cacheElements();
    normalizeLoadedState();
    bindEvents();
    applyTheme(state.theme);
    render();
    updateClock();
    setInterval(updateClock, 250);
    requestAnimationFrame(animationLoop);
    registerServiceWorker();

    if (pendingExpiredCountdownEvent) {
      appendEvent({
        stopwatchId: "countdown",
        stopwatchName: state.countdown.name,
        eventType: "countdown_complete",
        elapsedMs: state.countdown.durationMs,
      });
      render();
      scheduleSave();
    }
  }

  function cacheElements() {
    elements.html = document.documentElement;
    elements.metaTheme = document.querySelector('meta[name="theme-color"]');
    elements.liveClock = document.getElementById("liveClock");
    elements.newSessionBtn = document.getElementById("newSessionBtn");
    elements.themeButtons = Array.from(document.querySelectorAll(".theme-option"));
    elements.sessionMeta = document.getElementById("sessionMeta");
    elements.startAllBtn = document.getElementById("startAllBtn");
    elements.stopAllBtn = document.getElementById("stopAllBtn");
    elements.lapAllBtn = document.getElementById("lapAllBtn");
    elements.addStopwatchBtn = document.getElementById("addStopwatchBtn");
    elements.stopwatchList = document.getElementById("stopwatchList");
    elements.countdownSection = document.querySelector(".countdown-section");
    elements.countdownName = document.getElementById("countdownName");
    elements.countdownHours = document.getElementById("countdownHours");
    elements.countdownMinutes = document.getElementById("countdownMinutes");
    elements.countdownSeconds = document.getElementById("countdownSeconds");
    elements.countdownDisplay = document.getElementById("countdownDisplay");
    elements.countdownStatus = document.getElementById("countdownStatus");
    elements.countdownStartBtn = document.getElementById("countdownStartBtn");
    elements.countdownResetBtn = document.getElementById("countdownResetBtn");
    elements.countdownFullscreenBtn = document.getElementById("countdownFullscreenBtn");
    elements.soundSelect = document.getElementById("soundSelect");
    elements.volumeInput = document.getElementById("volumeInput");
    elements.volumeValue = document.getElementById("volumeValue");
    elements.testSoundBtn = document.getElementById("testSoundBtn");
    elements.shortcutMessage = document.getElementById("shortcutMessage");
    elements.exportCsvBtn = document.getElementById("exportCsvBtn");
    elements.eventCount = document.getElementById("eventCount");
    elements.eventRows = document.getElementById("eventRows");
    elements.fullscreenCountdown = document.getElementById("fullscreenCountdown");
    elements.exitFullscreenBtn = document.getElementById("exitFullscreenBtn");
    elements.fullscreenCountdownName = document.getElementById("fullscreenCountdownName");
    elements.fullscreenCountdownDisplay = document.getElementById("fullscreenCountdownDisplay");
    elements.fullscreenProgressBar = document.getElementById("fullscreenProgressBar");
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
      stopwatches: [0, 1, 2].map((index) =>
        createStopwatch(`Stopwatch ${index + 1}`, DEFAULT_COLORS[index], DEFAULT_SHORTCUTS[index])
      ),
      countdown: {
        name: "Experiment",
        hours: 0,
        minutes: 0,
        seconds: 5,
        durationMs: 5000,
        remainingMs: 5000,
        status: "idle",
        startedAtPerf: null,
        startedAtEpoch: null,
        endAtPerf: null,
        endAtEpoch: null,
        sound: "beep",
        volume: 100,
        shortcut: null,
      },
      eventLog: [],
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
      lapsOpen: true,
      laps: [],
    };
  }

  function normalizeLoadedState() {
    const nowEpochValue = Date.now();
    const nowPerfValue = performance.now();

    state.theme = ["auto", "dark", "light"].includes(state.theme) ? state.theme : "auto";
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

    state.countdown = normalizeCountdown(state.countdown || createDefaultState().countdown);
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

  function normalizeCountdown(saved) {
    const fallback = createDefaultState().countdown;
    const countdown = { ...fallback, ...saved };
    countdown.name = String(countdown.name || "Experiment");
    countdown.hours = clamp(Math.round(toSafeNumber(countdown.hours)), 0, 99);
    countdown.minutes = clamp(Math.round(toSafeNumber(countdown.minutes)), 0, 59);
    countdown.seconds = clamp(Math.round(toSafeNumber(countdown.seconds)), 0, 59);
    countdown.durationMs = durationFromParts(countdown.hours, countdown.minutes, countdown.seconds);
    countdown.remainingMs = clamp(toSafeNumber(countdown.remainingMs, countdown.durationMs), 0, Math.max(countdown.durationMs, 1));
    countdown.status = ["idle", "running", "paused", "complete"].includes(countdown.status)
      ? countdown.status
      : "idle";
    countdown.sound = ["beep", "chime", "bell", "mute"].includes(countdown.sound) ? countdown.sound : "beep";
    countdown.volume = clamp(Math.round(toSafeNumber(countdown.volume, 100)), 0, 100);

    if (countdown.status === "running") {
      const remaining = Math.max(0, toSafeNumber(countdown.endAtEpoch) - Date.now());
      if (remaining <= 0) {
        countdown.status = "complete";
        countdown.remainingMs = 0;
        countdown.startedAtPerf = null;
        countdown.startedAtEpoch = null;
        countdown.endAtPerf = null;
        countdown.endAtEpoch = null;
        pendingExpiredCountdownEvent = true;
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
      }
    }

    return countdown;
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

    elements.newSessionBtn.addEventListener("click", createNewSession);
    elements.addStopwatchBtn.addEventListener("click", addStopwatch);
    elements.startAllBtn.addEventListener("click", startAllStopwatches);
    elements.stopAllBtn.addEventListener("click", stopAllStopwatches);
    elements.lapAllBtn.addEventListener("click", lapAllStopwatches);
    elements.exportCsvBtn.addEventListener("click", exportCsv);

    elements.stopwatchList.addEventListener("click", onStopwatchClick);
    elements.stopwatchList.addEventListener("input", onStopwatchInput);
    elements.stopwatchList.addEventListener("toggle", onLapToggle, true);

    elements.countdownName.addEventListener("input", () => {
      state.countdown.name = elements.countdownName.value.trim() || "Experiment";
      updateCountdownDisplays();
      scheduleSave();
    });

    [elements.countdownHours, elements.countdownMinutes, elements.countdownSeconds].forEach((input) => {
      input.addEventListener("input", updateCountdownDurationFromInputs);
    });

    elements.countdownStartBtn.addEventListener("click", startOrPauseCountdown);
    elements.countdownResetBtn.addEventListener("click", resetCountdown);
    elements.countdownFullscreenBtn.addEventListener("click", enterCountdownFullscreen);
    elements.exitFullscreenBtn.addEventListener("click", exitCountdownFullscreen);

    elements.soundSelect.addEventListener("change", () => {
      state.countdown.sound = elements.soundSelect.value;
      scheduleSave();
    });

    elements.volumeInput.addEventListener("input", () => {
      state.countdown.volume = clamp(Math.round(toSafeNumber(elements.volumeInput.value, 100)), 0, 100);
      elements.volumeValue.textContent = `${state.countdown.volume}%`;
      scheduleSave();
    });

    elements.testSoundBtn.addEventListener("click", () => {
      playCountdownSound();
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
      toggleStopwatch(stopwatch);
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

  function createNewSession() {
    const hasEvents = state.eventLog.length > 0;
    if (hasEvents && !window.confirm("Start a new session and clear the current event log? Export first if you need this data.")) {
      return;
    }

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
    resetCountdown(false);
    render();
    persistNow();
  }

  function startOrPauseCountdown() {
    if (state.countdown.status === "running") {
      pauseCountdown();
    } else {
      startCountdown();
    }
  }

  function startCountdown() {
    const countdown = state.countdown;
    const remainingMs = countdown.status === "paused" ? countdown.remainingMs : countdown.durationMs;
    if (remainingMs <= 0) {
      return;
    }

    ensureAudioContext().catch(() => {});
    countdown.status = "running";
    countdown.remainingMs = remainingMs;
    countdown.startedAtPerf = performance.now();
    countdown.startedAtEpoch = Date.now();
    countdown.endAtPerf = performance.now() + remainingMs;
    countdown.endAtEpoch = Date.now() + remainingMs;

    appendEvent({
      stopwatchId: "countdown",
      stopwatchName: countdown.name,
      eventType: "countdown_start",
      elapsedMs: countdown.durationMs - remainingMs,
    });

    renderCountdown();
    scheduleSave();
  }

  function pauseCountdown() {
    const countdown = state.countdown;
    if (countdown.status !== "running") {
      return;
    }

    countdown.remainingMs = getCountdownRemaining();
    countdown.status = "paused";
    countdown.startedAtPerf = null;
    countdown.startedAtEpoch = null;
    countdown.endAtPerf = null;
    countdown.endAtEpoch = null;

    appendEvent({
      stopwatchId: "countdown",
      stopwatchName: countdown.name,
      eventType: "countdown_pause",
      elapsedMs: countdown.durationMs - countdown.remainingMs,
    });

    renderCountdown();
    scheduleSave();
  }

  function resetCountdown(shouldLog = true) {
    const countdown = state.countdown;
    const elapsedMs = countdown.durationMs - getCountdownRemaining();
    countdown.status = "idle";
    countdown.remainingMs = countdown.durationMs;
    countdown.startedAtPerf = null;
    countdown.startedAtEpoch = null;
    countdown.endAtPerf = null;
    countdown.endAtEpoch = null;

    if (shouldLog) {
      appendEvent({
        stopwatchId: "countdown",
        stopwatchName: countdown.name,
        eventType: "countdown_reset",
        elapsedMs,
      });
    }

    renderCountdown();
    scheduleSave();
  }

  function completeCountdown() {
    const countdown = state.countdown;
    if (countdown.status !== "running") {
      return;
    }

    countdown.status = "complete";
    countdown.remainingMs = 0;
    countdown.startedAtPerf = null;
    countdown.startedAtEpoch = null;
    countdown.endAtPerf = null;
    countdown.endAtEpoch = null;

    appendEvent({
      stopwatchId: "countdown",
      stopwatchName: countdown.name,
      eventType: "countdown_complete",
      elapsedMs: countdown.durationMs,
    });

    playCountdownSound();
    renderCountdown();
    scheduleSave();
  }

  function updateCountdownDurationFromInputs() {
    const hours = clamp(Math.round(toSafeNumber(elements.countdownHours.value)), 0, 99);
    const minutes = clamp(Math.round(toSafeNumber(elements.countdownMinutes.value)), 0, 59);
    const seconds = clamp(Math.round(toSafeNumber(elements.countdownSeconds.value)), 0, 59);
    const durationMs = durationFromParts(hours, minutes, seconds);

    state.countdown.hours = hours;
    state.countdown.minutes = minutes;
    state.countdown.seconds = seconds;
    state.countdown.durationMs = durationMs;

    if (state.countdown.status !== "running") {
      state.countdown.status = "idle";
      state.countdown.remainingMs = durationMs;
      renderCountdown();
    }
    scheduleSave();
  }

  function getStopwatchElapsed(stopwatch) {
    if (stopwatch.status !== "running" || typeof stopwatch.startedAtPerf !== "number") {
      return Math.max(0, stopwatch.baseElapsedMs);
    }
    return Math.max(0, stopwatch.baseElapsedMs + (performance.now() - stopwatch.startedAtPerf));
  }

  function getCountdownRemaining() {
    const countdown = state.countdown;
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
    elements.sessionMeta.textContent = `${state.stopwatches.length} stopwatches - ${running} running - ${state.eventLog.length} events`;
  }

  function renderStopwatches() {
    elements.stopwatchList.innerHTML = state.stopwatches.map((stopwatch) => {
      const isCapturing = capturingStopwatchId === stopwatch.id;
      const shortcutLabel = isCapturing ? "Press a key..." : stopwatch.shortcutLabel || "Set key";
      const laps = stopwatch.laps.length
        ? stopwatch.laps.map((lap) => `
            <li class="lap-item">
              <strong>Lap ${lap.lapNumber}</strong>
              <span class="lap-time">${formatStopwatch(lap.elapsedMs)}</span>
              <span>Split ${formatStopwatch(lap.splitMs)}</span>
            </li>
          `).join("")
        : `<li class="empty-state">No laps recorded</li>`;

      return `
        <article class="stopwatch-row" data-status="${escapeHtml(stopwatch.status)}" data-stopwatch-id="${escapeHtml(stopwatch.id)}" style="--stopwatch-accent: ${escapeHtml(stopwatch.color)}">
          <div class="stopwatch-meta">
            <span class="status-wrap">
              <span class="status-dot" aria-hidden="true"></span>
              <span data-status-label="${escapeHtml(stopwatch.id)}">${STATUS_LABEL[stopwatch.status]}</span>
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
              <span>Shortcut</span>
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
              >Clear</button>
            </div>
          </div>

          <output class="timer-display" data-time-id="${escapeHtml(stopwatch.id)}">${formatStopwatch(getStopwatchElapsed(stopwatch))}</output>

          <div class="timer-actions" role="group" aria-label="${escapeHtml(stopwatch.name)} controls">
            <button class="button button-primary" type="button" data-stopwatch-action="start" data-stopwatch-id="${escapeHtml(stopwatch.id)}" ${stopwatch.status === "running" ? "disabled" : ""}>START</button>
            <button class="button button-secondary" type="button" data-stopwatch-action="lap" data-stopwatch-id="${escapeHtml(stopwatch.id)}" ${stopwatch.status !== "running" ? "disabled" : ""}>LAP</button>
            <button class="button button-danger" type="button" data-stopwatch-action="stop" data-stopwatch-id="${escapeHtml(stopwatch.id)}" ${stopwatch.status !== "running" ? "disabled" : ""}>STOP</button>
            <button class="button button-secondary" type="button" data-stopwatch-action="reset" data-stopwatch-id="${escapeHtml(stopwatch.id)}">RESET</button>
          </div>

          <details class="lap-history" data-stopwatch-id="${escapeHtml(stopwatch.id)}" ${stopwatch.lapsOpen ? "open" : ""}>
            <summary>Laps (${stopwatch.laps.length})</summary>
            <ol class="lap-list">${laps}</ol>
          </details>
        </article>
      `;
    }).join("");
  }

  function renderCountdown() {
    const countdown = state.countdown;
    elements.countdownSection.dataset.status = countdown.status;
    setValueUnlessFocused(elements.countdownName, countdown.name);
    setValueUnlessFocused(elements.countdownHours, String(countdown.hours));
    setValueUnlessFocused(elements.countdownMinutes, String(countdown.minutes));
    setValueUnlessFocused(elements.countdownSeconds, String(countdown.seconds));
    elements.countdownHours.disabled = countdown.status === "running";
    elements.countdownMinutes.disabled = countdown.status === "running";
    elements.countdownSeconds.disabled = countdown.status === "running";
    setValueUnlessFocused(elements.soundSelect, countdown.sound);
    setValueUnlessFocused(elements.volumeInput, String(countdown.volume));
    elements.volumeValue.textContent = `${countdown.volume}%`;

    elements.countdownStartBtn.textContent = countdown.status === "running"
      ? "PAUSE"
      : countdown.status === "complete"
        ? "RESTART"
        : "START";
    elements.countdownStartBtn.disabled = countdown.durationMs <= 0 && countdown.status !== "running";
    elements.countdownStatus.textContent = STATUS_LABEL[countdown.status] || titleCase(countdown.status);
    updateCountdownDisplays();
    renderEventLog();
  }

  function renderEventLog() {
    const count = state.eventLog.length;
    elements.eventCount.textContent = `${count} ${count === 1 ? "event" : "events"} recorded`;

    if (!count) {
      elements.eventRows.innerHTML = `<tr><td colspan="5">No events yet</td></tr>`;
      return;
    }

    const recent = state.eventLog.slice(-12).reverse();
    elements.eventRows.innerHTML = recent.map((event) => `
      <tr>
        <td>${escapeHtml(formatEventTime(event.timestamp))}</td>
        <td>${escapeHtml(event.stopwatchName)}</td>
        <td>${escapeHtml(event.eventType)}</td>
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

  function updateCountdownDisplays() {
    const remainingMs = getCountdownRemaining();
    const display = formatCountdown(remainingMs);
    elements.countdownDisplay.textContent = display;
    elements.fullscreenCountdownDisplay.textContent = display;
    elements.fullscreenCountdownName.textContent = state.countdown.name.toUpperCase();
    elements.fullscreenCountdown.classList.toggle("countdown-complete", state.countdown.status === "complete");

    const duration = Math.max(1, state.countdown.durationMs);
    const progress = state.countdown.status === "complete" ? 0 : clamp(remainingMs / duration, 0, 1);
    elements.fullscreenProgressBar.style.transform = `scaleX(${progress})`;
  }

  function animationLoop() {
    updateRunningStopwatchDisplays();

    if (state.countdown.status === "running") {
      state.countdown.remainingMs = getCountdownRemaining();
      if (state.countdown.remainingMs <= 0) {
        completeCountdown();
      } else {
        updateCountdownDisplays();
      }
    } else {
      updateCountdownDisplays();
    }

    requestAnimationFrame(animationLoop);
  }

  function updateClock() {
    const date = new Date();
    const clockText = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
    elements.liveClock.textContent = clockText;
    elements.liveClock.dateTime = date.toISOString();
  }

  function exportCsv() {
    const header = [
      "timestamp",
      "session_id",
      "event_id",
      "stopwatch_id",
      "stopwatch",
      "event",
      "elapsed_ms",
      "lap",
      "split_ms",
    ];
    const rows = state.eventLog.map((event) => [
      event.timestamp,
      event.sessionId,
      event.eventId,
      event.stopwatchId,
      event.stopwatchName,
      event.eventType,
      event.elapsedMs,
      event.lapNumber,
      event.splitMs,
    ]);
    const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\r\n");
    const blob = new Blob([`\uFEFF${csv}\r\n`], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `stopwatch-session-${formatFilenameDate(new Date())}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 2000);
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

  function enterCountdownFullscreen() {
    elements.fullscreenCountdown.hidden = false;
    pseudoFullscreenActive = false;
    updateCountdownDisplays();

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
    elements.fullscreenCountdown.hidden = true;
    pseudoFullscreenActive = false;
  }

  function onFullscreenChange() {
    if (document.fullscreenElement === elements.fullscreenCountdown) {
      elements.fullscreenCountdown.hidden = false;
      pseudoFullscreenActive = false;
    } else if (!pseudoFullscreenActive) {
      elements.fullscreenCountdown.hidden = true;
    }
  }

  function playCountdownSound() {
    const countdown = state.countdown;
    if (countdown.sound === "mute" || countdown.volume <= 0) {
      return;
    }

    ensureAudioContext()
      .then((context) => {
        if (!context) {
          return;
        }

        const volume = clamp(countdown.volume / 100, 0, 1) * 0.45;
        const master = context.createGain();
        master.gain.setValueAtTime(volume, context.currentTime);
        master.connect(context.destination);

        if (countdown.sound === "chime") {
          scheduleTone(context, master, 659.25, 0, 0.16, "sine");
          scheduleTone(context, master, 783.99, 0.17, 0.16, "sine");
          scheduleTone(context, master, 987.77, 0.34, 0.22, "sine");
        } else if (countdown.sound === "bell") {
          scheduleTone(context, master, 880, 0, 0.42, "triangle");
          scheduleTone(context, master, 1320, 0.03, 0.32, "sine");
        } else {
          scheduleTone(context, master, 880, 0, 0.28, "square");
        }

        window.setTimeout(() => master.disconnect(), 1200);
      })
      .catch(() => {});
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

  function scheduleTone(context, output, frequency, offset, duration, type) {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const start = context.currentTime + offset;
    const end = start + duration;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(1, start + 0.025);
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
    return {
      ...state,
      stopwatches: state.stopwatches.map((stopwatch) => ({
        ...stopwatch,
        startedAtPerf: null,
      })),
      countdown: {
        ...state.countdown,
        startedAtPerf: null,
        endAtPerf: null,
      },
    };
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

  function formatCountdown(ms) {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  }

  function formatEventTime(timestamp) {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
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
