import { useRouter } from 'next/router';
import { useState } from 'react';
import { ref, push, update } from 'firebase/database';
import { database } from '../../firebase';

export default function OrderPage() {
  const router = useRouter();
  const { id, productName, productImage, stock, price } = router.query;
  const [order, setOrder] = useState({ quantity: '', firstName: '', lastName: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseInt(order.quantity) > parseInt(stock)) {
      alert('Cantidad solicitada excede el stock disponible.');
      return;
    }

    const orderId = Date.now(); // Generar un ID de orden único basado en la fecha/hora actual
    const orderData = {
      id: orderId,
      productId: id,
      productName,
      productImage,
      quantity: order.quantity,
      price,
      total: order.quantity * price,
      customer: {
        firstName: order.firstName,
        lastName: order.lastName
      },
      status: 'new'
    };

    const res = await fetch('/api/saveOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orderData, stock })
    });

    if (res.ok) {
      alert('Orden de compra creada con éxito');
      router.push('/');
    } else {
      alert('Error al crear la orden de compra');
    }
  };

  return (
    <div>
      <h1>Compra de {productName}</h1>
      <img src={productImage} alt={productName} style={{ maxWidth: '150px' }} />
      <div>
        <strong>Stock disponible:</strong> {stock}
      </div>
      <div>
        <strong>Precio:</strong> ${price}
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Cantidad:</label>
          <input type="number" value={order.quantity} onChange={(e) => setOrder({ ...order, quantity: e.target.value })} />
        </div>
        <br />
        <div>
          <label>Datos del Cliente</label>
        </div>
        <div>
          <label>Nombre:</label>
          <input type="text" value={order.firstName} onChange={(e) => setOrder({ ...order, firstName: e.target.value })} />
        </div>
        <div>
          <label>Apellido:</label>
          <input type="text" value={order.lastName} onChange={(e) => setOrder({ ...order, lastName: e.target.value })} />
        </div>
        <button type="submit">Crear Orden</button>
      </form>
    </div>
  );
}
