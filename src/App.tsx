import { FormEvent, useEffect, useMemo, useState } from "react";

type Question = {
  difficulty: string;
  text: string;
  options: string[];
  answer: string;
};

type Rank = {
  title: string;
  message: string;
};

type AttemptRecord = {
  date: string;
  attempts: number;
};

type Screen = "intro" | "quiz" | "retry" | "result";

const questions: Question[] = [
  {
    difficulty: "Level 1",
    text: "Which anime follows Naruto Uzumaki as he dreams of becoming Hokage?",
    options: ["Naruto", "Bleach", "One Piece", "Demon Slayer"],
    answer: "Naruto",
  },
  {
    difficulty: "Level 2",
    text: "In One Piece, what is the name of Luffy's pirate crew?",
    options: ["Straw Hat Pirates", "Heart Pirates", "Blackbeard Pirates", "Red Hair Pirates"],
    answer: "Straw Hat Pirates",
  },
  {
    difficulty: "Level 3",
    text: "In Demon Slayer, what group do the elite swordsmen known as Hashira belong to?",
    options: ["Demon Slayer Corps", "Survey Corps", "Soul Society", "Phantom Troupe"],
    answer: "Demon Slayer Corps",
  },
  {
    difficulty: "Level 4",
    text: "In Attack on Titan, which branch is known for expeditions outside the walls?",
    options: ["Scout Regiment", "Military Police Brigade", "Garrison Regiment", "Warrior Unit"],
    answer: "Scout Regiment",
  },
  {
    difficulty: "Level 5",
    text: "In Death Note, what is the name of the Shinigami who drops the notebook into the human world?",
    options: ["Ryuk", "Rem", "Gelus", "Sidoh"],
    answer: "Ryuk",
  },
  {
    difficulty: "Level 6",
    text: "In Fullmetal Alchemist: Brotherhood, what principle says that something of equal value must be exchanged?",
    options: ["Equivalent Exchange", "Nen Contract", "Cursed Technique", "Bankai Release"],
    answer: "Equivalent Exchange",
  },
  {
    difficulty: "Level 7",
    text: "In Hunter x Hunter, which Nen category does Killua Zoldyck primarily use?",
    options: ["Transmutation", "Enhancement", "Conjuration", "Manipulation"],
    answer: "Transmutation",
  },
  {
    difficulty: "Level 8",
    text: "In Bleach, what is the name of Ichigo Kurosaki's Zanpakuto spirit/sword?",
    options: ["Zangetsu", "Senbonzakura", "Hyourinmaru", "Benihime"],
    answer: "Zangetsu",
  },
  {
    difficulty: "Level 9",
    text: "In Steins;Gate, what is the name of the group led by Rintaro Okabe?",
    options: ["Future Gadget Laboratory", "Special Operations Squad", "Night Raid", "Gurren Brigade"],
    answer: "Future Gadget Laboratory",
  },
  {
    difficulty: "Level 10",
    text: "In Neon Genesis Evangelion, what is the name of the secret organization operating behind NERV?",
    options: ["SEELE", "WILLE", "Geass Order", "The Round Table"],
    answer: "SEELE",
  },
];

const attemptStorageKey = "marshmallow-anime-quiz-attempts";
const maxAttemptsPerDay = 2;
const certificateImageUrl = "/quiz-arena.png";
const ranksByScore: Rank[] = [
  {
    title: "Academy Rookie",
    message: "Your training arc begins today. Marshmallow Tech invites you to try again and claim a guild post.",
  },
  {
    title: "Scout",
    message: "You are ready to step beyond the walls. Marshmallow Tech awards you the post of Scout.",
  },
  {
    title: "Soul Reaper",
    message: "Your spirit pressure is rising. Marshmallow Tech awards you the post of Soul Reaper.",
  },
  {
    title: "Hunter",
    message: "You passed the first true test of instinct. Marshmallow Tech awards you the post of Hunter.",
  },
  {
    title: "Pro Hero",
    message: "You showed courage under pressure. Marshmallow Tech awards you the post of Pro Hero.",
  },
  {
    title: "Hokage",
    message: "Your village would trust your judgment. Marshmallow Tech recognizes you as Hokage.",
  },
  {
    title: "Special Grade",
    message: "Your anime knowledge carries dangerous energy. Marshmallow Tech awards you Special Grade status.",
  },
  {
    title: "S-Class Hunter",
    message: "You are moving with elite instincts. Marshmallow Tech awards you the post of S-Class Hunter.",
  },
  {
    title: "Hashira",
    message: "You have serious anime breathing technique. Marshmallow Tech awards you the post of Hashira.",
  },
  {
    title: "Super Saiyan",
    message: "Your power level broke the scanner. Marshmallow Tech announces that you are Super Saiyan.",
  },
  {
    title: "Pirate King",
    message: "You cleared the trial perfectly. Marshmallow Tech announces that you are the Pirate King.",
  },
];

function todayKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function getAttemptRecord(): AttemptRecord {
  const fallback: AttemptRecord = { date: todayKey(), attempts: 0 };

  try {
    const record = JSON.parse(localStorage.getItem(attemptStorageKey) || "null") as AttemptRecord | null;
    return record?.date === todayKey() ? record : fallback;
  } catch {
    return fallback;
  }
}

function saveAttemptRecord(record: AttemptRecord) {
  localStorage.setItem(attemptStorageKey, JSON.stringify(record));
}

function getRank(score: number): Rank {
  return ranksByScore[Math.max(0, Math.min(score, questions.length))];
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
      return;
    }
    line = testLine;
  });

  lines.push(line);
  lines.forEach((textLine, index) => {
    ctx.fillText(textLine, x, y + index * lineHeight);
  });
}

function buildCertificateCanvas(playerName: string, score: number, includeImage: boolean) {
  const rank = getRank(score);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas is not supported in this browser.");
  }

  canvas.width = 1600;
  canvas.height = 1000;
  ctx.fillStyle = "#fff8ec";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (includeImage) {
    const image = document.querySelector<HTMLImageElement>("#certificate-source-image");
    if (image?.complete && image.naturalWidth) {
      ctx.globalAlpha = 0.22;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    }
  }

  ctx.fillStyle = "rgba(255, 248, 236, 0.9)";
  ctx.fillRect(80, 80, 1440, 840);
  ctx.strokeStyle = "#d99a24";
  ctx.lineWidth = 20;
  ctx.strokeRect(96, 96, 1408, 808);
  ctx.strokeStyle = "rgba(23, 21, 25, 0.22)";
  ctx.lineWidth = 3;
  ctx.strokeRect(138, 138, 1324, 724);

  ctx.textAlign = "center";
  ctx.fillStyle = "#0d8c8f";
  ctx.font = "800 34px Arial, sans-serif";
  ctx.fillText("OFFICIAL CERTIFICATE", 800, 232);

  ctx.fillStyle = "#171519";
  ctx.font = "800 58px Arial, sans-serif";
  ctx.fillText("Marshmallow Tech announces", 800, 330);

  ctx.fillStyle = "#ef5d52";
  ctx.font = "900 112px Arial, sans-serif";
  drawWrappedText(ctx, playerName, 800, 475, 1180, 116);

  ctx.fillStyle = "#171519";
  ctx.font = "900 72px Arial, sans-serif";
  ctx.fillText(rank.title, 800, 650);

  ctx.fillStyle = "#675f55";
  ctx.font = "700 34px Arial, sans-serif";
  ctx.fillText(`${score} correct answers out of ${questions.length}`, 800, 720);

  ctx.font = "600 32px Arial, sans-serif";
  drawWrappedText(ctx, rank.message, 800, 790, 1040, 44);

  return canvas;
}

