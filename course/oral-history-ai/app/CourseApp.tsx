"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { aiGuardrails, capstoneChecklist, phases, units } from "./course-data";

type Language = "zh" | "en";
type FontMode = "general" | "large";

const STORAGE = {
  completed: "oral-history-ai:completed",
  exercises: "oral-history-ai:exercises",
  font: "oral-history-ai:font",
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
      const inPhase = phaseFilter === 0 || unit.phase === phaseFilter;
      const text = [unit.title, unit.topic, ...unit.skills, unit.media.zh.channel, unit.media.en.channel]
        .join(" ")
        .toLocaleLowerCase("zh-Hant");
      return inPhase && (!needle || text.includes(needle));
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
    setCompleted((items) => items.includes(key) ? items.filter((item) => item !== key) : [...items, key]);
  }

  function toggleExercise(unitId: number, index: number) {
    const key = `${unitId}-${index}`;
    setExerciseDone((items) => items.includes(key) ? items.filter((item) => item !== key) : [...items, key]);
  }

  return (
    <div className={fontMode === "large" ? "course-app large-type" : "course-app"}>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="口述歷史課程首頁">
          <span className="brand-mark" aria-hidden="true">聲</span>
          <span><b>留下人的聲音</b><small>ORAL HISTORY × AI</small></span>
        </a>
        <nav aria-label="主要導覽">
          <a href="#workspace">開始學習</a>
          <a href="#roadmap">課程地圖</a>
          <a href="#capstone">結業專案</a>
        </nav>
        <div className="topbar-tools">
          <div className="type-toggle" aria-label="字級選擇">
            <button type="button" className={fontMode === "general" ? "active" : ""} aria-pressed={fontMode === "general"} onClick={() => setFontMode("general")}>一般</button>
            <button type="button" className={fontMode === "large" ? "active" : ""} aria-pressed={fontMode === "large"} onClick={() => setFontMode("large")}>大字</button>
          </div>
          <a className="course-overview-link" href="/courses.html" aria-label="回到課程總覽頁面">← 課程總覽</a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><span>2026</span> LISTEN BEFORE YOU GENERATE</p>
            <h1>AI 會轉成文字。<br />但誰來<span>守住聲音？</span></h1>
            <p className="hero-lede">一門從方法、倫理與傾聽開始的實作課。你會完成訪談、逐字稿與 AI 稽核，最後交付一份能回到原音、尊重敘事者、可長久保存的口述史專案。</p>
            <div className="hero-actions">
              <button type="button" onClick={() => lessonRef.current?.scrollIntoView({ behavior: "smooth" })}>開始第一課 <span aria-hidden="true">↓</span></button>
              <a href="#ai-boundary">先看 AI 邊界</a>
            </div>
            <dl className="hero-stats">
              <div><dt>08</dt><dd>方法與實作單元</dd></div>
              <div><dt>16</dt><dd>中英精選影音</dd></div>
              <div><dt>01</dt><dd>正式口述訪談</dd></div>
              <div><dt>01</dt><dd>可保存專案包</dd></div>
            </dl>
          </div>
          <div className="hero-archive" aria-label="口述史資料流示意">
            <div className="archive-head"><span>TAPE OH–001 / SIDE A</span><i>REC ●</i></div>
            <div className="wave" aria-hidden="true">
              {[28, 52, 19, 74, 42, 88, 34, 63, 24, 79, 47, 92, 38, 68, 30, 58, 21, 76, 44, 64, 31, 85, 40, 55].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
            </div>
            <blockquote>「我記得的，不一定是唯一的版本；但那是我走過之後，現在願意告訴你的版本。」</blockquote>
            <div className="archive-path">
              <span><b>01</b> 聽見</span><i>→</i><span><b>02</b> 查核</span><i>→</i><span><b>03</b> 保存</span><i>→</i><span><b>04</b> 交還</span>
            </div>
          </div>
        </section>

        <section className="ai-boundary" id="ai-boundary" aria-labelledby="ai-boundary-title">
          <div className="section-intro">
            <p className="eyebrow">AI BOUNDARY</p>
            <h2 id="ai-boundary-title">省下聽打時間，<br /><span>不要省略人的判斷。</span></h2>
            <p>AI 在這門課裡是受約束的助手。每次使用都要先有同意、資料邊界與回到原音的路徑。</p>
          </div>
          <div className="guardrail-list">
            {aiGuardrails.map(([title, text], index) => <article key={title}>
              <span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div>
            </article>)}
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
              <small>已完成 {completed.length} / {units.length} · 只儲存在這台裝置</small>
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
            <section className="content-block"><header><span>02</span><h3>先讀懂，再動手</h3></header><div className="theory-list">{selected.theory.map((item, index) => <article key={item}><b>{["核心觀念", "主要方法", "風險邊界"][index]}</b><p>{item}</p></article>)}</div></section>
            <section className="prereq"><span>PREREQUISITES</span><div>{selected.prerequisites.map((item) => <p key={item}>✓ {item}</p>)}</div><small>建議節奏｜{selected.rhythm}</small></section>
            <section className="content-block exercises"><header><span>03</span><h3>三層實作任務</h3></header><div className="exercise-list">{selected.exercises.map((item, index) => {
              const key = `${selected.id}-${index}`; const done = exerciseDone.includes(key);
              return <label key={item} className={done ? "done" : ""}><input type="checkbox" checked={done} onChange={() => toggleExercise(selected.id, index)} /><span><small>{["REPRODUCE", "DIAGNOSE", "TRANSFER"][index]}</small><b>{item}</b></span></label>;
            })}</div></section>
            <section className="artifact"><div><span>DELIVERABLE</span><h3>{selected.project}</h3><p>{selected.outcome}</p></div><div className="skill-tags">{selected.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></section>
            <div className="lesson-next"><div><small>{nextUnit ? "NEXT LESSON" : "CAPSTONE READY"}</small><strong>{nextUnit ? nextUnit.title : "組裝、回看並交付你的口述史專案包"}</strong></div>{nextUnit ? <button type="button" onClick={() => selectUnit(nextUnit.id)}>下一課 →</button> : <a href="#capstone">查看結業清單 →</a>}</div>
          </article>
        </section>

        <section className="roadmap" id="roadmap">
          <div className="section-intro"><p className="eyebrow">FOUR PHASES</p><h2>每一階段都留下<br />可查核的痕跡。</h2><p>後一階段只建立在前一階段已完成的文件與同意上。沒有倫理與保存，速度不算進步。</p></div>
          <div className="phase-grid">{phases.map((item) => <article key={item.id}><span>0{item.id}</span><small>{item.code}</small><h3>{item.title}</h3><p>{item.description}</p><strong>EXIT → {item.outcome}</strong></article>)}</div>
        </section>

        <section className="capstone" id="capstone">
          <div className="capstone-copy"><p className="eyebrow">CAPSTONE / RETURN THE RECORD</p><h2>一個人的聲音，<br />一份<span>負責任的歷史來源。</span></h2><p>結業成果是可交付、可查核的專案包。若敘事者不同意公開，你仍可提交去識別化流程與保存說明；公開從來不是完成課程的前提。</p><a href="#workspace">回到課程工作區 ↑</a></div>
          <ol className="checklist">{capstoneChecklist.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>)}</ol>
        </section>

        <section className="source-note">
          <div><span>METHOD & RIGHTS</span><h2>方法有來源，<br />聲音有主人。</h2></div>
          <div>
            <p>課程方法參照臺灣口述歷史學會、Oral History Association、Baylor Institute for Oral History、Library of Congress 與 National Park Service 的公開資源，所有教學說明、練習與專案要求均為重新撰寫。</p>
            <div className="source-links"><a href="https://www.oh.org.tw/" target="_blank" rel="noreferrer">臺灣口述歷史學會 ↗</a><a href="https://oralhistory.org/principles-and-best-practices-revised-2018/" target="_blank" rel="noreferrer">OHA Principles ↗</a><a href="https://library.web.baylor.edu/visit/institute-oral-history/resources" target="_blank" rel="noreferrer">Baylor Resources ↗</a><a href="https://www.nps.gov/articles/000/oral-history-resources-choosing-recording-equipment.htm" target="_blank" rel="noreferrer">NPS Equipment ↗</a></div>
            <p>影音著作權屬原創作者與 YouTube 頻道；本站僅提供隱私增強嵌入、來源連結、近似觀看訊號與選片理由，不代表合作或背書。觀看數為查核當日近似值，可能持續變動。</p>
          </div>
        </section>

        <section className="discussion">
          <div><p className="eyebrow">COURSE DISCUSSION</p><h2>帶著時間碼提問。</h2><p>可討論方法與去識別化片段；請勿上傳未取得公開同意的音檔、姓名、聯絡方式或第三人敏感資訊。</p></div>
          {giscusReady ? <div className="giscus-host" ref={discussionRef} /> : <div className="discussion-empty"><span aria-hidden="true">◎</span><div><h3>討論區準備中</h3><p>設定四個公開 giscus 環境變數後會自動啟用；課程、進度與練習功能不受影響。</p><code>NEXT_PUBLIC_GISCUS_REPO · REPO_ID · CATEGORY · CATEGORY_ID</code></div></div>}
        </section>
      </main>
      <footer><strong>留下人的聲音 / 2026</strong><p>原創課程架構與教學文字 · 精選影音權利屬各創作者 · 學習進度只儲存在本機瀏覽器</p></footer>
    </div>
  );
}
