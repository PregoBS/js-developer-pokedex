const pokemonsCache = {};
const pokeApi = {};

function convertPokeApiDetailToPokemonAndCache(pokeDetail) {
  const stats = pokeDetail.stats.map((statSlot) => (
    new PokemonStat({
      baseStat: statSlot.base_stat,
      effort: statSlot.effort,
      name: statSlot.stat.name,
      url: statSlot.stat.url,
    })
  ));

  const types = pokeDetail.types.map((typeSlot) => (
    new PokemonType({
      slot: typeSlot.slot,
      name: typeSlot.type.name,
      url: typeSlot.type.url,
    })
  ));

  const moves = pokeDetail.moves.map((moveSlot) => (
      new PokemonMove({
        name: moveSlot.move.name,
        url: moveSlot.move.url,
      })
  ));

  const abilities = pokeDetail.abilities.map((abilitySlot) => (
    new PokemonAbility({
      slot: abilitySlot.slot,
      isHidden: abilitySlot.isHidden,
      name: abilitySlot.ability.name,
      url: abilitySlot.ability.url,
    })
  ));

  pokemonsCache[pokeDetail.name] = new Pokemon({
    number: pokeDetail.id,
    name: pokeDetail.name,
    type: types[0],
    baseExp: pokeDetail.base_experience,
    weight: pokeDetail.weight,
    height: pokeDetail.height,
    photo: pokeDetail.sprites.other.dream_world.front_default,
    types,
    moves,
    abilities,
    stats
  });
  
  return;
}

pokeApi.getPokemonDetail = (pokemon) => {
  if (pokemonsCache[pokemon.name]) return;

  return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemonAndCache);
};

pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    .then((detailRequests) => Promise.all(detailRequests));
};
