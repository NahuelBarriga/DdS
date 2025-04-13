import { getPedidos, confirmarORechazarPedido, getItemsMenu } from "../services/pedidoHelper";
import { useEffect, useState } from "react";
import socket from "../config/socket";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "../context/authContext";
import PedidoResDTO from "../models/pedidoResDTO";
import { Trash2, Pencil, X, Filter, Plus, Minus } from "lucide-react";

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [detalleItems, setDetalleItems] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
  const [filtroFechaFin, setFiltroFechaFin] = useState("");
  const [ocultarRechazados, setOcultarRechazados] = useState(false);
  const [itemsMenu, setItemsMenu] = useState([]);
  const [editableItems, setEditableItems] = useState([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const { user } = useAuth();

  // Para el socket
  useEffect(() => {
    socket.on("pedido:estadoActualizado", ({ pedidoId, estado }) => {
      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id === pedidoId ? { ...pedido, estado } : pedido
        )
      );
    });
    return () => socket.off("pedidoActualizado");
  }, []);

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const data = await getPedidos();
        setPedidos(data);
        setFiltroFechaInicio(new Date().toISOString().split('T')[0]);
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPedidos();

    // Listener for real-time updates
    socket.on("pedido:nuevo", (nuevoPedido) => {
      setPedidos((prevPedidos) => 
        [...prevPedidos, PedidoResDTO.fromJson(nuevoPedido)].sort((a, b) => {
          const dateComparison = new Date(a.fecha) - new Date(b.fecha);
          if (dateComparison !== 0) return dateComparison;
          return a.hora.localeCompare(b.hora);
        })
      );
      fetchPedidos();
    });

    socket.on("pedido:eliminado", (pedidoId) => { 
      setPedidos((prevPedidos) =>
        prevPedidos.filter((pedido) => pedido.id !== pedidoId)
      );
    });

    return () => {
      socket.off("pedido:nuevo");
      socket.off("pedido:eliminado");
    };
  }, []);

  // Obtener los nombres de los ítems cuando se selecciona un pedido
  useEffect(() => {
    if (pedidoSeleccionado) {
      const fetchItems = async () => {
        const detalles = {};
        if (pedidoSeleccionado.items.length !== 0) {
          for (let id of pedidoSeleccionado.items) {
            detalles[id] = pedidoSeleccionado.items.nombre;
          }
          setDetalleItems(detalles);
        }
        console.log(detalles);
      };
      fetchItems();
    }
  }, [pedidoSeleccionado]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const items = await getItemsMenu();
        setItemsMenu(items);
      } catch (error) {
        console.error("Error al obtener los items del menú:", error);
      }
    };
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (pedidoSeleccionado && editMode) {
      setEditableItems(pedidoSeleccionado.items.map(item => ({
        ...item,
        cantidadOriginal: item.cantidad || 1
      })));
    }
  }, [pedidoSeleccionado, editMode]);

  // Función para asignar colores a los estados de los pedidos
  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-300 text-yellow-900";
      case "aceptado":
      case "confirmado":
        return "bg-green-300 text-green-900";
      case "rechazado":
        return "bg-red-300 text-red-900";
      default:
        return "bg-gray-300 text-gray-900";
    }
  };

  const cambiarEstadoPedido = (pedidoId, estado) => {
    confirmarORechazarPedido(pedidoId, estado);
  };

  // Agregar esta función bajo las otras funciones //todo----------------------------------------------------------------------------------------
  const handleEliminarPedido = (pedidoId) => {
  // Aquí deberías llamar a una función del servicio similar a:
  // deleteOrder(pedidoId);
  // Por ahora, solo cerraremos el modal
  setPedidoSeleccionado(null);
  };

  // Función para modificar la cantidad de un item
  const handleCambiarCantidad = (index, nuevaCantidad) => {
    const itemsActualizados = [...editableItems];
    itemsActualizados[index] = {
      ...itemsActualizados[index],
      cantidad: Math.max(0, nuevaCantidad)
    };
    setEditableItems(itemsActualizados);
  };

  // Función para cambiar el item seleccionado
  const handleCambiarItem = (index, nuevoItemId) => {
    const itemSeleccionado = itemsMenu.find(item => item.id === nuevoItemId);
    const itemsActualizados = [...editableItems];
    itemsActualizados[index] = {
      ...itemSeleccionado,
      cantidad: itemsActualizados[index].cantidad || 1
    };
    setEditableItems(itemsActualizados);
  };

  // Agregar nuevo item
  const handleAgregarItem = () => {
    if (itemsMenu.length > 0) {
      setEditableItems([
        ...editableItems, 
        { ...itemsMenu[0], cantidad: 1 }
      ]);
    }
  };

  // Eliminar item
  const handleEliminarItem = (index) => {
    const itemsActualizados = editableItems.filter((_, i) => i !== index);
    setEditableItems(itemsActualizados);
  };

  // Guardar cambios en los items
  const guardarCambiosItems = () => {
    // Filtrar items con cantidad mayor a 0
    const itemsValidos = editableItems.filter(item => item.cantidad > 0);
    
    // Calcular nuevo total
    const nuevoTotal = itemsValidos.reduce((total, item) => 
      total + (item.precio * item.cantidad), 0);

    setPedidoSeleccionado({
      ...pedidoSeleccionado,
      items: itemsValidos,
      total: nuevoTotal
    });

    setEditMode(false);
  };




  // Filtrar pedidos según criterios
  const pedidosFiltrados = pedidos.filter((pedido) => {
    // Filtro por estado
    if (ocultarRechazados && pedido.estado === "rechazado") {
      return false;
    }

    // Filtro por fecha
    if (filtroFechaInicio && filtroFechaFin) {
      const fechaPedido = new Date(pedido.dia);
      const inicio = new Date(filtroFechaInicio);
      const fin = new Date(filtroFechaFin);
      fin.setHours(23, 59, 59); // Para incluir todo el día final

      return fechaPedido >= inicio && fechaPedido <= fin;
    } else if (filtroFechaInicio) {
      const fechaPedido = new Date(pedido.dia);
      const inicio = new Date(filtroFechaInicio);
      return fechaPedido >= inicio;
    } else if (filtroFechaFin) {
      const fechaPedido = new Date(pedido.dia);
      const fin = new Date(filtroFechaFin);
      fin.setHours(23, 59, 59);
      return fechaPedido <= fin;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Cabecera */}
        <div className="bg-white rounded-lg shadow-md p-5 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-naranja flex items-center">
            <span className="mr-2">📝</span> Gestión de Pedidos
          </h1>
          <p className="text-gray-600 mt-1">
            Administra y da seguimiento a todos los pedidos de clientes
          </p>
        </div>


        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Filtros</h2>
            <button 
              onClick={() => setMostrarFiltros(!mostrarFiltros)} 
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-naranja"
            >
              <Filter size={18} />
              {mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"}
            </button>
          </div>

        {/* Filtros */}
        {mostrarFiltros &&
        (<div className="bg-white rounded-lg shadow-md p-5 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={filtroFechaInicio}
                onChange={(e) => setFiltroFechaInicio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-naranja"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin
              </label>
              <input
                type="date"
                value={filtroFechaFin}
                onChange={(e) => setFiltroFechaFin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-naranja"
              />
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={ocultarRechazados}
                  onChange={() => setOcultarRechazados(!ocultarRechazados)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-naranja/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-naranja"></div>
                <span className="ms-3 text-sm font-medium text-gray-700">
                  Ocultar rechazados
                </span>
              </label>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFiltroFechaInicio(new Date().toISOString().split('T')[0]);
                  setFiltroFechaFin("");
                  setOcultarRechazados(false);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>
        )} 
        </div>

        {/* Mensaje de carga */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-10 text-center">
            <div className="animate-spin w-12 h-12 mx-auto mb-4 border-4 border-naranja border-t-transparent rounded-full"></div>
            <p className="text-gray-600 text-lg">Cargando pedidos...</p>
          </div>
        )}

        {/* Si no hay pedidos, mostrar mensaje */}
        {!loading && pedidosFiltrados.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-10 text-center">
            <div className="text-gray-400 text-6xl mb-4">📭</div>
            <p className="text-gray-600 text-lg">
              {pedidos.length === 0
                ? "No hay pedidos disponibles en este momento."
                : "No se encontraron pedidos que coincidan con los filtros aplicados."}
            </p>
          </div>
        )}

        {/* Lista de pedidos */}
        {!loading && pedidosFiltrados.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-3 text-gray-700 font-semibold">Fecha</th>
                    <th className="px-4 py-3 text-gray-700 font-semibold">Hora</th>
                    <th className="px-4 py-3 text-gray-700 font-semibold">Cliente</th>
                    <th className="px-4 py-3 text-gray-700 font-semibold text-right">Total</th>
                    <th className="px-4 py-3 text-gray-700 font-semibold text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosFiltrados.map((pedido, index) => (
                    <tr
                      key={pedido.id}
                      className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                        index !== pedidosFiltrados.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      }`}
                      onClick={() => setPedidoSeleccionado(pedido)}
                    >
                      <td className="px-4 py-3 text-gray-800">{pedido.dia}</td>
                      <td className="px-4 py-3 text-gray-800">{pedido.hora}</td>
                      <td className="px-4 py-3 text-gray-800">
                        {pedido.cliente.nombre} {pedido.cliente.apellido}
                      </td>
                      <td className="px-4 py-3 text-gray-800 text-right font-medium">
                        ${pedido.total.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${obtenerColorEstado(
                            pedido.estado
                          )}`}
                        >
                          {pedido.estado.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contador de pedidos mostrados */}
        {!loading && pedidos.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Mostrando {pedidosFiltrados.length} de {pedidos.length} pedidos
          </div>
        )}
      </div>

      {/* Modal con detalles del pedido seleccionado */}
      {pedidoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
            {/* Cabecera modal */}
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Pedido #{pedidoSeleccionado.id}
                </h2>
                <h3>
                  {user?.cargo === "admin" && (
                    <><button
                      onClick={() => setEditMode(true)}
                      className="text-1xl text-blue-600 bg-transparent hover:text-blue-800 focus:outline-none"
                    >
                      <Pencil size={18} />
                    </button><button
                      onClick={() => {
                        handleEliminarPedido(pedidoSeleccionado.id);
                      } }
                      className="text-1xl text-red-600 bg-transparent hover:text-red-800 focus:outline-none"
                    >
                        <Trash2 size={18} />
                      </button></>
                  )}
                  <button
                    onClick={() => setPedidoSeleccionado(null)}
                    className="text-1xl text-gray-800 bg-transparent hover:text-gray-600 focus:outline-none"
                  >
                    X
                  </button>
                </h3>
              </div>
            </div>

            {/* Contenido modal */}
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="font-medium text-gray-800">
                    {pedidoSeleccionado.cliente.nombre}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha y hora</p>
                  <p className="font-medium text-gray-800">
                    {pedidoSeleccionado.dia} - {pedidoSeleccionado.hora}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mesa asignada</p>
                  <p className="font-medium text-gray-800">
                    { pedidoSeleccionado.mesa.id ? `mesa #${pedidoSeleccionado.mesa.id}` : "No asignada"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${obtenerColorEstado(
                      pedidoSeleccionado.estado
                    )}`}
                  >
                    {pedidoSeleccionado.estado.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Comentario */}
              {pedidoSeleccionado.comentario && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Comentario</p>
                  <p className="mt-1 text-gray-800 bg-gray-50 p-3 rounded-md">
                    {pedidoSeleccionado.comentario}
                  </p>
                </div>
              )}

              {/* Listado de ítems */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Detalles del pedido</h3>
                <div className="bg-gray-50 rounded-md overflow-hidden">
                  <div className="border-b border-gray-200 py-2 px-3 bg-gray-100">
                    <div className="grid grid-cols-5">
                      <div className="col-span-3 text-sm font-medium text-gray-700">Producto</div>
                      <div className="text-center text-sm font-medium text-gray-700">Cantidad</div>
                      <div className="text-right text-sm font-medium text-gray-700">Precio</div>
                      <div className="text-right text-sm font-medium text-gray-700">Total</div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {pedidoSeleccionado.items ? (
                      pedidoSeleccionado.items.map((item) => (
                        <div key={item.id} className="py-2 px-3">
                          <div className="grid grid-cols-6">
                            <div className="col-span-3 text-gray-800">{item.nombre}</div>
                            <div className="text-center text-gray-800">{item.cantidad || 1}</div>
                            <div className="text-right text-gray-800">${item.precio.toFixed(2)}</div>
                            <div className="text-right text-gray-800">
                              ${(item.precio * (item.cantidad || 1)).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-2 px-3 text-gray-500 italic">Cargando...</div>
                    )}
                  </div>
                  <div className="py-2 px-3 bg-gray-100">
                    <div className="grid grid-cols-5">
                      <div className="col-span-4 text-right font-semibold text-gray-700">Total</div>
                      <div className="text-right font-semibold text-gray-700">
                        ${pedidoSeleccionado.total.toFixed(2) || 'NaN'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario de edición */} 
            {editMode && (
              <div className="px-6 py-4 border-t">
                <h3 className="font-semibold text-gray-700 mb-3">Editar Items del Pedido</h3>
                <div className="space-y-4">
                  {/* Ejemplo de campo para editar comentario */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Comentario
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-naranja"
                      value={pedidoSeleccionado.comentario || ""}
                      onChange={(e) => setPedidoSeleccionado({
                        ...pedidoSeleccionado,
                        comentario: e.target.value
                      })}
                      rows="3"
                    ></textarea>
                  </div>
                  {editableItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {/* Selector de item */}
                      <select 
                        value={item.id} 
                        onChange={(e) => handleCambiarItem(index, parseInt(e.target.value))}
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-naranja"
                      >
                        {itemsMenu.map((menuItem) => (
                          <option key={menuItem.id} value={menuItem.id}>
                            {menuItem.nombre} (${menuItem.precio.toFixed(2)})
                          </option>
                        ))}
                      </select>

                      {/* Control de cantidad */}
                      <div className="flex items-center border rounded-md">
                        <button 
                          onClick={() => handleCambiarCantidad(index, item.cantidad - 1)}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                        >
                          <Minus size={16} />
                        </button>
                        <input 
                          type="number" 
                          value={item.cantidad} 
                          onChange={(e) => handleCambiarCantidad(index, parseInt(e.target.value))}
                          className="w-12 text-center border-x py-1 focus:outline-none"
                          min="0"
                        />
                        <button 
                          onClick={() => handleCambiarCantidad(index, item.cantidad + 1)}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Botón de eliminar */}
                      <button 
                        onClick={() => handleEliminarItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}

                  {/* Botón para agregar nuevo item */}
                  <div className="flex justify-between items-center mt-4">
                    <button 
                      onClick={handleAgregarItem}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      Agregar Item
                    </button>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={guardarCambiosItems}
                      className="px-4 py-2 bg-naranja text-white rounded-md hover:bg-naranja/90 transition-colors"
                    >
                      Guardar cambios
                    </button>
                  </div>
                </div>
              </div>
            )}


            {/* Botones de acción */}
            <div className="px-6 py-4 bg-gray-50 border-t">
              {pedidoSeleccionado.estado === "pendiente" ? (
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      cambiarEstadoPedido(pedidoSeleccionado.id, "rechazado");
                      setPedidoSeleccionado(null);
                    }}
                    className="px-4 py-2 bg-white border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Rechazar
                  </button>
                  <button
                    onClick={() => {
                      cambiarEstadoPedido(pedidoSeleccionado.id, "confirmado");
                      setPedidoSeleccionado(null);
                    }}
                    className="px-4 py-2 bg-naranja text-white rounded-md hover:bg-naranja/90 transition-colors"
                  >
                    Aceptar pedido
                  </button>
                </div>
              ) : (
                <div className="flex justify-end">
                  <button
                    onClick={() => setPedidoSeleccionado(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pedidos;