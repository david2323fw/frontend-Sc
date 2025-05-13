import React, { useEffect, useState } from 'react';
import './App.css';
import {
  getFechasHistoricas,
  addFechaHistorica,
  updateFechaHistorica,
  deleteFechaHistorica,
  deleteImage,
} from './api';

function App() {
  // Definimos los estados sin tipado TypeScript
  const [fechasHistoricas, setFechasHistoricas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState('');
  const [imagen, setImagen] = useState(''); // ahora es una URL
  const [descripcion, setDescripcion] = useState('');
  const [editingId, setEditingId] = useState(null); // puede ser un id o null
  const [loading, setLoading] = useState(true);
  const [imagenEliminada, setImagenEliminada] = useState(false);

  useEffect(() => {
    fetchFechasHistoricas();
  }, []);

  const fetchFechasHistoricas = async () => {
    try {
      const data = await getFechasHistoricas();
      setFechasHistoricas(data);
    } catch (error) {
      console.error('Error al obtener fechas históricas:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setTitulo('');
    setFecha('');
    setImagen('');
    setDescripcion('');
    setEditingId(null);
    setImagenEliminada(false);
  };

  const handleSubmit = async () => {
    if (!titulo || !fecha || !descripcion) {
      alert('Por favor llena todos los campos.');
      return;
    }

    const data = {
      titulo,
      fecha,
      descripcion,
      imagen: imagenEliminada ? null : imagen,
    };

    try {
      if (editingId) {
        const updated = await updateFechaHistorica(editingId, data);
        setFechasHistoricas(fechasHistoricas.map((f) => (f._id === editingId ? updated : f)));
      } else {
        const added = await addFechaHistorica(data);
        setFechasHistoricas([...fechasHistoricas, added]);
      }
      clearForm();
    } catch (error) {
      console.error('Error al guardar fecha histórica:', error);
    }
  };

  const handleEdit = (item) => {
    setTitulo(item.titulo);
    setFecha(item.fecha);
    setDescripcion(item.descripcion);
    setImagen(item.imagen || '');
    setEditingId(item._id);
    setImagenEliminada(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteFechaHistorica(id);
      setFechasHistoricas(fechasHistoricas.filter((f) => f._id !== id));
    } catch (error) {
      console.error('Error al eliminar fecha histórica:', error);
    }
  };

  const handleDeleteImage = async () => {
    if (!editingId) return;

    try {
      await deleteImage(editingId);
      setImagenEliminada(true);
      setImagen('');
      setFechasHistoricas(fechasHistoricas.map((f) =>
        f._id === editingId ? { ...f, imagen: null } : f
      ));
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
    }
  };

  return (
    <div className="container">
      <div className="main-content">
        <div className="form-section">
          <h1>{editingId ? 'Editar Fecha Histórica' : 'Agregar Fecha Histórica'}</h1>

          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <input
            type="text"
            placeholder="Fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
          <input
            type="text"
            placeholder="URL de la imagen"
            value={imagen || ''}
            onChange={(e) => setImagen(e.target.value)}
          />
          {editingId && !imagenEliminada && imagen && (
            <div>
              <img
                src={imagen}
                alt="Imagen actual"
                style={{ width: '100px', height: '100px' }}
              />
              <button onClick={handleDeleteImage} className="delete-image-button">
                Eliminar Imagen
              </button>
            </div>
          )}
          <textarea
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          <button onClick={handleSubmit}>
            {editingId ? 'Actualizar' : 'Agregar'}
          </button>

          {editingId && (
            <button onClick={clearForm} className="cancel-button">
              Cancelar
            </button>
          )}
        </div>

        <div className="list-section">
          <h2>Lista de Fechas Históricas</h2>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            fechasHistoricas.map((item) => (
              <div key={item._id} className="fecha-item">
                <h3>{item.titulo}</h3>
                <p>Fecha: {item.fecha}</p>
                {item.imagen && (
                  <img
                    src={item.imagen}
                    alt={item.titulo}
                    className="fecha-image"
                  />
                )}
                <p>{item.descripcion}</p>

                <button onClick={() => handleEdit(item)}>Editar</button>
                <button onClick={() => handleDelete(item._id)}>Eliminar</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
