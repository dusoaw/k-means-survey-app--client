import { create } from "zustand";
import { ResultsPageType } from "../pages/ResultsPage/ResultsPage";
import { api } from "../helpers/api";
import { Point, getClusteredData } from "../helpers/k-means-method";
import { deleteAllCookies } from "../helpers/authCheck";

interface ResultsPageStore {
    resultsData: ResultsPageType | null;
    points: Point[];
    fetchResultsData: (id: string) => {};
}

export const useResultsPageStore = create<ResultsPageStore>(set => ({
    resultsData: null,
    points: [],
    fetchResultsData: async (id: string) => {
        try {
            const res = await api.get(`/answers/${id}`);
            await set({ resultsData: res.data, points: getClusteredData(res.data.answers) });
        } catch(e: any) {
            if(e.response.status === 401) {
                deleteAllCookies();
            }
        }
    }
}));