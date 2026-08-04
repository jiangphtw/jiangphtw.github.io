"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { courseFacts, phases, units, type CourseUnit } from "./course-data";

type Language = "zh" | "en";
type Progress = {
  units: Record<number, boolean>;
  exercises: Record<string, boolean>;
};

const emptyProgress: Progress = { units: {}, exercises: {} };
const progressKey = "stock-course-progress-v1";
const typeKey = "stock-course-large-type";

function formatProgress(progress: Progress) {
  const completed = units.filter((unit) => progress.units[unit.id]).length;
  return {
    completed,
    percent: Math.round((completed / units.length) * 100),
  };
}

function matches(unit: CourseUnit, query: string) {
  const haystack = [
    unit.title,
    unit.topic,
    unit.skills.join(" "),
    unit.media.zh.channel,
    unit.media.en.channel,
  ]
    .join(" ")
    .toLocaleLowerCase("zh-Hant");
  return haystack.includes(query.toLocaleLowerCase("zh-Hant"));
}

function Discussion() {
  const rootRef = useRef<HTMLDivElement>(null);
  const config = {
    repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID,
    category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
    categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
  };
  const configured = Object.values(config).every(Boolean);

  useEffect(() => {
    if (!configured || !rootRef.current) return;
    rootRef.current.replaceChildren();
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", config.repo ?? "");
    script.setAttribute("data-repo-id", config.repoId ?? "");
    script.setAttribute("data-category", config.category ?? "");
    script.setAttribute("data-category-id", config.categoryId ?? "");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", "zh-TW");
    rootRef.current.appendChild(script);
  }, [
    configured,
    config.category,
    config.categoryId,
    config.repo,
    config.repoId,
  ]);

  if (configured) {
    return <div ref={rootRef} className="giscus-frame" />;
  }

  return (
    <div className="discussion-empty">
      <span className="discussion-mark" aria-hidden="true">
        ↗
      </span>
      <div>
        <h3>討論區尚未連線</h3>
        <p>
          本地課程已可完整使用。若日後需要留言討論，可在環境設定加入
          giscus 的儲存庫與分類資訊。
        </p>
      </div>
    </div>
  );
}

