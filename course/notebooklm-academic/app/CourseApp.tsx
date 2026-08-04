"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { capstoneChecklist, phases, sourceNotes, units, type Language } from "./course-data";

type FontMode = "standard" | "large";

const STORAGE = {
  completed: "gemini-notebook-course:completed",
  exercises: "gemini-notebook-course:exercises",
  font: "gemini-notebook-course:font",
};

function readStoredArray(key: string) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export default function CourseApp() {
  const [selectedId, setSelectedId] = useState(1);
  const [language, setLanguage] = useState<Language>("zh");
  const [query, setQuery] = useState("");
  const [phaseFilter, setPhaseFilter] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [exerciseDone, setExerciseDone] = useState<string[]>([]);
  const [fontMode, setFontMode] = useState<FontMode>("standard");
  const [hydrated, setHydrated] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const lessonRef = useRef<HTMLElement>(null);
  const discussionRef = useRef<HTMLDivElement>(null);

  const selected = units.find((unit) => unit.id === selectedId) ?? units[0];
  const phase = phases.find((item) => item.id === selected.phase) ?? phases[0];
  const media = selected.media[language];
  const selectedIndex = units.findIndex((unit) => unit.id === selected.id);
  const nextUnit = units[selectedIndex + 1];
  const progress = Math.round((completed.length / units.length) * 100);

  const filteredUnits = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("zh-Hant");
    return units.filter((unit) => {
      const matchesPhase = phaseFilter === 0 || unit.phase === phaseFilter;
      const haystack = [unit.title, unit.subtitle, unit.topic, unit.skills.join(" "), unit.project].join(" ").toLocaleLowerCase("zh-Hant");
      return matchesPhase && (!needle || haystack.includes(needle));
    });
  }, [phaseFilter, query]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setCompleted(readStoredArray(STORAGE.completed));
      setExerciseDone(readStoredArray(STORAGE.exercises));
      setFontMode(window.localStorage.getItem(STORAGE.font) === "large" ? "large" : "standard");
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE.completed, JSON.stringify(completed));
  }, [completed, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE.exercises, JSON.stringify(exerciseDone));
  }, [exerciseDone, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE.font, fontMode);
  }, [fontMode, hydrated]);

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
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", "zh-TW");
    host.appendChild(script);
  }, [giscus.category, giscus.categoryId, giscus.repo, giscus.repoId, giscusReady]);

  function selectUnit(id: number) {
    setSelectedId(id);
    setLanguage("zh");
    setNavOpen(false);
    window.requestAnimationFrame(() => lessonRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function toggleCompleted(id: number) {
    const key = String(id);
    setCompleted((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  }

  function toggleExercise(unitId: number, index: number) {
    const key = `${unitId}-${index}`;
    setExerciseDone((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  }

  return (
    <div className={fontMode === "large" ? "site font-large" : "site"}>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="回到課程首頁">
          <span className="brand-mark" aria-hidden="true">EF</span>
          <span><b>EVIDENCE FIRST</b><small>ACADEMIC RESEARCH LAB</small></span>
        </a>
        <nav aria-label="主要導覽">
          <a href="#workspace">開始上課</a>
          <a href="#roadmap">學習路徑</a>
          <a href="#capstone">結業作品</a>
          <a href="#method">課程方法</a>
        </nav>
        <div className="font-control" aria-label="字級選擇">
          <button type="button" className={fontMode === "standard" ? "active" : ""} aria-pressed={fontMode === "standard"} onClick={() => setFontMode("standard")}>標準</button>
          <button type="button" className={fontMode === "large" ? "active" : ""} aria-pressed={fontMode === "large"} onClick={() => setFontMode("large")}>大字</button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">GEMINI NOTEBOOK <span>原 NOTEBOOKLM</span></p>
            <h1>不要只問 AI。<br /><em>建立能被查證的研究。</em></h1>
            <p className="hero-lede">從一個問題開始，走過搜尋、證據矩陣、批判綜整、引用查核與 Zotero 知識庫。最後交出的不是聊天紀錄，而是一份讀者能理解、審查者能追溯的研究證據卷宗。</p>
            <div className="hero-actions">
              <button type="button" onClick={() => lessonRef.current?.scrollIntoView({ behavior: "smooth" })}>從第 1 單元開始 <span>↘</span></button>
              <a href="#roadmap">先看 7 週路線</a>
            </div>
            <dl className="hero-stats">
              <div><dt>07</dt><dd>週完整路徑</dd></div>
              <div><dt>14</dt><dd>個實作單元</dd></div>
              <div><dt>28</dt><dd>支雙語影音</dd></div>
              <div><dt>01</dt><dd>份研究卷宗</dd></div>
            </dl>
          </div>

          <div className="hero-visual" aria-label="從研究問題到可查證研究輸出的流程圖">
            <div className="grid-paper" aria-hidden="true" />
            <p className="visual-label">THE EVIDENCE CHAIN / 2026</p>
            <div className="question-card"><small>START WITH</small><b>一個好問題</b><span>範圍 · 對象 · 判準</span></div>
            <div className="evidence-stack" aria-hidden="true">
              <i /><i /><i /><i />
              <strong>12+</strong><span>SOURCES</span>
            </div>
            <div className="claim-card"><small>END WITH</small><b>一條可追溯主張</b><span>CLAIM → EVIDENCE → SOURCE</span></div>
            <svg className="evidence-line" viewBox="0 0 720 560" role="img" aria-label="證據流向線">
              <path d="M120 120 C280 100 210 275 360 280 S520 430 630 395" />
              <circle cx="120" cy="120" r="8" /><circle cx="360" cy="280" r="8" /><circle cx="630" cy="395" r="8" />
            </svg>
            <div className="stamp" aria-hidden="true">VERIFY<br />BEFORE<br />YOU CITE</div>
          </div>
        </section>

        <section className="principles" aria-label="課程核心原則">
          <b>01</b><span>問題先於工具</span><i>×</i>
          <b>02</b><span>證據先於文筆</span><i>×</i>
          <b>03</b><span>查證先於引用</span>
          <small>適合研究生、知識工作者，以及正在準備專題、論文或專業報告的人。</small>
        </section>

        <section className="workspace" id="workspace" ref={lessonRef} tabIndex={-1}>
          <button type="button" className="mobile-curriculum-button" aria-expanded={navOpen} aria-controls="curriculum-panel" onClick={() => setNavOpen((current) => !current)}>
            {navOpen ? "關閉課綱" : `打開課綱 · ${selected.order}/${units.length}`}
          </button>

          <aside className={navOpen ? "curriculum open" : "curriculum"} id="curriculum-panel">
            <div className="curriculum-progress">
              <div><span>YOUR PROGRESS</span><strong>{progress}%</strong></div>
              <div className="progress-track" role="progressbar" aria-label={`課程進度 ${progress}%`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><i style={{ width: `${progress}%` }} /></div>
              <p>完成 {completed.length} / {units.length} 單元 · 資料只存在這台裝置</p>
            </div>

            <label className="search">
              <span className="sr-only">搜尋單元、技能或交付物</span>
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋單元、技能、交付物…" />
              <i aria-hidden="true">⌕</i>
            </label>

            <div className="phase-filters" aria-label="依階段篩選">
              <button type="button" className={phaseFilter === 0 ? "active" : ""} aria-pressed={phaseFilter === 0} onClick={() => setPhaseFilter(0)}>全部</button>
              {phases.map((item) => <button type="button" key={item.id} className={phaseFilter === item.id ? "active" : ""} aria-pressed={phaseFilter === item.id} onClick={() => setPhaseFilter(item.id)} title={item.title}>{item.id}</button>)}
            </div>

            <div className="lesson-list">
              {filteredUnits.length ? filteredUnits.map((unit) => {
                const done = completed.includes(String(unit.id));
                return (
                  <button type="button" key={unit.id} className={unit.id === selected.id ? "active" : ""} aria-current={unit.id === selected.id ? "step" : undefined} onClick={() => selectUnit(unit.id)}>
                    <i className={done ? "done" : ""} aria-hidden="true">{done ? "✓" : unit.order}</i>
                    <span><small>PHASE {unit.phase} · {unit.topic}</small><b>{unit.title}</b></span>
                  </button>
                );
              }) : <p className="empty-state">找不到符合條件的單元。試試其他關鍵字或清除階段篩選。</p>}
            </div>
          </aside>

          <article className="lesson">
            <div className="lesson-crumb"><span>PHASE {phase.number}</span><i>/</i><span>{phase.title}</span><i>/</i><b>LESSON {selected.order}</b></div>
            <div className="lesson-heading">
              <div><p>{selected.topic}</p><h2>{selected.title}</h2><span>{selected.subtitle}</span></div>
              <button type="button" className={completed.includes(String(selected.id)) ? "done" : ""} aria-pressed={completed.includes(String(selected.id))} onClick={() => toggleCompleted(selected.id)}>
                {completed.includes(String(selected.id)) ? "✓ 已完成" : "標記完成"}
              </button>
            </div>

            <div className="video-toolbar">
              <p><span className="pulse" aria-hidden="true" /> 策展影音 · {media.duration}</p>
              <div className="language-switch" role="tablist" aria-label="影音語言">
                <button type="button" role="tab" aria-selected={language === "zh"} className={language === "zh" ? "active" : ""} onClick={() => setLanguage("zh")}>中文</button>
                <button type="button" role="tab" aria-selected={language === "en"} className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>English</button>
              </div>
            </div>
            <div className="video-frame">
              <iframe key={`${selected.id}-${language}`} src={`https://www.youtube-nocookie.com/embed/${media.videoId}?rel=0&modestbranding=1`} title={`${selected.title}：${media.title}`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
            </div>
            <div className="video-meta">
              <div><span>{language === "zh" ? "中文選片" : "ENGLISH PICK"}</span><b>{media.title}</b><small>{media.channel} · {media.duration} · {media.approximateViews}</small></div>
              <a href={`https://www.youtube.com/watch?v=${media.videoId}`} target="_blank" rel="noreferrer">在 YouTube 開啟 ↗</a>
            </div>

            <div className="lesson-grid">
              <div className="lesson-main">
                <section className="content-card objectives-card">
                  <span className="card-index">01</span><div><p className="card-kicker">LEARNING OBJECTIVES</p><h3>完成後，你能做到</h3>
                  <ol className="objective-list">{selected.objectives.map((item, index) => <li key={item}><i>{index + 1}</i><span>{item}</span></li>)}</ol></div>
                </section>
                <section className="content-card theory-card">
                  <span className="card-index">02</span><div><p className="card-kicker">CORE IDEAS</p><h3>先懂原理，再碰按鈕</h3>
                  <div className="theory-list">{selected.theory.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>)}</div></div>
                </section>
                <section className="content-card curation-card">
                  <span className="card-index">03</span><div><p className="card-kicker">CURATION NOTES</p><h3>為什麼選這兩支</h3>
                  <div className="curation-list">{(["zh", "en"] as Language[]).map((lang) => <div key={lang}><b>{lang === "zh" ? "中" : "EN"}</b><p>{selected.media[lang].selectionReason}</p></div>)}</div>
                  <p className="checked-note">影音可用性最後查核：{selected.media.zh.checkedAt}。觀看數為選片時約數；介面與功能可能變更。</p></div>
                </section>
                <section className="content-card practice-card">
                  <span className="card-index">04</span><div><p className="card-kicker">PRACTICE LADDER</p><h3>由小到大的實作</h3>
                  <div className="exercise-list">{selected.exercises.map((exercise, index) => {
                    const key = `${selected.id}-${index}`;
                    const checked = exerciseDone.includes(key);
                    return <label key={exercise} className={checked ? "checked" : ""}><input type="checkbox" checked={checked} onChange={() => toggleExercise(selected.id, index)} /><i aria-hidden="true">{checked ? "✓" : index + 1}</i><span>{exercise}</span></label>;
                  })}</div>
                  <div className="artifact-callout"><span>本單元交付物</span><b>{selected.project}</b></div></div>
                </section>
              </div>

              <aside className="lesson-rail">
                <section className="facts-card"><p className="card-kicker">LESSON BRIEF</p><dl><div><dt>建議節奏</dt><dd>{selected.rhythm}</dd></div><div><dt>先備條件</dt><dd>{selected.prerequisites}</dd></div></dl><div className="skill-tags">{selected.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></section>
                <section className="outcome-card"><span>SUCCESS LOOKS LIKE</span><p>{selected.outcome}</p></section>
                {nextUnit ? <section className="next-card"><small>NEXT / LESSON {nextUnit.order}</small><b>{nextUnit.title}</b><button type="button" onClick={() => selectUnit(nextUnit.id)}>前往下一單元 →</button></section> : <section className="next-card finish"><small>YOU MADE IT</small><b>整理結業作品，邀請一位同儕抽查。</b><a href="#capstone">查看交付清單 →</a></section>}
              </aside>
            </div>
          </article>
        </section>

        <section className="roadmap-section" id="roadmap">
          <div className="section-heading"><div><p className="eyebrow">7-WEEK ROADMAP</p><h2>從問題，到證據，再到交付。</h2></div><p>每週完成兩個單元與一組可以保存的研究產物。建議用同一題貫穿全課，讓每次練習都累積到結業作品。</p></div>
          <div className="roadmap-grid">
            {phases.map((item) => <article key={item.id} style={{ "--phase": item.color } as React.CSSProperties}>
              <div className="phase-top"><span>{item.number}</span><small>WEEK {item.id}</small></div><p>{item.short}</p><h3>{item.title}</h3><i className="phase-stroke" /><p className="phase-description">{item.description}</p>
              <ul>{units.filter((unit) => unit.phase === item.id).map((unit) => <li key={unit.id}><button type="button" onClick={() => selectUnit(unit.id)}><span>{unit.order}</span>{unit.title}</button></li>)}</ul>
              <footer><span>WEEKLY OUTPUT</span><b>{item.deliverable}</b></footer>
            </article>)}
          </div>
        </section>

        <section className="capstone-section" id="capstone">
          <div className="capstone-copy"><span className="eyebrow">CAPSTONE / RESEARCH DOSSIER</span><h2>結業不是考試，<br /><em>是一份研究證據卷宗。</em></h2><p>選一個真實問題，用至少 12 個合格來源完成 1,500–2,000 字研究簡報。把搜尋、選擇、抽取、綜整與修訂過程一起交付，讓別人能沿著你的證據路徑重做一次。</p><button type="button" onClick={() => selectUnit(14)}>前往結業單元 →</button></div>
          <div className="capstone-board"><p>FINAL DELIVERY / 07 FILES</p><ol>{capstoneChecklist.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b><i>↗</i></li>)}</ol><small>最低通過條件：同儕隨機抽查 3 條主張，均能在兩步內回到原始來源。</small></div>
        </section>

        <section className="method-section" id="method">
          <div className="section-heading"><div><p className="eyebrow">COURSE METHOD & SOURCES</p><h2>課程方法與來源</h2></div><p>本課保留參考課「匯入、搜尋、術語、全貌、提問、驗證、累積」的學習邏輯，重新撰寫為原創 7 週研究流程，並補上倫理、方法、引用與可重現性。</p></div>
          <div className="method-grid">
            <article><span>01</span><h3>教學內容原創</h3><p>沒有複製參考課的專有教材、提示詞、人物、品牌資產或付費內容；視覺只借鑑清楚的卡片層級與高對比節奏。</p></article>
            <article><span>02</span><h3>雙語影音策展</h3><p>每單元各一支中文與英文主教材，共 28 支不重複影片。頁面說明選片理由、角色與限制，並採 YouTube 隱私增強嵌入。</p></article>
            <article><span>03</span><h3>證據優先</h3><p>官方文件用來核對功能與產品現況；所有 AI 答案都視為待查證草稿，引用必須回到原始來源與語境。</p></article>
          </div>
          <div className="source-grid">{sourceNotes.map((source) => <a key={source.href} href={source.href} target="_blank" rel="noreferrer"><span>{source.label}</span><b>{source.title}</b><p>{source.body}</p><i>閱讀官方來源 ↗</i></a>)}</div>
        </section>

        <section className="discussion-section">
          <div className="discussion-heading"><p className="eyebrow">DISCUSSION</p><h2>把你的問題，放進研究社群。</h2><p>分享檢索式、難以判讀的證據、相互矛盾的結果，或請同學抽查你的主張。高品質討論從可重現的上下文開始。</p></div>
          <div className="giscus-host" ref={discussionRef}>
            {!giscusReady && <div className="giscus-setup"><span>?</span><div><b>討論區尚未啟用</b><p>在部署環境設定四個 <code>NEXT_PUBLIC_GISCUS_*</code> 變數，即可載入 GitHub Discussions。</p></div><a href="https://giscus.app/zh-TW" target="_blank" rel="noreferrer">查看設定方式 ↗</a></div>}
          </div>
        </section>
      </main>

      <footer className="site-footer"><div><b>EVIDENCE FIRST</b><span>Gemini Notebook 學術研究實戰</span></div><p>Gemini Notebook / NotebookLM 為 Google 產品名稱。本課為獨立策展的免費教育資源，與 Google 及影片作者無隸屬關係；影片權利屬原頻道。</p><a href="/courses.html">返回所有課程 ↗</a></footer>
    </div>
  );
}
