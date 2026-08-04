(() => {
  "use strict";

  const course = window.SUSTAINABILITY_COURSE;
  if (!course) return;

  const STORAGE = {
    completed: "sustainability-course:completed",
    exercises: "sustainability-course:exercises",
    font: "sustainability-course:font"
  };

  const state = {
    selectedId: 1,
    language: "zh",
    phase: 0,
    query: "",
    caseFilter: "全部",
    completed: readArray(STORAGE.completed),
    exercises: readArray(STORAGE.exercises),
    font: localStorage.getItem(STORAGE.font) === "large" ? "large" : "general"
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const unitById = (id) => course.units.find((unit) => unit.id === Number(id)) || course.units[0];
  const phaseById = (id) => course.phases.find((phase) => phase.id === Number(id)) || course.phases[0];

  function readArray(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function save() {
    localStorage.setItem(STORAGE.completed, JSON.stringify(state.completed));
    localStorage.setItem(STORAGE.exercises, JSON.stringify(state.exercises));
    localStorage.setItem(STORAGE.font, state.font);
  }

  function setFont(mode) {
    state.font = mode === "large" ? "large" : "general";
    document.documentElement.classList.toggle("font-large", state.font === "large");
    $$(".font-button").forEach((button) => {
      const active = button.dataset.font === state.font;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    save();
  }

  function formatProgress() {
    const valid = new Set(course.units.map((unit) => String(unit.id)));
    state.completed = state.completed.filter((id) => valid.has(id));
    const progress = Math.round((state.completed.length / course.units.length) * 100);
    $("#progress-number").textContent = `${progress}%`;
    $("#progress-copy").textContent = `已完成 ${state.completed.length} / ${course.units.length} 單元`;
    $("#progress-bar").style.width = `${progress}%`;
    const track = $(".progress-track");
    track.setAttribute("aria-valuenow", String(progress));
    track.setAttribute("aria-label", `課程完成度 ${progress}%`);
  }

  function renderFilters() {
    $("#phase-filters").innerHTML = [
      `<button type="button" data-phase="0" aria-pressed="${state.phase === 0}">全部</button>`,
      ...course.phases.map((phase) => `<button type="button" data-phase="${phase.id}" title="${escapeHtml(phase.title)}" aria-pressed="${state.phase === phase.id}">${phase.id}</button>`)
    ].join("");
  }

  function renderUnitList() {
    const query = state.query.trim().toLocaleLowerCase("zh-Hant");
    const filtered = course.units.filter((unit) => {
      const inPhase = state.phase === 0 || unit.phase === state.phase;
      const searchable = [unit.title, unit.topic, ...unit.skills, unit.media.zh.channel, unit.media.en.channel].join(" ").toLocaleLowerCase("zh-Hant");
      return inPhase && (!query || searchable.includes(query));
    });

    $("#unit-list").innerHTML = filtered.length
      ? filtered.map((unit) => {
          const done = state.completed.includes(String(unit.id));
          return `<button type="button" data-unit="${unit.id}" class="${unit.id === state.selectedId ? "active" : ""}" ${unit.id === state.selectedId ? 'aria-current="step"' : ""}>
            <i class="${done ? "done" : ""}" aria-hidden="true">${done ? "✓" : unit.order}</i>
            <span><small>PHASE ${unit.phase} · ${escapeHtml(unit.topic)}</small><strong>${escapeHtml(unit.title)}</strong></span>
          </button>`;
        }).join("")
      : `<p class="empty">找不到符合的單元，試試「碳」、「職涯」或切換階段。</p>`;
  }

  function renderLesson() {
    const unit = unitById(state.selectedId);
    const phase = phaseById(unit.phase);
    const media = unit.media[state.language];
    const index = course.units.findIndex((item) => item.id === unit.id);
    const next = course.units[index + 1];
    const isDone = state.completed.includes(String(unit.id));

    $("#lesson-crumb").innerHTML = `<span>PHASE ${phase.number}</span><i>/</i><span>${escapeHtml(phase.title)}</span><i>/</i><strong>LESSON ${unit.order}</strong>`;
    $("#media-duration").textContent = `精選影音 · ${media.duration}`;
    $("#lesson-video").src = `https://www.youtube-nocookie.com/embed/${media.videoId}?rel=0&modestbranding=1`;
    $("#lesson-video").title = `${unit.title}｜${media.title}`;
    $("#media-language").textContent = state.language === "zh" ? "中文精選" : "ENGLISH PICK";
    $("#media-title").textContent = media.title;
    $("#media-info").textContent = `${media.channel} · ${media.duration} · ${media.approximateViews}`;
    $("#media-link").href = `https://www.youtube.com/watch?v=${media.videoId}`;
    $("#lesson-topic").textContent = unit.topic;
    $("#lesson-title").textContent = unit.title;

    const completeButton = $("#complete-unit");
    completeButton.classList.toggle("done", isDone);
    completeButton.setAttribute("aria-pressed", String(isDone));
    completeButton.textContent = isDone ? "✓ 已完成這一課" : "標記本課完成";

    $("#objectives").innerHTML = unit.objectives.map((item, i) => `<li><i>${i + 1}</i><span>${escapeHtml(item)}</span></li>`).join("");
    $("#theory").innerHTML = unit.theory.map((item, i) => `<div><span>${String(i + 1).padStart(2, "0")}</span><p>${escapeHtml(item)}</p></div>`).join("");
    $("#reasons").innerHTML = ["zh", "en"].map((lang) => `<div><b>${lang === "zh" ? "中" : "EN"}</b><p>${escapeHtml(unit.media[lang].selectionReason)}</p></div>`).join("");
    $("#source-link").href = unit.source.url;
    $("#source-link").textContent = `本課官方查核入口｜${unit.source.label} ↗`;

    $("#exercises").innerHTML = unit.exercises.map((item, i) => {
      const key = `${unit.id}-${i}`;
      const checked = state.exercises.includes(key);
      return `<label class="${checked ? "checked" : ""}"><input type="checkbox" data-exercise="${i}" ${checked ? "checked" : ""}/><i aria-hidden="true">${checked ? "✓" : i + 1}</i><span>${escapeHtml(item)}</span></label>`;
    }).join("");
    $("#project").textContent = unit.project;
    $("#facts").innerHTML = `
      <div><dt>難度</dt><dd>${escapeHtml(unit.level)}</dd></div>
      <div><dt>投入時間</dt><dd>${escapeHtml(unit.estimatedTime)}</dd></div>
      <div><dt>建議節奏</dt><dd>${escapeHtml(unit.rhythm)}</dd></div>
      <div><dt>先備條件</dt><dd>${escapeHtml(unit.prerequisites.join("；"))}</dd></div>`;
    $("#skills").innerHTML = unit.skills.map((skill) => `<span>${escapeHtml(skill)}</span>`).join("");
    $("#outcome").textContent = unit.outcome;

    if (next) {
      $("#next-card").classList.remove("finish");
      $("#next-title").textContent = next.title;
      $("#next-unit").hidden = false;
      $("#next-unit").dataset.unit = String(next.id);
      $("#next-unit").textContent = `前往單元 ${next.order} →`;
    } else {
      $("#next-card").classList.add("finish");
      $("#next-title").textContent = "把你的永續推理，帶進下一場面試。";
      $("#next-unit").hidden = true;
    }

    $$("[data-language]").forEach((button) => {
      const active = button.dataset.language === state.language;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
  }

  function renderRoadmap() {
    $("#roadmap-grid").innerHTML = course.phases.map((phase) => `
      <article style="--phase:${phase.color}">
        <div class="phase-top"><span>${phase.number}</span><small>${phase.weeks}</small></div>
        <p class="phase-short">${escapeHtml(phase.short)}</p><h3>${escapeHtml(phase.title)}</h3>
        <i class="phase-line" aria-hidden="true"></i><p>${escapeHtml(phase.description)}</p>
        <ul>${course.units.filter((unit) => unit.phase === phase.id).map((unit) => `<li><button type="button" data-unit="${unit.id}"><span>${unit.order}</span>${escapeHtml(unit.topic)}</button></li>`).join("")}</ul>
        <footer><span>階段交付</span><strong>${escapeHtml(phase.outcome)}</strong></footer>
      </article>`).join("");
  }

  function renderCases() {
    const items = state.caseFilter === "全部" ? course.cases : course.cases.filter((item) => item.type === state.caseFilter);
    $("#case-grid").innerHTML = items.map((item) => `
      <article>
        <div><span>${escapeHtml(item.type)}</span><b>${escapeHtml(item.code)}</b></div>
        <p>${escapeHtml(item.focus)}</p><h3>${escapeHtml(item.name)}</h3>
        <dl><div><dt>怎麼做</dt><dd>${escapeHtml(item.action)}</dd></div><div><dt>要追問</dt><dd>${escapeHtml(item.watchFor)}</dd></div></dl>
        <a href="${item.url}" target="_blank" rel="noreferrer">查看官方資料 ↗</a>
      </article>`).join("");
  }

  function renderStaticData() {
    $("#capstone-list").innerHTML = course.capstoneChecklist.map((item, i) => `<li><span>${String(i + 1).padStart(2, "0")}</span><strong>${escapeHtml(item)}</strong><i aria-hidden="true">□</i></li>`).join("");
    $("#official-sources").innerHTML = course.officialSources.map((source, i) => `<a href="${source.url}" target="_blank" rel="noreferrer"><span>${String(i + 1).padStart(2, "0")}</span><strong>${escapeHtml(source.label)}</strong><small>${escapeHtml(source.note)}</small><i aria-hidden="true">↗</i></a>`).join("");
  }

  function selectUnit(id, scroll = true) {
    state.selectedId = unitById(id).id;
    state.language = "zh";
    renderUnitList();
    renderLesson();
    $(".outline").classList.remove("open");
    $(".mobile-outline").setAttribute("aria-expanded", "false");
    $(".mobile-outline").textContent = `開啟課程目錄 · ${unitById(id).order}/${course.units.length}`;
    if (scroll) requestAnimationFrame(() => $("#lesson").scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function toggleCompleted() {
    const key = String(state.selectedId);
    state.completed = state.completed.includes(key) ? state.completed.filter((item) => item !== key) : [...state.completed, key];
    save();
    formatProgress();
    renderUnitList();
    renderLesson();
  }

  function toggleExercise(index) {
    const key = `${state.selectedId}-${index}`;
    state.exercises = state.exercises.includes(key) ? state.exercises.filter((item) => item !== key) : [...state.exercises, key];
    save();
    renderLesson();
  }

  document.addEventListener("click", (event) => {
    const unitButton = event.target.closest("[data-unit]");
    if (unitButton) {
      selectUnit(Number(unitButton.dataset.unit));
      return;
    }
    const phaseButton = event.target.closest("[data-phase]");
    if (phaseButton) {
      state.phase = Number(phaseButton.dataset.phase);
      renderFilters();
      renderUnitList();
      return;
    }
    const languageButton = event.target.closest("[data-language]");
    if (languageButton) {
      state.language = languageButton.dataset.language;
      renderLesson();
      return;
    }
    const fontButton = event.target.closest("[data-font]");
    if (fontButton) {
      setFont(fontButton.dataset.font);
      return;
    }
    const caseButton = event.target.closest("[data-case-filter]");
    if (caseButton) {
      state.caseFilter = caseButton.dataset.caseFilter;
      $$("[data-case-filter]").forEach((button) => button.setAttribute("aria-pressed", String(button === caseButton)));
      renderCases();
      return;
    }
    if (event.target.closest("[data-start]")) {
      $("#lesson").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  $("#search").addEventListener("input", (event) => {
    state.query = event.target.value;
    renderUnitList();
  });
  $("#complete-unit").addEventListener("click", toggleCompleted);
  $("#exercises").addEventListener("change", (event) => {
    if (event.target.matches("[data-exercise]")) toggleExercise(Number(event.target.dataset.exercise));
  });
  $(".mobile-outline").addEventListener("click", (event) => {
    const open = $(".outline").classList.toggle("open");
    event.currentTarget.setAttribute("aria-expanded", String(open));
    event.currentTarget.textContent = open ? "收合課程目錄" : `開啟課程目錄 · ${unitById(state.selectedId).order}/${course.units.length}`;
  });
  $("#reset-progress").addEventListener("click", () => {
    if (!window.confirm("確定要清除這台裝置上的單元與練習進度嗎？")) return;
    state.completed = [];
    state.exercises = [];
    save();
    formatProgress();
    renderUnitList();
    renderLesson();
  });

  setFont(state.font);
  renderFilters();
  renderUnitList();
  renderLesson();
  renderRoadmap();
  renderCases();
  renderStaticData();
  formatProgress();
  $(".mobile-outline").textContent = `開啟課程目錄 · 01/${course.units.length}`;
})();