export default function CourseApp() {
  const [currentId, setCurrentId] = useState(1);
  const [language, setLanguage] = useState<Language>("zh");
  const [query, setQuery] = useState("");
  const [phaseFilter, setPhaseFilter] = useState(0);
  const [largeType, setLargeType] = useState(false);
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);
  const [mobileCurriculum, setMobileCurriculum] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem(progressKey);
        const savedType = window.localStorage.getItem(typeKey);
        if (saved) setProgress(JSON.parse(saved) as Progress);
        setLargeType(savedType === "true");
      } catch {
        setProgress(emptyProgress);
      }
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(progressKey, JSON.stringify(progress));
  }, [progress, ready]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(typeKey, String(largeType));
  }, [largeType, ready]);

  const current = units.find((unit) => unit.id === currentId) ?? units[0];
  const media = current.media[language];
  const courseProgress = formatProgress(progress);
  const filteredUnits = useMemo(
    () =>
      units.filter(
        (unit) =>
          (phaseFilter === 0 || unit.phase === phaseFilter) &&
          (!query.trim() || matches(unit, query.trim())),
      ),
    [phaseFilter, query],
  );
  const next = units.find((unit) => unit.id === current.id + 1);

  const chooseUnit = (id: number) => {
    setCurrentId(id);
    setLanguage("zh");
    setMobileCurriculum(false);
    window.scrollTo({ top: 260, behavior: "smooth" });
  };

  const toggleExercise = (index: number) => {
    const key = `${current.id}-${index}`;
    setProgress((previous) => ({
      ...previous,
      exercises: {
        ...previous.exercises,
        [key]: !previous.exercises[key],
      },
    }));
  };

  const toggleUnit = () => {
    setProgress((previous) => ({
      ...previous,
      units: {
        ...previous.units,
        [current.id]: !previous.units[current.id],
      },
    }));
  };

  return (
    <div className={largeType ? "course-app large-type" : "course-app"}>
      <a className="skip-link" href="#lesson">
        跳到目前單元
      </a>

      <header className="topbar">
        <a className="brand" href="#top" aria-label="股海判讀學首頁">
          <span className="brand-mark" aria-hidden="true">
            判
          </span>
          <span>
            <strong>{courseFacts.title}</strong>
            <small>STOCK DECISION LAB</small>
          </span>
        </a>

        <nav className="top-actions" aria-label="課程工具">
          <a href="#roadmap">課程地圖</a>
          <a href="#sources">資料來源</a>
          <button
            className="type-toggle"
            type="button"
            aria-pressed={largeType}
            onClick={() => setLargeType((value) => !value)}
          >
            <span aria-hidden="true">Aa</span>
            {largeType ? "一般字級" : "大字模式"}
          </button>
          <a className="course-overview-link" href="/courses.html" aria-label="回到課程總覽頁面">← 課程總覽</a>
        </nav>
      </header>

      <main id="top">
        <section className="course-hero" aria-labelledby="course-title">
          <div className="hero-copy">
            <p className="eyebrow">台股研究實作課 · 本地版</p>
            <h1 id="course-title">
              從資訊噪音裡，
              <br />
              找到<span>可驗證的決策。</span>
            </h1>
            <p className="hero-lead">{courseFacts.promise}</p>
            <div className="hero-actions">
              <button type="button" onClick={() => chooseUnit(currentId)}>
                {courseProgress.completed ? "繼續學習" : "開始第一單元"}
                <span aria-hidden="true">→</span>
              </button>
              <a href="#roadmap">先看完整路線</a>
            </div>
          </div>

          <div className="hero-dashboard" aria-label="課程概覽">
            <div className="signal-card">
              <div className="signal-header">
                <span>DECISION SIGNAL</span>
                <span className="live-dot">學習中</span>
              </div>
              <div className="signal-chart" aria-hidden="true">
                <i style={{ height: "32%" }} />
                <i style={{ height: "48%" }} />
                <i style={{ height: "41%" }} />
                <i style={{ height: "66%" }} />
                <i style={{ height: "58%" }} />
                <i style={{ height: "78%" }} />
                <i style={{ height: "92%" }} />
              </div>
              <p>事實 → 驗證 → 情境 → 行動</p>
            </div>
            <dl className="hero-stats">
              <div>
                <dt>單元</dt>
                <dd>09</dd>
              </div>
              <div>
                <dt>中英資源</dt>
                <dd>18</dd>
              </div>
              <div>
                <dt>實作</dt>
                <dd>27</dd>
              </div>
              <div>
                <dt>總時數</dt>
                <dd>11h</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="progress-band" aria-label="學習進度">
          <div>
            <span>你的進度</span>
            <strong>
              {courseProgress.completed} / {units.length} 單元
            </strong>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={courseProgress.percent}
            aria-label={`課程完成 ${courseProgress.percent}%`}
          >
            <span style={{ width: `${courseProgress.percent}%` }} />
          </div>
          <b>{courseProgress.percent}%</b>
        </section>

        <button
          className="mobile-curriculum-toggle"
          type="button"
          aria-expanded={mobileCurriculum}
          aria-controls="curriculum"
          onClick={() => setMobileCurriculum((value) => !value)}
        >
          <span>目錄與搜尋</span>
          <span aria-hidden="true">{mobileCurriculum ? "收起 ↑" : "開啟 ↓"}</span>
        </button>

        <div className="learning-shell">
          <aside
            id="curriculum"
            className={mobileCurriculum ? "curriculum open" : "curriculum"}
            aria-label="課程目錄"
          >
            <div className="curriculum-tools">
              <label htmlFor="course-search">搜尋課程</label>
              <div className="search-field">
                <span aria-hidden="true">⌕</span>
                <input
                  id="course-search"
                  type="search"
                  value={query}
                  placeholder="標題、技能、頻道…"
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <div className="phase-filters" aria-label="階段篩選">
                <button
                  type="button"
                  aria-pressed={phaseFilter === 0}
                  onClick={() => setPhaseFilter(0)}
                >
                  全部
                </button>
                {phases.map((phase) => (
                  <button
                    key={phase.id}
                    type="button"
                    aria-pressed={phaseFilter === phase.id}
                    onClick={() => setPhaseFilter(phase.id)}
                  >
                    {phase.id}
                  </button>
                ))}
              </div>
            </div>

            <div className="unit-list">
              {filteredUnits.length ? (
                filteredUnits.map((unit) => (
                  <button
                    key={unit.id}
                    type="button"
                    className={unit.id === current.id ? "unit-link active" : "unit-link"}
                    aria-current={unit.id === current.id ? "page" : undefined}
                    onClick={() => chooseUnit(unit.id)}
                  >
                    <span className="unit-index">
                      {progress.units[unit.id] ? "✓" : unit.order}
                    </span>
                    <span>
                      <small>
                        PHASE {unit.phase} · {unit.estimatedTime}
                      </small>
                      <strong>{unit.title}</strong>
                      <em>{unit.topic}</em>
                    </span>
                  </button>
                ))
              ) : (
                <p className="no-results">沒有符合的單元，試試較短的關鍵字。</p>
              )}
            </div>
          </aside>

          <article className="lesson" id="lesson">
            <header className="lesson-header">
              <div>
                <p className="lesson-kicker">
                  PHASE {current.phase} <span>/</span> LESSON {current.order}
                </p>
                <h2>{current.title}</h2>
                <p>{current.outcome}</p>
              </div>
              <dl className="lesson-meta">
                <div>
                  <dt>難度</dt>
                  <dd>{current.level}</dd>
                </div>
                <div>
                  <dt>時間</dt>
                  <dd>{current.estimatedTime}</dd>
                </div>
              </dl>
            </header>

            <section className="media-panel" aria-labelledby="media-heading">
              <div className="media-toolbar">
                <div>
                  <span className="section-number">01</span>
                  <div>
                    <p className="section-label">PRIMARY LESSON</p>
                    <h3 id="media-heading">精選教學</h3>
                  </div>
                </div>
                <div className="language-switch" role="group" aria-label="影片語言">
                  <button
                    type="button"
                    aria-pressed={language === "zh"}
                    onClick={() => setLanguage("zh")}
                  >
                    中文
                  </button>
                  <button
                    type="button"
                    aria-pressed={language === "en"}
                    onClick={() => setLanguage("en")}
                  >
                    English
                  </button>
                </div>
              </div>

              <div className="player-wrap">
                <iframe
                  key={`${current.id}-${language}`}
                  src={`https://www.youtube-nocookie.com/embed/${media.videoId}?rel=0&modestbranding=1`}
                  title={`${current.title}：${media.title}`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>

              <div className="media-details">
                <div>
                  <span className="media-lang">{language === "zh" ? "ZH" : "EN"}</span>
                  <h4>{media.title}</h4>
                  <p>
                    {media.channel} · {media.duration} · {media.approximateViews}
                  </p>
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${media.videoId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  在 YouTube 開啟 ↗
                </a>
              </div>

              <div className="selection-note">
                <strong>為什麼選這支</strong>
                <p>{media.selectionReason}</p>
                <small>
                  發布 {media.publishedAt} · 查核 {media.checkedAt} ·
                  觀看數為查核當時近似值
                </small>
              </div>
            </section>

            <section className="lesson-section" aria-labelledby="objectives-heading">
              <div className="section-heading">
                <span className="section-number">02</span>
                <div>
                  <p className="section-label">LEARNING TARGETS</p>
                  <h3 id="objectives-heading">這單元要做到</h3>
                </div>
              </div>
              <div className="objective-grid">
                {current.objectives.map((objective, index) => (
                  <div className="objective-card" key={objective}>
                    <span>0{index + 1}</span>
                    <p>{objective}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="lesson-section" aria-labelledby="theory-heading">
              <div className="section-heading">
                <span className="section-number">03</span>
                <div>
                  <p className="section-label">CORE MODEL</p>
                  <h3 id="theory-heading">先建立判斷框架</h3>
                </div>
              </div>
              <div className="theory-stack">
                {current.theory.map((point, index) => (
                  <div key={point}>
                    <span>{["模型", "方法", "盲點"][index]}</span>
                    <p>{point}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="lesson-section article-section" aria-labelledby="article-heading">
              <div className="section-heading">
                <span className="section-number">04</span>
                <div>
                  <p className="section-label">TEXT LESSON</p>
                  <h3 id="article-heading">本單元文字教學</h3>
                </div>
              </div>
              <article className="lesson-article">
                <p className="article-lede">{current.article.lede}</p>
                {current.article.sections.map((section, sectionIndex) => (
                  <section className="article-chapter" key={section.title}>
                    <div className="article-chapter-heading">
                      <span>{String(sectionIndex + 1).padStart(2, "0")}</span>
                      <h4>{section.title}</h4>
                    </div>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.keyPoints && (
                      <ul className="article-key-points">
                        {section.keyPoints.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
                <aside className="article-recap" aria-label="本單元文章小結">
                  <strong>讀完請記住</strong>
                  <ul>
                    {current.article.recap.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </aside>
                <p className="article-source">文章依據：{current.noteBasis}</p>
              </article>
            </section>

            {current.eventImpacts && (
              <section className="lesson-section event-impact-section" aria-labelledby="event-impact-heading">
                <div className="section-heading">
                  <span className="section-number">05</span>
                  <div>
                    <p className="section-label">EVENT IMPACT MATRIX</p>
                    <h3 id="event-impact-heading">十項事件比較板</h3>
                  </div>
                </div>
                <p className="event-impact-note">
                  數字口徑包含峰谷、年度與事件窗，已在各卡標示；用途是比較傳導方式，不是把不同口徑硬排成績。
                </p>
                <div className="event-impact-grid">
                  {current.eventImpacts.map((impact) => (
                    <article className="event-impact-card" key={impact.event}>
                      <header>
                        <span>{impact.kind}</span>
                        <small>{impact.period}</small>
                        <h4>{impact.event}</h4>
                      </header>
                      <dl>
                        <div>
                          <dt>美股指數</dt>
                          <dd>{impact.usMarket}</dd>
                        </div>
                        <div>
                          <dt>台股指數</dt>
                          <dd>{impact.taiwanMarket}</dd>
                        </div>
                        <div>
                          <dt>判讀</dt>
                          <dd>{impact.interpretation}</dd>
                        </div>
                      </dl>
                      <figure className="event-mini-chart">
                        <figcaption>
                          <strong>{impact.chart.title}</strong>
                          <span>{impact.chart.caption}</span>
                        </figcaption>
                        <div className="event-chart-bars">
                          {impact.chart.bars.map((bar) => (
                            <div className="event-chart-row" key={`${impact.event}-${bar.label}`}>
                              <div>
                                <span>{bar.label}</span>
                                <b>{bar.display}</b>
                              </div>
                              <div
                                className="event-chart-track"
                                role="img"
                                aria-label={`${bar.label}：${bar.display}`}
                              >
                                <span
                                  className={`event-chart-bar ${bar.tone}`}
                                  style={{
                                    width: `${Math.max(6, Math.min(100, (Math.abs(bar.value) / 80) * 100))}%`,
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <small>統一以 80% 為滿刻度；僅比較圖中標示的數值與視窗。</small>
                      </figure>
                      <div className="event-impact-sources" aria-label={`${impact.event}資料來源`}>
                        {impact.sources.map((source) => (
                          <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                            {source.label} ↗
                          </a>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            <section className="lesson-section notebook-cases" aria-labelledby="notebook-cases-heading">
              <div className="section-heading">
                <span className="section-number">{current.eventImpacts ? "06" : "05"}</span>
                <div>
                  <p className="section-label">
                    {current.caseSection?.eyebrow ?? "ORIGINAL NOTE CASES"}
                  </p>
                  <h3 id="notebook-cases-heading">
                    {current.caseSection?.title ?? "原筆記案例"}
                  </h3>
                </div>
              </div>
              <div className="notebook-cases-grid">
                {current.notebookCases.map((notebookCase) => (
                  <article className="notebook-case-card" key={notebookCase.title}>
                    <small>{notebookCase.source}</small>
                    <h4>{notebookCase.title}</h4>
                    <dl>
                      <div>
                        <dt>事件背景</dt>
                        <dd>{notebookCase.situation}</dd>
                      </div>
                      <div>
                        <dt>筆記判讀</dt>
                        <dd>{notebookCase.notebookReading}</dd>
                      </div>
                      <div>
                        <dt>如何遷移</dt>
                        <dd>{notebookCase.transfer}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            </section>

            <section className="case-lab" aria-labelledby="case-heading">
              <p className="section-label">NOTEBOOK CASE LAB</p>
              <h3 id="case-heading">{current.caseStudy.title}</h3>
              <p>{current.caseStudy.context}</p>
              <ul>
                {current.caseStudy.prompts.map((prompt) => (
                  <li key={prompt}>{prompt}</li>
                ))}
              </ul>
              <small>筆記依據：{current.noteBasis}</small>
            </section>

            {current.currentRule && (
              <aside className="rule-update" aria-label="現行制度校正">
                <span aria-hidden="true">!</span>
                <div>
                  <strong>現行制度校正</strong>
                  <p>{current.currentRule}</p>
                </div>
              </aside>
            )}

            <section className="lesson-section" aria-labelledby="exercise-heading">
              <div className="section-heading">
                <span className="section-number">{current.eventImpacts ? "07" : "06"}</span>
                <div>
                  <p className="section-label">TRANSFER PRACTICE</p>
                  <h3 id="exercise-heading">三階段實作</h3>
                </div>
              </div>
              <div className="exercise-list">
                {current.exercises.map((exercise, index) => {
                  const key = `${current.id}-${index}`;
                  const checked = Boolean(progress.exercises[key]);
                  return (
                    <label className={checked ? "exercise done" : "exercise"} key={exercise}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleExercise(index)}
                      />
                      <span className="checkmark" aria-hidden="true">
                        {checked ? "✓" : index + 1}
                      </span>
                      <span>
                        <small>{["重現", "比較", "遷移"][index]}</small>
                        <strong>{exercise}</strong>
                      </span>
                    </label>
                  );
                })}
              </div>
              <div className="artifact-row">
                <span>本單元產出</span>
                <strong>{current.project}</strong>
                <em>{current.rhythm}</em>
              </div>
            </section>

            <section className="lesson-section sources-card" id="sources">
              <div className="section-heading">
                <span className="section-number">{current.eventImpacts ? "08" : "07"}</span>
                <div>
                  <p className="section-label">SOURCE DESK</p>
                  <h3>官方延伸閱讀</h3>
                </div>
              </div>
              <div className="reading-links">
                {current.reading.map((item) => (
                  <a key={item.url} href={item.url} target="_blank" rel="noreferrer">
                    <span>
                      <small>{item.publisher}</small>
                      <strong>{item.label}</strong>
                    </span>
                    <b aria-hidden="true">↗</b>
                  </a>
                ))}
              </div>
            </section>

            <div className="lesson-complete">
              <div>
                <small>LESSON {current.order}</small>
                <strong>{progress.units[current.id] ? "已完成，做得好。" : "完成實作後，留下進度。"}</strong>
              </div>
              <button
                type="button"
                className={progress.units[current.id] ? "completed" : ""}
                aria-pressed={Boolean(progress.units[current.id])}
                onClick={toggleUnit}
              >
                {progress.units[current.id] ? "✓ 已完成" : "標記完成"}
              </button>
              {next && (
                <button type="button" className="next-button" onClick={() => chooseUnit(next.id)}>
                  下一單元 <span aria-hidden="true">→</span>
                </button>
              )}
            </div>
          </article>
        </div>

        <section className="roadmap" id="roadmap" aria-labelledby="roadmap-heading">
          <div className="roadmap-intro">
            <p className="eyebrow">5 PHASES · 9 UNITS</p>
            <h2 id="roadmap-heading">從看懂，到能做出決策。</h2>
            <p>
              每一階段都有可交付成果。最後不是得到一張推薦清單，而是一份能被新證據推翻、也能事後複盤的決策備忘錄。
            </p>
          </div>
          <div className="phase-grid">
            {phases.map((phase) => (
              <article key={phase.id}>
                <span>0{phase.id}</span>
                <small>{phase.short}</small>
                <h3>{phase.title}</h3>
                <p>{phase.description}</p>
                <strong>{phase.outcome}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="method-section" aria-labelledby="method-heading">
          <div>
            <p className="eyebrow">RESEARCH STANDARD</p>
            <h2 id="method-heading">不是報牌，是一套查證習慣。</h2>
          </div>
          <ol>
            <li>
              <span>01</span>
              <div>
                <strong>從原始資料開始</strong>
                <p>公告、財報、法說與交易所規則優先；新聞用來發現問題。</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>先寫反證</strong>
                <p>每個多空論點都要有失效條件、驗證日期與不交易條件。</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>留下決策紀錄</strong>
                <p>把當時可得資訊與事後結果分開，才能真正改善判斷。</p>
              </div>
            </li>
          </ol>
        </section>

        <section className="discussion-section" aria-labelledby="discussion-heading">
          <div>
            <p className="eyebrow">DISCUSSION</p>
            <h2 id="discussion-heading">把你的反證寫出來。</h2>
          </div>
          <Discussion />
        </section>
      </main>

      <footer>
        <div>
          <strong>{courseFacts.title}</strong>
          <p>{courseFacts.subtitle}</p>
        </div>
        <p>
          教育用途，不構成投資建議。影片著作權歸原創作者所有；本站僅提供策展、連結與原創學習引導。
          本課程是原筆記的主題式重構，不是逐頁重製；個股案例僅選代表性內容，制度資料以課程所連結的現行官方來源為準。
          資源查核日：{courseFacts.checkedAt}。
        </p>
      </footer>
    </div>
  );
}
