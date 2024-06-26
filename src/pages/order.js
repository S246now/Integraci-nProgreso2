import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ref, get, child } from 'firebase/database';
import { database } from '../firebase';

export default function NewOrder() {
  const [pokemonList, setPokemonList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPokemonList = async () => {
      const promises = [];
      for (let i = 1; i <= 10; i++) {
        promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then(res => res.json()));
      }
      const results = await Promise.all(promises);
      setPokemonList(results.map(pokemon => ({
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.sprites.front_default
      })));
    };

    fetchPokemonList();
  }, []);

  const handleBuy = async (pokemon) => {
    const productsRef = ref(database, 'products');
    const snapshot = await get(productsRef);

    if (snapshot.exists()) {
      const products = snapshot.val();
      let product = null;

      for (const key in products) {
        if (products[key].productId === pokemon.id.toString()) {
          product = products[key];
          break;
        }
      }

      if (product) {
        router.push({
          pathname: `/order/${pokemon.id}`,
          query: {
            productName: pokemon.name,
            productImage: pokemon.image,
            stock: product.stock,
            price: product.price
          }
        });
      } else {
        alert('No hay unidades disponibles del producto seleccionado.');
      }
    } else {
      alert('No hay unidades disponibles del producto seleccionado.');
    }
  };

  return (
    <div>
      <h1>Lista de Pokémon</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {pokemonList.map(pokemon => (
          <div key={pokemon.id} style={{ margin: '10px' }}>
            <img src={pokemon.image} alt={pokemon.name} style={{ maxWidth: '150px' }} />
            <div>{pokemon.name}</div>
            <button onClick={() => handleBuy(pokemon)}>Comprar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
