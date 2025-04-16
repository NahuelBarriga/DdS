import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { CarritoProvider } from "./context/carrito";
import Navbar from "./components/navBar";
import RenderMenu from "./pages/menu";
import RenderLogin from './pages/login';
import RenderCarrito from './pages/carrito';
import RenderPedidos from "./pages/pedidos";

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
            <Route path="/pedidos" element={<RenderPedidos />} />
          </Routes>
        </Router>
      </CarritoProvider>
    </AuthProvider>
    </div>
  );
}

export default App;

