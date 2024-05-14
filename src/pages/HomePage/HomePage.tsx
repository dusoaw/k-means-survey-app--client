import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import { useHomePageStore } from "../../store/homePageStore";
import { deleteAllCookies, getTokenCookie } from "../../helpers/authCheck";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { api } from "../../helpers/api";
import { useForm } from "react-hook-form";

type EditSurveyNameFormType = {
    surveyName: string;
}

export const HomePage = () => {
    const [surveyNameEditing, setSurveyNameEditing] = useState<string | null>(null);
    const { surveys, fetchSurveys } = useHomePageStore();

    const navigate = useNavigate();
    
    useEffect(() => {
        if(!getTokenCookie()) {
            navigate('/not-found', {
                replace: true
            });
        }

        fetchSurveys();
    }, [])

    const handleAddSurveyButtonClick = () => {
        navigate('/survey/new');
    }

    const handleDeleteIconClick = (surveyId: string) => {
        api.delete(`/surveys/${surveyId}`)
            .then(() => {
                fetchSurveys();
            })
            .catch((e) => {
                if(e.response.status === 401) {
                    deleteAllCookies();
                    
                    navigate('/login', {
                        replace: true
                    });
                }
            })
    }

    const form = useForm<EditSurveyNameFormType>({
        defaultValues: {
            surveyName: ""
        }
    });

    const { register, handleSubmit, formState } = form;
    const { errors } = formState;

    const onSubmit = (data: EditSurveyNameFormType) => {
        if(surveyNameEditing !== null) {
            api.put("/surveys", { surveyId: surveyNameEditing, surveyName: data.surveyName })
                .then(() => {
                    setSurveyNameEditing(null);
                    fetchSurveys();
                })
                .catch((e) => {
                    if(e.response.status === 401) {
                        deleteAllCookies();
                        
                        navigate('/not-found', {
                            replace: true
                        });
                    }
                })
        }
    }
    
    return (
        <div className="home-page">
            <div className="title">Your surveys:</div>
            <div className="home-container">
                <Dialog open={surveyNameEditing !== null} onClose={() => setSurveyNameEditing(null)}>
                    <DialogTitle>Edit the survey name</DialogTitle>
                    <DialogContent>
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <Stack spacing={2} width={420}>
                                <TextField 
                                    label="Survey name" 
                                    type="text"
                                    variant="outlined"
                                    {...register("surveyName", {
                                        required: "New survey name is required",
                                    })}
                                    error={!!errors.surveyName}
                                    helperText={errors.surveyName?.message}
                                />
                                <Button 
                                    size="large" 
                                    type="submit" 
                                    variant="contained">
                                        Update
                                </Button>
                            </Stack>
                        </form>
                    </DialogContent>
                </Dialog>
                <Box className="survey-list">
                    <Stack spacing={5} width={900}>
                        {
                            surveys.map(survey => {
                                return (
                                    <div className="survey-card" key={survey.id}>
                                        <div className="card-title" onClick={() => navigate(`/results/${survey.id}`)}>
                                            {survey.surveyName}
                                        </div>
                                        <div className="icons">
                                            <EditIcon 
                                                sx={{cursor: "pointer"}}
                                                onClick={() => setSurveyNameEditing(survey.id)}
                                            />
                                            <DeleteForeverIcon
                                                sx={{cursor: "pointer"}}
                                                onClick={() => handleDeleteIconClick(survey.id)}
                                            />
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </Stack>
                </Box>
                <div className="add-button" onClick={handleAddSurveyButtonClick}><AddIcon fontSize="large"/></div>
            </div>
        </div>
    )
}