function App() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [playerName, setPlayerName] = useState("");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(() => Array(questions.length).fill(null));
  const [finalScore, setFinalScore] = useState(0);
  const [attemptsUsed, setAttemptsUsed] = useState(0);

  useEffect(() => {
    setAttemptsUsed(getAttemptRecord().attempts);
  }, []);

  const score = useMemo(
    () => questions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0),
    [answers],
  );
  const attemptsLeft = Math.max(maxAttemptsPerDay - attemptsUsed, 0);
  const currentQuestion = questions[current];
  const finalRank = getRank(finalScore);
  const displayName = playerName.trim() || "Anime Challenger";

  const resetQuizForAttempt = () => {
    setCurrent(0);
    setAnswers(Array(questions.length).fill(null));
  };

  const addAttempt = () => {
    const record = getAttemptRecord();
    const nextAttempts = Math.min(record.attempts + 1, maxAttemptsPerDay);
    const nextRecord = { ...record, attempts: nextAttempts };
    saveAttemptRecord(nextRecord);
    setAttemptsUsed(nextAttempts);
    return nextAttempts;
  };

  const startQuiz = () => {
    if (attemptsLeft <= 0) {
      return;
    }

    resetQuizForAttempt();
    setScreen("quiz");
  };

  const finishAttempt = () => {
    const nextScore = score;
    const nextAttemptsUsed = addAttempt();
    setFinalScore(nextScore);

    if (nextAttemptsUsed === 1) {
      setScreen("retry");
      return;
    }

    setScreen("result");
  };

  const submitAnswer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (answers[current] === null) {
      return;
    }

    if (current === questions.length - 1) {
      finishAttempt();
      return;
    }

    setCurrent((value) => value + 1);
  };

  const chooseAnswer = (option: string) => {
    setAnswers((currentAnswers) => {
      const nextAnswers = [...currentAnswers];
      nextAnswers[current] = option;
      return nextAnswers;
    });
  };

  const downloadCertificatePng = () => {
    const cleanName = displayName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const cleanRank = finalRank.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const link = document.createElement("a");

    link.download = `${cleanName || "anime-challenger"}-${cleanRank}-certificate.png`;

    try {
      link.href = buildCertificateCanvas(displayName, finalScore, true).toDataURL("image/png");
    } catch {
      link.href = buildCertificateCanvas(displayName, finalScore, false).toDataURL("image/png");
    }

    link.click();
  };

  return (
    <main className="app-shell">
      <img id="certificate-source-image" src={certificateImageUrl} alt="" aria-hidden="true" />
      <section className="quiz-panel" aria-labelledby="app-title">
        <div className="brand-row">
          <span className="brand-mark" aria-hidden="true">
            MT
          </span>
          <span className="brand-name">Marshmallow Tech</span>
        </div>

        {screen === "intro" && (
          <div className="intro">
            <p className="eyebrow">Anime Knowledge Trial</p>
            <h1 id="app-title">Claim Your Guild Rank</h1>
            <p className="intro-copy">
              Answer 10 questions and receive a ranked certificate based on your score.
            </p>
            <p className="attempt-note">
              {attemptsLeft > 0
                ? `${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} left today.`
                : "Today's 2 attempts are complete. Come back tomorrow for a fresh run."}
            </p>

            <label className="name-field" htmlFor="player-name">
              <span>Name for certificate</span>
              <input
                id="player-name"
                type="text"
                maxLength={32}
                placeholder="Enter name"
                autoComplete="name"
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
              />
            </label>

            <div className="rank-strip" aria-label="Quiz rank thresholds">
              {ranksByScore.slice(1).map((rank, index) => (
                <div key={rank.title}>
                  <strong>{index + 1}</strong>
                  <span>{rank.title}</span>
                </div>
              ))}
            </div>

            <button className="primary-action" type="button" disabled={attemptsLeft <= 0} onClick={startQuiz}>
              Start quiz
            </button>
          </div>
        )}

        {screen === "quiz" && (
          <form className="question-card" onSubmit={submitAnswer}>
            <div className="quiz-topline">
              <span>
                {currentQuestion.difficulty} · Question {current + 1} of {questions.length}
              </span>
              <span>Score {score}</span>
            </div>
            <div className="progress-track" aria-hidden="true">
              <span style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
            </div>
            <h2>{currentQuestion.text}</h2>
            <div className="answers">
              {currentQuestion.options.map((option) => {
                const id = `answer-${current}-${option.replace(/\W+/g, "-").toLowerCase()}`;
                return (
                  <label className="answer-option" htmlFor={id} key={option}>
                    <input
                      id={id}
                      type="radio"
                      name="answer"
                      value={option}
                      checked={answers[current] === option}
                      onChange={() => chooseAnswer(option)}
                      required
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
            <div className="question-actions">
              <button
                className="ghost-action"
                type="button"
                disabled={current === 0}
                onClick={() => setCurrent((value) => Math.max(value - 1, 0))}
              >
                Back
              </button>
              <button className="primary-action" type="submit">
                {current === questions.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </form>
        )}

        {screen === "retry" && (
          <section className="retry-choice" aria-live="polite">
            <p className="eyebrow">First Attempt Complete</p>
            <h2>Keep this result or try one last time?</h2>
            <p>
              You scored {finalScore} out of {questions.length}, which currently gives you {getRank(finalScore).title}.
              You can accept this certificate now or use your second and final attempt for today.
            </p>
            <div className="result-actions">
              <button className="ghost-action" type="button" onClick={() => setScreen("result")}>
                Proceed with certificate
              </button>
              <button
                className="primary-action"
                type="button"
                onClick={() => {
                  resetQuizForAttempt();
                  setScreen("quiz");
                }}
              >
                Try one last time
              </button>
            </div>
          </section>
        )}

        {screen === "result" && (
          <section className="certificate" aria-live="polite">
            <div className="certificate-inner">
              <p className="eyebrow">Official Certificate</p>
              <h2>Marshmallow Tech announces</h2>
              <p className="winner-name">{displayName}</p>
              <p className="rank-line">{finalRank.title}</p>
              <p className="score-line">
                {finalScore} correct answers out of {questions.length}
              </p>
              <p className="certificate-note">{finalRank.message}</p>
            </div>
            <div className="result-actions">
              <button
                className="ghost-action"
                type="button"
                onClick={() => {
                  resetQuizForAttempt();
                  setScreen("intro");
                }}
              >
                Start over
              </button>
              <button className="primary-action" type="button" onClick={downloadCertificatePng}>
                Download PNG
              </button>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
