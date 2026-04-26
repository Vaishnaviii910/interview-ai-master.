import React, { useState } from "react";
import "../style/interview.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate, useParams } from "react-router";

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

  const { report, loading, getResumePdf } = useInterview();
  const { interviewId } = useParams(); // ✅ FIXED

  if (loading || !report) {
    return (
      <main className="loading-screen">
        <h1>Loading your interview plan......</h1>
      </main>
    );
  }

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

          {/* ✅ DOWNLOAD BUTTON FIXED */}
          <button
            onClick={() => getResumePdf(report._id)}
            className="button primary-button"
          >
            Download Resume
          </button>
        </nav>

        <div className="interview-divider" />

        {/* CENTER */}
        <main className="interview-content">
          {activeNav === "technical" && (
            <section>
              <div className="content-header">
                <h2>Technical Questions</h2>
                <span>{report.technicalQuestions.length} questions</span>
              </div>

              {report.technicalQuestions.map((q, i) => (
                <QuestionCard key={i} item={q} index={i} />
              ))}
            </section>
          )}

          {activeNav === "behavioral" && (
            <section>
              <div className="content-header">
                <h2>Behavioral Questions</h2>
                <span>{report.behavioralQuestions.length} questions</span>
              </div>

              {report.behavioralQuestions.map((q, i) => (
                <QuestionCard key={i} item={q} index={i} />
              ))}
            </section>
          )}

          {activeNav === "roadmap" && (
            <section>
              <div className="content-header">
                <h2>Preparation Road Map</h2>
                <span>{report.preparationPlan.length} days</span>
              </div>

              {report.preparationPlan.map((day) => (
                <RoadMapDay key={day.day} day={day} />
              ))}
            </section>
          )}
        </main>

        <div className="interview-divider" />

        {/* RIGHT */}
        <aside className="interview-sidebar">
          <div className={`match-score ${scoreColor}`}>
            <p>Match Score</p>
            <h2>{report.matchScore}%</h2>
          </div>

          <div className="skill-gaps">
            <p>Skill Gaps</p>
            {report.skillGaps.map((gap, i) => (
              <span key={i}>{gap.skill}</span>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Interview;