import { useEffect, useState } from "react";
import { getMenu, postItem, getAllCat, deleteItem, updateItem, updateItemStock} from "../services/menuHelper";
import {verificarMesaDisponible} from '../services/carritoHelper';
import ProductoModal from "../components/productoModal";
import { useAuth } from "../context/authContext";
import { useCarrito } from "../context/carrito";
import Modal from "../components/modal";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"; // Assuming you're using react-toastify

function RenderMenu() {
  const [menu, setMenu] = useState([]);
  const { user } = useAuth();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoItem, setNuevoItem] = useState({ 
    nombre: "", 
    precio: "", 
    descripcion: "", 
    categoriaId: "", 
    tag: "" 
  });
  const [categorias, setCategorias] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const { agregarAlCarrito, carrito } = useCarrito();

  // Para el modal de cantidad
  const [showCantidadModal, setShowCantidadModal] = useState(false);
  const [cantidadModalItem, setCantidadModalItem] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  // Para el modal de confirmación de eliminación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  // Para filtrar por tags dietéticos
  const [activeFilters, setActiveFilters] = useState([]);

  // Para agregar la mesa 
  const [showMesaModal, setShowMesaModal] = useState(false);
  const [mesaInfo, setMesaInfo] = useState({ tipo: "", numero: "" });
  const [mesaError, setMesaError] = useState("");
  const [verificandoMesa, setVerificandoMesa] = useState(false);


  // Función para refrescar el menú
  const refresh = async () => {
    try {
      const updatedMenu = await getMenu();
      setMenu(updatedMenu);
    } catch (error) {
      console.error("Error al refrescar el menú:", error);
      toast.error("Error al refrescar el menú");
    }
  };

  // Función para verificar si un item cumple con los filtros activos
  const passesFilters = (item) => {
    if (activeFilters.length === 0) return true;
    
    const itemTags = item.tag ? item.tag.split(',') : [];
    return activeFilters.every(filter => itemTags.includes(filter));
  };

  // Cargar menú y categorías al montar el componente
  useEffect(() => {
    async function fetchData() {
      try {
        const menuData = await getMenu();
        const catData = await getAllCat();
        console.log(menuData); //!sacar
        setMenu(menuData);
        setCategorias(catData || []);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        toast.error("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    // Cargar la información de mesa desde localStorage si existe
    const savedMesaInfo = sessionStorage.getItem('mesaInfo');
    if (savedMesaInfo) {
      try {
        setMesaInfo(JSON.parse(savedMesaInfo));
      } catch (error) {
        console.error("Error al cargar la información de mesa:", error);
      }
    }
   
  }, []);

  // Organizar el menú por categorías
  const menuPorCategoria = categorias.map(cat => {
    // Filtrar productos para esta categoría, asegurándose de comparar correctamente los tipos
    const categoryItems = menu.filter(item => {
      // Convertir ambos a string para comparación segura
      
      return String(item.categoriaId) === String(cat.id);
    });
    
    return {
      ...cat,
      items: categoryItems
    };
  });

  // Utilidad de debugging - mostrar en consola para verificar
  useEffect(() => {
    if (menu.length > 0 && categorias.length > 0) {
    }
  }, [menu, categorias]);

  // Reset form when closing modal
  const handleCloseModal = () => {
    setNuevoItem({ nombre: "", precio: "", descripcion: "", categoriaId: "", tag: "" });
    setMostrarModal(false);
  };

  // Maneja la visibilidad de items (actualiza stock)
  const handleStock = async (producto) => {
    try {
      const response = await updateItemStock(producto.id, !producto.stock);
      if (response.status === 200) {
        toast.success("Estado del ítem actualizado correctamente");
        
        // Refrescar la interfaz
        refresh();
        setProductoSeleccionado(null);
      }
    } catch (error) {
      console.error("Error al actualizar el stock:", error);
      toast.error("Error al actualizar disponibilidad");
    }
  };

  // Añadir nuevo ítem al menú
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await postItem(nuevoItem);
      if (response.status === 201) {
        toast.success("Ítem añadido con éxito");
     
        handleCloseModal();
        refresh();
      }
    } catch (error) {
      console.error("Error al añadir el ítem:", error);
      toast.error("Error al añadir el ítem");
    }
  };

  // Preparar eliminación de ítem
  const prepareDelete = (id) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };


  // Eliminar ítem del menú
  const handleDelete = async () => {
    
    if (!itemToDelete) return;
    
    try {
      const response = await deleteItem(itemToDelete);
      if (response.status === 200) {
        toast.success("Ítem eliminado correctamente");
        
        setShowDeleteConfirm(false);
        setItemToDelete(null);
        setProductoSeleccionado(null);
        setMostrarModal(false); 
        refresh(); //!ver pq no funciona nada
      }
    } catch (error) {
      console.error("Error al eliminar el ítem:", error);
      toast.error("Error al eliminar el ítem");
    }
  };

  // Preparar formulario para editar ítem
  const handleEdit = (producto) => {
    setNuevoItem(producto);
    setMostrarModal(true);
  };

  // Actualizar ítem existente
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await updateItem(nuevoItem);
      if (response.status === 200) {
        toast.success("Ítem actualizado correctamente");
        setProductoSeleccionado(null);
        setMostrarModal(false); 
        
        handleCloseModal();
        refresh();
      }
    } catch (error) {
      console.error("Error al actualizar el ítem:", error);
      toast.error("Error al actualizar el ítem");
    }
  };

  // Borra la mesa en sessionStorage
  const limpiarInfoMesa = () => {
    setMesaInfo({ tipo: "", numero: "" });
    sessionStorage.removeItem('mesaInfo');
  };

  // Función para manejar la selección de cantidad antes de agregar al carrito
  const handleAgregarClick = (e, item) => {
    e.stopPropagation(); // Prevenir que se abra el modal de producto
    
    // Si no hay nada en el carrito, mostrar modal de mesa primero
    if (carrito.length === 0 && !mesaInfo.tipo) {
      setCantidadModalItem(item);
      setShowMesaModal(true);
    } else {
      // Si ya hay ítems, mostrar solo el modal de cantidad
      setCantidadModalItem(item);
      setShowCantidadModal(true);
    }
  };

  // Añadir después de handleConfirmCantidad
  const handleConfirmMesa = async () => {
    // Validar entrada
    if (mesaInfo.tipo === "mesa" && (!mesaInfo.numero || isNaN(parseInt(mesaInfo.numero)))) {
      setMesaError("Por favor, ingrese un número de mesa válido");
      return;
    }
    
    setVerificandoMesa(true);
    setMesaError("");
    try {
      let response;
      if (mesaInfo.tipo === "mesa") {
        response = await verificarMesaDisponible(mesaInfo.numero);
      } else {
        response = true; 
      }
      
      if (response) {
        // Guardar la info de mesa en localStorage para que persista
        sessionStorage.setItem('mesaInfo', JSON.stringify(mesaInfo));
        // Continuar con el modal de cantidad
        setShowMesaModal(false);
        setShowCantidadModal(true);
      } else {
        setMesaError("La mesa no está disponible o no existe");
      }
    } catch (error) {
      console.error("Error al verificar mesa:", error);
      setMesaError("Error al verificar disponibilidad");
    } finally {
      setVerificandoMesa(false);
    }
  };

  
  // Función para agregar al carrito desde el modal de cantidad
  const handleConfirmCantidad = () => {
    if (cantidadModalItem && cantidad > 0) {
      agregarAlCarrito(cantidadModalItem, cantidad);
      toast.success(`${cantidad} ${cantidadModalItem.nombre}(s) agregado(s) al carrito`);
      setShowCantidadModal(false);
      setCantidadModalItem(null);
      setCantidad(1);
    } else {
      toast.error("Por favor ingrese una cantidad válida");
    }
  };

  // Función para obtener la cantidad de un item en el carrito
  const getCantidadEnCarrito = (itemId) => {
    const itemEnCarrito = carrito.find(item => item.id === itemId);
    return itemEnCarrito ? itemEnCarrito.cantidad : 0;
  };

  // Si no hay categorías o el menú está vacío pero ya cargó, mostrar todos los productos
  const mostrarMenuCompleto = !loading && menu.length > 0 && (categorias.length === 0 || menuPorCategoria.every(cat => cat.items.length === 0));

  return (
    <div className="min-h-screen bg-gris flex flex-col items-center h-full w-full min-h-scree p-5">
      <h1 className="text-3xl font-bold text-naranja mb-5">Menú de Pixel Café</h1>

      {loading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-naranja"></div>
          <p className="ml-3 text-naranja font-semibold">Cargando menú...</p>
        </div>
      )}

      {!loading && menu.length === 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <p className="text-lg">No hay productos disponibles en este momento.</p>
        </div>
      )}

      {/* Indicador de Mesa/Tipo de pedido */}
      {(mesaInfo.tipo && user?.cargo === 'cliente')  && (
        <div 
          className="mb-5 bg-white p-3 rounded-lg shadow-md flex items-center justify-between cursor-pointer hover:bg-gray-50 border border-naranja"
          onClick={() => setShowMesaModal(true)}
        >
          <div>
            {mesaInfo.tipo === 'mesa' ? (
              <p className="font-medium text-gray-700">
                <span className="text-naranja">Mesa {mesaInfo.numero}</span>
              </p>
            ) : mesaInfo.tipo === 'delivery' ? (
              <p className="font-medium text-gray-700">
                <span className="text-naranja">Pedido a domicilio</span> 
              </p>
            ) : (
              <p className="font-medium text-gray-700">
                <span className="text-naranja">Pedido para llevar</span>
              </p>
            )}
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </div>
      )}

      {/* Contador de carrito para clientes y empleados */}
      {(user?.cargo === "cliente" || user?.cargo === "empleado") && (
        <div className="mb-5">
          <Link to="/carrito">
            <button className="bg-naranja text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors duration-300 flex items-center gap-2 shadow-md">
              🛒 Carrito
              {carrito.length > 0 && (
                <span className="bg-white text-naranja rounded-full px-2 py-1 text-sm font-bold">
                  {carrito.reduce((total, item) => total + item.cantidad, 0)}
                </span>
              )}
            </button>
          </Link>
        </div>
      )}


      {/* Filtros y búsqueda */}
      {!loading && menu.length > 0 && (
        <div className="w-full max-w-5xl mb-6 bg-white p-4 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex gap-2">
              {/* Tags para filtrar */}
              <button 
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  activeFilters.includes('GF') 
                    ? "bg-blue-600 text-white" 
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                }`}
                onClick={() => {
                  setActiveFilters(prev => 
                    prev.includes('GF') 
                      ? prev.filter(f => f !== 'GF') 
                      : [...prev, 'GF']
                  );
                }}
              >
                Sin TACC
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  activeFilters.includes('Veg') 
                    ? "bg-green-600 text-white" 
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
                onClick={() => {
                  setActiveFilters(prev => 
                    prev.includes('Veg') 
                      ? prev.filter(f => f !== 'Veg') 
                      : [...prev, 'Veg']
                  );
                }}
              >
                Vegetariano
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  activeFilters.includes('V') 
                    ? "bg-purple-600 text-white" 
                    : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                }`}
                onClick={() => {
                  setActiveFilters(prev => 
                    prev.includes('V') 
                      ? prev.filter(f => f !== 'V') 
                      : [...prev, 'V']
                  );
                }}
              >
                Vegano
              </button>
              {activeFilters.length > 0 && (
                <button 
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-full hover:bg-red-200 text-sm"
                  onClick={() => setActiveFilters([])}
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Información de debugging */}
      {/* {!loading && process.env.NODE_ENV !== 'production' && (
        <div className="text-black w-full max-w-5xl mb-4 p-2 bg-yellow-100 text-xs border border-yellow-400 rounded">
          <p>Total productos cargados: {menu.length}</p>
          <p>Total categorías: {categorias.length}</p>
        </div>
      )} */}

    
      {/* Menú organizado por categorías */}
      {!mostrarMenuCompleto && (
        <div className="w-full max-w-5xl">
            {menuPorCategoria.map(cat => {
      // Filtra los items según el tipo de usuario y disponibilidad
      const visibleItems = cat.items.filter(item => ((user && user?.cargo !== "cliente") || item.stock !== false) && passesFilters(item));
      
      // Solo muestra la categoría si tiene ítems para mostrar
      return visibleItems.length > 0 ? (
        <div key={cat.id} className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b-2 border-naranja pb-2">{cat.nombre}</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleItems.map((item) => (
              <div 
                key={item.id} 
                className={`shadow-md rounded-lg p-4 text-center transition-all duration-300 transform hover:scale-105 ${
                  item.stock === false 
                    ? "bg-gray-300 opacity-70" 
                    : "bg-white hover:shadow-lg"
                }`}
                onClick={() => setProductoSeleccionado(item)}
              >
                        <h3 className="text-xl font-semibold text-gray-800">{item.nombre}</h3>
                        <p className="text-gray-600 mb-2">Precio: ${item.precio.toFixed(2)}</p>
                        
                        {/* Tags de producto */}
                        {item.tag && (
                          <div className="flex justify-center gap-1 mb-2">
                            {item.tag.includes('GF') && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Sin TACC</span>
                            )}
                            {item.tag.includes('Veg') && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Vegetariano</span>
                            )}
                            {item.tag.includes('V') && (
                              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Vegano</span>
                            )}
                          </div>
                        )}

                        {/* Mostrar cantidad en carrito si ya está agregado */}
                        {getCantidadEnCarrito(item.id) > 0 && (
                          <p className="text-sm text-green-600 font-semibold bg-green-100 py-1 px-2 rounded mb-2">
                            {getCantidadEnCarrito(item.id)} en carrito
                          </p>
                        )}
                        
                        {/* Botón para agregar al carrito */}
                        {item.stock !== false && (user?.cargo === "cliente" || user?.cargo === "empleado") && (
                          <button 
                            className="mt-2 bg-naranja text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300 w-full"
                            onClick={(e) => handleAgregarClick(e, item)}
                          >
                            Agregar al Carrito
                          </button>
                        )}
                        
                        {/* Botón para manejar stock (admin) - solo muestra "No Disponible" */}
                        {user?.cargo === "admin" && item.stock === false && (
                          <p className="mt-2 text-red-600 font-bold">No Disponible</p>
                        )}

                      </div>
                    ))}
                </div>
            </div>
          ) :null; 
        })}
        </div>
      )}

      {/* Botón flotante del carrito (solo para clientes) */}
      {user?.cargo === "cliente" && carrito.length > 0 && (
        <Link to="/carrito">
          <button className="fixed bottom-5 right-5 bg-naranja text-white p-4 rounded-full shadow-lg text-lg hover:bg-orange-600 transition-all duration-300 flex items-center justify-center">
            <span className="mr-1">🛒</span>
            <span className="bg-white text-naranja rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">
              {carrito.reduce((total, item) => total + item.cantidad, 0)}
            </span>
          </button>
        </Link>
      )}

      {/* Botón para agregar ítem (solo admin) */}
      {user?.cargo === "admin" && (
        <button
          onClick={() => setMostrarModal(true)}
          className="fixed bottom-5 right-5 bg-blue-500 text-white p-4 rounded-full shadow-lg text-lg hover:bg-blue-700 transition-all duration-300"
        >
          Agregar ítem +
        </button>
      )}

      {/* Modal de detalle de producto */}
      {productoSeleccionado && (
        <ProductoModal 
          producto={productoSeleccionado} 
          onClose={() => setProductoSeleccionado(null)} 
          onEdit={handleEdit} 
          onDelete={()=> { 
            prepareDelete(productoSeleccionado.id);
            handleDelete();
          }}
          onStock={handleStock}
          usuario={user}
          onAddToCart={(cantidad) => {
            agregarAlCarrito(productoSeleccionado, cantidad);
            toast.success(`${cantidad} ${productoSeleccionado.nombre}(s) agregado(s) al carrito`);
            setProductoSeleccionado(null);
          }}
        />
      )}
    
      {/* Modal para agregar/editar ítem */}
      {mostrarModal && (
        <Modal 
          titulo={nuevoItem.id ? "Editar Ítem" : "Añadir Nuevo Ítem"} 
          onClose={() => {setMostrarModal(false); handleCloseModal()}}
        >
          <form onSubmit={nuevoItem.id ? handleUpdate : handleSubmit} className="mt-4"> //si tiene id edita, sino submitea 
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">Nombre:</label>
              <input
                type="text"
                placeholder="Nombre del producto"
                value={nuevoItem.nombre}
                onChange={(e) => setNuevoItem({ ...nuevoItem, nombre: e.target.value })}
                className="bg-white text-black placeholder-gray-400 border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">Descripción:</label>
              <textarea
                placeholder="Descripción del producto"
                value={nuevoItem.descripcion}
                onChange={(e) => setNuevoItem({ ...nuevoItem, descripcion: e.target.value })}
                className="border bg-white align-text-top text-black placeholder-gray-400 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">Precio:</label>
              <input
                type="number"
                step="0.01"
                placeholder="Precio"
                value={nuevoItem.precio}
                onChange={(e) => setNuevoItem({ ...nuevoItem, precio: e.target.value })}
                className="border bg-white text-black placeholder-gray-400 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">Categoría:</label>
              <select
                value={nuevoItem.categoriaId}
                onChange={(e) => setNuevoItem({ ...nuevoItem, categoriaId: e.target.value })}
                className="border bg-white text-black p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              > 
                <option value="">Selecciona una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
             
            <div className=" bg-gray-50 p-3 rounded">
              <label className="block text-gray-700 text-sm font-bold mb-2">Etiquetas dietéticas:</label>
              <div className="text-black flex flex-wrap gap-4">
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    name="tag" 
                    value="GF" 
                    className="form-checkbox h-5 w-5 text-blue-600"
                    checked={nuevoItem.tag?.includes('GF')}
                    onChange={(e) => {
                      const tags = nuevoItem.tag ? nuevoItem.tag.split(',') : [];
                      if (e.target.checked) {
                        tags.push('GF');
                      } else {
                        const index = tags.indexOf('GF');
                        if (index > -1) tags.splice(index, 1);
                      }
                      setNuevoItem({ ...nuevoItem, tag: tags.join(',') });
                    }}
                  />
                  <span className="ml-2">Sin gluten</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    name="tag" 
                    value="Veg" 
                    className="form-checkbox h-5 w-5 text-green-600"
                    checked={nuevoItem.tag?.includes('Veg')}
                    onChange={(e) => {
                      const tags = nuevoItem.tag ? nuevoItem.tag.split(',') : [];
                      if (e.target.checked) {
                        tags.push('Veg');
                      } else {
                        const index = tags.indexOf('Veg');
                        if (index > -1) tags.splice(index, 1);
                      }
                      setNuevoItem({ ...nuevoItem, tag: tags.join(',') });
                    }}
                  />
                  <span className="ml-2">Vegetariano</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    name="tag" 
                    value="V" 
                    className="form-checkbox h-5 w-5 text-purple-600"
                    checked={nuevoItem.tag?.includes('V')}
                    onChange={(e) => {
                      const tags = nuevoItem.tag ? nuevoItem.tag.split(',') : [];
                      if (e.target.checked) {
                        tags.push('V');
                      } else {
                        const index = tags.indexOf('V');
                        if (index > -1) tags.splice(index, 1);
                      }
                      setNuevoItem({ ...nuevoItem, tag: tags.join(',') });
                    }}
                  />
                  <span className="ml-2">Vegano</span>
                </label>
              </div>
            </div>
    
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => {setMostrarModal(false); handleCloseModal()}}
                className="mt-3 bg-gray-500 text-white px-4 py-2 rounded-lg w-1/2 hover:bg-gray-600 transition-colors duration-300"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg w-1/2 hover:bg-blue-600 transition-colors duration-300"
              >
                {nuevoItem.id ? "Actualizar" : "Añadir"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal para seleccionar cantidad */}
      {showCantidadModal && cantidadModalItem && (
        <Modal 
          titulo={`Agregar ${cantidadModalItem.nombre} al carrito`}
          onClose={() => {
            setShowCantidadModal(false);
            setCantidadModalItem(null);
            setCantidad(1);
          }}
        >
          <div className="p-4">
            <p className="mb-4 text-gray-700">¿Cuántas unidades deseas agregar?</p>
            
            <div className="flex items-center justify-center mb-6">
              <button 
                className="bg-gray-200 px-3 py-1 rounded-l-lg text-xl font-bold hover:bg-gray-300"
                onClick={() => setCantidad(prev => Math.max(1, prev - 1))}
              >
                -
              </button>
              
              <input
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                className="w-16 text-center py-1 border-t border-b border-gray-300"
              />
              
              <button 
                className="bg-gray-200 px-3 py-1 rounded-r-lg text-xl font-bold hover:bg-gray-300"
                onClick={() => setCantidad(prev => prev + 1)}
              >
                +
              </button>
            </div>
            
            <div className="flex justify-between gap-3">
              <button
                className="w-1/2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                onClick={() => {
                  setShowCantidadModal(false);
                  setCantidadModalItem(null);
                  setCantidad(1);
                }}
              >
                Cancelar
              </button>
              
              <button
                className="w-1/2 bg-naranja text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                onClick={handleConfirmCantidad}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </Modal>
      )}
      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <Modal 
          titulo="Confirmar eliminación"
          onClose={() => {
            setShowDeleteConfirm(false);
            setItemToDelete(null);
          }}
        >
          <div className="p-4">
            <p className="mb-4 text-gray-700 font-bold text-center">¿Estás seguro de que deseas eliminar este ítem?</p>
            <p className="mb-6 text-red-600 text-center">Esta acción no se puede deshacer.</p>
            
            <div className="flex justify-between gap-3">
              <button
                className="w-1/2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setItemToDelete(null);
                }}
              >
                Cancelar
              </button>
              
              <button
                className="w-1/2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </Modal>
      )}
      {/* Modal para seleccionar mesa o tipo de pedido */}
      {showMesaModal && (
        <Modal 
          titulo={mesaInfo.tipo ? "Cambiar ubicación" : "¿Dónde estás disfrutando Pixel Café?"}
          onClose={() => {
            setShowMesaModal(false);
            setCantidadModalItem(null);
          }}
        >
          <div className="p-4">
            <div className="mb-4">
              <div className="flex gap-3 mb-4">
                <button 
                  className={`flex-1 py-2 px-4 rounded-lg ${mesaInfo.tipo === 'mesa' ? 'bg-naranja text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setMesaInfo({...mesaInfo, tipo: 'mesa'})}
                >
                  En mesa
                </button>
                <button 
                  className={`flex-1 py-2 px-4 rounded-lg ${mesaInfo.tipo === 'delivery' ? 'bg-naranja text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setMesaInfo({...mesaInfo, tipo: 'delivery'})}
                >
                  Delivery
                </button>
                <button 
                  className={`flex-1 py-2 px-4 rounded-lg ${mesaInfo.tipo === 'takeaway' ? 'bg-naranja text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setMesaInfo({...mesaInfo, tipo: 'takeaway'})}
                >
                  Para llevar
                </button>
              </div>
              
              {mesaInfo.tipo === 'mesa' && (
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Número de mesa:</label>
                  <input
                    type="number"
                    placeholder="Ej: 5"
                    value={mesaInfo.numero}
                    onChange={(e) => setMesaInfo({...mesaInfo, numero: e.target.value})}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-naranja"
                  />
                </div>
              )}
              
              {mesaInfo.tipo === 'delivery' && (
                <div className="p-4 border rounded bg-gray-50">
                  <p className="text-sm text-gray-600">
                    Para delivery, completa los datos de envío al finalizar tu pedido en el carrito.
                  </p>
                </div>
              )}
              
              {mesaError && (
                <p className="text-red-500 text-sm mt-2">{mesaError}</p>
              )}
            </div>
            
            <div className="flex justify-between gap-3 mt-6">
              <button
                className="w-1/2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                onClick={() => {
                  setShowMesaModal(false);
                  setCantidadModalItem(null);
                }}
              >
                Cancelar
              </button>
              
              <button
                className="w-1/2 bg-naranja text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                onClick={handleConfirmMesa}
                disabled={verificandoMesa}
              >
                {verificandoMesa ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin h-5 w-5 mr-2 border-b-2 border-white rounded-full"></span>
                    Verificando...
                  </span>
                ) : (
                  "Continuar"
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}

export default RenderMenu;