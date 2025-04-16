import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from '../context/authContext';
import { useState } from "react";

function Sidebar({ isOpen, onClose }) {
    const { user, logout } = useAuth();
    const [mostrarModal, setMostrarModal] = useState(false);
  return (
    <>
      {/* Fondo oscuro al abrir el sidebar */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />}

      {/* Sidebar deslizante */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        <div className="p-5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-naranja">{user? user.nombre : ''}</h2>
          {/* <button onClick={onClose} className="text-black bg-gray-400 hover:text-gray-900">
            <X size={24} />
          </button> */}
        </div>
        <nav className="flex flex-col p-5">
          <Link to="/" className="p-3 text-gray-800 hover:bg-gray-100 rounded" onClick={onClose}>☕ Menú</Link>

          {/* <Link to="/reservar" className="p-3 text-gray-800 hover:bg-gray-100 rounded" onClick={onClose}>📜 Reservar</Link> */}
          <button
            onClick={() => {
                setMostrarModal(true); 
                onClose()
              }}
              className="p-3 text-gray-800 text-left bg-white hover:bg-gray-100 rounded"
              >
              📜 Reservar
            </button>

            {(user?.cargo === "encargado" || user?.cargo === "admin" || user?.cargo === "mozo") && (
            <div className="flex flex-col">
                <Link to="/pedidos" className="p-3 text-gray-800 hover:bg-gray-100 rounded" onClick={onClose}>📝 Pedidos</Link>
                <Link to="/reservas" className="p-3 text-gray-800 hover:bg-gray-100 rounded" onClick={onClose}>📅 Reservas</Link>  
                <Link to="/layout" className="p-3 text-gray-800 hover:bg-gray-100 rounded" onClick={onClose}>🪑 Local</Link>
            </div>
            )} 
            {user?.cargo === "admin" && (
            <div className="flex flex-col">
              <Link to="/users" className="p-3 text-gray-800 hover:bg-gray-100 rounded" onClick={onClose}>👥 Usuarios</Link>
              <Link to="/stats" className="p-3 text-gray-800 hover:bg-gray-100 rounded" onClick={onClose}>📊 Estadísticas</Link>
                  
            </div>
            )} 
            {(user?.cargo === "encargado" || user?.cargo === "admin" || user?.cargo === "cajero") && (
            <Link to="/caja" className="p-3 text-gray-800 hover:bg-gray-100 rounded" onClick={onClose}>💰 Caja</Link> 
            )} 
            
          </nav>
          <div className="flex flex-col bottom-0">
              <Link to="/config" className="bottom-5 p-3 text-gray-800 hover:bg-gray-100 rounded" onClick={onClose}>⚙️ Configuración</Link>
          </div>
            
          </div>
    </>
  );
}

export default Sidebar;
