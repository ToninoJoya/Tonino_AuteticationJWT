// Import necessary components from react-router-dom and other parts of the application.
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useState } from "react"
// Custom hook for accessing the global state.

const intialState = {
  email: "",
  lastname: "",
  password: ""
}

export const Demo = () => {
  // Access the global state and dispatch function using the useGlobalReducer hook.
  const { store, dispatch } = useGlobalReducer()

  const [user, setUser] = useState(intialState)
  const navigate = useNavigate()

  const handleOnChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value
    })
  }
  const handleSubmit = async (event) => {

    event.preventDefault()
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    
    const response = await fetch(`${backendUrl}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
    if (response.ok) {
      setUser(intialState)
      setTimeout(() => {
        navigate("/login")
      }, 1000)
    } else if (response.status === 400) {
      alert("El usuario ya existe")
    } else {
      alert("Hubo un error al registrar el usuario")
    }

  }


  return (
    <div className="container">
      <div className="row justify-content-center">
        <h3 className=" text-center mb-4">Regístrate</h3>
        <div className="col-12 col-md-6 border py-4">
          <form
            onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="inputLastName" className="form-label">Lastname:</label>
              <input
                type="text"
                id="inputLastName"
                name="lastname"
                className="form-control"
                onChange={handleOnChange}
                value = {user.lastname}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="inputEmail" className="form-label">Email:
              </label>
              <input
                type="text"
                id="inputEmail"
                className="form-control"
                name="email"
                onChange={handleOnChange}
                value = {user.email} />


            </div>
            <div className="form-group mb-3">
              <label htmlFor="inputPassword5" className="form-label">Password:</label>
              <input
                type="password"
                id="inputPassword5"
                className="form-control"
                name="password"
                onChange={handleOnChange}
                value = {user.password}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Crear cuenta
            </button>
          </form>
        </div>
        <div className="w-100"></div>
        <div className="col-12 col-md-6 text-center">
          ¿Ya tienes una cuenta?
          <Link to="/login" className="m-2">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
};
