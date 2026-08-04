"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { course } from "./course-data";

type Language = "zh" | "en";
type FontMode = "general" | "large";
type CaseFilter = "全部" | "國家" | "企業";

const STORAGE = {
  completed: "sustainability-course:completed",
  exercises: "sustainability-course:exercises",
  font: "sustainability-course:font",
};

function readStoredArray(key: string) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export default function CourseApp() {
  const [selectedId, setSelectedId] = useState(1);
  const [language, setLanguage] = useState<Language>("zh");
  const [phaseFilter, setPhaseFilter] = useState(0);
  const [query, setQuery] = useState("");
  const [caseFilter, setCaseFilter] = useState<CaseFilter>("全部");
  const [completed, setCompleted] = useState<string[]>([]);
  const [exerciseDone, setExerciseDone] = useState<string[]>([]);
  const [fontMode, setFontMode] = useState<FontMode>("general");
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const lessonRef = useRef<HTMLElement>(null);
  const discussionRef = useRef<HTMLDivElement>(null);

  const selected = course.units.find((unit) => unit.id === selectedId) ?? course.units[0];
  const phase = course.phases.find((item) => item.id === selected.phase) ?? course.phases[0];
  const media = selected.media[language];
  const selectedIndex = course.units.findIndex((unit) => unit.id === selected.id);
  const nextUnit = course.units[selectedIndex + 1];
  const progress = Math.round((completed.length / course.units.length) * 100);

  const filteredUnits = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("zh-Hant");
    return course.units.filter((unit) => {
      const inPhase = phaseFilter === 0 || unit.phase === phaseFilter;
      const searchable = [unit.title, unit.topic, ...unit.skills, unit.media.zh.channel, unit.media.en.channel]
        .join(" ")
        .toLocaleLowerCase("zh-Hant");
      return inPhase && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [phaseFilter, query]);

  const visibleCases = useMemo(
    () => (caseFilter === "全部" ? course.cases : course.cases.filter((item) => item.type === caseFilter)),
    [caseFilter],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const validIds = new Set(course.units.map((unit) => String(unit.id)));
      setCompleted(readStoredArray(STORAGE.completed).filter((id) => validIds.has(id)));
      setExerciseDone(readStoredArray(STORAGE.exercises));
      setFontMode(window.localStorage.getItem(STORAGE.font) === "large" ? "large" : "general");
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("font-large", fontMode === "large");
    if (hydrated) window.localStorage.setItem(STORAGE.font, fontMode);
    return () => document.documentElement.classList.remove("font-large");
  }, [fontMode, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE.completed, JSON.stringify(completed));
  }, [completed, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE.exercises, JSON.stringify(exerciseDone));
  }, [exerciseDone, hydrated]);

  const giscus = {
    repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID,
    category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
    categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
  };
  const giscusReady = Object.values(giscus).every(Boolean);

  useEffect(() => {
    if (!giscusReady || !discussionRef.current) return;
    const host = discussionRef.current;
    host.replaceChildren();
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", giscus.repo ?? "");
    script.setAttribute("data-repo-id", giscus.repoId ?? "");
    script.setAttribute("data-category", giscus.category ?? "");
    script.setAttribute("data-category-id", giscus.categoryId ?? "");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", "zh-TW");
    host.appendChild(script);
  }, [giscus.category, giscus.categoryId, giscus.repo, giscus.repoId, giscusReady]);

  function selectUnit(id: number, scroll = true) {
    const unit = course.units.find((item) => item.id === id) ?? course.units[0];
    setSelectedId(unit.id);
    setLanguage("zh");
    setOutlineOpen(false);
    if (scroll) window.requestAnimationFrame(() => lessonRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function toggleCompleted() {
    const key = String(selected.id);
    setCompleted((items) => (items.includes(key) ? items.filter((item) => item !== key) : [...items, key]));
  }

  function toggleExercise(index: number) {
    const key = `${selected.id}-${index}`;
    setExerciseDone((items) => (items.includes(key) ? items.filter((item) => item !== key) : [...items, key]));
  }

  function resetProgress() {
    if (!window.confirm("確定要清除這台裝置上的單元與練習進度嗎？")) return;
    setCompleted([]);
    setExerciseDone([]);
  }

  const selectedDone = completed.includes(String(selected.id));

  return (
    <>
      <a className="skip-link" href="#lesson">跳到目前課程</a>
      <div className="page-shell" id="top">
        <header className="topbar">
          <a className="brand" href="#top" aria-label="永續力課程首頁">
            <span className="brand-orbit" aria-hidden="true"><i /></span>
            <span><strong>永續力</strong><small>SDGs → CAREER</small></span>
          </a>
          <nav aria-label="主要導覽">
            <a href="#learn">開始學習</a>
            <a href="#cases">案例雷達</a>
            <a href="#career">求職成果</a>
          </nav>
          <div className="top-actions">
            <button className={fontMode === "general" ? "font-button active" : "font-button"} type="button" aria-pressed={fontMode === "general"} onClick={() => setFontMode("general")}>一般</button>
            <button className={fontMode === "large" ? "font-button active" : "font-button"} type="button" data-font="large" aria-pressed={fontMode === "large"} onClick={() => setFontMode("large")}>大字</button>
            <a className="course-overview-link" href="/courses.html" aria-label="回到課程總覽頁面">← 課程總覽</a>
          </div>
        </header>

        <main>
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-copy">
              <p className="eyebrow"><span>8 WEEKS</span> 大學生永續職涯實作課</p>
              <h1 id="hero-title">不只關心世界，<br /><em>還能提出證據。</em></h1>
              <p className="hero-lede">從 SDGs、各國政策與企業策略開始，學會讀報告、拆指標、查核承諾；最後把一個校園行動，變成履歷上說得清楚的能力。</p>
              <div className="hero-actions">
                <button type="button" onClick={() => lessonRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>開始第一課 <span aria-hidden="true">↘</span></button>
                <a href="#roadmap">先看 8 週路線</a>
              </div>
              <dl className="hero-stats">
                <div><dt>12</dt><dd>實作單元</dd></div>
                <div><dt>24</dt><dd>雙語影音</dd></div>
                <div><dt>08</dt><dd>國家／企業案例</dd></div>
                <div><dt>01</dt><dd>求職證據包</dd></div>
              </dl>
            </div>
            <div className="hero-visual" aria-label="從全球目標到個人職涯的學習路徑">
              <div className="goal-disc">
                <span className="disc-core">17<small>GLOBAL<br />GOALS</small></span>
                <i className="ring ring-one" /><i className="ring ring-two" /><i className="ring ring-three" />
                <b className="node node-a">國家<small>POLICY</small></b>
                <b className="node node-b">企業<small>BUSINESS</small></b>
                <b className="node node-c">你<small>CAREER</small></b>
              </div>
              <div className="signal-card signal-a"><span>35%</span><p>2025 年有趨勢資料的 SDG targets 達到或呈中度進展</p><small>UN SDG REPORT 2025</small></div>
              <div className="signal-card signal-b"><span>18%</span><p>相較 2015 基準倒退：所以要學會讀證據，而非只看承諾</p><small>GLOBAL PROGRESS</small></div>
            </div>
          </section>

          <section className="promise" aria-label="課程轉換">
            <p><span>不是</span> 背完 17 個彩色圖示</p><i aria-hidden="true">→</i>
            <p><span>而是</span> 看懂問題、比較做法、做出證據</p>
            <small>零基礎可學・適合所有科系・每週約 2 小時</small>
          </section>

          <section className="learn" id="learn">
            <button className="mobile-outline" type="button" aria-expanded={outlineOpen} aria-controls="outline" onClick={() => setOutlineOpen((open) => !open)}>
              {outlineOpen ? "收合課程目錄" : `開啟課程目錄 · ${selected.order}/${course.units.length}`}
            </button>
            <aside className={outlineOpen ? "outline open" : "outline"} id="outline">
              <div className="progress-panel">
                <span>YOUR PROGRESS</span><strong>{progress}%</strong>
                <div className="progress-track" role="progressbar" aria-label={`課程完成度 ${progress}%`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><i style={{ width: `${progress}%` }} /></div>
                <p>已完成 {completed.length} / {course.units.length} 單元</p>
              </div>
              <label className="search-box">
                <span aria-hidden="true">⌕</span><span className="sr-only">搜尋單元、技能或頻道</span>
                <input type="search" placeholder="搜尋單元、技能或頻道" autoComplete="off" value={query} onChange={(event) => setQuery(event.target.value)} />
              </label>
              <div className="phase-filters" aria-label="依階段篩選">
                <button type="button" aria-pressed={phaseFilter === 0} onClick={() => setPhaseFilter(0)}>全部</button>
                {course.phases.map((item) => <button key={item.id} type="button" title={item.title} aria-pressed={phaseFilter === item.id} onClick={() => setPhaseFilter(item.id)}>{item.id}</button>)}
              </div>
              <div className="unit-list">
                {filteredUnits.length ? filteredUnits.map((unit) => {
                  const done = completed.includes(String(unit.id));
                  return (
                    <button key={unit.id} type="button" className={unit.id === selected.id ? "active" : ""} aria-current={unit.id === selected.id ? "step" : undefined} onClick={() => selectUnit(unit.id)}>
                      <i className={done ? "done" : ""} aria-hidden="true">{done ? "✓" : unit.order}</i>
                      <span><small>PHASE {unit.phase} · {unit.topic}</small><strong>{unit.title}</strong></span>
                    </button>
                  );
                }) : <p className="empty">找不到符合的單元，試試「碳」、「職涯」或切換階段。</p>}
              </div>
              <button className="reset-button" type="button" onClick={resetProgress}>重設本機學習進度</button>
            </aside>

            <section className="lesson" id="lesson" tabIndex={-1} aria-live="polite" ref={lessonRef}>
              <div className="lesson-crumb"><span>PHASE {phase.number}</span><i>/</i><span>{phase.title}</span><i>/</i><strong>LESSON {selected.order}</strong></div>
              <div className="lesson-toolbar">
                <p><i aria-hidden="true" /><span>精選影音 · {media.duration}</span></p>
                <div className="language-tabs" role="tablist" aria-label="影音語言">
                  <button className={language === "zh" ? "active" : ""} type="button" role="tab" aria-selected={language === "zh"} onClick={() => setLanguage("zh")}>中文</button>
                  <button className={language === "en" ? "active" : ""} type="button" role="tab" aria-selected={language === "en"} onClick={() => setLanguage("en")}>English</button>
                </div>
              </div>
              <div className="video-frame"><iframe title={`${selected.title}｜${media.title}`} src={`https://www.youtube-nocookie.com/embed/${media.videoId}?rel=0&modestbranding=1`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>
              <div className="video-meta">
                <div><span>{language === "zh" ? "中文精選" : "ENGLISH PICK"}</span><strong>{media.title}</strong><small>{media.channel} · {media.duration} · {media.approximateViews}</small></div>
                <a href={`https://www.youtube.com/watch?v=${media.videoId}`} target="_blank" rel="noreferrer">在 YouTube 開啟 ↗</a>
              </div>
              <div className="lesson-heading">
                <div><p>{selected.topic}</p><h2>{selected.title}</h2></div>
                <button id="complete-unit" className={selectedDone ? "done" : ""} type="button" aria-pressed={selectedDone} onClick={toggleCompleted}>{selectedDone ? "✓ 已完成這一課" : "標記本課完成"}</button>
              </div>
              <div className="lesson-layout">
                <div className="lesson-main">
                  <article className="content-card goals-card"><span className="card-number">01</span><div><p className="card-label">LEARNING OBJECTIVES</p><h3>完成後，你能做到</h3><ol id="objectives">{selected.objectives.map((item, index) => <li key={item}><i>{index + 1}</i><span>{item}</span></li>)}</ol></div></article>
                  <article className="content-card theory-card"><span className="card-number">02</span><div><p className="card-label">THINK BEFORE YOU WATCH</p><h3>先帶走三個核心觀念</h3><div className="theory-list">{selected.theory.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>)}</div></div></article>
                  <article className="content-card evidence-card"><span className="card-number">03</span><div><p className="card-label">WHY THESE RESOURCES</p><h3>媒體選擇與查核入口</h3><div className="reasons"><div><b>中</b><p>{selected.media.zh.selectionReason}</p></div><div><b>EN</b><p>{selected.media.en.selectionReason}</p></div></div><a className="source-link" href={selected.source.url} target="_blank" rel="noreferrer">本課官方查核入口｜{selected.source.label} ↗</a><small className="checked-note">影音觀看數為 {course.checkedAt} 查詢時約數，會隨時間變動；著作權歸原作者。</small></div></article>
                  <article className="content-card practice-card"><span className="card-number">04</span><div><p className="card-label">MAKE IT REAL</p><h3>課後實作</h3><div className="exercise-list">{selected.exercises.map((item, index) => {
                    const key = `${selected.id}-${index}`;
                    const checked = exerciseDone.includes(key);
                    return <label className={checked ? "checked" : ""} key={key}><input type="checkbox" checked={checked} onChange={() => toggleExercise(index)} /><i aria-hidden="true">{checked ? "✓" : index + 1}</i><span>{item}</span></label>;
                  })}</div><div className="deliverable"><span>本課交付</span><strong>{selected.project}</strong></div></div></article>
                </div>
                <aside className="lesson-rail">
                  <article className="facts-card"><p className="card-label">LESSON NOTES</p><dl><div><dt>難度</dt><dd>{selected.level}</dd></div><div><dt>投入時間</dt><dd>{selected.estimatedTime}</dd></div><div><dt>建議節奏</dt><dd>{selected.rhythm}</dd></div><div><dt>先備條件</dt><dd>{selected.prerequisites.join("；")}</dd></div></dl><div className="skill-tags">{selected.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></article>
                  <article className="outcome-card"><span>VISIBLE OUTCOME</span><p>{selected.outcome}</p></article>
                  <article className={nextUnit ? "next-card" : "next-card finish"}><small>NEXT LESSON</small><strong>{nextUnit ? nextUnit.title : "把你的永續推理，帶進下一場面試。"}</strong>{nextUnit && <button type="button" onClick={() => selectUnit(nextUnit.id)}>前往單元 {nextUnit.order} →</button>}</article>
                </aside>
              </div>
            </section>
          </section>

          <section className="roadmap-section" id="roadmap">
            <header className="section-heading"><div><span>COURSE ROADMAP</span><h2>八週，把抽象名詞變成行動。</h2></div><p>四個階段都留下可見交付；最後不用說「我對永續很有興趣」，而是直接展示你怎麼研究、判斷與執行。</p></header>
            <div className="roadmap-grid">{course.phases.map((item) => (
              <article key={item.id} style={{ "--phase": item.color } as CSSProperties}>
                <div className="phase-top"><span>{item.number}</span><small>{item.weeks}</small></div>
                <p className="phase-short">{item.short}</p><h3>{item.title}</h3><i className="phase-line" aria-hidden="true" /><p>{item.description}</p>
                <ul>{course.units.filter((unit) => unit.phase === item.id).map((unit) => <li key={unit.id}><button type="button" onClick={() => selectUnit(unit.id)}><span>{unit.order}</span>{unit.topic}</button></li>)}</ul>
                <footer><span>階段交付</span><strong>{item.outcome}</strong></footer>
              </article>
            ))}</div>
          </section>

          <section className="cases-section" id="cases">
            <header className="section-heading inverse"><div><span>CASE RADAR</span><h2>同一個目標，八種做法。</h2></div><p>案例不是成功故事收藏。每張卡同時列出行動與需要追問的地方，練習從承諾一路查到治理與結果。</p></header>
            <div className="case-controls" role="group" aria-label="案例類型">{(["全部", "國家", "企業"] as const).map((filter) => <button key={filter} type="button" aria-pressed={caseFilter === filter} onClick={() => setCaseFilter(filter)}>{filter}</button>)}</div>
            <div className="case-grid">{visibleCases.map((item) => <article key={item.code}><div><span>{item.type}</span><b>{item.code}</b></div><p>{item.focus}</p><h3>{item.name}</h3><dl><div><dt>怎麼做</dt><dd>{item.action}</dd></div><div><dt>要追問</dt><dd>{item.watchFor}</dd></div></dl><a href={item.url} target="_blank" rel="noreferrer">查看官方資料 ↗</a></article>)}</div>
          </section>

          <section className="career-section" id="career">
            <div className="career-copy"><span>CAPSTONE / CAREER EVIDENCE</span><h2>把「我很關心」，<br />改寫成<span>「這是我做到的」。</span></h2><p>結業時，你會有一份可公開的校園永續提案，以及能直接放進履歷、作品集與面試的證據。成果不要求完美，要求可追溯、可查核、說得清楚。</p><button type="button" onClick={() => selectUnit(12)}>查看最後一課 ↗</button></div>
            <div className="career-board"><p>FINAL CHECK / 08 ITEMS</p><ol>{course.capstoneChecklist.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong><i aria-hidden="true">□</i></li>)}</ol><small>完成定義：每一項都能連回一筆觀察、資料、決策或真實回饋。</small></div>
          </section>

          <section className="skills-section" aria-labelledby="skills-title"><header className="section-heading compact"><div><span>SKILL TRANSLATION</span><h2 id="skills-title">不論科系，都有切入點。</h2></div></header><div className="major-grid"><article><span>DATA</span><h3>理工／資訊</h3><p>能源資料、碳盤查、生命週期、系統效率、永續產品與數位工具。</p></article><article><span>BUSINESS</span><h3>商管／財金</h3><p>重大性、供應鏈、永續金融、風險、揭露、商業模式與轉型策略。</p></article><article><span>PEOPLE</span><h3>人文／教育</h3><p>政策、溝通、行為改變、公正轉型、人權、參與設計與影響評估。</p></article><article><span>PLACE</span><h3>設計／社會實踐</h3><p>循環設計、服務系統、場域研究、社區協作與可近性。</p></article></div></section>

          <section className="sources-section" aria-labelledby="sources-title"><header><span>SOURCE DESK</span><h2 id="sources-title">從官方資料開始，不從二手口號結束。</h2><p>課程文字為原創教學內容；影音僅策展與隱私強化嵌入，權利歸原作者。企業案例為學習查核入口，不代表背書或合作。</p></header><div className="source-grid">{course.officialSources.map((source, index) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><span>{String(index + 1).padStart(2, "0")}</span><strong>{source.label}</strong><small>{source.note}</small><i aria-hidden="true">↗</i></a>)}</div></section>

          <section className="discussion-section" aria-label="課程討論">
            <div><span>STUDIO DISCUSSION</span><h2>{giscusReady ? "帶著證據來，也帶著問題離開。" : "討論區準備中"}</h2><p>{giscusReady ? "提出問題時附上來源、推理與目前卡點，讓討論能往下一步前進。" : "設定四個公開 giscus 環境變數後會自動啟用；課程與本機進度可完整使用。"}</p></div>
            {giscusReady ? <div className="giscus-host" ref={discussionRef} /> : <a href="https://giscus.app/zh-TW" target="_blank" rel="noreferrer">查看 giscus 設定方式 ↗</a>}
          </section>
        </main>

        <footer className="site-footer"><div><strong>永續力</strong><span>一門把全球目標翻譯成個人行動的課。</span></div><p>策展查詢日：{course.checkedAt}。觀看數為約數，不代表排名；遇到失效影音，請以同主題官方或教學等值資源替換。</p><a href="/courses.html">回到所有課程 ↗</a></footer>
      </div>
    </>
  );
}
