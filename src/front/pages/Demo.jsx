// Import necessary components from react-router-dom and other parts of the application.
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
// Custom hook for accessing the global state.

export const Demo = () => {
  // Access the global state and dispatch function using the useGlobalReducer hook.
  const { store, dispatch } = useGlobalReducer()

  return (
    <div className="container">
      <div className="row justify-content-center">
        <h3 className=" text-center mb-4">Regístrate</h3>
        <div className="col-12 col-md-6 border py-4">
          <form>
            <div className="form-group mb-3">
              <label htmlfor="inputLastName" className="form-label">Lastname:</label>
              <input
                type="password"
                id="inputLastName"
                name="lastname"
                className="form-control"
              />
            </div>
            <div className="form-group mb-3">
              <label htmlfor="inputEmail" className="form-label">Email:
              </label>
              <input
                type="text"
                id="inputEmail"
                className="form-control"
                name = "email" />
                
            </div>
            <div className="form-group mb-3">
              <label htmlfor="inputPassword5" className="form-label">Password:</label>
              <input
                type="password"
                id="inputPassword5"
                className="form-control"
                name = "password"
              />
            </div>
            <div className="btn btn-primary w-100">
              Crear cuenta
            </div>
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
