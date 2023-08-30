class Pokemon {
  constructor({
    number,
    name,
    type,
    types,
    photo,
    moves,
    abilities,
    baseExp,
    stats,
    weight,
    height,
  }) {
    this.number = number;
    this.name = name;
    this.type = type;
    this.photo = photo;
    this.baseExp = baseExp;
    this.weight = weight;
    this.height = height;
    this.stats = stats || [];
    this.types = types || [];
    this.moves = moves || [];
    this.abilities = abilities || [];
  }
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
