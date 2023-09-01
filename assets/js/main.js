const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
    <a class="text-decoration-none" href="/details/about?pokemon=${
      pokemon.name
    }">
      <li class="pokemon ${pokemon.type.name}">
        <span class="number">#${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>

        <div class="detail">
          <ol class="types">
            ${pokemon.types
              .map((type) => `<li class="type ${type.name}">${type.name}</li>`)
              .join("")}
          </ol>

            <img src="${pokemon.sprites.svg}" alt="${pokemon.name}">
        </div>
      </li>
    </a>
    `;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then(() => {
    const cache = getPokemonsCache();
    const pokemonsSlice = Object.values(cache).filter(
      (pokemon) => pokemon.number >= offset && pokemon.number < offset + limit
    ).sort((a, b) => a.number - b.number);
    const newHtml = pokemonsSlice.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});
