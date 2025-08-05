import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Card, CardContent } from "@mui/material";
import bgImage from "../../assets/Images/Question_BG.png";
import { useQuestion } from "./Context/QuestionContext";

// Import all question type components
import SingleChoiceQuestion from "./QuestionTypes/SingleChoiceQuestion";
import MultipleChoiceQuestion from "./QuestionTypes/MultipleChoiceQuestion";
import TrueFalseQuestion from "./QuestionTypes/TrueFalseQuestion";
import FillBlankQuestion from "./QuestionTypes/FillBlankQuestion";
import MatchingQuestion from "./QuestionTypes/MatchingQuestion";
import { useNavigate } from "react-router-dom";

const QuestionPage = () => {
  const location = useLocation();
  const { id } = useParams();
  const {
    currentQuestion,
    submitAnswer,
    startStageItem,
    loading,
    questionGroupId,
    setCurrentQuestion,
    setLessonLogId,
    setQuestionGroupId,
    lessonLogId,
  } = useQuestion();
  const [nextQuestionId, setNextQuestionId] = useState(null);
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [blankAnswers, setBlankAnswers] = useState(["", "", ""]);
  const [matchingAnswers, setMatchingAnswers] = useState([
    { left: "لاعب ١", right: "" },
    { left: "لاعب ٢", right: "" },
  ]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null); // true/false/null

  // Fetch question on load if not passed via navigation
  useEffect(() => {
    if (!location.state?.question) {
      startStageItem(id).catch((err) => {
        console.error("Failed to start stage item:", err);
      });
    } else {
      setCurrentQuestion(location.state.question);
      setLessonLogId(location.state.lesson_log_id);
      setQuestionGroupId(location.state.question_group_id);
    }
  }, [id, startStageItem, location.state]);
  useEffect(() => {
    setNextQuestionId(null);
  }, [currentQuestion]);

  const handleFillChange = (index, value) => {
    const updated = [...blankAnswers];
    updated[index] = value;
    setBlankAnswers(updated);
  };

  const handleMatchingChange = (index, value) => {
    const updated = [...matchingAnswers];
    updated[index] = { ...updated[index], right: value };
    setMatchingAnswers(updated);
  };

  const handleMultipleToggle = (id) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((opt) => opt !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!currentQuestion) return;

    const payload = {
      question: currentQuestion.id,
      question_group_id: questionGroupId,
      lesson_log_id: lessonLogId,
      question_type: currentQuestion.type, // 👈 ADD THIS
    };

    // Attach the correct payload key based on question type
    switch (currentQuestion.type) {
      case "single":
      case "true_false":
        if (!selectedOption) return; // Prevent submitting if not answered
        payload.selected_options = [selectedOption];
        break;

      case "multiple":
        if (!selectedOptions.length) return;
        payload.selected_options = selectedOptions;
        break;

      case "fill_blank":
        payload.structured_answer = {
          blanks: blankAnswers,
        };
        break;

      case "matching":
        payload.structured_answer = matchingAnswers;
        break;

      default:
        return; // Do nothing if question type is unsupported
    }

    try {
      const res = await submitAnswer(payload);

      setIsCorrect(res?.is_correct);
      setShowResult(true);

      // Save the next question but don't navigate yet
      if (res?.next_question) {
        setNextQuestionId(res.next_question.id);
        // Update question_group_id if provided in the response
        if (res?.question_group_id) {
          setQuestionGroupId(res.question_group_id);
        }
      } else {
        setCurrentQuestion(null); // No more questions
      }

      // Reset all answer states
      setSelectedOption(null);
      setSelectedOptions([]);
      setBlankAnswers(["", "", ""]);
      setMatchingAnswers([
        { left: "لاعب ١", right: "" },
        { left: "لاعب ٢", right: "" },
      ]);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const handleNext = () => {
    setShowResult(false);
    setIsCorrect(null);

    if (nextQuestionId) {
      navigate(`/questions/${nextQuestionId}`, {
        state: {
          question: null, // So it fetches again
          lesson_log_id: lessonLogId,
          question_group_id: questionGroupId,
        },
      });
    } else {
      setCurrentQuestion(null);
    }
  };

  if (!currentQuestion && !showResult) {
    return <div className="text-center mt-8">لا يوجد سؤال</div>;
  }

  const renderQuestionByType = () => {
    switch (currentQuestion?.type) {
      case "single":
        return (
          <SingleChoiceQuestion
            question={currentQuestion}
            selectedOption={selectedOption}
            onChange={setSelectedOption}
            isCorrect={isCorrect}
            showResult={showResult}
          />
        );
      case "multiple":
        return (
          <MultipleChoiceQuestion
            options={currentQuestion.options}
            selectedOptions={selectedOptions}
            onToggle={handleMultipleToggle}
          />
        );
      case "true_false":
        return (
          <TrueFalseQuestion
            options={currentQuestion.options}
            selectedOption={selectedOption}
            onSelect={setSelectedOption}
            result={
              showResult
                ? { correct_options: currentQuestion.correct_options }
                : null
            }
          />
        );

      case "fill_blank":
        return (
          <FillBlankQuestion
            question={currentQuestion} // pass the whole question object here
            answer={blankAnswers}
            onChange={setBlankAnswers}
            showResult={showResult}
            isCorrect={isCorrect}
          />
        );

      case "matching":
        return (
          <MatchingQuestion
            pairs={matchingAnswers}
            onChange={handleMatchingChange}
          />
        );
      default:
        return <div>نوع السؤال غير معروف</div>;
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(to bottom, #31A9D6, #205CC7), url(${bgImage})`,
      }}
    >
      <div className="p-4 w-full max-w-2xl opacity-90">
        <Card elevation={3} className="bg-white/90">
          <CardContent>
            {currentQuestion && (
              <>
                <h2 className="text-xl font-bold text-right mb-6">
                  {currentQuestion.text}
                </h2>
                {renderQuestionByType()}
              </>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-4">
              {!showResult && (
                <button
                  onClick={handleSubmit}
                  className="bg-primary text-black py-2 px-4 rounded hover:bg-primary-dark"
                  disabled={loading}
                >
                  تأكيد الإجابة
                </button>
              )}

              {showResult && (
                <button
                  onClick={handleNext}
                  className="bg-blue-600 text-black py-2 px-4 rounded hover:bg-blue-700"
                >
                  التالي
                </button>
              )}
            </div>

            {/* Feedback message */}
            {showResult && (
              <div className="mt-4 text-right">
                <p
                  className={`font-bold mb-2 ${
                    isCorrect ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isCorrect ? "إجابة صحيحة" : "إجابة خاطئة"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionPage;