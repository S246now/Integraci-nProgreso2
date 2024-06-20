import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function OrderPage() {
  const router = useRouter();
  const { id } = router.query;
  const [pokemon, setPokemon] = useState(null);
  const [order, setOrder] = useState({ quantity: '', firstName: '', lastName: '' });

  useEffect(() => {
    const fetchPokemon = async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await res.json();
      setPokemon({ id: data.id, name: data.name, image: data.sprites.front_default });
    };

    if (id) {
      fetchPokemon();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      productId: pokemon.id,
      productName: pokemon.name,
      productImage: pokemon.image,
      quantity: order.quantity,
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
      body: JSON.stringify({ order: orderData })
    });

    if (res.ok) {
      alert('Orden de compra creada con éxito');
      router.push('/');
    } else {
      alert('Error al crear la orden de compra');
    }
  };

  return (
    pokemon && (
      <div>
        <h1>Compra de {pokemon.name}</h1>
        <img src={pokemon.image} alt={pokemon.name} style={{ maxWidth: '150px' }} />
        <form onSubmit={handleSubmit}>
          <div>
            <label>Cantidad:</label>
            <input type="number" value={order.quantity} onChange={(e) => setOrder({ ...order, quantity: e.target.value })} />
          </div>
          <br></br>
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
    )
  );
}
