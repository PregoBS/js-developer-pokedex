const pokeApi = {};

const POKEMONS_CACHE_KEY = "pokemons";

function writeCacheToLocalStorage(pokemon) {
  try {
    let cache = JSON.parse(localStorage.getItem(POKEMONS_CACHE_KEY)) || {};
    cache[pokemon.name] = pokemon;
    localStorage.setItem(POKEMONS_CACHE_KEY, JSON.stringify(cache));
  } catch (err) {
    console.log("[LOCAL STORAGE] Error caching pokemons:", err);
  }
}

function getPokemonsCache() {
  try {
    const cache = localStorage.getItem(POKEMONS_CACHE_KEY);
    if (cache) return JSON.parse(cache);
    else return null;
  } catch (err) {
    console.log("[LOCAL STORAGE] Error getting pokemons cache:", err);
  }
}

function convertPokeApiDetailAndSpeciesToPokemonAndCache(
  pokeDetail,
  pokeSpecies
) {
  const types = pokeDetail.types.map(
    (typeSlot) =>
      new PokemonType({
        slot: typeSlot.slot,
        name: typeSlot.type.name,
        url: typeSlot.type.url,
      })
  );

  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;
  pokemon.type = types[0];
  pokemon.types = types;
  pokemon.sprites = new PokemonSprites({
    svg: pokeDetail.sprites.other.dream_world.front_default,
    male: pokeDetail.sprites.front_default,
    female: pokeDetail.sprites.front_female,
    shinyMale: pokeDetail.sprites.front_shiny,
    shinyFemale: pokeDetail.sprites.front_shiny_female,
    backMale: pokeDetail.sprites.back_default,
    backFemale: pokeDetail.sprites.back_female,
    backShinyMale: pokeDetail.sprites.back_shiny,
    backShinyFemale: pokeDetail.sprites.back_shiny_female,
  });
  pokemon.weight = pokeDetail.weight;
  pokemon.height = pokeDetail.height;
  pokemon.baseExp = pokeDetail.base_experience;
  pokemon.moves = pokeDetail.moves.map(
    (moveSlot) =>
      new PokemonMove({
        name: moveSlot.move.name,
        url: moveSlot.move.url,
      })
  );
  pokemon.abilities = pokeDetail.abilities.map(
    (abilitySlot) =>
      new PokemonAbility({
        slot: abilitySlot.slot,
        isHidden: abilitySlot.isHidden,
        name: abilitySlot.ability.name,
        url: abilitySlot.ability.url,
      })
  );
  pokemon.stats = pokeDetail.stats.map(
    (statSlot) =>
      new PokemonStat({
        baseStat: statSlot.base_stat,
        effort: statSlot.effort,
        name: statSlot.stat.name,
        url: statSlot.stat.url,
      })
  );

  // from species
  pokemon.baseHappiness = pokeSpecies.base_happiness;
  pokemon.captureRate = pokeSpecies.capture_rate;
  pokemon.genderRate = pokeSpecies.gender_rate;
  pokemon.eggGroups = pokeSpecies.egg_groups.map(
    (group) =>
      new PokemonEggGroup({
        name: group.name,
        url: group.url,
      })
  );
  pokemon.evolvesFromSpecies =
    pokeSpecies.evolves_from_species !== null
      ? new PokemonEvolvesFromSpecies({
          name: pokeSpecies.evolves_from_species.name,
          url: pokeSpecies.evolves_from_species.url,
        })
      : null;
  pokemon.growthRate = new PokemonGrowthRate({
    name: pokeSpecies.growth_rate.name,
    url: pokeSpecies.growth_rate.url,
  });
  pokemon.habitat = new PokemonHabitat({
    name: pokeSpecies.habitat.name,
    url: pokeSpecies.habitat.url,
  });
  pokemon.hasGenderDifferences = pokeSpecies.has_gender_differences;
  pokemon.isBaby = pokeSpecies.is_baby;
  pokemon.isLegendary = pokeSpecies.is_legendary;
  pokemon.isMythical = pokeSpecies.is_mythical;
  pokemon.shape = new PokemonShape({
    name: pokeSpecies.shape.name,
    url: pokeSpecies.shape.url,
  });
  pokemon.varieties = pokeSpecies.varieties.map(
    (variety) =>
      new PokemonVariety({
        name: variety.pokemon.name,
        url: variety.pokemon.url,
        isDefault: variety.is_default,
      })
  );
  return pokemon;
}

pokeApi.getPokemonDetail = (pokemonName) => {
  const cache = getPokemonsCache();
  if (cache && cache[pokemonName]) return;

  const urls = [
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
    `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`,
  ];

  return Promise.all(
    urls.map((url) => fetch(url).then((response) => response.json()))
  )
    .then(([pokeDetails, pokeSpecies]) => {
      return convertPokeApiDetailAndSpeciesToPokemonAndCache(
        pokeDetails,
        pokeSpecies
      );
    })
    .then((pokemon) => writeCacheToLocalStorage(pokemon));
};

pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) =>
      pokemons.map((pokemon) => pokeApi.getPokemonDetail(pokemon.name))
    )
    .then((detailRequests) => Promise.all(detailRequests));
};
