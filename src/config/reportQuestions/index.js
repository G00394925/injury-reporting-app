import { getHealthyQuestions } from "./healthyQuestions";

export const getQuestions = (healthStatus, updateAnswer, answers, setInjured, setIll, setConsulted, setTimeLoss, setTrained) => {
	return getHealthyQuestions(updateAnswer, answers, setInjured, setIll, setConsulted, setTimeLoss, setTrained)
}