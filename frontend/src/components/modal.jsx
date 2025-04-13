function Modal({ titulo, children, onClose }) {
  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-background") {
      onClose(); // Cerrar modal si se hace clic fuera
    }
  };

  return (
    <div
      id="modal-background"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30"
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-black">{titulo}</h2>
        {children}
      </div>
    </div>
  );
}

export default Modal;
