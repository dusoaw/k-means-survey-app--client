import { Button, Stack, TextField } from "@mui/material";
import "./NewSurveyPage.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { api } from "../../helpers/api";
import { useEffect } from "react";
import { deleteAllCookies, getTokenCookie } from "../../helpers/authCheck";

export type SurveyPageType = {
    surveyName: string;
    firstMetricName: string
    firstMetricFrom: number;
    firstMetricTo: number;
    secondMetricName: string;
    secondMetricFrom: number;
    secondMetricTo: number;
};

export const NewSurveyPage = () => {

    const navigate = useNavigate();
    
    useEffect(() => {
        if(!getTokenCookie()) {
            navigate('/not-found', {
                replace: true
            });
        }
    }, [])

    const form = useForm<SurveyPageType>({
        defaultValues: {
            surveyName: "",
            firstMetricName: "",
            firstMetricFrom: 0,
            firstMetricTo: 100,
            secondMetricName: "",
            secondMetricFrom: 0,
            secondMetricTo: 100
        }
    });

    const { register, handleSubmit, formState } = form;
    const { errors } = formState;

    const onSubmit = (data: SurveyPageType) => {
        api.post(`/surveys`, data)
            .then((d) => 
                navigate('/thanks', {
                    state: {
                        description: "Дякуємо за користування нашою платформою для опитувань! Ось посилання на ваше опитування:",
                        link: `/survey/${d.data.survey._id}`
                    }
                })
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
        <div className="new-survey-page">
            <div className="title">Create new survey</div>
            <div className="new-survey-container">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack className="inputs-container" spacing={4} width={600}>
                    <TextField 
                        label="Survey name" 
                        type="text"
                        variant="outlined"
                        {...register("surveyName", {
                            required: "Survey name is required"
                        })}
                        error={!!errors.surveyName}
                        helperText={errors.surveyName?.message}
                    />
                    <Stack spacing={1}>
                        <TextField
                            label="First metric" 
                            type="text"
                            variant="outlined"
                            {...register("firstMetricName", {
                                required: "First metric is required"
                            })}
                            error={!!errors.firstMetricName}
                            helperText={errors.firstMetricName?.message}
                        />
                        <Stack direction="row" spacing={2}>
                            <TextField 
                                label="From" 
                                type="number"
                                variant="outlined"
                                {...register("firstMetricFrom", {
                                    required: "Range is required",
                                    min: {
                                        value: 0,
                                        message: "From value must be positive"
                                    },
                                    validate: {
                                        lowerThanTo: (value, values) => {
                                            return value < values.firstMetricTo || "From must be lower than To value"
                                        }
                                    }
                                })}
                                error={!!errors.firstMetricFrom}
                                helperText={errors.firstMetricFrom?.message}
                            />
                            <TextField 
                                label="To" 
                                type="number"
                                variant="outlined"
                                {...register("firstMetricTo", {
                                    required: "Range is required",
                                    min: {
                                        value: 0,
                                        message: "To value must be positive"
                                    },
                                    validate: {
                                        greaterThanFrom: (value, values) => {
                                            return value > values.firstMetricFrom || "To value must be greater than From value";
                                        }
                                    }
                                })}
                                error={!!errors.firstMetricTo}
                                helperText={errors.firstMetricTo?.message}
                            />
                        </Stack>
                    </Stack>
                    <Stack spacing={1}>
                        <TextField 
                            label="Second metric" 
                            type="text"
                            variant="outlined"
                            {...register("secondMetricName", {
                                required: "Second metric is required"
                            })}
                            error={!!errors.secondMetricName}
                            helperText={errors.secondMetricName?.message}
                        />
                        <Stack direction="row" spacing={2}>
                            <TextField 
                                label="From" 
                                type="number"
                                variant="outlined"
                                {...register("secondMetricFrom", {
                                    required: "Range is required",
                                    min: {
                                        value: 0,
                                        message: "From value must be positive"
                                    },
                                    validate: {
                                        lowerThanTo: (value, values) => {
                                            return value < values.secondMetricTo || "From must be lower than To value"
                                        }
                                    }
                                })}
                                error={!!errors.secondMetricFrom}
                                helperText={errors.secondMetricFrom?.message}
                            />
                            <TextField 
                                label="To" 
                                type="number"
                                variant="outlined"
                                {...register("secondMetricTo", {
                                    required: "Range is required",
                                    min: {
                                        value: 0,
                                        message: "To value must be positive"
                                    },
                                    validate: {
                                        greaterThanFrom: (value, values) => {
                                            return value > values.secondMetricFrom || "To value must be greater than From value";
                                        }
                                    }
                                })}
                                error={!!errors.secondMetricTo}
                                helperText={errors.secondMetricTo?.message}
                            />
                        </Stack>
                    </Stack>
                    <Button 
                        size="large" 
                        type="submit" 
                        variant="contained">
                            Create
                    </Button>
                </Stack>
            </form>
            </div>
        </div>
    )
}