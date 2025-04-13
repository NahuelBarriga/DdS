import api from './api';
import ItemResDTO from '../models/itemResDTO';
import ItemFormDTO from '../models/itemFormDTO';
import {API_PORT, MODO_PRUEBA} from '../config';
import { refresh } from './loginHelper';

const API_URL = `/items`;


const mockMenu = [
  { id: 1, nombre: "Café Expreso", precio: 25.00 },
  { id: 2, nombre: "Té Verde", precio: 15.00 },
  { id: 3, nombre: "Medialuna", precio: 10.00 }
];

export const getMenu = async () => {
  if (MODO_PRUEBA) {
    console.log("⚠️ Usando datos MOCK para el menú");
    return new Promise((resolve) => setTimeout(() => resolve(mockMenu), 500)); // Simula un delay de 500ms
  }
  try {
    const response = await api.get(`${API_URL}/menu`); 
    return response.data.map(ItemResDTO.fromJson);
  } catch (error) {
    console.error("Error al obtener el menú:", error);
    return [];
  }
};

export const getItemById = async (id) => { 
  try {

    const response = await api.get(`${API_URL}/${id}`);
    console.log(response); //!borrar
    
    return response.data.map(ItemDTO.fromJson);
  } catch (error) {
    console.error("Error al obtener el menú:", error);
    return [];
  }
}

export const postItem = async(item) => { 
  try { 
    const itemDTO = new ItemFormDTO(item);
    console.log(itemDTO); //!sacar
    const response = await api.post(API_URL, JSON.stringify(itemDTO));  
    return response; 
  } catch (error) {  
      if (error.status == 403) { //token expirado
        refresh(); 
      } else { 
        console.error('Error en la solicitud: ', error); 
      }
  }

}
export const updateItem = async (item) => {
  try {
    const itemDTO = new ItemFormDTO(item);
    console.log(itemDTO);
    const response = await api.patch(`${API_URL}/${item.id}`, JSON.stringify(itemDTO));

    console.log(response.status, response.data);
    return response;
  } catch (error) {
    if (error.status === 403) { // token expired
      refresh();
    } else {
      console.error('Error en la solicitud: ', error);
    }
    return null;
  }
};

export const updateItemStock = async (id, estado) => { 
  try {
    const response = await api.patch(`${API_URL}/${id}/stock`, {stock: estado});
    return response;
  } catch (error) {
    if (error.status === 403) { // token expired
      refresh();
    } else {
      console.error('Error en la solicitud: ', error);
    }
    return null;
  }
}

export const deleteItem = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/${id}`);
    console.log(response.status, response.data);
    return response;
  } catch (error) {
    if (error.status === 403) { // token expired
      refresh();
    } else {
      console.error('Error en la solicitud: ', error);
    }
    return null;
  }
};

export const postCat = async (category) => {
  try {
    const response = await api.post('/categories', JSON.stringify(category));
    console.log(response.status, response.data);
    return response.data;
  } catch (error) {
    if (error.status === 403) { // token expired
      refresh();
    } else {
      console.error('Error en la solicitud: ', error);
    }
    return null;
  }
};

export const deleteCat = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    console.log(response.status, response.data);
    return response.data;
  } catch (error) {
    if (error.status === 403) { // token expired
      refresh();
    } else {
      console.error('Error en la solicitud: ', error);
    }
    return null;
  }
};

export const getAllCat = async () => {
  if (MODO_PRUEBA) {
    console.log("⚠️ Usando datos MOCK para las categorías");
    return new Promise((resolve) => setTimeout(() => resolve([
      { id: 1, nombre: "Bebidas" },
      { id: 2, nombre: "Comidas" },
      { id: 3, nombre: "Postres" }
    ]), 500)); // Simula un delay de 500ms
  }

  try {
    const response = await api.get('/items/categorias');
    console.log(response)
    return response.data;
  } catch (error) {
    if (error.status === 403) { // token expired
      refresh();
    } else {
      console.error('Error en la solicitud: ', error);
    }
    return null;
  }

};








