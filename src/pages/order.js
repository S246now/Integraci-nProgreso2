import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NewOrder() {
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    const fetchPokemonList = async () => {
      const promises = [];
      for (let i = 1; i <= 10; i++) { // Obtén las imágenes de los primeros 10 Pokémon
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

  return (
    <div>
      <h1>Lista de Pokémon</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {pokemonList.map(pokemon => (
          <div key={pokemon.id} style={{ margin: '10px' }}>
            <img src={pokemon.image} alt={pokemon.name} style={{ maxWidth: '150px' }} />
            <div>{pokemon.name}</div>
            <Link href={`/order/${pokemon.id}`} legacyBehavior>
              <a>
                <button>Comprar</button>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
