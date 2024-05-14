import { create } from "zustand";
import { api } from "../helpers/api";
import { SurveyPageType } from "../pages/NewSurveyPage/NewSurveyPage";
import { deleteAllCookies } from "../helpers/authCheck";

interface AnswerPageStore {
  surveyData: SurveyPageType | null;
  fetchSurveyData: (id: string) => {};
}

export const useAnswerPageStore = create<AnswerPageStore>(set => ({
    surveyData: null,
    fetchSurveyData: async (id: string) => {
        try {
            const res = await api.get(`/surveys/${id}`);
            await set({ surveyData: res.data.survey });
        } catch(e: any) {
            if(e.response.status === 401) {
                deleteAllCookies();
            }
        }
    }
})

)