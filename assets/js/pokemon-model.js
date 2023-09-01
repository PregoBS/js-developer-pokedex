class Pokemon {
  // from details
  number;
  name;
  type;
  types;
  sprites;
  moves;
  abilities;
  baseExp;
  stats;
  weight;
  height;
  // from species
  baseHappiness;
  captureRate;
  eggGroups;
  genderRate; // The chance of this Pokémon being female, in eighths; or -1 for genderless
  evolvesFromSpecies;
  growthRate;
  habitat;
  hasGenderDifferences;
  isBaby;
  isLegendary;
  isMythical;
  shape;
  varieties;
}

class PokemonStat {
  constructor({ baseStat, effort, name, url }) {
    this.baseStat = baseStat;
    this.effort = effort;
    this.name = name;
    this.url = url;
  }
}

class PokemonType {
  constructor({ slot, name, url }) {
    this.slot = slot;
    this.name = name;
    this.url = url;
  }
}

class PokemonSprites {
  constructor({ svg, male, female, shinyMale, shinyFemale, backMale, backFemale, backShinyMale, backShinyFemale }) {
    this.svg = svg;
    this.default = {};
    this.default.male = {};
    this.default.male.front = male;
    this.default.male.back = backMale;
    this.default.female = {};
    this.default.female.front = female;
    this.default.female.back = backFemale;
    this.shiny = {};
    this.shiny.male = {};
    this.shiny.male.front = shinyMale;
    this.shiny.male.back = backShinyMale;
    this.shiny.female = {};
    this.shiny.female.front = shinyFemale;
    this.shiny.female.back = backShinyFemale;
  }
}

class PokemonMove {
  constructor({ name, url }) {
    this.name = name;
    this.url = url;
  }
}

class PokemonAbility {
  constructor({ name, url, isHidden, slot }) {
    this.name = name;
    this.url = url;
    this.isHidden = isHidden;
    this.slot = slot
  }
}

class PokemonEggGroup {
  constructor({ name, url }) {
    this.name = name;
    this.url = url;
  }
}

class PokemonEvolvesFromSpecies {
  constructor({ name, url }) {
    this.name = name;
    this.url = url;
  }
}

class PokemonGrowthRate {
  constructor({ name, url }) {
    this.name = name;
    this.url = url;
  }
}

class PokemonHabitat {
  constructor({ name, url }) {
    this.name = name;
    this.url = url;
  }
}

class PokemonShape {
  constructor({ name, url }) {
    this.name = name;
    this.url = url;
  }
}

class PokemonVariety {
  constructor({ name, url, isDefault }) {
    this.isDefault = isDefault;
    this.name = name;
    this.url = url;
  }
}