import { useEffect, useState } from 'react';
import { database } from '../firebase';
import { ref, push, get } from 'firebase/database';

export default function NewProduct() {
  const [productId, setProductId] = useState('');
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  
  const handleAddProduct = async () => {
    const productRef = ref(database, 'products');
    const newProduct = {
      productId,
      stock,
      price,
    };
    await push(productRef, newProduct);
    alert('Producto agregado correctamente');
  };

  return (
    <div>
      <h1>Agregar Nuevo Producto</h1>
      <div>
        <label>ID del Producto:</label>
        <input type="text" value={productId} onChange={(e) => setProductId(e.target.value)} />
      </div>
      <div>
        <label>Stock:</label>
        <input type="number" value={stock} onChange={(e) => setStock(parseInt(e.target.value))} />
      </div>
      <div>
        <label>Precio:</label>
        <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} />
      </div>
      <button onClick={handleAddProduct}>Agregar Producto</button>
    </div>
  );
}
