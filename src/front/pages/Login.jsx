import { Link, useNavigate } from "react-router-dom";
import { useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"

const initialState = {
    email: "",
    password: ""
}
export const Login = () => {

    const [user, setUser] = useState(initialState)

    const {store, dispatch} = useGlobalReducer()
    const navigate = useNavigate()

    const handleChange = (event) => {
        setUser({
            ...user,
            [event.target.name]: event.target.value
        })
    }
    const handleSubmit = async (event) => {
        event.preventDefault()
        const backendUrl = import.meta.env.VITE_BACKEND_URL
        const response = await fetch(`${backendUrl}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        const data = await response.json()
        if (response.ok) {
      localStorage.setItem("token", data.token)
      dispatch({
        type : "LOGIN", 
        payload: data.token
      })
      setTimeout(() => {
        navigate("/")
      }, 2000)
    } else if (response.status == 400) {
      alert("Hubo un error al iniciar sesion")
    } else {
      alert("Comunicate con soporte")
    }
    }



    return (
        <div className="container">
            <div className="row justify-content-center">
                <h3 className=" text-center mb-4">Ingresar a la plataforma</h3>
                <div className="col-12 col-md-6 border py-4">
                    <form
                        onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlfor="inputEmail" className="form-label">Email:</label>
                            <input
                                type="text"
                                id="inputEmail"
                                className="form-control"
                                onChange={handleChange}
                                name="email"
                                value={user.email} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlfor="inputPassword5" className="form-label">Password:</label>
                            <input
                                type="password"
                                id="inputPassword5"
                                className="form-control"
                                onChange={handleChange}
                                name="password"
                                value={user.password}
                            />
                        </div>
                        <button 
                        className="btn btn-primary w-100"
                        onSubmit={handleSubmit}>
                            Iniciar Sesión
                        </button>
                    </form>
                </div>
                <div className="w-100"></div>
                <div className="col-12 col-md-6 text-center">
                    ¿No tienes una cuenta?
                    <Link to="/demo" className="m-2">
                        Regístrate
                    </Link>
                </div>
            </div>
        </div>
    );
};
