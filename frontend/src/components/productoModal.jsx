import { useState } from "react";
import {Trash2, EyeOff, Eye, Pencil} from "lucide-react"

function ProductoModal({ producto, onClose, onEdit, onDelete, onStock, usuario, onAddToCart }) {
  const [cantidad, setCantidad] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(cantidad);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>

        

        <div className="flex items-center">

          <h2 className="text-black text-2xl font-bold mb-4">{producto.nombre}</h2>
          <div className="pl-1">
            {/* Botones de acción para administradores */}
            {usuario?.cargo === "admin" && (
                <>
                  <button 
                    onClick={() => onEdit(producto)} 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(producto.id)} 
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                   <Trash2 size={16} />
                  </button>
                  <button 
                    onClick={() => onStock(producto)} 
                    className={`${producto.stock ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white px-4 py-2 rounded`}
                  >
                    {producto.stock ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </>
              )}
            </div>
        </div>
          
        
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Precio:</span> ${producto.precio.toFixed(2)}
        </p>
        
        {producto.descripcion && (
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Descripción:</span> {producto.descripcion}
          </p>
        )}
        
        {producto.tag && (
          <p className="text-gray-700 mb-4">
            <span className="font-semibold">Etiquetas:</span> {producto.tag}
          </p>
        )}

        {/* Selector de cantidad para clientes y empleados */}
        {(usuario?.cargo === "cliente" || usuario?.cargo === "empleado") && producto.stock !== false && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad:
            </label>
            <div className="flex items-center">
              <button 
                className="bg-gray-200 px-3 py-1 rounded-l"
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center p-1 border-t border-b"
              />
              <button 
                className="bg-gray-200 px-3 py-1 rounded-r"
                onClick={() => setCantidad(cantidad + 1)}
              >
                +
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          
          {/* Botón de agregar al carrito para clientes y empleados */}
          {(usuario?.cargo === "cliente" || usuario?.cargo === "empleado") && producto.stock !== false && (
            <button 
              onClick={handleAddToCart} 
              className="bg-naranja text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Agregar al Carrito
            </button>
          )}
          
          <button 
            onClick={onClose} 
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductoModal;