import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

interface Option {
  option_text: string;
  is_correct: boolean;
}

const AddQuestions: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const navigate = useNavigate();

  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState<"single-select" | "multi-select" | "true-false">("single-select");
  const [options, setOptions] = useState<Option[]>([{ option_text: "", is_correct: false }]);

  const handleOptionChange = (index: number, field: "option_text" | "is_correct", value: any) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { option_text: "", is_correct: false }]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!questionText || options.length === 0) return alert("Fill question and options");

    try {
      await api.post(`/admin/contests/${contestId}/questions`, {
        question_text: questionText,
        question_type: questionType,
        options
      });
      alert("Question added!");
      setQuestionText("");
      setOptions([{ option_text: "", is_correct: false }]);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Error adding question");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Add Questions to Contest</h1>
      <div style={{ maxWidth: 500, display: "flex", flexDirection: "column" }}>
        <input
          type="text"
          placeholder="Question Text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
        <select value={questionType} onChange={(e) => setQuestionType(e.target.value as any)}>
          <option value="single-select">Single Select</option>
          <option value="multi-select">Multi Select</option>
          <option value="true-false">True/False</option>
        </select>

        {questionType !== "true-false" && options.map((o, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginTop: 5 }}>
            <input
              type="text"
              placeholder={`Option ${i + 1}`}
              value={o.option_text}
              onChange={(e) => handleOptionChange(i, "option_text", e.target.value)}
            />
            <label>
              Correct
              <input
                type="checkbox"
                checked={o.is_correct}
                onChange={(e) => handleOptionChange(i, "is_correct", e.target.checked)}
              />
            </label>
            <button onClick={() => removeOption(i)}>Remove</button>
          </div>
        ))}

        {questionType !== "true-false" && <button onClick={addOption}>Add Option</button>}

        {questionType === "true-false" && (
          <div style={{ marginTop: 10 }}>
            <label>
              True
              <input
                type="radio"
                name="tf"
                value="true"
                checked={options[0]?.is_correct === true}
                onChange={() => setOptions([{ option_text: "True", is_correct: true }, { option_text: "False", is_correct: false }])}
              />
            </label>
            <label style={{ marginLeft: 10 }}>
              False
              <input
                type="radio"
                name="tf"
                value="false"
                checked={options[0]?.is_correct === false}
                onChange={() => setOptions([{ option_text: "True", is_correct: false }, { option_text: "False", is_correct: true }])}
              />
            </label>
          </div>
        )}

        <button onClick={handleSubmit} style={{ marginTop: 15 }}>
          Add Question
        </button>
        <button onClick={() => navigate("/admin")} style={{ marginTop: 5 }}>
          Back to Admin
        </button>
      </div>
    </div>
  );
};

export default AddQuestions;
