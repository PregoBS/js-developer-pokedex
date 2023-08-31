const queryString = window.location.search;
const section = window.location.pathname.split("/")[2] || "about";
const urlParams = new URLSearchParams(queryString);

const pokemonName = urlParams.get("pokemon") || 'bulbasaur';

var cache = getPokemonsCache();

if (!cache || !cache[pokemonName]) {
  console.log("Sem cache, fazendo o fetch ..");
  pokeApi.getPokemonDetail(pokemonName)
    .then(() => {
      cache = getPokemonsCache();
      insertDetailsHTML(cache[pokemonName], section);
    })
    .catch((error) => console.log(`[GET] Error getting Pokemon (${pokemonName}) Details:`, error));
} else {
  insertDetailsHTML(cache[pokemonName], section);
}

function createDetailsHTML(pokemon, section) {
  return `
  <div class="details ${pokemon.type.name}">
    <div class="detailsMain full-h column space-between">
      <div class="pokedex-link row items-center">
        <a href="/" class="text-decoration-none">
          ${arrowLeftIcon()} Pokedex
        </a>
      </div>

      <div class="row space-between items-center p1">
        <div>
          <h1 id="pokemonName" class="font-30">${pokemon.name}</h1>
          <ol id="pokemonTypes" class="row types list-style-none font-11">
            ${pokemon.types.map((type) => `<li class="type ${type.name}">${type.name}</li>`).join("")}
          </ol>
        </div>
        <div>
          <h3 id="pokemonNumber" class="font-18"># ${String(pokemon.number).padStart(4, "0")}</h3>
        </div>
      </div>

      <div class="column">
        <img src="${pokemon.photo}" alt="${pokemon.name}" class="sprite">
        <div class="detailsInfo">
          ${createDetailsSectionHTML(pokemon, section)}
        </div>
      </div>
    </div>
  </div>
  `;
}

function createDetailsSectionHTML(pokemon, section) {
  switch (section) {
    case "about":
      return createAboutSectionHTML(pokemon);
    case "stats":
      return createStatsSectionHTML(pokemon);
    case "moves":
      return createMovesSectionHTML(pokemon);
    default:
      return "";
  }
}

function createAboutSectionHTML(pokemon) {
  const femaleRate = pokemon.genderRate / 8;
  return `
  <nav class="p1">
    <ul class="nav row space-around list-style-none font-16">
      <li><a class="text-decoration-none cursor-default selected">About</a></li>
      <li><a href="/details/stats?pokemon=${pokemon.name}" class="text-decoration-none cursor-pointer">Base Stats</a></li>
      <li><a href="/details/moves?pokemon=${pokemon.name}" class="text-decoration-none cursor-pointer">Moves</a></li>
    </ul>
  </nav>

  <div id="pokemonInfo" class="info">
    <div>
      <div class="row">
        <ul class="list-style-none labels font-14">
          <li>Height</li>
          <li>Weight</li>
          <li>Abilities</li>
        </ul>
        <ul class="list-style-none values font-14">
          <li>${(pokemon.height*10).toFixed(1)} cm</li>
          <li>${(pokemon.weight/10).toFixed(1)} kg</li>
          <li>${pokemon.abilities.map((ability, index) => {
            if (index >= pokemon.abilities.length-1) return `${ability.name}`;
            else return `${ability.name}, `;
          }).join("")}</li>
        </ul>
      </div>
    </div>
    <div>
      <h3 class="font-18">Breeding</h3>
      <div class="row">
        <ul class="list-style-none labels font-14">
          <li>Gender</li>
          <li>Egg Groups</li>
        </ul>
        <ul class="list-style-none values font-14">
          <li><span class="gender-m">M ${((1-femaleRate) * 100).toFixed(1)}%</span> <span class="gender-f">F ${(femaleRate * 100).toFixed(1)}%</span></li>
          <li>${pokemon.eggGroups.map((group, index) => {
            if (index >= pokemon.eggGroups.length-1) return `${group.name}`;
            else return `${group.name}, `;
          }).join("")}</li>
        </ul>
      </div>
    </div>
  </div>
  `;
}

function createStatsSectionHTML(pokemon) {
  const femaleRate = pokemon.genderRate / 8;
  return `
  <nav class="p1">
    <ul class="nav row space-around list-style-none font-16">
      <li><a href="/details/about?pokemon=${pokemon.name}" class="text-decoration-none cursor-pointer">About</a></li>
      <li><a class="text-decoration-none cursor-default selected">Base Stats</a></li>
      <li><a href="/details/moves?pokemon=${pokemon.name}" class="text-decoration-none cursor-pointer">Moves</a></li>
    </ul>
  </nav>

  <div id="pokemonInfo" class="info">

  </div>
  `;
}

function createMovesSectionHTML(pokemon) {
  const femaleRate = pokemon.genderRate / 8;
  return `
  <nav class="p1">
    <ul class="nav row space-around list-style-none font-16">
      <li><a href="/details/about?pokemon=${pokemon.name}" class="text-decoration-none cursor-pointer">About</a></li>
      <li><a href="/details/stats?pokemon=${pokemon.name}" class="text-decoration-none cursor-pointer">Base Stats</a></li>
      <li><a class="text-decoration-none cursor-default selected">Moves</a></li>
    </ul>
  </nav>

  <div id="pokemonInfo" class="info">
    
  </div>
  `;
}

function insertDetailsHTML(pokemon, section) {
  const container = document.getElementById(section);
  const newHTML = createDetailsHTML(pokemon, section);
  container.innerHTML += newHTML;
}