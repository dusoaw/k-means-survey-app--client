import { Button, Stack, TextField} from "@mui/material"
import { useForm } from "react-hook-form";
import './RegisterPage.css';
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../helpers/api";

type RegisterFormType = {
    email: string;
    password: string;
}

export const RegisterPage = () => {
    const navigate = useNavigate();

    const form = useForm<RegisterFormType>({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const { register, handleSubmit, formState } = form;
    const { errors } = formState;

    const onSubmit = (data: RegisterFormType) => {
        api.post(`/auth/register`, data)
            .then(() => navigate('/', {
                replace: true
            }));
    }

    return (
        <div className="register-page">
            <div className="title">Register</div>
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
                            Register
                    </Button>
                    <Link 
                        to="/login"
                        style={{color: "#03AED2"}}
                    >
                        Already have an account? Login!
                    </Link>
                </Stack>
            </form>
      </div>
    )
}