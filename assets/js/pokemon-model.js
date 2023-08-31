class Pokemon {
  // from details
  number;
  name;
  type;
  types;
  photo;
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