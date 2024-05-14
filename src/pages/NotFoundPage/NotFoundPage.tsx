import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NotFoundPage.css";

export const NotFoundPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/not-found');
    }, [navigate]);

    return(
        <div className="not-found-page">
                <div className="title">Ууууууууууууупс!</div>
                <div className="description">
                    Сторінку не знайдено. Можливо її не існує, або ж ви неавторизувались для її перегляду
                </div>
                <Link 
                    to="/"
                    style={{marginTop: "32px", fontSize: "32px", color: "#03AED2"}}
                >
                    Поверніться на головну сторінку
                </Link>
                <Link 
                    to="/login"
                    style={{marginTop: "16px", fontSize: "24px", color: "#03AED2"}}
                >
                    Або увійдіть
                </Link>
            </div>
    )
}