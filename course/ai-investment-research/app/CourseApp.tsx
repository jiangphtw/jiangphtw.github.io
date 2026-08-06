"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { capstoneChecklist, comparison, phases, units } from "./course-data";

type Language = "zh" | "en";
type FontMode = "general" | "large";

const STORAGE = {
  completed: "ai-investment-research:completed",
  exercises: "ai-investment-research:exercises",
  font: "ai-investment-research:font",
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
        <a className="brand" href="#top" aria-label="AI 投資研究工程課程首頁">
          <span className="brand-chip">AIR/08</span>
          <span><b>AI 投資研究工程</b><small>EVIDENCE BEFORE ANSWERS</small></span>
        </a>
        <nav aria-label="主要導覽"><a href="#workspace">開始學習</a><a href="#roadmap">課程地圖</a><a href="#capstone">結業作品</a></nav>
        <div className="topbar-tools">
          <div className="type-toggle" aria-label="字級選擇">
            <button type="button" className={fontMode === "general" ? "active" : ""} aria-pressed={fontMode === "general"} onClick={() => setFontMode("general")}>一般</button>
            <button type="button" className={fontMode === "large" ? "active" : ""} aria-pressed={fontMode === "large"} onClick={() => setFontMode("large")}>大字</button>
          </div>
          <a className="course-overview-link" href="/courses.html">← 課程總覽</a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><span>2026</span> AI × INVESTMENT RESEARCH</p>
            <h1>別讓 AI<br />替你<span>假裝確定。</span></h1>
            <p className="hero-lede">從來源、財報與估值，到回測、風險與可靠自動化。你會完成一個會引用、會拒答、有人覆核、出錯能停的 AI 投資研究助理。</p>
            <div className="hero-actions">
              <button type="button" onClick={() => lessonRef.current?.scrollIntoView({ behavior: "smooth" })}>開始第一課 <span aria-hidden="true">↘</span></button>
              <a href="#upgrade">看它好在哪裡</a>
            </div>
            <dl className="hero-stats">
              <div><dt>08</dt><dd>深度實作單元</dd></div><div><dt>16</dt><dd>中英雙語影音</dd></div><div><dt>16+</dt><dd>小時學習與實作</dd></div><div><dt>01</dt><dd>可稽核研究助理</dd></div>
            </dl>
            <p className="finance-warning">教學用途，不提供個別投資建議；投資有風險，AI 輸出必須經來源查核與人類判斷。</p>
          </div>
          <div className="hero-system" aria-label="可稽核 AI 投資研究流程">
            <div className="system-head"><span>RESEARCH_LEDGER.run</span><i>HUMAN IN LOOP</i></div>
            <div className="system-node node-user"><small>QUESTION</small><b>決策契約</b><span>目標 · 時點 · 風險</span></div>
            <div className="system-arrow">↓</div>
            <div className="system-row">
              <div className="system-node"><small>EVIDENCE</small><b>原始來源</b><span>申報 · 期間 · 版本</span></div>
              <div className="system-node hot"><small>ANALYSIS</small><b>AI 協作</b><span>引用 · 反證 · 拒答</span></div>
            </div>
            <div className="system-arrow">↓</div>
            <div className="system-node node-proof"><small>DECISION</small><b>人工覆核與停機</b><span>風險 · 成本 · 稽核</span></div>
            <div className="system-log"><span>✓ source_traceable</span><span>✓ as_of_locked</span><span>✓ no_auto_trade</span></div>
          </div>
        </section>

        <section className="upgrade" id="upgrade" aria-labelledby="upgrade-title">
          <div className="upgrade-intro"><p className="eyebrow">THE UPGRADE</p><h2 id="upgrade-title">不是更多工具，<br /><span>是更少盲點。</span></h2><p>保留參考課程的財報、估值、量化與自動化主線，補上會真正決定結果能否信任的研究工程。</p></div>
          <div className="comparison-list">{comparison.map((item, index) => <article key={item.gap}><span>{String(index + 1).padStart(2, "0")}</span><p>{item.gap}</p><i aria-hidden="true">→</i><strong>{item.upgrade}</strong></article>)}</div>
        </section>

        <section className="workspace" id="workspace" ref={lessonRef} tabIndex={-1}>
          <button className="mobile-nav" type="button" aria-expanded={navOpen} aria-controls="curriculum" onClick={() => setNavOpen((value) => !value)}>{navOpen ? "收合課程目錄" : `開啟課程目錄 · ${selected.order}/${units.length}`}</button>
          <aside className={navOpen ? "curriculum open" : "curriculum"} id="curriculum">
            <div className="progress-box"><div><span>LOCAL PROGRESS</span><strong>{progress}%</strong></div><div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label={`課程完成度 ${progress}%`}><i style={{ width: `${progress}%` }} /></div><small>已完成 {completed.length} / {units.length} · 儲存在這台裝置</small></div>
            <label className="search"><span aria-hidden="true">⌕</span><span className="sr-only">搜尋單元、技能或頻道</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋單元、技能或頻道" /></label>
            <div className="phase-filters" aria-label="依階段篩選"><button type="button" className={phaseFilter === 0 ? "active" : ""} aria-pressed={phaseFilter === 0} onClick={() => setPhaseFilter(0)}>ALL</button>{phases.map((item) => <button type="button" key={item.id} className={phaseFilter === item.id ? "active" : ""} aria-pressed={phaseFilter === item.id} onClick={() => setPhaseFilter(item.id)} title={item.title}>{item.id}</button>)}</div>
            <div className="unit-list">
              {filteredUnits.length ? filteredUnits.map((unit) => {
                const done = completed.includes(String(unit.id));
                return <button type="button" key={unit.id} className={unit.id === selected.id ? "active" : ""} aria-current={unit.id === selected.id ? "step" : undefined} onClick={() => selectUnit(unit.id)}><i className={done ? "done" : ""}>{done ? "✓" : unit.order}</i><span><small>P{unit.phase} / {unit.topic}</small><b>{unit.title}</b></span></button>;
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
            <section className="content-block"><header><span>04</span><h3>官方閱讀與查核入口</h3></header><div className="reading-links">{selected.readings.map((item) => <a key={item.url} href={item.url} target="_blank" rel="noreferrer"><span><small>PRIMARY / AUTHORITATIVE</small><strong>{item.label}</strong></span><b aria-hidden="true">↗</b></a>)}</div></section>
            <section className="artifact"><div><span>DELIVERABLE</span><h3>{selected.project}</h3><p>{selected.outcome}</p></div><div className="skill-tags">{selected.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></section>
            <div className="lesson-next"><div><small>{nextUnit ? "NEXT LESSON" : "CAPSTONE READY"}</small><strong>{nextUnit ? nextUnit.title : "完成模型卡與事故演練"}</strong></div>{nextUnit ? <button type="button" onClick={() => selectUnit(nextUnit.id)}>下一課 →</button> : <a href="#capstone">查看結業清單 →</a>}</div>
          </article>
        </section>

        <section className="roadmap" id="roadmap">
          <div className="section-intro"><p className="eyebrow">FOUR PHASES</p><h2>每一步都留下<br />可重查的證據。</h2><p>不是看完影片就算完成；每個階段都有退出條件，後一階段只能建立在已稽核成果上。</p></div>
          <div className="phase-grid">{phases.map((item) => <article key={item.id}><span>{String(item.id).padStart(2, "0")}</span><small>{item.code}</small><h3>{item.title}</h3><p>{item.description}</p><strong>EXIT → {item.outcome}</strong></article>)}</div>
        </section>

        <section className="capstone" id="capstone">
          <div className="capstone-copy"><p className="eyebrow">CAPSTONE / RESEARCH WITH RECEIPTS</p><h2>最後不是一個選股機，<br />是<span>可稽核的研究助理。</span></h2><p>它不自動下單、不保證報酬；它會保存來源、揭露不確定性、在高風險處停下來，讓人類做最後決定。</p><a href="#workspace">回到課程工作區 ↑</a></div>
          <ol className="checklist">{capstoneChecklist.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>)}</ol>
        </section>

        <section className="source-note">
          <div><span>REFERENCE & RIGHTS</span><h2>保留實作骨架，重做可信度。</h2></div>
          <p>本課以 Hahow「高效 AI 投資術：No Code 打造自動化股票理專」公開頁面作為研究起點（查閱日：2026-08-06）。參考頁面列出 9 章、31 單元、7 項作業與 425 分鐘內容；本站重新設計所有教學文字、練習與作品要求，補入資料稽核、回測偏誤、AI 風險與可靠營運。<a href="https://hahow.in/courses/68186cab7b691d6899006945" target="_blank" rel="noreferrer">查看參考課程 ↗</a></p>
          <p>影音著作權屬原創作者與 YouTube 頻道；本站僅提供隱私增強嵌入、來源連結、近似觀看訊號與選片理由，不代表合作或背書。觀看數為查核當日近似值，可能持續變動。</p>
        </section>

        <section className="discussion">
          <div><p className="eyebrow">COURSE DISCUSSION</p><h2>帶著來源提問。</h2><p>建議附上資料截止日、來源、重現步驟與預期結果；請勿貼上 API key、券商帳號、持倉明細或個資。</p></div>
          {giscusReady ? <div className="giscus-host" ref={discussionRef} /> : <div className="discussion-empty"><span>⌁</span><div><h3>討論區準備中</h3><p>設定四個公開 giscus 環境變數後會自動啟用；課程其他功能不受影響。</p><code>NEXT_PUBLIC_GISCUS_REPO · REPO_ID · CATEGORY · CATEGORY_ID</code></div></div>}
        </section>
      </main>
      <footer><strong>AI INVESTMENT RESEARCH / 2026</strong><p>原創課程架構與教學文字 · 精選影音權利屬各創作者 · 不構成投資建議 · 學習進度只儲存在本機瀏覽器</p></footer>
    </div>
  );
}
