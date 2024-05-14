import { useEffect, useState } from "react";
import "./ResultsPage.css";
import { DataGrid, GridColDef, GridToolbar, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { ScatterChart } from '@mui/x-charts';
import { Point, getClusteredData } from "../../helpers/k-means-method";
import { useNavigate, useParams } from "react-router-dom";
import { getTokenCookie } from "../../helpers/authCheck";
import { useResultsPageStore } from "../../store/resultsPageStore";

export type SurveyAnswer = {
    email: string;
    firstMetricAnswer: number;
    secondMetricAnswer: number;
}

export type ResultsPageType = {
    surveyName: string;
    answers: SurveyAnswer[];
}

const colors = ["#7469B6", "#0A6847", "#FF0080"];
  
  
const columns: GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        width: 70
    },
    {
        field: "email",
        headerName: "Поштова скринька",
        width: 350
    },
    {
        field: "x",
        headerName: "Перший показник",
        type: "number",
        width: 200
    },
    {
        field: "y",
        headerName: "Другий показник",
        type: "number",
        width: 200
    },
    {
        field: "claster",
        headerName: "Кластер",
        type: "number",
        width: 70,
        renderCell: (params) => (
            <div className="circle-container">
                <div className="circle" style={{backgroundColor: colors[params.row.claster]}}></div>
            </div>
        )
    }
]

function CustomToolbar() {
    return (
      <GridToolbarContainer sx={{display: "flex", justifyContent: "right", marginBottom: "8px"}}>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

export const ResultsPage = () => {
    const [isAnswersTabActive, setIsAnswersTabActive] = useState(true);
    // const [points, setPoints] = useState<Point[]>();

    const { surveyId } = useParams();
    const { resultsData, points, fetchResultsData } = useResultsPageStore();

    const navigate = useNavigate();
    
    useEffect(() => {
        if(!getTokenCookie()) {
            navigate('/not-found', {
                replace: true
            });
        }

        fetchResultsData(surveyId || "");
    }, [])

    return(
        <div className="results-page">
            <div className="title">{resultsData?.surveyName}</div>
            <div className="tabs">
                <div 
                    className={`tab${isAnswersTabActive ? " active" : ""}`}
                    onClick={() => setIsAnswersTabActive(true)}
                >
                    Відповіді
                </div>
                <div 
                    className={`tab${!isAnswersTabActive ? " active" : ""}`}
                    onClick={() => setIsAnswersTabActive(false)}
                >
                    Дашборд
                </div>
            </div>
            <div className="results-container">
                {
                    isAnswersTabActive
                        ? <DataGrid
                            rows={points.map((point, index) => {
                                return {
                                    ...point,
                                    id: index
                                }
                            })}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        page: 0,
                                        pageSize: 7
                                    }
                                }
                            }} 
                            pageSizeOptions={[5, 7]}
                            slots={{ toolbar: CustomToolbar }}
                        />
                        : <ScatterChart
                            width={800}
                            height={500}
                            colors={colors}
                            series={[
                                {
                                    label: "Кластер 1",
                                    markerSize: 8,
                                    data: points
                                        .filter((p) => p.claster === 0)
                                        .map((p, index) => ({x: p.x, y: p.y, id: index, email: p.email}))
                                },
                                {
                                    label: "Кластер 2",
                                    markerSize: 8,
                                    data: points
                                        .filter((p) => p.claster === 1)
                                        .map((p, index) => ({x: p.x, y: p.y, id: index}))
                                },
                                {
                                    label: "Кластер 3",
                                    markerSize: 8,
                                    data: points
                                        .filter((p) => p.claster === 2)
                                        .map((p, index) => ({x: p.x, y: p.y, id: index}))
                                }
                            ]
                            }
                        />
                }
            </div>
        </div>
    )
}