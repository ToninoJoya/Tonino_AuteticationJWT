import { Link } from "react-router-dom";

export const Login = () => {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <h3 className=" text-center mb-4">Ingresar a la plataforma</h3>
                <div className="col-12 col-md-6 border py-4">
                    <form>
                        <div className="form-group mb-3">
                            <label htmlfor="inputEmail" className="form-label">Email:</label>
                            <input
                                type="text"
                                id="inputEmail"
                                className="form-control" />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlfor="inputPassword5" className="form-label">Password:</label>
                            <input
                                type="password"
                                id="inputPassword5"
                                className="form-control"
                            />
                        </div>
                        <div className="btn btn-primary w-100">
                            Iniciar Sesión
                        </div>
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
