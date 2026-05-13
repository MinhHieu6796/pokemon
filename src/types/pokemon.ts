export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
}

export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: PokemonSprites;
  types: PokemonTypeSlot[];
  stats: PokemonStat[];
}

export interface PokemonSprites {
  front_default: string | null;
  other?: {
    "official-artwork"?: {
      front_default: string | null;
    };
    dream_world?: {
      front_default: string | null;
    };
  };
}

export interface PokemonTypeSlot {
  slot: number;
  type: NamedAPIResource;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

export interface TypeListResponse {
  count: number;
  results: NamedAPIResource[];
}

export interface TypeDetailResponse {
  id: number;
  name: string;
  pokemon: TypePokemonEntry[];
}

export interface TypePokemonEntry {
  pokemon: NamedAPIResource;
  slot: number;
}

export interface PokemonCardData {
  id: number;
  name: string;
  image: string;
  types: string[];
  stats: { name: string; value: number }[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PokemonSpecies {
  evolution_chain: {
    url: string;
  };
}

export interface EvolutionDetail {
  min_level: number | null;
  item: NamedAPIResource | null;
  trigger: NamedAPIResource;
  min_happiness: number | null;
  held_item: NamedAPIResource | null;
  known_move: NamedAPIResource | null;
  known_move_type: NamedAPIResource | null;
  location: NamedAPIResource | null;
  time_of_day: string;
}

export interface ChainLink {
  is_baby: boolean;
  species: NamedAPIResource;
  evolution_details: EvolutionDetail[];
  evolves_to: ChainLink[];
}

export interface EvolutionChainResponse {
  id: number;
  chain: ChainLink;
}
