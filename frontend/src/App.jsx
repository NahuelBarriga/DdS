import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { CarritoProvider } from "./context/carrito";
import Navbar from "./components/navBar";
import RenderMenu from "./pages/menu";
import RenderLogin from './pages/login';
import RenderCarrito from './pages/carrito';
import RenderCaja from "./pages/caja";
import RenderMesasLayout from "./pages/layout";
import RenderPedidos from "./pages/pedidos";
import RenderUsuarios from "./pages/users";
import RenderReservas from "./pages/reservas";
import RenderStats from "./pages/stats";
import RenderLayout from "./pages/layout";
import RenderConfig from "./pages/config";

function App() {
  return (
    <div className="w-full min-h-screen bg-gray-100">
      <AuthProvider>
      <CarritoProvider>
        <Router>
          <Navbar/> 
          <Routes>
            <Route path="/" element={<RenderMenu />} />
            <Route path="/login" element={<RenderLogin />} />
            <Route path="/carrito" element={<RenderCarrito />} />
            <Route path="/caja" element={<RenderCaja />} />
            <Route path="/mesas" element={<RenderMesasLayout />} />
            <Route path="/pedidos" element={<RenderPedidos />} />
            <Route path="/users" element={<RenderUsuarios />} />
            <Route path="/reservas" element={<RenderReservas />} />
            <Route path="/stats" element={<RenderStats />} />
            <Route path="/layout" element={<RenderLayout />} />
            <Route path="/config" element={<RenderConfig />} />
            
          </Routes>
        </Router>
      </CarritoProvider>
    </AuthProvider>
    </div>
  );
}

export default App;

