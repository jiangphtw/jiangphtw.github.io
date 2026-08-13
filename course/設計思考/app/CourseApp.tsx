"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { capstoneChecklist, phases, units } from "./course-data";

type Language = "zh" | "en";
type FontMode = "general" | "large";

const STORAGE = {
  completed: "design-thinking-course:completed",
  exercises: "design-thinking-course:exercises",
  font: "design-thinking-course:font",
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
        <a className="brand" href="#top" aria-label="設計思考課程首頁">
          <span className="brand-mark" aria-hidden="true">
            DT
          </span>
          <span>
            <b>設計思考</b>
            <small>FROM INSIGHT TO ACTION</small>
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
              DESIGN / THINK / DO <span>2026 EDITION</span>
            </p>
            <h1>
              不急著想答案，
              <br />
              先找到<span>值得解的問題。</span>
            </h1>
            <p className="hero-lede">
              這是一門從真實情境出發的設計思考實作課。你會訪談、觀察、整理洞察，
              再把想法做成能被測試的原型——每一步都有證據，每一次失敗都能推動下一步。
            </p>
            <div className="hero-actions">
              <button type="button" onClick={startLearning}>
                開始第一個挑戰 <span aria-hidden="true">↘</span>
              </button>
              <a href="#roadmap">先看六週地圖</a>
            </div>
            <dl className="hero-stats">
              <div>
                <dt>06</dt>
                <dd>週實作路徑</dd>
              </div>
              <div>
                <dt>12</dt>
                <dd>核心單元</dd>
              </div>
              <div>
                <dt>24</dt>
                <dd>雙語影音</dd>
              </div>
            </dl>
          </div>

          <div className="hero-board" aria-label="設計思考流程示意">
            <div className="board-grid" aria-hidden="true" />
            <p className="board-label">THE LEARNING LOOP</p>
            <div className="loop-path" aria-hidden="true" />
            <article className="note note-one">
              <small>01 / SEE</small>
              <b>觀察人</b>
              <span>先記錄，再解讀</span>
            </article>
            <article className="note note-two">
              <small>02 / FRAME</small>
              <b>重寫問題</b>
              <span>把假設攤在桌上</span>
            </article>
            <article className="note note-three">
              <small>03 / MAKE</small>
              <b>製作原型</b>
              <span>讓想法接受測試</span>
            </article>
            <article className="note note-four">
              <small>04 / LEARN</small>
              <b>帶著證據回來</b>
              <span>保留迭代痕跡</span>
            </article>
            <div className="coral-dot" aria-hidden="true" />
          </div>
        </section>

        <section className="promise-strip" aria-label="課程承諾">
          <span>不是</span>
          <p>一張五步驟海報</p>
          <i aria-hidden="true">→</i>
          <span>而是</span>
          <p>一套可重複的學習循環</p>
          <small>適合零基礎學習者、跨域團隊與想補強研究方法的設計工作者</small>
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
                    <b>把你的設計推理說給世界聽。</b>
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
              <h2>六週，不是一條直線。</h2>
            </div>
            <p>
              每個階段都有看得見的交付。需要時往回走，拿新證據修正前一步——這正是設計思考。
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
              不是做一個漂亮答案，
              <br />
              是留下<span>每次決策的證據。</span>
            </h2>
            <p>
              結業時，你會交付一份八頁設計提案、服務藍圖與可測試原型。
              主題可以來自校園、公共服務、工作流程或日常生活；重點是讓他人能追溯你的研究、取捨與迭代。
            </p>
            <button type="button" onClick={() => selectUnit(12)}>
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
            <small>完成定義：每一項都能連回原始證據與一次設計決策。</small>
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
              <h3>先做，再看第二遍</h3>
              <p>第一次抓流程，立刻做小練習；遇到卡點再回看，影音才會變成方法。</p>
            </article>
            <article>
              <span>02</span>
              <h3>保留反例與失敗</h3>
              <p>不要只收支持你的資料。作品集最有價值的部分，往往是證據如何推翻原案。</p>
            </article>
            <article>
              <span>03</span>
              <h3>每週找一位真實的人</h3>
              <p>同儕互評很好，但不能取代情境中的使用者。把對話、觀察與測試排進行事曆。</p>
            </article>
          </div>
        </section>

        <section className="discussion-section">
          <div className="discussion-heading">
            <span>STUDIO DISCUSSION</span>
            <h2>帶著證據來，也帶著問題離開。</h2>
            <p>分享你的 HMW、原型或測試發現。回饋請指出目標、觀察與下一個可驗證的問題。</p>
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
          <b>設計思考</b>
          <span>一門用行動縮短未知的課。</span>
        </div>
        <p>
          本站僅策展與嵌入教學影片，著作權歸原作者或權利人所有。
          觀看數為查詢日約數，不代表排名或合作關係。
        </p>
        <a href="https://jiangphtw.github.io">回到 Jiang 的網站 ↗</a>
      </footer>
    </div>
  );
}
