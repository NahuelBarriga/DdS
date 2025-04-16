import { useCarrito } from "../context/carrito";
import { useAuth } from "../context/authContext";
import { postPedido, getPedidosPendientes, cancelarPedidoPendiente } from "../services/carritoHelper";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { CircleX, Plus, Minus, Clock, CheckCircle, XCircle, CreditCard, ShoppingBag } from 'lucide-react';
import { toast } from "react-toastify";

function Carrito() {
  const {
    carrito,
    eliminarDelCarrito,
    actualizarCantidad,
    calcularTotal,
    comentario,
    mesaInfoGuardada,
    setComentario,
    cupon,
    setCupon,
    limpiarCarrito
  } = useCarrito();

  const { user } = useAuth();
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);
  
  // Estados para manejar pedidos
  const [pedidoActual, setPedidoActual] = useState(null);
  const [pedidosPendientes, setPedidosPendientes] = useState([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(false);
  // const [socket, setSocket] = useState(null);

  // Cargar pedidos pendientes desde la API
  const cargarPedidosPendientes = useCallback(async () => {
    if (!user) return;
    
    try {
      setCargandoPedidos(true);
      // Obtener pedidos pendientes de la API
      const pedidosAPI = await getPedidosPendientes(user.id) || [];
      console.log("pedidos de cliente", pedidosAPI); //!sacar
      setPedidosPendientes(pedidosAPI);
    } catch (error) {
      console.error("Error al cargar pedidos pendientes:", error);
      // Fallback a localStorage
      const pedidoGuardado = localStorage.getItem('pedidoActual');
      if (pedidoGuardado) {
        setPedidosPendientes([JSON.parse(pedidoGuardado)]);
      }
    } finally {
      setCargandoPedidos(false);
    }
  }, [user]);

  // Cargar pedidos al iniciar y configurar listeners de socket
  useEffect(() => {
    cargarPedidosPendientes();
    
    // Verificar si hay un pedido en curso en localStorage
    const pedidoGuardado = localStorage.getItem('pedidoActual');
    if (pedidoGuardado) {
      setPedidoActual(JSON.parse(pedidoGuardado));
    }
  }, []); //saque el cargarPedidosPendientes de aca porque hacia boom

  // Configurar listeners de socket cuando el socket esté disponible

  // Escuchar actualizaciones de estado del pedido
  const handleActualizacionPedido = (data) => {
    console.log(data);
    // Actualizar el estado de los pedidos pendientes
    setPedidosPendientes(prevPedidos => {
      const nuevoPedidos = prevPedidos.map(pedido => {
        if (pedido.id === data.pedidoId) {
          // Notificar al usuario sobre el cambio de estado
          if (data.estado === "confirmado") {
            toast.success("¡Tu pedido ha sido confirmado! Ya puedes proceder al pago.");
          } else if (data.estado === "rechazado") {
            toast.error("Lo sentimos, tu pedido ha sido rechazado.");
            //todo: ofrecer boton para pedir ayuda? 
          }
          
          // Actualizar el pedido
          return { ...pedido, estado: data.estado };
        }
        return pedido;
      });
      
      // Actualizar localStorage si es el pedido actual
      const pedidoActualGuardado = localStorage.getItem('pedidoActual');
      if (pedidoActualGuardado) {
        const pedidoActual = JSON.parse(pedidoActualGuardado);
        if (pedidoActual.id === data.pedidoId) {
          const pedidoActualizado = { ...pedidoActual, estado: data.estado };
          localStorage.setItem('pedidoActual', JSON.stringify(pedidoActualizado));
          setPedidoActual(pedidoActualizado);
        }
      }
      
      return nuevoPedidos;
    });
  };

 

  // Verificar cupon
  const verificarCupon = () => {
    if (!cupon.trim()) {
      toast.info("Por favor ingrese un código de cupón");
      return;
    }
    
    // Simulamos la verificación //!sacar  --------------------------------------------------------------------------
    const cupones = {
      "PIXELCAFE10": 10,
      "PIXELCAFE20": 20,
      "BIENVENIDO": 15
    };
    
    setEnviando(true);
    
    setTimeout(() => {
      if (cupones[cupon]) {
        setDescuentoAplicado(cupones[cupon]);
        toast.success(`Cupón aplicado: ${cupones[cupon]}% de descuento`);
      } else {
        setDescuentoAplicado(0);
        toast.error("Cupón no válido");
      }
      setEnviando(false);
    }, 600);
  };

  // Calcular el total con descuento
  const totalConDescuento = () => {
    const subtotal = calcularTotal();
    if (descuentoAplicado > 0) {
      return subtotal - (subtotal * (descuentoAplicado / 100));
    }
    return subtotal;
  };

  // Enviar pedido
  const enviarPedido = async () => {
    // Validar que haya productos en el carrito
    if (carrito.length === 0) {
      setError("No hay productos en el carrito");
      return;
    }
  
    setEnviando(true);
    setError("");
  
    try {
      const pedidoNuevo = {
        items: carrito,
        comentario,
        cupon,
        mesaId: mesaInfoGuardada.numero,
        subtotal: calcularTotal(),
        total: totalConDescuento(),
        usuarioId: user?.id
      };

      const response = await postPedido(pedidoNuevo);
      
      // Crear objeto de pedido con ID del backend o ID temporal //!hace falta? pq va para la bd ya y se recupera en teoria
      const pedidoGuardado = {
        ...pedidoNuevo,
        id: response?.data?.id || `temp-${Date.now()}`,
        estado: "pendiente",
        fechaCreacion: new Date().toISOString()
      };
      
      // Guardar el pedido actual en localStorage
      localStorage.setItem('pedidoActual', JSON.stringify(pedidoGuardado)); //!deberia usar el TDO creo
      setPedidoActual(pedidoGuardado);
      
      
      // Añadir el pedido a la lista de pedidos pendientes
      //setPedidosPendientes(prevPedidos => [...prevPedidos, pedidoGuardado]);
      
      toast.info("¡Pedido realizado con éxito! Esperando aprobación...");
      
      // Limpiar el carrito
      limpiarCarrito();
      setComentario("");
      setCupon("");
      setDescuentoAplicado(0);
      cargarPedidosPendientes()
      
    } catch (error) {
      console.error("Error al enviar el pedido:", error);
      setError("Error al procesar el pedido. Intente nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  // Proceder al pago de todos los pedidos aprobados
  const procederAlPago = () => {
    // Filtrar solo los pedidos aprobados
    const pedidosAprobados = pedidosPendientes.filter(p => p.estado === "confirmado");
    
    if (pedidosAprobados.length === 0) {
      toast.info("No hay pedidos aprobados para pagar");
      return;
    }
    
    // Guardar los pedidos aprobados para la página de pago
    localStorage.setItem('pedidosAprobados', JSON.stringify(pedidosAprobados));
    
    // Redirigir a la página de pago
    navigate("/pago");
  };

  // Generar nuevo pedido
  const generarNuevoPedido = () => {
    // Limpiar el carrito y redireccionar al menú
    limpiarCarrito();
    setComentario("");
    setCupon("");
    setDescuentoAplicado(0);
    
    // Mantener el pedido actual en localStorage
    navigate("/");
  };

  // Cancelar un pedido específico
  const cancelarPedido = async (pedidoId) => {
    if (window.confirm("¿Estás seguro de que deseas cancelar este pedido?")) {
      try {
        const response = await cancelarPedidoPendiente(pedidoId); 
        console.log(response);
        if (response.status == 200) {
          // Eliminar de la lista de pedidos pendientes
          setPedidosPendientes(prevPedidos => 
            prevPedidos.filter(p => p.id !== pedidoId)
          );
          
          // Si es el pedido actual, limpiarlo del localStorage
          if (pedidoActual && pedidoActual.id === pedidoId) {
            localStorage.removeItem('pedidoActual');
            setPedidoActual(null);
          } 
          toast.info("Pedido cancelado");
          cargarPedidosPendientes();
      } else { 
        throw new Error();
      }
       
     } catch (error) {
        console.error(error); 
     }
    }
  };

  // Calcular el total de todos los pedidos aprobados
  const calcularTotalPedidosAprobados = () => {
    return pedidosPendientes
      .filter(p => p.estado === "confirmado")
      .reduce((total, pedido) => total + pedido.total, 0);
  };

  // Renderizar la lista de pedidos pendientes
  const renderPedidosPendientes = () => {
    if (pedidosPendientes.length === 0) return null;

    return (
      <div className="bg-white shadow-md p-5 rounded-lg mb-5 w-full max-w-2xl">
        <h2 className="text-black text-xl font-bold mb-4 text-center">Tus Pedidos</h2>
        
        {/* Pedidos pendientes */}
        <div className="space-y-4">
          {pedidosPendientes.map((pedido) => (
            <div 
              key={pedido.id} 
              className={`border rounded-lg p-4 ${
                pedido.estado === "confirmado" || pedido.estado === "pago_pendiente"
                  ? "border-green-300 bg-green-50" 
                  : pedido.estado === "rechazado" 
                    ? "border-red-300 bg-red-50"
                    : "border-yellow-300 bg-yellow-50"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  {pedido.estado === "pendiente" && <Clock size={20} className="text-yellow-500 mr-2" />}
                  {(pedido.estado === "confirmado" || pedido.estado === "pago_pendiente") && <CheckCircle size={20} className="text-green-500 mr-2" />}
                  {pedido.estado === "rechazado" && <XCircle size={20} className="text-red-500 mr-2" />}
                  <span className="text-black font-medium">
                    Pedido #{pedido.id.toString().substring(0, 8)}
                  </span>
                </div>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  pedido.estado === "confirmado" || pedido.estado === "pago_pendiente"
                  ? "bg-green-200 text-green-800" 
                  : pedido.estado === "rechazado" 
                    ? "bg-red-200 text-red-800"
                    : "bg-yellow-200 text-yellow-800"
                }`}>
                  {pedido.estado === "pendiente" ? "Pendiente" : 
                  pedido.estado === "confirmado" ? "confirmado" : 
                  pedido.estado === "pago_pendiente" ? "Pago Pendiente" :
                 "Rechazado"}
                </span>
              </div>
              
              <div className="text-sm text-gray-700 mb-2">
                <p><strong>Fecha:</strong> {pedido.dia} {pedido.hora}</p>
                <p><strong>Total:</strong> ${pedido.total.toFixed(2)}</p>
                <p>
                  <strong>Entrega:</strong> {
                    pedido.mesa.id ? `Mesa #${pedido.mesa.id}` : 
                    mesaInfoGuardada.tipo === 'delivery' ? 'Delivery' : 'Para llevar'
                  }
                </p>
              </div>
              
              <div className="text-black text-sm mb-2">
                <strong>Productos:</strong>
                <ul className="ml-5 list-disc">
                  {pedido.items.map((item, idx) => (
                    <li key={idx}>
                      {item.nombre} x{item.cantidad} - ${(item.precio * item.cantidad).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
              
              {pedido.estado === "pendiente" && (
                <button
                  onClick={() => cancelarPedido(pedido.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Cancelar pedido
                </button>
              )}
            </div>
          ))}
        </div>
        
        {/* Botones de acción */}
        <div className="mt-6 flex flex-col gap-3">
          {/* Mostrar botón de pago si hay pedidos aprobados */}
          {pedidosPendientes.some(p => p.estado === "confirmado" || p.estado === "pago_pendiente") && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-black font-medium">Total a pagar:</span>
                <span className="text-black font-bold text-lg">${calcularTotalPedidosAprobados().toFixed(2)}</span>
              </div>
              <button
                onClick={procederAlPago}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <CreditCard size={20} />
                Pagar pedidos aprobados
              </button>
            </div>
          )}
          
          <button
            onClick={generarNuevoPedido}
            className="w-full bg-naranja text-white px-4 py-3 rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2"
          >
            <ShoppingBag size={20} />
            {carrito.length > 0 ? "Finalizar este pedido" : "Hacer nuevo pedido"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-5">
      <h1 className="text-3xl font-bold text-naranja mb-5">🛒 Carrito de Compras</h1>
    
      {/* Mostrar lista de pedidos pendientes */}
      {renderPedidosPendientes()}

      {/* Carrito actual */}
      {carrito.length === 0 ? (
        <div className="text-center">
          {pedidosPendientes.length === 0 && (
            <>
              <p className="text-gray-600 mb-4">Tu carrito está vacío.</p>
              <Link to="/">
                <button className="bg-naranja text-white px-4 py-2 rounded-lg hover:bg-orange-600">
                  Volver al Menú
                </button>
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="w-full max-w-2xl">
          {/* Tabla de productos */}
          <div className="bg-white shadow-md p-5 rounded-lg mb-5">
            {/* Información de mesa/tipo de pedido */}
            <div className="mb-4">
              <div className="bold text-center p-3 ">
                {mesaInfoGuardada.tipo === 'mesa' ? (
                  <p className="text-black font-medium">Mesa #{mesaInfoGuardada.numero}</p>
                ) : mesaInfoGuardada.tipo === 'delivery' ? (
                  <p className="text-black font-medium">Delivery</p>
                ) : (
                  <p className="text-black font-medium">Para llevar</p>
                )}
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-black border-b">
                  <th className="text-left py-2">Producto</th>
                  <th className="text-center py-2">Cantidad</th>
                  <th className="text-right py-2">Precio</th>
                  <th className="text-right py-2">Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="text-black py-3">{item.nombre}</td>
                    <td className="text-black text-center">
                      <div className="flex justify-center items-center">
                        <button 
                          className="bg-gray-200 px-2 rounded-r"
                          onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-3">{item.cantidad}</span>
                        <button 
                          className="bg-gray-200 px-2 rounded-l"
                          onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="text-black text-right">${item.precio.toFixed(2)}</td>
                    <td className="text-black text-right">${(item.precio * item.cantidad).toFixed(2)}</td>
                    <td className="text-right">
                      <button 
                        className="bg-transparent text-red-500 hover:text-red-700"
                        onClick={() => eliminarDelCarrito(item.id)}
                      >
                        <CircleX size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold">
                  <td colSpan="3" className="text-black text-right pt-4">Subtotal:</td>
                  <td className=" text-black text-right pt-4">${calcularTotal().toFixed(2)}</td>
                  <td></td>
                </tr>
                {descuentoAplicado > 0 && (
                  <tr className="text-green-600">
                    <td colSpan="3" className="text-black text-right">Descuento ({descuentoAplicado}%):</td>
                    <td className="text-black text-right">-${(calcularTotal() * (descuentoAplicado / 100)).toFixed(2)}</td>
                    <td></td>
                  </tr>
                )}
                <tr className="font-bold text-lg">
                  <td colSpan="3" className="text-black text-right pt-2">Total:</td>
                  <td className="text-black text-right pt-2">${totalConDescuento().toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Sección de comentarios y cupón */}
          <div className="bg-white shadow-md p-5 rounded-lg mb-5">
            <h3 className="text-black font-semibold text-lg mb-3">Información adicional</h3>
            
            {/* Comentarios */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comentarios o instrucciones especiales:
              </label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Ej: Sin cebolla, extra salsa, etc."
                rows="3"
              ></textarea>
            </div>
            
            {/* Cupón */}
            <div className="flex items-end gap-2">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cupón de descuento:
                </label>
                <input
                  type="text"
                  value={cupon}
                  onChange={(e) => setCupon(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Ej: PIXELCAFE10"
                />
              </div>
              <button
                onClick={verificarCupon}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Aplicar
              </button>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-between mt-4">
            <Link to="/">
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                Volver al Menú
              </button>
            </Link>
            
            <button
              onClick={enviarPedido}
              disabled={enviando || carrito.length === 0}
              className={`${
                enviando || carrito.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white px-6 py-2 rounded-lg`}
            >
              {enviando ? "Procesando..." : "Realizar Pedido"}
            </button>
          </div>
          
          {/* Mensaje de error */}
          {error && (
            <div className="mt-4 text-center text-red-600">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Carrito;