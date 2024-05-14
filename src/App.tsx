import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import { RegisterPage } from './pages/RegisterPage/RegisterPage';
import { HomePage } from './pages/HomePage/HomePage';
import { NewSurveyPage } from './pages/NewSurveyPage/NewSurveyPage';
import { ThanksPage } from './pages/ThanksPage/ThanksPage';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { ResultsPage } from './pages/ResultsPage/ResultsPage';
import { SurveyPage } from './pages/SurveyPage/SurveyPage';

function App() {
    const theme = createTheme({
        components: {
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#B5C18E',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#B5C18E',
                        },
                    }
                }
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        color: 'black',
                        backgroundColor: '#B5C18E',
                        '&:hover': {
                            backgroundColor: '#97a66c'
                        }
                    }
                }
            }
        }
    })

    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/results/:surveyId" element={<ResultsPage />} />
                    <Route path="/survey/new" element={<NewSurveyPage />} />
                    <Route path="/survey/:surveyId" element={<SurveyPage />} />
                    <Route path="/thanks" element={<ThanksPage />} />
                    <Route path="/*" element={<NotFoundPage />} />
                </Routes>
            </div>
        </ThemeProvider>
    );
}

export default App;
