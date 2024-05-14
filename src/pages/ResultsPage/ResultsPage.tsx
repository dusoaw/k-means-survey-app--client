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

const mockAnswers = [
    {
      id: 1,
      email: "john@email.com",
      firstMetricAnswer: 18,
      secondMetricAnswer: 65000
    },
    {
      id: 2,
      email: "jane@email.com",
      firstMetricAnswer: 19,
      secondMetricAnswer: 125000
    },
    {
      id: 3,
      email: "alex@email.com",
      firstMetricAnswer: 20,
      secondMetricAnswer: 35000
    },
    {
      id: 4,
      email: "sarah@email.com",
      firstMetricAnswer: 21,
      secondMetricAnswer: 185000
    },
    {
      id: 5,
      email: "michael@email.com",
      firstMetricAnswer: 22,
      secondMetricAnswer: 75000
    },
    {
      id: 6,
      email: "emily@email.com",
      firstMetricAnswer: 23,
      secondMetricAnswer: 110000
    },
    {
      id: 7,
      email: "david@email.com",
      firstMetricAnswer: 24,
      secondMetricAnswer: 20000
    },
    {
      id: 8,
      email: "samantha@email.com",
      firstMetricAnswer: 25,
      secondMetricAnswer: 140000
    },
    {
      id: 9,
      email: "chris@email.com",
      firstMetricAnswer: 26,
      secondMetricAnswer: 5000
    },
    {
      id: 10,
      email: "olivia@email.com",
      firstMetricAnswer: 27,
      secondMetricAnswer: 155000
    },
    {
      id: 11,
      email: "jacob@email.com",
      firstMetricAnswer: 28,
      secondMetricAnswer: 90000
    },
    {
      id: 12,
      email: "sophia@email.com",
      firstMetricAnswer: 29,
      secondMetricAnswer: 170000
    },
    {
      id: 13,
      email: "william@email.com",
      firstMetricAnswer: 30,
      secondMetricAnswer: 12000
    },
    {
      id: 14,
      email: "ava@email.com",
      firstMetricAnswer: 31,
      secondMetricAnswer: 200000
    },
    {
        id: 15,
        email: "ethan@email.com",
        firstMetricAnswer: 32,
        secondMetricAnswer: 20000
    },
    {
        id: 16,
        email: "mia@email.com",
        firstMetricAnswer: 33,
        secondMetricAnswer: 180000
    },
    {
        id: 17,
        email: "matthew@email.com",
        firstMetricAnswer: 34,
        secondMetricAnswer: 130000
    },
    {
        id: 18,
        email: "isabella@email.com",
        firstMetricAnswer: 35,
        secondMetricAnswer: 19000
    },
    {
        id: 19,
        email: "logan@email.com",
        firstMetricAnswer: 36,
        secondMetricAnswer: 175000
    },
    {
        id: 20,
        email: "amelia@email.com",
        firstMetricAnswer: 37,
        secondMetricAnswer: 80000
    },
    {
        id: 21,
        email: "benjamin@email.com",
        firstMetricAnswer: 38,
        secondMetricAnswer: 200000
    },
    {
        id: 22,
        email: "mia@email.com",
        firstMetricAnswer: 39,
        secondMetricAnswer: 30000
    },
    {
        id: 23,
        email: "daniel@email.com",
        firstMetricAnswer: 40,
        secondMetricAnswer: 195000
    },
    {
        id: 24,
        email: "harper@email.com",
        firstMetricAnswer: 41,
        secondMetricAnswer: 70000
    },
    {
        id: 25,
        email: "jackson@email.com",
        firstMetricAnswer: 42,
        secondMetricAnswer: 160000
    },
    {
        id: 26,
        email: "evelyn@email.com",
        firstMetricAnswer: 43,
        secondMetricAnswer: 15000
    },
    {
        id: 27,
        email: "mia@email.com",
        firstMetricAnswer: 44,
        secondMetricAnswer: 165000
    },
    {
        id: 28,
        email: "aiden@email.com",
        firstMetricAnswer: 45,
        secondMetricAnswer: 14000
    },
    {
        id: 29,
        email: "abigail@email.com",
        firstMetricAnswer: 46,
        secondMetricAnswer: 135000
    },
    {
        id: 30,
        email: "cameron@email.com",
        firstMetricAnswer: 47,
        secondMetricAnswer: 25000
    },
    {
      id: 31,
      email: "harper@email.com",
      firstMetricAnswer: 48,
      secondMetricAnswer: 120000
    },
    {
      id: 32,
      email: "ethan@email.com",
      firstMetricAnswer: 49,
      secondMetricAnswer: 10000
    },
    {
      id: 33,
      email: "ava@email.com",
      firstMetricAnswer: 50,
      secondMetricAnswer: 105000
    },
    {
      id: 34,
      email: "dylan@email.com",
      firstMetricAnswer: 51,
      secondMetricAnswer: 55000
    },
    {
      id: 35,
      email: "madison@email.com",
      firstMetricAnswer: 52,
      secondMetricAnswer: 130000
    },
    {
      id: 36,
      email: "aiden@email.com",
      firstMetricAnswer: 53,
      secondMetricAnswer: 60000
    },
    {
      id: 37,
      email: "emily@email.com",
      firstMetricAnswer: 54,
      secondMetricAnswer: 95000
    },
    {
      id: 38,
      email: "jacob@email.com",
      firstMetricAnswer: 55,
      secondMetricAnswer: 145000
    },
    {
      id: 39,
      email: "addison@email.com",
      firstMetricAnswer: 56,
      secondMetricAnswer: 40000
    },
    {
      id: 40,
      email: "noah@email.com",
      firstMetricAnswer: 57,
      secondMetricAnswer: 180000
    },
    {
      id: 41,
      email: "chloe@email.com",
      firstMetricAnswer: 58,
      secondMetricAnswer: 30000
    },
    {
      id: 42,
      email: "william@email.com",
      firstMetricAnswer: 59,
      secondMetricAnswer: 170000
    },
    {
      id: 43,
      email: "aubrey@email.com",
      firstMetricAnswer: 60,
      secondMetricAnswer: 70000
    },
    {
      id: 44,
      email: "liam@email.com",
      firstMetricAnswer: 61,
      secondMetricAnswer: 160000
    },
    {
      id: 45,
      email: "zoe@email.com",
      firstMetricAnswer: 62,
      secondMetricAnswer: 35000
    },
    {
      id: 46,
      email: "lucas@email.com",
      firstMetricAnswer: 63,
      secondMetricAnswer: 195000
    },
    {
      id: 47,
      email: "mia@email.com",
      firstMetricAnswer: 64,
      secondMetricAnswer: 80000
    },
    {
      id: 48,
      email: "julia@email.com",
      firstMetricAnswer: 65,
      secondMetricAnswer: 110000
    },
    {
      id: 49,
      email: "brayden@email.com",
      firstMetricAnswer: 66,
      secondMetricAnswer: 17000
    },
    {
      id: 50,
      email: "mason@email.com",
      firstMetricAnswer: 67,
      secondMetricAnswer: 125000
    },
  ];
  
  
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