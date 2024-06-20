import { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, push } from 'firebase/database';
import fetch from 'isomorphic-unfetch';

export default function Invoice() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const ordersRef = ref(database, 'orders');
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setOrders(Object.values(data));
      }
    });
  }, []);

  const generateInvoice = async (orderId) => {
    const res = await fetch('/api/generateInvoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orderId })
    });

    if (res.ok) {
      alert('Factura generada y guardada correctamente');
    } else {
      alert('Error al generar la factura');
    }
  };

  return (
    <div>
      <h1>Sistema de Facturación</h1>
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            <div>ID del Producto: {order.productId}</div>
            <div>Nombre del Producto: {order.productName}</div>
            <div>Cantidad: {order.quantity}</div>
            <div>Cliente: {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'Información del cliente no disponible'}</div>
            <div>Status: {order.status}</div>
            {order.status === 'new' && (
              <button onClick={() => generateInvoice(order.id)}>Generar Factura</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}