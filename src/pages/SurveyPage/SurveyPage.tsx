import { useEffect, useState } from "react";
import { Button, Stack, TextField } from "@mui/material";
import { SurveyPageType } from "../NewSurveyPage/NewSurveyPage";
import "./SurveyPage.css";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../helpers/api";
import { useAnswerPageStore } from "../../store/answerPageStore";
import { deleteAllCookies } from "../../helpers/authCheck";

type SurveyFormType = {
    email: string;
    firstMetricAnswer: number;
    secondMetricAnswer: number;
}

export const SurveyPage = () => {
    const navigate = useNavigate();
    const { surveyId } = useParams();

    const { surveyData, fetchSurveyData } = useAnswerPageStore();

    useEffect(() => {
        const isPassed = localStorage.getItem(`${surveyId}`);
        
        if(isPassed) {
            navigate('/thanks', {
                state: {
                    description: `Дякуємо за вашу участь в опитуванні на цю тему та чесну відповідь! Нам дуже важлива ваша думка.`,
                },
                replace: true
            })
        }

        fetchSurveyData(surveyId || "");
    }, [])

    const form = useForm<SurveyFormType>({
        defaultValues: {
            email: "",
            firstMetricAnswer: 0,
            secondMetricAnswer: 0
        }
    });

    const { register, handleSubmit, formState } = form;
    const { errors } = formState;

    const onSubmit = (data: SurveyFormType) => {
        api.post(`/answers`, {...data, surveyId: surveyId})
            .then(() => 
                {
                    localStorage.setItem(`${surveyId}`, "passed");

                    navigate('/thanks', {
                        state: {
                            description: `Дякуємо за вашу участь в опитуванні на тему "${surveyData?.surveyName}" та чесну відповідь! Нам дуже важлива ваша думка.`,
                        },
                        replace: true
                    })
                }
            )
            .catch((e) => {
                if(e.response.status === 401) {
                    deleteAllCookies();
                    
                    navigate('/login', {
                        replace: true
                    });
                }
            });
    }

    return (
        <div className="survey-page">
            {surveyData !== null && 
            <>
                <div className="title">{surveyData.surveyName}</div>
                <div className="survey-container">
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Stack className="inputs-container" spacing={4} width={420}>
                            <TextField 
                                label="Email" 
                                type="email"
                                variant="outlined"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Invalid email format"
                                    }
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                            <TextField 
                                label={surveyData.firstMetricName}
                                type="number"
                                variant="outlined"
                                {...register("firstMetricAnswer", {
                                    required: `${surveyData.firstMetricName} is required`,
                                    min: {
                                        value: 0,
                                        message: `${surveyData.firstMetricName} value must be positive`
                                    },
                                    validate: {
                                        greaterThanFrom: (value) => {
                                            return value > surveyData.firstMetricFrom || `${surveyData.firstMetricName} value should be greater than ${surveyData.firstMetricFrom}`
                                        },
                                        lowerThanTo: (value) => {
                                            return value < surveyData.firstMetricTo ||  `${surveyData.firstMetricName} value should be lower than ${surveyData.firstMetricTo}`
                                        }
                                    }
                                })}
                                error={!!errors.firstMetricAnswer}
                                helperText={errors.firstMetricAnswer?.message}
                            />
                            <TextField 
                                label={surveyData.secondMetricName}
                                type="number"
                                variant="outlined"
                                {...register("secondMetricAnswer", {
                                    required: `${surveyData.secondMetricName} is required`,
                                    min: {
                                        value: 0,
                                        message: `${surveyData.secondMetricName} value must be positive`
                                    },
                                    validate: {
                                        greaterThanFrom: (value) => {
                                            return value > surveyData.secondMetricFrom || `${surveyData.secondMetricName} value should be greater than ${surveyData.secondMetricFrom}`
                                        },
                                        lowerThanTo: (value) => {
                                            return value < surveyData.secondMetricTo ||  `${surveyData.secondMetricName} value should be lower than ${surveyData.secondMetricTo}`
                                        }
                                    }
                                })}
                                error={!!errors.secondMetricAnswer}
                                helperText={errors.secondMetricAnswer?.message}
                            />
                            <Button 
                                size="large" 
                                type="submit" 
                                variant="contained">
                                    Submit
                            </Button>
                        </Stack>
                    </form>
                </div>
            </>
        }
        </div>
    )
}