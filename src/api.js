import axios from 'axios';

const API_URL = 'https://backen-sc.onrender.com/fechas-historicas';

export const getFechasHistoricas = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.fechasHistoricas || [];
  } catch (error) {
    console.error('Error obteniendo fechas históricas:', error);
    throw new Error('No se pudieron obtener las fechas históricas');
  }
};

export const addFechaHistorica = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data.fechaHistorica;
  } catch (error) {
    console.error('Error agregando fecha histórica:', error);
    throw new Error('No se pudo agregar la fecha histórica');
  }
};

export const updateFechaHistorica = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data.fechaHistorica;
  } catch (error) {
    console.error('Error actualizando fecha histórica:', error);
    throw new Error('No se pudo actualizar la fecha histórica');
  }
};

export const deleteFechaHistorica = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error eliminando fecha histórica:', error);
    throw new Error('No se pudo eliminar la fecha histórica');
  }
};

export const deleteImage = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}/imagen`);
    return response.data;
  } catch (error) {
    console.error('Error eliminando imagen:', error);
    throw new Error('No se pudo eliminar la imagen');
  }
};

