const queryString = window.location.search;
const section = window.location.pathname.split("/")[2] || "about";
const urlParams = new URLSearchParams(queryString);

const pokemonName = urlParams.get("pokemon") || "bulbasaur";

var cache = getPokemonsCache();

if (!cache || !cache[pokemonName]) {
  pokeApi
    .getPokemonDetail(pokemonName)
    .then(() => {
      cache = getPokemonsCache();
      insertDetailsHTML(cache[pokemonName], section);
    })
    .catch((error) =>
      console.log(
        `[GET] Error getting Pokemon (${pokemonName}) Details:`,
        error
      )
    );
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
            ${pokemon.types
              .map((type) => `<li class="type ${type.name}">${type.name}</li>`)
              .join("")}
          </ol>
        </div>
        <div>
          <h3 id="pokemonNumber" class="font-18"># ${String(
            pokemon.number
          ).padStart(4, "0")}</h3>
        </div>
      </div>

      <div class="column">
        <img src="${pokemon.sprites.svg}" alt="${pokemon.name}" class="sprite">
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
    case "sprites":
      return createSpritesSectionHTML(pokemon);
    default:
      return "";
  }
}

function createAboutSectionHTML(pokemon) {
  const femaleRate = pokemon.genderRate == -1 ? 0 : pokemon.genderRate / 8;

  function addTags() {
    const isBaby = pokemon.isBaby
      ? `<span class="font-12 pokeTag tagBaby">Baby</span>`
      : "";
    const isLegendary = pokemon.isLegendary
      ? `<span class="font-12 pokeTag tagLegendary">Legendary</span>`
      : "";
    const isMythical = pokemon.isMythical
      ? `<span class="font-12 pokeTag tagMythical">Mythical</span>`
      : "";
    return isBaby + isLegendary + isMythical;
  }

  const isEvolution = pokemon.evolvesFromSpecies !== null;

  return `
  <nav class="p1">
    <ul class="nav row space-around list-style-none font-16">
      <li><a class="text-decoration-none cursor-default selected">About</a></li>
      <li><a href="/details/stats?pokemon=${
        pokemon.name
      }" class="text-decoration-none cursor-pointer">Base Stats</a></li>
      <li><a href="/details/sprites?pokemon=${
        pokemon.name
      }" class="text-decoration-none cursor-pointer">Sprites</a></li>
    </ul>
  </nav>

  <div id="pokemonInfo" class="info column">
    <div class="row justify-end items-gap">
      ${addTags()}
    </div>
  
    <div>
      <div class="row">
        <ul class="list-style-none labels font-14">
          <li>Height</li>
          <li>Weight</li>
          <li>Abilities</li>
          <li>Shape</li>
          ${isEvolution ? `<li>Evolves From</li>` : ""}
        </ul>
        <ul class="list-style-none values font-14">
          <li>${(pokemon.height * 10).toFixed(1)} cm</li>
          <li>${(pokemon.weight / 10).toFixed(1)} kg</li>
          <li>${pokemon.abilities
            .map((ability, index) => {
              if (index >= pokemon.abilities.length - 1)
                return `${ability.name}`;
              else return `${ability.name}, `;
            })
            .join("")}</li>
          <li>${pokemon.shape.name}</li>
          ${
            isEvolution
              ? `
              <li>
                <a class="text-decoration-none" href="/details/about?pokemon=${pokemon.evolvesFromSpecies.name}">
                  ${pokemon.evolvesFromSpecies.name}
                </a>
              </li>
            `
              : ""
          }
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
          <li>
            <span class="gender-m">&#9794;</span> ${(
              (1 - femaleRate) *
              100
            ).toFixed(1)}%&nbsp;
            <span class="gender-f">&#9792;</span> ${(femaleRate * 100).toFixed(
              1
            )}%
          </li>
          <li>${pokemon.eggGroups
            .map((group, index) => {
              if (index >= pokemon.eggGroups.length - 1) return `${group.name}`;
              else return `${group.name}, `;
            })
            .join("")}</li>
        </ul>
      </div>
    </div>
  </div>
  `;
}

