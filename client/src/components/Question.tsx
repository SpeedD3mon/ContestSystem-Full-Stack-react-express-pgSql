import React, { useState, useEffect } from "react";

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

interface QuestionProps {
  question: QuestionType;
  onChange: (questionId: number, selectedOptions: number[]) => void;
}

const Question: React.FC<QuestionProps> = ({ question, onChange }) => {
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    // Notify parent of current selection
    onChange(question.question_id, selected);
  }, [selected]);

  const handleSingleSelect = (optionId: number) => {
    setSelected([optionId]);
  };

  const handleMultiSelect = (optionId: number) => {
    setSelected(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  return (
    <div style={{ marginBottom: "1.5rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <p><b>{question.question_text}</b></p>

      {question.question_type === "single-select" &&
        question.options.map(opt => (
          <div key={opt.option_id}>
            <label>
              <input
                type="radio"
                name={`question-${question.question_id}`}
                value={opt.option_id}
                checked={selected.includes(opt.option_id)}
                onChange={() => handleSingleSelect(opt.option_id)}
              />
              {opt.option_text}
            </label>
          </div>
        ))}

      {question.question_type === "multi-select" &&
        question.options.map(opt => (
          <div key={opt.option_id}>
            <label>
              <input
                type="checkbox"
                value={opt.option_id}
                checked={selected.includes(opt.option_id)}
                onChange={() => handleMultiSelect(opt.option_id)}
              />
              {opt.option_text}
            </label>
          </div>
        ))}

      {question.question_type === "true-false" &&
        question.options.map(opt => (
          <div key={opt.option_id}>
            <label>
              <input
                type="radio"
                name={`question-${question.question_id}`}
                value={opt.option_id}
                checked={selected.includes(opt.option_id)}
                onChange={() => handleSingleSelect(opt.option_id)}
              />
              {opt.option_text}
            </label>
          </div>
        ))}
    </div>
  );
};

export default Question;
