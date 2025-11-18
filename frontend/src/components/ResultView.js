import React, { useState } from "react";

export default function ResultView({ item }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!item) return null;

  const handleAnswer = (qIdx, optionIdx) => {
    if (submitted) return; // disable changes after submission
    setAnswers({ ...answers, [qIdx]: optionIdx });
  };

  const score = Object.entries(answers).reduce((acc, [qIdx, optionIdx]) => {
    if (item.quiz[qIdx] && optionIdx === item.quiz[qIdx].correctIndex) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const isAllAnswered = item.quiz.length === Object.keys(answers).length;

  return (
    <section style={{ marginTop: 20 }}>
      <h3>Summary</h3>
      <p style={{ whiteSpace: "pre-wrap" }}>{item.summary}</p>

      <h3>Quiz Questions</h3>
      {item.quiz && item.quiz.length ? (
        <>
          <ol style={{ paddingLeft: 20 }}>
            {item.quiz.map((q, idx) => (
              <li key={idx} style={{ marginBottom: 15 }}>
                <p>
                  <strong>{q.question}</strong>
                </p>
                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                  {q.options.map((opt, i) => (
                    <li
                      key={i}
                      onClick={() => handleAnswer(idx, i)}
                      style={{
                        cursor: submitted ? "default" : "pointer",
                        fontWeight: answers[idx] === i ? "bold" : "normal",
                        color: submitted
                          ? i === q.correctIndex
                            ? "green"
                            : answers[idx] === i
                            ? "red"
                            : "inherit"
                          : "inherit",
                        backgroundColor: !submitted
                          ? answers[idx] === i
                            ? "#d0e8ff"
                            : "#f5f5f5"
                          : "transparent",
                        padding: "6px 10px",
                        borderRadius: 4,
                        marginBottom: 6,
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (!submitted)
                          e.currentTarget.style.backgroundColor = "#e0ebff";
                      }}
                      onMouseLeave={(e) => {
                        if (!submitted)
                          e.currentTarget.style.backgroundColor =
                            answers[idx] === i ? "#d0e8ff" : "#f5f5f5";
                      }}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
                {submitted && q.explanation && (
                  <p style={{ fontStyle: "italic", color: "#555" }}>
                    Explanation: {q.explanation}
                  </p>
                )}
              </li>
            ))}
          </ol>
          {!submitted && (
            <button
              onClick={() => setSubmitted(true)}
              disabled={!isAllAnswered}
            >
              Submit Quiz
            </button>
          )}
          {submitted && (
            <p>
              Your score: {score} / {item.quiz.length}
            </p>
          )}
        </>
      ) : (
        <p>No quiz available.</p>
      )}
    </section>
  );
}
