import React, { useState } from "react";
import "../style/interview.scss";

const NAV_ITEMS = [
  { id: "technical", label: "Technical Questions" },
  { id: "behavioral", label: "Behavioral Questions" },
  { id: "roadmap", label: "Road Map" },
];

const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="q-card">
      <div className="q-card__header" onClick={() => setOpen(!open)}>
        <span className="q-card__index">Q{index + 1}</span>
        <p className="q-card__question">{item.question}</p>
        <span className={`q-card__chevron ${open ? "q-card__chevron--open" : ""}`}>
          ▼
        </span>
      </div>

      {open && (
        <div className="q-card__body">
          <div className="q-card__section">
            <span className="q-card__tag q-card__tag--intention">Intention</span>
            <p>{item.intention}</p>
          </div>

          <div className="q-card__section">
            <span className="q-card__tag q-card__tag--answer">Model Answer</span>
            <p>{item.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const RoadMapDay = ({ day }) => (
  <div className="roadmap-day">
    <div className="roadmap-day__header">
      <span className="roadmap-day__badge">Day {day.day}</span>
      <h3 className="roadmap-day__focus">{day.focus}</h3>
    </div>

    <ul className="roadmap-day__tasks">
      {day.tasks.map((task, i) => (
        <li key={i}>
          <span className="roadmap-day__bullet" />
          {task}
        </li>
      ))}
    </ul>
  </div>
);

const Interview = () => {
  const [activeNav, setActiveNav] = useState("technical");

  const report = {
    matchScore: 88,

    technicalQuestions: [
      {
        question: "Explain Node.js event loop.",
        intention: "Assess async architecture understanding.",
        answer: "Explain phases, libuv, and non-blocking I/O.",
      },
      {
        question: "Optimize MongoDB aggregation pipeline?",
        intention: "Check database optimization.",
        answer: "Use indexes, reduce dataset early.",
      },
      {
        question: "Cache-Aside pattern with Redis?",
        intention: "Evaluate caching strategy.",
        answer: "Check cache → DB → update cache.",
      },
    ],

    behavioralQuestions: [
      {
        question: "Tell me about a conflict you handled.",
        intention: "Assess teamwork and communication.",
        answer: "Use STAR method (Situation, Task, Action, Result).",
      },
    ],

    skillGaps: [
      { skill: "System Design", severity: "high" },
      { skill: "CI/CD", severity: "medium" },
      { skill: "Caching", severity: "low" },
    ],

    preparationPlan: [
      {
        day: 1,
        focus: "DSA Basics",
        tasks: ["Arrays", "Strings", "Hashmaps"],
      },
      {
        day: 2,
        focus: "Backend",
        tasks: ["Node.js internals", "Event loop"],
      },
      {
        day: 3,
        focus: "Database",
        tasks: ["MongoDB queries", "Indexing"],
      },
      {
        day: 4,
        focus: "System Design",
        tasks: ["Scalability basics", "Caching"],
      },
    ],
  };

  const scoreColor =
    report.matchScore >= 80
      ? "score--high"
      : report.matchScore >= 60
      ? "score--mid"
      : "score--low";

  return (
    <div className="interview-page">
      <div className="interview-layout">

        {/* LEFT NAV */}
        <nav className="interview-nav">
          <div>
            <p className="interview-nav__label">Sections</p>

            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`interview-nav__item ${
                  activeNav === item.id ? "interview-nav__item--active" : ""
                }`}
                onClick={() => setActiveNav(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="interview-divider" />

        {/* CENTER */}
        <main className="interview-content">
          {activeNav === "technical" && (
            <section>
              <div className="content-header">
                <h2>Technical Questions</h2>
                <span className="content-header__count">
                  {report.technicalQuestions.length} questions
                </span>
              </div>

              <div className="q-list">
                {report.technicalQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === "behavioral" && (
            <section>
              <div className="content-header">
                <h2>Behavioral Questions</h2>
                <span className="content-header__count">
                  {report.behavioralQuestions.length} questions
                </span>
              </div>

              <div className="q-list">
                {report.behavioralQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === "roadmap" && (
            <section>
              <div className="content-header">
                <h2>Preparation Road Map</h2>
                <span className="content-header__count">
                  {report.preparationPlan.length} days
                </span>
              </div>

              <div className="roadmap-list">
                {report.preparationPlan.map((day) => (
                  <RoadMapDay key={day.day} day={day} />
                ))}
              </div>
            </section>
          )}
        </main>

        <div className="interview-divider" />

        {/* RIGHT */}
        <aside className="interview-sidebar">
          <div className="match-score">
            <p className="match-score__label">Match Score</p>

            <div className={`match-score__ring ${scoreColor}`}>
              <span className="match-score__value">
                {report.matchScore}
              </span>
              <span className="match-score__pct">%</span>
            </div>

            <p className="match-score__sub">Strong match for this role</p>
          </div>

          <div className="sidebar-divider" />

          <div className="skill-gaps">
            <p className="skill-gaps__label">Skill Gaps</p>

            <div className="skill-gaps__list">
              {report.skillGaps.map((gap, i) => (
                <span
                  key={i}
                  className={`skill-tag skill-tag--${gap.severity}`}
                >
                  {gap.skill}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Interview;