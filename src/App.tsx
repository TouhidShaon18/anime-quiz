import { FormEvent, useEffect, useMemo, useState } from "react";

type Question = {
  id: number;
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
  usedQuestionIds: number[];
};

type Screen = "intro" | "quiz" | "retry" | "result";

const questionBank: Question[] = [
  {
    id: 1,
    difficulty: "Level 1",
    text: "What is Naruto Uzumaki's dream?",
    options: ["Become Hokage", "Become Jonin", "Become ANBU", "Become Kazekage"],
    answer: "Become Hokage",
  },
  {
    id: 2,
    difficulty: "Level 2",
    text: "Who is Luffy searching for?",
    options: ["Dragon Balls", "One Piece", "Death Note", "Titan Serum"],
    answer: "One Piece",
  },
  {
    id: 3,
    difficulty: "Level 3",
    text: "What is the name of Tanjiro's sister?",
    options: ["Shinobu", "Mitsuri", "Nezuko", "Kanao"],
    answer: "Nezuko",
  },
  {
    id: 4,
    difficulty: "Level 4",
    text: "In Attack on Titan, what are giant humanoids called?",
    options: ["Hollows", "Titans", "Curses", "Demons"],
    answer: "Titans",
  },
  {
    id: 5,
    difficulty: "Level 5",
    text: "What sport is featured in Haikyuu!!?",
    options: ["Basketball", "Soccer", "Volleyball", "Baseball"],
    answer: "Volleyball",
  },
  {
    id: 6,
    difficulty: "Level 6",
    text: "Who possesses the Death Note first in the series?",
    options: ["Light Yagami", "L", "Ryuk", "Misa"],
    answer: "Light Yagami",
  },
  {
    id: 7,
    difficulty: "Level 7",
    text: "What is Goku's Saiyan name?",
    options: ["Vegeta", "Bardock", "Kakarot", "Raditz"],
    answer: "Kakarot",
  },
  {
    id: 8,
    difficulty: "Level 8",
    text: "What is the name of Ash Ketchum's first Pokemon?",
    options: ["Bulbasaur", "Pikachu", "Charmander", "Squirtle"],
    answer: "Pikachu",
  },
  {
    id: 9,
    difficulty: "Level 9",
    text: "Which anime features Edward Elric?",
    options: ["Bleach", "Fullmetal Alchemist", "Fairy Tail", "Black Clover"],
    answer: "Fullmetal Alchemist",
  },
  {
    id: 10,
    difficulty: "Level 10",
    text: "What color is Ichigo Kurosaki's hair?",
    options: ["Black", "Brown", "Orange", "Blue"],
    answer: "Orange",
  },
  {
    id: 11,
    difficulty: "Level 11",
    text: "Who is Naruto's father?",
    options: ["Jiraiya", "Minato", "Kakashi", "Itachi"],
    answer: "Minato",
  },
  {
    id: 12,
    difficulty: "Level 12",
    text: "What is the name of Monkey D. Luffy's brother?",
    options: ["Ace", "Law", "Shanks", "Kid"],
    answer: "Ace",
  },
  {
    id: 13,
    difficulty: "Level 13",
    text: "Which organization does Gojo belong to?",
    options: ["Demon Slayer Corps", "Soul Society", "Jujutsu High", "Survey Corps"],
    answer: "Jujutsu High",
  },
  {
    id: 14,
    difficulty: "Level 14",
    text: "What is Levi Ackerman famous for?",
    options: ["Cooking", "Titan Slaying", "Alchemy", "Basketball"],
    answer: "Titan Slaying",
  },
  {
    id: 15,
    difficulty: "Level 15",
    text: "What is Deku's real name?",
    options: ["Katsuki", "Shoto", "Izuku Midoriya", "Tenya"],
    answer: "Izuku Midoriya",
  },
  {
    id: 16,
    difficulty: "Level 16",
    text: "Who teaches Class 1-A?",
    options: ["Endeavor", "Aizawa", "All Might", "Hawks"],
    answer: "Aizawa",
  },
  {
    id: 17,
    difficulty: "Level 17",
    text: "What is the name of Gon Freecss's best friend?",
    options: ["Kurapika", "Leorio", "Killua", "Hisoka"],
    answer: "Killua",
  },
  {
    id: 18,
    difficulty: "Level 18",
    text: "In Demon Slayer, what breathing style does Zenitsu use?",
    options: ["Water", "Thunder", "Flame", "Wind"],
    answer: "Thunder",
  },
  {
    id: 19,
    difficulty: "Level 19",
    text: "What is the name of the giant wall protecting humanity in AOT?",
    options: ["Wall Maria", "Wall Rose", "Wall Sina", "All of these"],
    answer: "All of these",
  },
  {
    id: 20,
    difficulty: "Level 20",
    text: "Which anime is about pirates?",
    options: ["Naruto", "One Piece", "Bleach", "Dr. Stone"],
    answer: "One Piece",
  },
  {
    id: 21,
    difficulty: "Level 21",
    text: "Who is known as the strongest sorcerer in JJK?",
    options: ["Sukuna", "Geto", "Gojo", "Nanami"],
    answer: "Gojo",
  },
  {
    id: 22,
    difficulty: "Level 22",
    text: "What is the name of Eren's hometown?",
    options: ["Shiganshina", "Trost", "Liberio", "Ragako"],
    answer: "Shiganshina",
  },
  {
    id: 23,
    difficulty: "Level 23",
    text: "What is Light Yagami's alias?",
    options: ["Joker", "Kira", "Zero", "Phantom"],
    answer: "Kira",
  },
  {
    id: 24,
    difficulty: "Level 24",
    text: "Which anime features the Survey Corps?",
    options: ["One Piece", "Naruto", "Attack on Titan", "Black Clover"],
    answer: "Attack on Titan",
  },
  {
    id: 25,
    difficulty: "Level 25",
    text: "What color is Nezuko's bamboo muzzle?",
    options: ["Green", "Black", "Brown", "Red"],
    answer: "Green",
  },
];

