import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./ThanksPage.css";

export const ThanksPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if(!location.state || location.state.description === undefined) {
            navigate('/not-found');
        }
    }, [location, navigate]);

    if (!location.state || location.state.description === undefined) {
        return null;
    }

    return (
        <div className="thanks-page">
            <div className="title">Дякуємо!</div>
            <div className="description">
                {location.state.description}
            </div>
            {
                location.state.link && (
                    <Link 
                        to={location.state.link}
                        style={{marginTop: "32px", fontSize: "24px", color: "#03AED2"}}
                    >
                        {`${window.location.origin}${location.state.link}`}
                    </Link>
                )
            }
        </div>
    )
}