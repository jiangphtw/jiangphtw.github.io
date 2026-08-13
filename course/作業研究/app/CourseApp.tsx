"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { capstoneChecklist, phases, units } from "./course-data";

type Language = "zh" | "en";
type FontMode = "general" | "large";

const STORAGE = {
  completed: "operations-research-course:completed",
  exercises: "operations-research-course:exercises",
  font: "operations-research-course:font",
};

function readStoredArray(key: string) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as string[]) : [];
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
  const lessonTopRef = useRef<HTMLElement>(null);
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
      const inPhase = phaseFilter === 0 || unit.phase === phaseFilter;
      const searchable = [
        unit.title,
        unit.topic,
        unit.skills.join(" "),
        unit.media.zh.channel,
        unit.media.en.channel,
      ]
        .join(" ")
        .toLocaleLowerCase("zh-Hant");
      return inPhase && (!needle || searchable.includes(needle));
    });
  }, [phaseFilter, query]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setCompleted(readStoredArray(STORAGE.completed));
      setExerciseDone(readStoredArray(STORAGE.exercises));
      setFontMode(
        window.localStorage.getItem(STORAGE.font) === "large"
          ? "large"
          : "general",
      );
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
    window.localStorage.setItem(
      STORAGE.exercises,
      JSON.stringify(exerciseDone),
    );
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
  }, [
    giscus.category,
    giscus.categoryId,
    giscus.repo,
    giscus.repoId,
    giscusReady,
  ]);

  function selectUnit(id: number) {
    setSelectedId(id);
    setLanguage("zh");
    setNavOpen(false);
    window.requestAnimationFrame(() =>
      lessonTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  }

  function toggleCompleted(id: number) {
    const key = String(id);
    setCompleted((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  }

  function toggleExercise(unitId: number, index: number) {
    const key = `${unitId}-${index}`;
    setExerciseDone((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  }

  function startLearning() {
    lessonTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className={fontMode === "large" ? "site font-large" : "site"}>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="作業研究課程首頁">
          <span className="brand-mark" aria-hidden="true">
            OR
          </span>
          <span>
            <b>作業研究</b>
            <small>MODEL · SOLVE · DECIDE</small>
          </span>
        </a>
        <nav aria-label="主要導覽">
          <a href="#workspace">開始學習</a>
          <a href="#roadmap">課程地圖</a>
          <a href="#capstone">結業作品</a>
        </nav>
        <div className="topbar-tools">
          <div className="font-control" aria-label="字級選擇">
            <button
              className={fontMode === "general" ? "active" : ""}
              type="button"
              aria-pressed={fontMode === "general"}
              onClick={() => setFontMode("general")}
            >
              一般
            </button>
            <button
              className={fontMode === "large" ? "active" : ""}
              type="button"
              aria-pressed={fontMode === "large"}
              onClick={() => setFontMode("large")}
            >
              大字
            </button>
          </div>
          <a className="course-overview-link" href="/courses.html" aria-label="回到課程總覽頁面">← 課程總覽</a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">
              OPERATIONS RESEARCH / OR I <span>2026 EDITION</span>
            </p>
            <h1>
              把限制說清楚，
              <br />
              再找到<span>更好的決策。</span>
            </h1>
            <p className="hero-lede">
              以陽明交大王晉元老師「作業研究（一）」為主軸，從線性規劃、單體法、
              對偶與敏感度，一路走到運輸、網路、PERT/CPM 與賽局；每一步都要能建模、驗證與解釋。
            </p>
            <div className="hero-actions">
              <button type="button" onClick={startLearning}>
                開始第一個模型 <span aria-hidden="true">↘</span>
              </button>
              <a href="#roadmap">先看十五週地圖</a>
            </div>
            <dl className="hero-stats">
              <div>
                <dt>15</dt>
                <dd>週完整路徑</dd>
              </div>
              <div>
                <dt>15</dt>
                <dd>核心單元</dd>
              </div>
              <div>
                <dt>30</dt>
                <dd>雙語影音</dd>
              </div>
            </dl>
          </div>

          <div className="hero-board" aria-label="作業研究決策流程示意">
            <div className="board-grid" aria-hidden="true" />
            <p className="board-label">THE DECISION PIPELINE</p>
            <div className="loop-path" aria-hidden="true" />
            <article className="note note-one">
              <small>01 / FRAME</small>
              <b>定義決策</b>
              <span>變數、目標、限制</span>
            </article>
            <article className="note note-two">
              <small>02 / MODEL</small>
              <b>寫成模型</b>
              <span>把假設攤在桌上</span>
            </article>
            <article className="note note-three">
              <small>03 / SOLVE</small>
              <b>求解與驗證</b>
              <span>演算法不是黑盒子</span>
            </article>
            <article className="note note-four">
              <small>04 / DECIDE</small>
              <b>解讀與行動</b>
              <span>說清楚範圍與風險</span>
            </article>
            <div className="coral-dot" aria-hidden="true" />
          </div>
        </section>

        <section className="promise-strip" aria-label="課程承諾">
          <span>不是</span>
          <p>只報一個最佳答案</p>
          <i aria-hidden="true">→</i>
          <span>而是</span>
          <p>一套可稽核的決策流程</p>
          <small>適合大二以上的管理或工程領域學生，也適合想補強最佳化思維的工作者</small>
        </section>

        <section
          className="workspace"
          id="workspace"
          ref={lessonTopRef}
          tabIndex={-1}
        >
          <button
            type="button"
            className="mobile-curriculum-button"
            aria-expanded={navOpen}
            aria-controls="curriculum-panel"
            onClick={() => setNavOpen((current) => !current)}
          >
            {navOpen ? "收合課程目錄" : `開啟課程目錄 · ${selected.order}/${units.length}`}
          </button>

          <aside
            className={navOpen ? "curriculum open" : "curriculum"}
            id="curriculum-panel"
          >
            <div className="curriculum-head">
              <div>
                <span>YOUR PROGRESS</span>
                <strong>{progress}%</strong>
              </div>
              <div
                className="progress-track"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                aria-label={`課程完成度 ${progress}%`}
              >
                <i style={{ width: `${progress}%` }} />
              </div>
              <p>
                已完成 {completed.length} / {units.length} 單元
              </p>
            </div>

            <label className="search">
              <span aria-hidden="true">⌕</span>
              <span className="sr-only">搜尋單元、技能或頻道</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜尋單元、技能或頻道"
              />
            </label>

            <div className="phase-filters" aria-label="依階段篩選">
              <button
                type="button"
                className={phaseFilter === 0 ? "active" : ""}
                aria-pressed={phaseFilter === 0}
                onClick={() => setPhaseFilter(0)}
              >
                全部
              </button>
              {phases.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={phaseFilter === item.id ? "active" : ""}
                  aria-pressed={phaseFilter === item.id}
                  onClick={() => setPhaseFilter(item.id)}
                  title={item.title}
                >
                  {item.id}
                </button>
              ))}
            </div>

            <div className="lesson-list">
              {filteredUnits.length > 0 ? (
                filteredUnits.map((unit) => {
                  const done = completed.includes(String(unit.id));
                  return (
                    <button
                      type="button"
                      key={unit.id}
                      onClick={() => selectUnit(unit.id)}
                      className={unit.id === selected.id ? "active" : ""}
                      aria-current={unit.id === selected.id ? "step" : undefined}
                    >
                      <i className={done ? "done" : ""} aria-hidden="true">
                        {done ? "✓" : unit.order}
                      </i>
                      <span>
                        <small>
                          PHASE {unit.phase} · {unit.topic}
                        </small>
                        <b>{unit.title}</b>
                      </span>
                    </button>
                  );
                })
              ) : (
                <p className="empty-state">找不到符合的單元，試試其他關鍵字。</p>
              )}
            </div>
          </aside>

          <div className="lesson">
            <div className="lesson-crumb">
              <span>PHASE {phase.number}</span>
              <i aria-hidden="true">/</i>
              <span>{phase.title}</span>
              <i aria-hidden="true">/</i>
              <b>LESSON {selected.order}</b>
            </div>

            <div className="lesson-toolbar">
              <p>
                <span className="live-dot" aria-hidden="true" />
                精選影音 · {media.duration}
              </p>
              <div className="language-switch" role="tablist" aria-label="影音語言">
                <button
                  type="button"
                  role="tab"
                  aria-selected={language === "zh"}
                  className={language === "zh" ? "active" : ""}
                  onClick={() => setLanguage("zh")}
                >
                  中文
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={language === "en"}
                  className={language === "en" ? "active" : ""}
                  onClick={() => setLanguage("en")}
                >
                  English
                </button>
              </div>
            </div>

            <div className="video-frame">
              <iframe
                key={`${selected.id}-${language}`}
                src={`https://www.youtube-nocookie.com/embed/${media.videoId}?rel=0&modestbranding=1`}
                title={`${selected.title}｜${media.title}`}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            <div className="video-meta">
              <div>
                <span>{language === "zh" ? "中文精選" : "ENGLISH PICK"}</span>
                <b>{media.title}</b>
                <small>
                  {media.channel} · {media.duration} · {media.approximateViews}
                </small>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${media.videoId}`}
                target="_blank"
                rel="noreferrer"
              >
                在 YouTube 開啟 <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="lesson-title">
              <div>
                <p>{selected.topic}</p>
                <h2>{selected.title}</h2>
              </div>
              <button
                type="button"
                className={completed.includes(String(selected.id)) ? "done" : ""}
                aria-pressed={completed.includes(String(selected.id))}
                onClick={() => toggleCompleted(selected.id)}
              >
                {completed.includes(String(selected.id))
                  ? "✓ 已完成這一課"
                  : "標記本課完成"}
              </button>
            </div>

            <div className="lesson-grid">
              <div className="lesson-main">
                <article className="content-card objectives-card">
                  <span className="card-index">01</span>
                  <div>
                    <p className="card-kicker">LEARNING OBJECTIVES</p>
                    <h3>完成後，你能做到</h3>
                    <ol className="objective-list">
                      {selected.objectives.map((objective, index) => (
                        <li key={objective}>
                          <i aria-hidden="true">{index + 1}</i>
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </article>

                <article className="content-card theory-card">
                  <span className="card-index">02</span>
                  <div>
                    <p className="card-kicker">THINK BEFORE YOU WATCH</p>
                    <h3>先帶走三個核心觀念</h3>
                    <div className="theory-list">
                      {selected.theory.map((item, index) => (
                        <div key={item}>
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          <p>{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>

                <article className="content-card reason-card">
                  <span className="card-index">03</span>
                  <div>
                    <p className="card-kicker">WHY THESE RESOURCES</p>
                    <h3>為什麼選這兩支影片</h3>
                    <div className="reason-list">
                      {(["zh", "en"] as Language[]).map((lang) => (
                        <div key={lang}>
                          <b>{lang === "zh" ? "中" : "EN"}</b>
                          <p>{selected.media[lang].selectionReason}</p>
                        </div>
                      ))}
                    </div>
                    <p className="checked-note">
                      觀看數為 {selected.media.zh.checkedAt} 查詢時的約數，會隨時間變動。
                    </p>
                  </div>
                </article>

                <article className="content-card practice-card">
                  <span className="card-index">04</span>
                  <div>
                    <p className="card-kicker">MAKE IT REAL</p>
                    <h3>課後實作</h3>
                    <div className="exercise-list">
                      {selected.exercises.map((exercise, index) => {
                        const key = `${selected.id}-${index}`;
                        const checked = exerciseDone.includes(key);
                        return (
                          <label key={exercise} className={checked ? "checked" : ""}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleExercise(selected.id, index)}
                            />
                            <i aria-hidden="true">{checked ? "✓" : index + 1}</i>
                            <span>{exercise}</span>
                          </label>
                        );
                      })}
                    </div>
                    <div className="artifact-callout">
                      <span>本課交付</span>
                      <b>{selected.project}</b>
                    </div>
                  </div>
                </article>
              </div>

              <aside className="lesson-rail">
                <article className="facts-card">
                  <p className="card-kicker">LESSON NOTES</p>
                  <dl>
                    <div>
                      <dt>難度</dt>
                      <dd>{selected.level}</dd>
                    </div>
                    <div>
                      <dt>投入時間</dt>
                      <dd>{selected.estimatedTime}</dd>
                    </div>
                    <div>
                      <dt>建議節奏</dt>
                      <dd>{selected.rhythm}</dd>
                    </div>
                    <div>
                      <dt>先備條件</dt>
                      <dd>{selected.prerequisites.join("；")}</dd>
                    </div>
                  </dl>
                  <div className="skill-tags" aria-label="本課技能">
                    {selected.skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </article>

                <article className="outcome-card">
                  <span>VISIBLE OUTCOME</span>
                  <p>{selected.outcome}</p>
                </article>

                {nextUnit ? (
                  <article className="next-card">
                    <small>NEXT LESSON</small>
                    <b>{nextUnit.title}</b>
                    <button type="button" onClick={() => selectUnit(nextUnit.id)}>
                      前往單元 {nextUnit.order} <span aria-hidden="true">→</span>
                    </button>
                  </article>
                ) : (
                  <article className="next-card finish">
                    <small>COURSE COMPLETE</small>
                    <b>把你的模型、證據與決策說清楚。</b>
                    <a href="#capstone">檢查結業作品 →</a>
                  </article>
                )}
              </aside>
            </div>
          </div>
        </section>

        <section className="roadmap-section" id="roadmap">
          <div className="section-heading">
            <div>
              <span>COURSE ROADMAP</span>
              <h2>十五週，從問題走到決策。</h2>
            </div>
            <p>
              每個階段都有可檢核的交付：模型、計算、驗證、敏感度與決策建議，逐步累積成結業專題。
            </p>
          </div>
          <div className="roadmap-grid">
            {phases.map((item) => (
              <article key={item.id} style={{ "--phase": item.color } as React.CSSProperties}>
                <div className="phase-top">
                  <span>{item.number}</span>
                  <small>{item.weeks}</small>
                </div>
                <p>{item.short}</p>
                <h3>{item.title}</h3>
                <div className="phase-stroke" aria-hidden="true" />
                <p className="phase-description">{item.description}</p>
                <ul>
                  {units
                    .filter((unit) => unit.phase === item.id)
                    .map((unit) => (
                      <li key={unit.id}>
                        <button type="button" onClick={() => selectUnit(unit.id)}>
                          <span>{unit.order}</span>
                          {unit.topic}
                        </button>
                      </li>
                    ))}
                </ul>
                <footer>
                  <span>階段交付</span>
                  <b>{item.outcome}</b>
                </footer>
              </article>
            ))}
          </div>
        </section>

        <section className="capstone-section" id="capstone">
          <div className="capstone-copy">
            <span>CAPSTONE / FINAL DELIVERY</span>
            <h2>
              不是只交一個最佳值，
              <br />
              是留下<span>每個假設的證據。</span>
            </h2>
            <p>
              結業時，你會交付一份可重現的最佳化模型、驗證紀錄、敏感度分析與決策簡報。
              主題可以來自生產、物流、排班、路網或專案管理；重點是讓他人能追溯資料、假設、計算與取捨。
            </p>
            <button type="button" onClick={() => selectUnit(15)}>
              查看最後一課 <span aria-hidden="true">↗</span>
            </button>
          </div>
          <div className="capstone-board">
            <p>FINAL CHECK / 06 ITEMS</p>
            <ol>
              {capstoneChecklist.map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <b>{item}</b>
                  <i aria-hidden="true">□</i>
                </li>
              ))}
            </ol>
            <small>完成定義：第三人能用你的資料與模型重現結果，並知道建議何時失效。</small>
          </div>
        </section>

        <section className="method-section">
          <div className="section-heading compact">
            <div>
              <span>HOW TO USE THIS COURSE</span>
              <h2>讓學習真正發生。</h2>
            </div>
          </div>
          <div className="method-grid">
            <article>
              <span>01</span>
              <h3>先手算，再交給工具</h3>
              <p>小題手算是為了看懂資訊流；大型模型交給求解器，但每個輸出都要能說明與驗證。</p>
            </article>
            <article>
              <span>02</span>
              <h3>先驗證，再最佳化</h3>
              <p>檢查單位、可行性、邊界與簡單基準。算得快不等於算得對，最優也不等於可採用。</p>
            </article>
            <article>
              <span>03</span>
              <h3>用情境挑戰答案</h3>
              <p>每週改一個關鍵假設，觀察基底、目標與建議是否改變，把脆弱點寫進決策備忘錄。</p>
            </article>
          </div>
        </section>

        <section className="discussion-section">
          <div className="discussion-heading">
            <span>STUDIO DISCUSSION</span>
            <h2>帶著模型來，也帶著反例離開。</h2>
            <p>分享你的限制式、求解結果或敏感度發現。回饋請指出單位、假設、驗證與可執行性。</p>
          </div>
          {giscusReady ? (
            <div ref={discussionRef} className="giscus-host" />
          ) : (
            <div className="giscus-setup">
              <span aria-hidden="true">···</span>
              <div>
                <b>討論區準備中</b>
                <p>
                  課程內容可完整使用；若要開啟 GitHub Discussions，請依
                  <code>.env.example</code> 填入公開的 giscus 設定值。
                </p>
              </div>
              <a href="https://giscus.app/zh-TW" target="_blank" rel="noreferrer">
                查看設定方式 ↗
              </a>
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <b>作業研究</b>
          <span>一門把限制轉化為可求解模型與可執行決策的課。</span>
        </div>
        <p>
          本站僅策展與嵌入教學影片，著作權歸原作者或權利人所有。
          觀看數為查詢日約數，不代表排名或合作關係。課程架構參考
          <a
            href="https://ocw.nycu.edu.tw/?course_page=all-course%2Fcollege-of-management%2F%E4%BD%9C%E6%A5%AD%E7%A0%94%E7%A9%B6%E4%B8%80-operations-research-i-97%E5%AD%B8%E5%B9%B4%E5%BA%A6-%E9%81%8B%E8%BC%B8%E8%88%87%E7%89%A9%E6%B5%81%E7%AE%A1%E7%90%86%E5%AD%B8%E7%B3%BB-%E7%8E%8B"
            target="_blank"
            rel="noreferrer"
          >
            NYCU OCW 王晉元老師「作業研究（一）」↗
          </a>
          。
        </p>
        <a href="https://jiangphtw.github.io">回到 Jiang 的網站 ↗</a>
      </footer>
    </div>
  );
}
