import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";
import Question from "../components/Question";

interface OptionType {
  option_id: number;
  option_text: string;
}

interface QuestionType {
  question_id: number;
  question_text: string;
  question_type: "single-select" | "multi-select" | "true-false";
  options: OptionType[];
}

interface Contest {
  contest_id: number;
  name: string;
  description: string;
  access_level: "normal" | "vip";
  prize: string;
  questions: QuestionType[];
}

interface Attempt {
  attempt_id: number;
  is_completed: boolean;
  contest_id: number;
}

const ContestPlay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();

  const [contest, setContest] = useState<Contest | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch contest info only
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await api.get<Contest>(`/contests/${id}`);
        setContest(res.data);
      } catch (err: any) {
        console.error(err);
        alert(err.response?.data?.error || "Error fetching contest");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) fetchContest();
  }, [id, currentUser]);

  // Timer effect
  useEffect(() => {
    if (attempt && !attempt.is_completed && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && attempt && !attempt.is_completed) {
      handleSubmit(); // Auto-submit when timer reaches 0
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, attempt]);

  const handleAnswerChange = (questionId: number, selectedOptions: number[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: selectedOptions }));
  };

  // Start contest only on button click
  const handleStartContest = async () => {
    if (!currentUser) return alert("Please login to start the contest");

    try {
      const res = await api.post<Attempt>(`/attempts/start/${id}`);
      setAttempt(res.data);
      setTimeLeft(30);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Error starting contest");
    }
  };

  const handleSubmit = async () => {
    if (!attempt) return alert("No active attempt");

    try {
      const formattedAnswers = Object.keys(answers).map(qId => ({
        question_id: parseInt(qId),
        selected_options: answers[parseInt(qId)],
      }));

      const res = await api.post(`/attempts/${attempt.attempt_id}/submit`, {
        answers: formattedAnswers,
      });

      alert(`Contest submitted! Your score: ${res.data.score}`);
      setAttempt({ ...attempt, is_completed: true });
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Error submitting contest");
    }
  };

  if (loading) return <div>Loading contest...</div>;
  if (!contest) return <div>Contest not found</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{contest.name}</h1>
      <p>{contest.description}</p>
      <p>Access Level: <b>{contest.access_level.toUpperCase()}</b></p>
      <p>Prize: <b>{contest.prize}</b></p>

      {!attempt ? (
        <button onClick={handleStartContest}>Start Contest</button>
      ) : attempt.is_completed ? (
        <div style={{ color: "green" }}>✅ You have already completed this contest</div>
      ) : (
        <div>
          <h3>Time Left: {timeLeft} sec</h3>
          {contest.questions.map(q => (
            <Question
              key={q.question_id}
              question={q}
              onChange={handleAnswerChange}
            />
          ))}
          <button onClick={handleSubmit}>End Contest & Submit</button>
        </div>
      )}

      <br />
      <Link to="/contests">Back to Contests</Link>
    </div>
  );
};

export default ContestPlay;
