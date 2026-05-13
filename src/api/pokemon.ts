import {
  PokemonListResponse,
  PokemonDetail,
  TypeListResponse,
  TypeDetailResponse,
  PokemonCardData,
  NamedAPIResource,
  Location,
  LocationArea,
} from "@/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

export async function fetchPokemonList(
  limit: number,
  offset: number
): Promise<PokemonListResponse> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch Pokemon list");
  return res.json();
}

export async function fetchPokemonDetail(nameOrId: string | number): Promise<PokemonDetail> {
  const res = await fetch(`${BASE_URL}/pokemon/${nameOrId}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Failed to fetch Pokemon: ${nameOrId}`);
  return res.json();
}

export async function fetchTypes(): Promise<TypeListResponse> {
  const res = await fetch(`${BASE_URL}/type`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error("Failed to fetch types");
  return res.json();
}

export async function fetchTypeDetail(typeName: string): Promise<TypeDetailResponse> {
  const res = await fetch(`${BASE_URL}/type/${typeName}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Failed to fetch type: ${typeName}`);
  return res.json();
}

export async function fetchPokemonSpecies(id: string | number) {
  const res = await fetch(`${BASE_URL}/pokemon-species/${id}`, {
    next: { revalidate: 86400 }, // Species data rarely changes
  });
  if (!res.ok) throw new Error(`Failed to fetch species: ${id}`);
  return res.json();
}

export async function fetchEvolutionChain(url: string) {
  const res = await fetch(url, {
    next: { revalidate: 86400 }, // Evolution chain data rarely changes
  });
  if (!res.ok) throw new Error(`Failed to fetch evolution chain`);
  return res.json();
}

// Location/Map API functions
export async function fetchLocation(idOrName: string | number): Promise<Location> {
  const res = await fetch(`${BASE_URL}/location/${idOrName}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`Failed to fetch location: ${idOrName}`);
  return res.json();
}

export async function fetchLocationArea(idOrName: string | number): Promise<LocationArea> {
  const res = await fetch(`${BASE_URL}/location-area/${idOrName}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`Failed to fetch location area: ${idOrName}`);
  return res.json();
}

export async function fetchLocationEncounters(locationName: string) {
  const res = await fetch(`${BASE_URL}/location/${locationName}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`Failed to fetch location: ${locationName}`);
  const location = await res.json();

  // Fetch all location areas to get encounters
  const areaPromises = location.areas.map((area: NamedAPIResource) =>
    fetch(area.url, { next: { revalidate: 86400 } }).then(r => r.json())
  );

  const areas = await Promise.all(areaPromises);
  return areas.flatMap((area: LocationArea) => area.pokemon_encounters || []);
}

export async function fetchRegion(regionName: string) {
  const res = await fetch(`${BASE_URL}/region/${regionName}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`Failed to fetch region: ${regionName}`);
  return res.json();
}

export async function fetchRegions() {
  const res = await fetch(`${BASE_URL}/region`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error("Failed to fetch regions");
  return res.json();
}

export function extractIdFromUrl(url: string): number {
  const parts = url.replace(/\/$/, "").split("/");
  return parseInt(parts[parts.length - 1], 10);
}

function getSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function transformToCardData(detail: PokemonDetail): PokemonCardData {
  return {
    id: detail.id,
    name: detail.name,
    image:
      detail.sprites.other?.["official-artwork"]?.front_default ??
      detail.sprites.front_default ??
      getSpriteUrl(detail.id),
    types: detail.types.map((t) => t.type.name),
    stats: detail.stats.map((s) => ({
      name: s.stat.name,
      value: s.base_stat,
    })),
  };
}

async function getValidPokemonNamesForType(typeName: string): Promise<Set<string>> {
  const typeData = await fetchTypeDetail(typeName);
  const names = new Set<string>();

  for (const entry of typeData.pokemon) {
    const id = extractIdFromUrl(entry.pokemon.url);
    if (id < 10000) {
      names.add(entry.pokemon.name);
    }
  }

  return names;
}

export async function getPokemonPage(
  page: number,
  limit: number,
  types?: string[]
): Promise<{ pokemon: PokemonCardData[]; totalItems: number }> {
  if (types && types.length > 0) {
    const typeSets = await Promise.all(types.map((type) => getValidPokemonNamesForType(type)));

    const intersectedNames = [...typeSets[0]].filter((name) =>
      typeSets.every((set) => set.has(name))
    );

    const totalItems = intersectedNames.length;
    const offset = (page - 1) * limit;
    const pageSlice = intersectedNames.slice(offset, offset + limit);

    const resources: NamedAPIResource[] = pageSlice.map((name) => ({
      name,
      url: `${BASE_URL}/pokemon/${name}`,
    }));

    const details = await fetchPokemonDetails(resources);
    return { pokemon: details, totalItems };
  }

  const offset = (page - 1) * limit;
  const listData = await fetchPokemonList(limit, offset);

  const details = await fetchPokemonDetails(listData.results);
  return { pokemon: details, totalItems: listData.count };
}

async function fetchPokemonDetails(resources: NamedAPIResource[]): Promise<PokemonCardData[]> {
  const detailPromises = resources.map((r) => fetchPokemonDetail(r.name));
  const details = await Promise.all(detailPromises);
  return details.map(transformToCardData);
}
