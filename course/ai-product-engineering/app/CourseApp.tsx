"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { capstoneChecklist, comparison, phases, units } from "./course-data";

type Language = "zh" | "en";
type FontMode = "general" | "large";

const STORAGE = {
  completed: "ai-product-engineering:completed",
  exercises: "ai-product-engineering:exercises",
  font: "ai-product-engineering:font",
};

function storedArray(key: string) {
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "[]") as string[];
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
  const [fontMode, setFontMode] = useState<FontMode>("general");
  const [hydrated, setHydrated] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const lessonRef = useRef<HTMLElement>(null);
  const discussionRef = useRef<HTMLDivElement>(null);

  const selected = units.find((unit) => unit.id === selectedId) ?? units[0];
  const phase = phases.find((item) => item.id === selected.phase) ?? phases[0];
  const media = selected.media[language];
  const currentIndex = units.findIndex((unit) => unit.id === selected.id);
  const nextUnit = units[currentIndex + 1];
  const progress = Math.round((completed.length / units.length) * 100);

  const filteredUnits = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("zh-Hant");
    return units.filter((unit) => {
      const matchesPhase = phaseFilter === 0 || unit.phase === phaseFilter;
      const haystack = [unit.title, unit.topic, ...unit.skills, unit.media.zh.channel, unit.media.en.channel]
        .join(" ")
        .toLocaleLowerCase("zh-Hant");
      return matchesPhase && (!needle || haystack.includes(needle));
    });
  }, [phaseFilter, query]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setCompleted(storedArray(STORAGE.completed));
      setExerciseDone(storedArray(STORAGE.exercises));
      setFontMode(window.localStorage.getItem(STORAGE.font) === "large" ? "large" : "general");
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE.completed, JSON.stringify(completed));
  }, [completed, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE.exercises, JSON.stringify(exerciseDone));
  }, [exerciseDone, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE.font, fontMode);
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
    setCompleted((items) => (items.includes(key) ? items.filter((item) => item !== key) : [...items, key]));
  }

  function toggleExercise(unitId: number, index: number) {
    const key = `${unitId}-${index}`;
    setExerciseDone((items) => (items.includes(key) ? items.filter((item) => item !== key) : [...items, key]));
  }

  return (
    <div className={fontMode === "large" ? "course-app large-type" : "course-app"}>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="AI 產品工程課程首頁">
          <span className="brand-chip">AIP/12</span>
          <span><b>AI 產品工程</b><small>BUILD WHAT HOLDS</small></span>
        </a>
        <nav aria-label="主要導覽">
          <a href="#workspace">開始學習</a>
          <a href="#roadmap">課程地圖</a>
          <a href="#capstone">結業作品</a>
        </nav>
        <div className="type-toggle" aria-label="字級選擇">
          <button type="button" className={fontMode === "general" ? "active" : ""} aria-pressed={fontMode === "general"} onClick={() => setFontMode("general")}>一般</button>
          <button type="button" className={fontMode === "large" ? "active" : ""} aria-pressed={fontMode === "large"} onClick={() => setFontMode("large")}>大字</button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><span>2026</span> PRODUCT ENGINEERING FOR THE AI ERA</p>
            <h1>別只叫 AI<br />把東西<span>做出來。</span></h1>
            <p className="hero-lede">把它做對、驗收、守住，再可靠上線。這門課從產品風險出發，帶你完成一個有測試、有來源、有成本邊界、出錯能復原的 AI 產品。</p>
            <div className="hero-actions">
              <button type="button" onClick={() => lessonRef.current?.scrollIntoView({ behavior: "smooth" })}>開始第一課 <span aria-hidden="true">↘</span></button>
              <a href="#upgrade">為什麼更完整？</a>
            </div>
            <dl className="hero-stats">
              <div><dt>12</dt><dd>完整實作單元</dd></div>
              <div><dt>24</dt><dd>中英雙語影音</dd></div>
              <div><dt>18+</dt><dd>小時學習與實作</dd></div>
              <div><dt>01</dt><dd>可公開驗收產品</dd></div>
            </dl>
          </div>
          <div className="hero-system" aria-label="AI 產品工程循環示意">
            <div className="system-head"><span>PRODUCT_SYSTEM.map</span><i>LIVE</i></div>
            <div className="system-node node-user"><small>INPUT</small><b>真實任務</b><span>使用者不是 prompt</span></div>
            <div className="system-arrow">↓</div>
            <div className="system-row">
              <div className="system-node"><small>CONTRACT</small><b>規格與邊界</b><span>成功、失敗、權限</span></div>
              <div className="system-node hot"><small>MODEL</small><b>AI 能力</b><span>輸出、成本、Eval</span></div>
            </div>
            <div className="system-arrow">↓</div>
            <div className="system-node node-proof"><small>PROOF</small><b>測試與營運證據</b><span>品質 · 觀測 · 回滾</span></div>
            <div className="system-log"><span>✓ task_success</span><span>✓ source_traceable</span><span>✓ rollback_ready</span></div>
          </div>
        </section>

        <section className="upgrade" id="upgrade" aria-labelledby="upgrade-title">
          <div className="upgrade-intro"><p className="eyebrow">THE UPGRADE</p><h2 id="upgrade-title">從「會做」升級成<br /><span>「做得住」。</span></h2><p>保留參考課程從零到全端產品的骨架，再補上最容易讓 Demo 在真實世界失敗的工程能力。</p></div>
          <div className="comparison-list">
            {comparison.map((item, index) => <article key={item.gap}><span>{String(index + 1).padStart(2, "0")}</span><p>{item.gap}</p><i aria-hidden="true">→</i><strong>{item.upgrade}</strong></article>)}
          </div>
        </section>

        <section className="workspace" id="workspace" ref={lessonRef} tabIndex={-1}>
          <button className="mobile-nav" type="button" aria-expanded={navOpen} aria-controls="curriculum" onClick={() => setNavOpen((value) => !value)}>
            {navOpen ? "收合課程目錄" : `開啟課程目錄 · ${selected.order}/${units.length}`}
          </button>
          <aside className={navOpen ? "curriculum open" : "curriculum"} id="curriculum">
            <div className="progress-box">
              <div><span>LOCAL PROGRESS</span><strong>{progress}%</strong></div>
              <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label={`課程完成度 ${progress}%`}><i style={{ width: `${progress}%` }} /></div>
              <small>已完成 {completed.length} / {units.length} · 儲存在這台裝置</small>
            </div>
            <label className="search"><span aria-hidden="true">⌕</span><span className="sr-only">搜尋單元、技能或頻道</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋單元、技能或頻道" /></label>
            <div className="phase-filters" aria-label="依階段篩選">
              <button type="button" className={phaseFilter === 0 ? "active" : ""} aria-pressed={phaseFilter === 0} onClick={() => setPhaseFilter(0)}>ALL</button>
              {phases.map((item) => <button type="button" key={item.id} className={phaseFilter === item.id ? "active" : ""} aria-pressed={phaseFilter === item.id} onClick={() => setPhaseFilter(item.id)} title={item.title}>{item.id}</button>)}
            </div>
            <div className="unit-list">
              {filteredUnits.length ? filteredUnits.map((unit) => {
                const done = completed.includes(String(unit.id));
                return <button type="button" key={unit.id} className={unit.id === selected.id ? "active" : ""} aria-current={unit.id === selected.id ? "step" : undefined} onClick={() => selectUnit(unit.id)}>
                  <i className={done ? "done" : ""}>{done ? "✓" : unit.order}</i><span><small>P{unit.phase} / {unit.topic}</small><b>{unit.title}</b></span>
                </button>;
              }) : <p className="empty">找不到符合的單元，請換個關鍵字。</p>}
            </div>
          </aside>

          <article className="lesson">
            <div className="lesson-kicker"><span>PHASE {selected.phase}</span><i>/</i><span>{phase.code}</span><i>/</i><b>LESSON {selected.order}</b></div>
            <div className="lesson-head">
              <div><p>{selected.topic}</p><h2>{selected.title}</h2><div className="meta"><span>{selected.level}</span><span>{selected.estimatedTime}</span><span>{selected.skills.length} 項技能</span></div></div>
              <button className={completed.includes(String(selected.id)) ? "complete done" : "complete"} type="button" aria-pressed={completed.includes(String(selected.id))} onClick={() => toggleCompleted(selected.id)}>{completed.includes(String(selected.id)) ? "✓ 已完成" : "標記本課完成"}</button>
            </div>

            <section className="media-card" aria-label="精選影音">
              <div className="media-toolbar"><div><span>CURATED VIDEO</span><small>查核：{media.checkedAt}</small></div><div className="language-tabs" role="tablist" aria-label="影音語言"><button type="button" role="tab" aria-selected={language === "zh"} className={language === "zh" ? "active" : ""} onClick={() => setLanguage("zh")}>中文</button><button type="button" role="tab" aria-selected={language === "en"} className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>English</button></div></div>
              <div className="video-frame"><iframe key={`${selected.id}-${language}`} src={`https://www.youtube-nocookie.com/embed/${media.videoId}?rel=0&modestbranding=1`} title={`${selected.title}｜${media.title}`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>
              <div className="media-info"><div><span>{language === "zh" ? "中文精選" : "ENGLISH PICK"}</span><h3>{media.title}</h3><p>{media.channel} · {media.duration} · {media.approximateViews}</p></div><a href={`https://www.youtube.com/watch?v=${media.videoId}`} target="_blank" rel="noreferrer">在 YouTube 開啟 ↗</a></div>
              <div className="selection-reason"><span>WHY THIS ONE</span><p>{media.selectionReason}</p></div>
            </section>

            <section className="content-block objectives"><header><span>01</span><h3>這一課要做到</h3></header><div className="two-col">{selected.objectives.map((item, index) => <article key={item}><i>{index + 1}</i><p>{item}</p></article>)}</div></section>
            <section className="content-block"><header><span>02</span><h3>先讀懂，再動手</h3></header><div className="theory-list">{selected.theory.map((item, index) => <article key={item}><b>{["核心模型", "主要方法", "風險邊界"][index]}</b><p>{item}</p></article>)}</div></section>
            <section className="prereq"><span>PREREQUISITES</span><div>{selected.prerequisites.map((item) => <p key={item}>✓ {item}</p>)}</div><small>建議節奏｜{selected.rhythm}</small></section>
            <section className="content-block exercises"><header><span>03</span><h3>三層實作任務</h3></header><div className="exercise-list">{selected.exercises.map((item, index) => {
              const key = `${selected.id}-${index}`; const done = exerciseDone.includes(key);
              return <label key={item} className={done ? "done" : ""}><input type="checkbox" checked={done} onChange={() => toggleExercise(selected.id, index)} /><span><small>{["REPRODUCE", "DIAGNOSE", "TRANSFER"][index]}</small><b>{item}</b></span></label>;
            })}</div></section>
            <section className="artifact"><div><span>DELIVERABLE</span><h3>{selected.project}</h3><p>{selected.outcome}</p></div><div className="skill-tags">{selected.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></section>
            <div className="lesson-next"><div><small>{nextUnit ? "NEXT LESSON" : "CAPSTONE READY"}</small><strong>{nextUnit ? nextUnit.title : "完成結業作品與事故演練"}</strong></div>{nextUnit ? <button type="button" onClick={() => selectUnit(nextUnit.id)}>下一課 →</button> : <a href="#capstone">查看結業清單 →</a>}</div>
          </article>
        </section>

        <section className="roadmap" id="roadmap">
          <div className="section-intro"><p className="eyebrow">FIVE PHASES</p><h2>每一階段都留下<br />可檢查的證據。</h2><p>不是看完影片就往下走；每一階段都有明確退出條件，後一階段只建立在已驗收的成果上。</p></div>
          <div className="phase-grid">{phases.map((item) => <article key={item.id}><span>{String(item.id).padStart(2, "0")}</span><small>{item.code}</small><h3>{item.title}</h3><p>{item.description}</p><strong>EXIT → {item.outcome}</strong></article>)}</div>
        </section>

        <section className="capstone" id="capstone">
          <div className="capstone-copy"><p className="eyebrow">CAPSTONE / SHIP WITH PROOF</p><h2>最後不是九個 Demo，<br />是一個<span>做得住的產品。</span></h2><p>你會保留完整推理、測試與營運證據，讓作品不只好看，也能回答「為什麼這樣做、如何知道有效、出錯怎麼辦」。</p><a href="#workspace">回到課程工作區 ↑</a></div>
          <ol className="checklist">{capstoneChecklist.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>)}</ol>
        </section>

        <section className="source-note">
          <div><span>REFERENCE & RIGHTS</span><h2>研究骨架，重新設計學習成果。</h2></div>
          <p>本課以 Hahow「AI Coding 無痛上手」公開頁面的主題與 9 章 59 單元架構作為研究起點（查閱日：2026-08-03），保留從零到全端產品的價值鏈，並重新撰寫所有教學文字、練習與作品要求。<a href="https://hahow.in/courses/671ccc1ceebc1c6fd62bc08c" target="_blank" rel="noreferrer">查看參考課程 ↗</a></p>
          <p>影音著作權屬原創作者與 YouTube 頻道；本站僅提供隱私增強嵌入、來源連結、近似觀看訊號與選片理由，不代表合作或背書。觀看數為查核當日近似值，可能持續變動。</p>
        </section>

        <section className="discussion">
          <div><p className="eyebrow">COURSE DISCUSSION</p><h2>帶著證據提問。</h2><p>建議附上重現步驟、預期、實際結果、截圖或可公開 repository；請勿貼上 API key、個資或未遮蔽的日誌。</p></div>
          {giscusReady ? <div className="giscus-host" ref={discussionRef} /> : <div className="discussion-empty"><span>⌁</span><div><h3>討論區準備中</h3><p>設定四個公開 giscus 環境變數後會自動啟用；課程其他功能不受影響。</p><code>NEXT_PUBLIC_GISCUS_REPO · REPO_ID · CATEGORY · CATEGORY_ID</code></div></div>}
        </section>
      </main>
      <footer><strong>AI PRODUCT ENGINEERING / 2026</strong><p>原創課程架構與教學文字 · 精選影音權利屬各創作者 · 學習進度只儲存在本機瀏覽器</p></footer>
    </div>
  );
}
