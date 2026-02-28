import { getFollowUpQuestions } from "./followUpQuestions";
import { getHealthyQuestions } from "./healthyQuestions";

export const getQuestions = (
  healthStatus,
  updateAnswer,
  answers,
  setInjured,
  setIll,
  setConsulted,
  setTimeLoss,
  setTrained,
  recoveryDate
) => {
  // If athlete is currently injured or recovering, use followup questions
  if (healthStatus === "No competing" || healthStatus === "No training or competing") {
    return getFollowUpQuestions(updateAnswer, answers, recoveryDate, null, null);
  }

  // Otherwise use healthy athlete questions
  return getHealthyQuestions(updateAnswer, answers, setInjured, setIll, setConsulted, setTimeLoss, setTrained);
};
