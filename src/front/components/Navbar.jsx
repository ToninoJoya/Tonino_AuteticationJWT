import { Link, useNavigate, useLocation } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"

export const Navbar = () => {

    const location = useLocation();
	const { store, dispatch } = useGlobalReducer()
	const navigate = useNavigate()

	const handleLogout = () => {
		dispatch({ type: "LOGOUT" });
		navigate("/login");
	}

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Home</span>
				</Link>
				{store.token ?
				<>
				<div className="ml-auto">
					<button 
						className="btn btn-primary p-2 m-1"
						onClick={handleLogout}>Logout
                    </button>
				</div>
				</>:
				<>
                    {location.pathname !== '/demo' && (
                        <div className="ml-auto">
                            <Link to="/demo">
                                <button className="btn btn-primary p-2 m-1">Crear cuenta</button>
                            </Link>
                        </div>
                    )}
				</>
				}
			</div>
		</nav>
	);
};