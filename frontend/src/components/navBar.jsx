import { Link, useSearchParams, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from '../context/authContext';
import { LogOut, Menu, CircleUser, UserCog, Home } from "lucide-react";
import Sidebar from "./sidebar";

//import { useCarrito } from "../context/carrito";


// const { carrito } = useCarrito(); //
// <Link to="/carrito" className="hover:underline">
//   Carrito ({carrito.length})
// </Link>



function Navbar() {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false); 
    const location = useLocation();

    const isMenu = location.pathname === "/"
  return (
    
    <nav className="sticky top-0 bg-naranja text-white p-4 flex justify-between items-center shadow-md z-50">
      <button
        onClick={() => setSidebarOpen(true)}
        className="text-white-700 bg-transparent hover:text-gray-900">
          <Menu size={24} />
      </button>

      <h1 className="text-xl font-bold">PoS3</h1>

      <div className="flex gap-4">
        {/* <Link to="/" className="hover:underline">Menú</Link> */}
        
        
        {user?.cargo === "admin" && (
            <div className="flex gap-4">
                
            </div>
        )} 
        {user?.cargo === 'cliente' && ( 
            <div> 
            </div>
        )}

        {/* Si hay un usuario logueado, mostrar "Cerrar Sesión" */}
        {isMenu ? (
          user ? (
            <Link to="/config" className="mr-4 hover:text-black bg-transparent text-white"><UserCog /></Link> //va a config 
          ) : (
            <Link to="/login" className="mr-4 hover:text-black bg-transparent text-white"><CircleUser /></Link> //usuario no logeado
          )
        ) : (
          <Link to="/" className="mr-4 hover:text-black bg-transparent text-white">< Home/></Link> //va al menu
        )}
        
      </div>
      {/* Sidebar deslizante */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </nav>
    
  );
}

export default Navbar;