function createStatsSectionHTML(pokemon) {
  function statBar(value) {
    const MAX = 200;
    const percentage =
      value && value > 0 ? (value > MAX ? 100 : (value / MAX) * 100) : 0;
    return `
      <div class="row items-center" style="">
        <span style="width:36px">${value}</span>
        <div class="full-w statsBar ml-2">
          <div class="statsBarProgress ${pokemon.type.name}" style="width:${percentage}%"></div>
        </div>
      </div>
    `;
  }
  return `
  <nav class="p1">
    <ul class="nav row space-around list-style-none font-16">
      <li><a href="/details/about?pokemon=${
        pokemon.name
      }" class="text-decoration-none cursor-pointer">About</a></li>
      <li><a class="text-decoration-none cursor-default selected">Base Stats</a></li>
      <li><a href="/details/sprites?pokemon=${
        pokemon.name
      }" class="text-decoration-none cursor-pointer">Sprites</a></li>
    </ul>
  </nav>

  <div id="pokemonInfo" class="info">
    <div class="row">
      <ul class="list-style-none labels font-14">
        <li>Base Experience</li>
        <li>Base Happiness</li>
        <li>Capture Rate</li>
      </ul>
      <ul class="list-style-none values font-14">
        <li>${pokemon.baseExp}</li>
        <li>${pokemon.baseHappiness}</li>
        <li>${pokemon.captureRate}</li>
      </ul>
    </div>
    
    <div>
      <h3 class="font-18">Stats</h3>
      <div class="row">
        <ul class="list-style-none labels font-14">
          ${pokemon.stats.map((stat) => `<li>${stat.name}</li>`).join("")}
        </ul>
        <ul class="list-style-none values font-14">
          ${pokemon.stats
            .map((stat) => `<li>${statBar(stat.baseStat)}</li>`)
            .join("")}
        </ul>
      </div>
    </div>
  </div>
  `;
}

function createSpritesSectionHTML(pokemon) {
  function addDefaultSprites() {
    const maleSprites = Object.values(pokemon.sprites.default.male).filter(_ => _ !== null);
    const femaleSprites = Object.values(pokemon.sprites.default.female).filter(_ => _ !== null);
    const sprites = [...maleSprites, ...femaleSprites];
    if (sprites.length == 0) return `
      <div>
        <p>Sorry, default sprites not found!</p>
      </div>
    `;

    return `
      <h3 class="font-18">Default Sprites</h3>
      ${addSprites(maleSprites, "male")}
      ${addSprites(femaleSprites, "female")}
    `
  }
  
  function addShinySprites() {
    const maleSprites = Object.values(pokemon.sprites.shiny.male).filter(_ => _ !== null);
    const femaleSprites = Object.values(pokemon.sprites.shiny.female).filter(_ => _ !== null);
    const sprites = [...maleSprites, ...femaleSprites];
    if (sprites.length == 0) return `
      <div>
        <p>Sorry, shiny sprites not found!</p>
      </div>
    `;

    return `
      <h3 class="font-18">Shiny Sprites</h3>
      ${addSprites(maleSprites, "male")}
      ${addSprites(femaleSprites, "female")}
    `
  }

  function addSprites(sprites, gender) {
    if (sprites.length == 0) return "";

    return `
    <div class="row items-center space-between">
      <h3>${gender}</h3>
      <div class="row items-center space-around full-w">
        ${sprites.map((sprite) => {
          let alt = `${pokemon.name}-`;
          alt += alt.includes('/shiny/') ? "shiny-" : "default-";
          alt += alt.includes('/back/') ? "back-" : "";
          alt += gender;
          return `<img class="" src="${sprite}" alt="${alt}">`;
        }).join("")}
      </div>
    </div>
    `;
  }

  return `
  <nav class="p1">
    <ul class="nav row space-around list-style-none font-16">
      <li><a href="/details/about?pokemon=${pokemon.name}" class="text-decoration-none cursor-pointer">About</a></li>
      <li><a href="/details/stats?pokemon=${pokemon.name}" class="text-decoration-none cursor-pointer">Base Stats</a></li>
      <li><a class="text-decoration-none cursor-default selected">Sprites</a></li>
    </ul>
  </nav>

  <div id="pokemonInfo" class="info">
    ${addDefaultSprites()}
    ${addShinySprites()}
  </div>
  `;
}

function insertDetailsHTML(pokemon, section) {
  const container = document.getElementById(section);
  const newHTML = createDetailsHTML(pokemon, section);
  container.innerHTML += newHTML;
}
