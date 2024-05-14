import { Button, Stack, TextField} from "@mui/material"
import { useForm } from "react-hook-form";
import './LoginPage.css';
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../helpers/api";

type LoginFormType = {
    email: string;
    password: string;
}

export const LoginPage = () => {
    const navigate = useNavigate();

    const form = useForm<LoginFormType>({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const { register, handleSubmit, formState } = form;
    const { errors } = formState;

    const onSubmit = (data: LoginFormType) => {
        api.post(`/auth/login`, data)
            .then(() => navigate('/', {
                replace: true
            }));
    }

    return (
        <div className="login-page">
            <div className="title">Login</div>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack className="inputs-container" spacing={5} width={420}>
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
                        label="Password" 
                        type="password" 
                        placeholder="Enter your password" 
                        variant="outlined"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters"
                            }
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    <Button 
                        size="large" 
                        type="submit" 
                        variant="contained">
                            Login
                    </Button>
                    <Link 
                        to="/register"
                        style={{color: "#03AED2"}}
                    >
                        Don't have an account? Register!
                    </Link>
                </Stack>
            </form>
      </div>
    )
}