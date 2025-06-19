import React, { useEffect, useState } from "react"; // 1. Importa useState
import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {
    const { store, dispatch } = useGlobalReducer();

    const [userData, setUserData] = useState(null);

    if (!store.token) {
        return <Navigate to="/login" />;
    }

    const getMe = async () => {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${backendUrl}/me`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}` 
                }
            });

            if (!response.ok) {
                dispatch({ type: "LOGOUT" });
                return;
            }

            const data = await response.json();
			console.log(data)
            setUserData(data); 

        } catch (error) {
            console.error("Error al obtener los datos del usuario:", error);
            dispatch({ type: "LOGOUT" });
        }
    };

    
    useEffect(() => {
        getMe();
    }, []);

    return (
        <div className="container text-center mt-5">
            {
                !userData ? (
                    <h1>Cargando perfil...</h1>
                ) : (
                    
                    <div>
                        <h1>¡Bienvenido, {userData.email}!</h1>
                        <p className="mt-4">Has iniciado sesión correctamente.</p>
                        <p>Tu id es: {userData.id}</p>
                    </div>
                )
            }
        </div>
    );
};