const attemptStorageKey = "marshmallow-anime-quiz-attempts";
const maxAttemptsPerDay = 2;
const questionsPerQuiz = 10;
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
    message: "Your power level exceeded the scanner's limits. Few warriors reach this legendary form.",
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
  const fallback: AttemptRecord = { date: todayKey(), attempts: 0, usedQuestionIds: [] };

  try {
    const record = JSON.parse(localStorage.getItem(attemptStorageKey) || "null") as AttemptRecord | null;
    if (record?.date !== todayKey()) {
      return fallback;
    }

    return {
      date: record.date,
      attempts: record.attempts || 0,
      usedQuestionIds: Array.isArray(record.usedQuestionIds) ? record.usedQuestionIds : [],
    };
  } catch {
    return fallback;
  }
}

function saveAttemptRecord(record: AttemptRecord) {
  localStorage.setItem(attemptStorageKey, JSON.stringify(record));
}

function getRank(score: number): Rank {
  return ranksByScore[Math.max(0, Math.min(score, questionsPerQuiz))];
}

function shuffleQuestions(items: Question[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function createQuizQuestions(excludedQuestionIds: number[]) {
  const excluded = new Set(excludedQuestionIds);
  const freshQuestions = questionBank.filter((question) => !excluded.has(question.id));
  const source = freshQuestions.length >= questionsPerQuiz ? freshQuestions : questionBank;

  return shuffleQuestions(source)
    .slice(0, questionsPerQuiz)
    .map((question, index) => ({
      ...question,
      difficulty: `Level ${index + 1}`,
    }));
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
  ctx.fillText("OFFICIAL POWER LEVEL CERTIFICATE", 800, 210);

  ctx.fillStyle = "#171519";
  ctx.font = "600 40px Arial, sans-serif";
  ctx.fillText("This certifies that", 800, 295);

  ctx.fillStyle = "#ef5d52";
  ctx.font = "900 104px Arial, sans-serif";
  drawWrappedText(ctx, playerName.toUpperCase(), 800, 410, 1180, 108);

  ctx.fillStyle = "#171519";
  ctx.font = "600 34px Arial, sans-serif";
  drawWrappedText(
    ctx,
    "has successfully completed the Saiyan Assessment and achieved the rank of",
    800,
    535,
    1120,
    46,
  );

  ctx.fillStyle = "#171519";
  ctx.font = "900 76px Arial, sans-serif";
  ctx.fillText(rank.title.toUpperCase(), 800, 665);

  ctx.fillStyle = "#675f55";
  ctx.font = "700 36px Arial, sans-serif";
  ctx.fillText(`Score: ${score} / ${questionsPerQuiz}`, 800, 735);

  ctx.font = "600 32px Arial, sans-serif";
  drawWrappedText(ctx, `"${rank.message}"`, 800, 805, 1040, 44);

  ctx.fillStyle = "#171519";
  ctx.font = "800 32px Arial, sans-serif";
  ctx.fillText("Awarded by Marshmallow Tech", 800, 895);

  return canvas;
}

function App() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [playerName, setPlayerName] = useState("");
  const [current, setCurrent] = useState(0);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(() =>
    createQuizQuestions(getAttemptRecord().usedQuestionIds),
  );
  const [answers, setAnswers] = useState<(string | null)[]>(() => Array(questionsPerQuiz).fill(null));
  const [finalScore, setFinalScore] = useState(0);
  const [attemptsUsed, setAttemptsUsed] = useState(0);

  useEffect(() => {
    setAttemptsUsed(getAttemptRecord().attempts);
  }, []);

  const score = useMemo(
    () =>
      activeQuestions.reduce(
        (total, question, index) => total + (answers[index] === question.answer ? 1 : 0),
        0,
      ),
    [activeQuestions, answers],
  );
  const attemptsLeft = Math.max(maxAttemptsPerDay - attemptsUsed, 0);
  const currentQuestion = activeQuestions[current];
  const finalRank = getRank(finalScore);
  const displayName = playerName.trim() || "Anime Challenger";

  const resetQuizForAttempt = () => {
    const nextQuestions = createQuizQuestions(getAttemptRecord().usedQuestionIds);
    setCurrent(0);
    setActiveQuestions(nextQuestions);
    setAnswers(Array(nextQuestions.length).fill(null));
  };

  const addAttempt = (answeredQuestionIds: number[]) => {
    const record = getAttemptRecord();
    const nextAttempts = Math.min(record.attempts + 1, maxAttemptsPerDay);
    const nextRecord = {
      ...record,
      attempts: nextAttempts,
      usedQuestionIds: Array.from(new Set([...record.usedQuestionIds, ...answeredQuestionIds])),
    };
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
    const nextAttemptsUsed = addAttempt(activeQuestions.map((question) => question.id));
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

    if (current === activeQuestions.length - 1) {
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
                {currentQuestion.difficulty} · Question {current + 1} of {activeQuestions.length}
              </span>
              <span>Score {score}</span>
            </div>
            <div className="progress-track" aria-hidden="true">
              <span style={{ width: `${((current + 1) / activeQuestions.length) * 100}%` }} />
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
                {current === activeQuestions.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </form>
        )}

        {screen === "retry" && (
          <section className="retry-choice" aria-live="polite">
            <p className="eyebrow">First Attempt Complete</p>
            <h2>Keep this result or try one last time?</h2>
            <p>
              You scored {finalScore} out of {questionsPerQuiz}, which currently gives you {getRank(finalScore).title}.
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
              <p className="eyebrow">Official Power Level Certificate</p>
              <p className="certificate-kicker">This certifies that</p>
              <p className="winner-name">{displayName.toUpperCase()}</p>
              <p className="certificate-kicker">
                has successfully completed the Saiyan Assessment and achieved the rank of
              </p>
              <p className="rank-line">{finalRank.title.toUpperCase()}</p>
              <p className="score-line">
                Score: {finalScore} / {questionsPerQuiz}
              </p>
              <p className="certificate-note">"{finalRank.message}"</p>
              <p className="certificate-awarded">Awarded by Marshmallow Tech</p>
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
