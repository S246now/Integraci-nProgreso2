import { useState } from 'react';
import { database } from '../firebase';
import { ref, push } from 'firebase/database';

export default function NewProduct() {
  const [productName, setProductName] = useState('');
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);

  const handleAddProduct = async () => {
    const productRef = ref(database, 'products');
    await push(productRef, { productName, stock, price });
    alert('Producto agregado correctamente');
  };

  return (
    <div>
      <h1>Agregar Nuevo Producto</h1>
      <div>
        <label>Nombre del Producto:</label>
        <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
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
