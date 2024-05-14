import { create } from "zustand";
import { api } from "../helpers/api";
import { deleteAllCookies } from "../helpers/authCheck";

export type SurveyInfo = {
    id: string;
    surveyName: string;
}

interface HomePageStore {
  surveys: SurveyInfo[];
  fetchSurveys: () => {};
}

export const useHomePageStore = create<HomePageStore>(set => ({
    surveys: [],
    fetchSurveys: async () => {
        try {
            const res = await api.get("/surveys");
            await set({ surveys: res.data.surveys.map(
                (survey: any) => { return  {id: survey._id, surveyName: survey.surveyName}}
            ) });
        } catch(e: any) {
            if(e.response.status === 401) {
                deleteAllCookies();
            }
        }
    }
})

)