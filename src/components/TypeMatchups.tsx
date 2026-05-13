"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TYPE_COLORS } from "@/utils/constants";

interface TypeRelation {
  name: string;
  damage_multiplier: number;
}

interface TypeData {
  name: string;
  damage_relations: {
    double_damage_from: { name: string }[];
    double_damage_to: { name: string }[];
    half_damage_from: { name: string }[];
    half_damage_to: { name: string }[];
    no_damage_from: { name: string }[];
    no_damage_to: { name: string }[];
  };
}

interface TypePokemon {
  id: number;
  name: string;
  image: string;
}

interface TypeMatchupsProps {
  types: { type: { name: string } }[];
}

export default function TypeMatchups({ types }: TypeMatchupsProps) {
  const [typeDataMap, setTypeDataMap] = useState<Record<string, TypeData>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTypeData() {
      try {
        const promises = types.map((t) =>
          fetch(`https://pokeapi.co/api/v2/type/${t.type.name}`).then((res) => res.json())
        );
        const results = await Promise.all(promises);
        
        const dataMap: Record<string, TypeData> = {};
        results.forEach((data) => {
          dataMap[data.name] = data;
        });
        
        setTypeDataMap(dataMap);
      } catch (error) {
        console.error("Failed to fetch type data", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchTypeData();
  }, [types]);

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Type Matchups</h3>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Calculate all matchups from all types
  const strongAgainst = new Set<string>();
  const weakAgainst = new Set<string>();
  const immuneTo = new Set<string>();
  const immuneFrom = new Set<string>();

  Object.values(typeDataMap).forEach((typeData) => {
    // Types this Pokemon deals 2x damage to
    typeData.damage_relations.double_damage_to.forEach((t) => strongAgainst.add(t.name));
    // Types this Pokemon deals 0.5x damage to
    typeData.damage_relations.half_damage_to.forEach((t) => weakAgainst.add(t.name));
    // Types this Pokemon deals 0x damage to
    typeData.damage_relations.no_damage_to.forEach((t) => immuneTo.add(t.name));
    // Types this Pokemon takes 2x damage from
    typeData.damage_relations.double_damage_from.forEach((t) => weakAgainst.add(t.name));
    // Types this Pokemon takes 0.5x damage from
    typeData.damage_relations.half_damage_from.forEach((t) => strongAgainst.add(t.name));
    // Types this Pokemon is immune to
    typeData.damage_relations.no_damage_from.forEach((t) => immuneTo.add(t.name));
  });

  // Remove immune types from strong/weak sets
  strongAgainst.delete('???') && '';
  weakAgainst.delete('???') && '';

  const typeOrder = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];

  const renderTypeList = (typesSet: Set<string>, title: string, color: string, icon: string) => {
    if (typesSet.size === 0) return null;
    
    const sortedTypes = Array.from(typesSet).sort((a, b) => 
      typeOrder.indexOf(a) - typeOrder.indexOf(b)
    );

    return (
      <div className="mb-6 last:mb-0">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{icon}</span>
          <h4 className={`text-sm font-semibold ${color}`}>{title}</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {sortedTypes.map((type) => (
            <TypeCard key={type} typeName={type} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-6">Type Matchups</h3>
      
      {renderTypeList(strongAgainst, 'Super Effective Against', 'text-green-400', '⚔️')}
      {renderTypeList(weakAgainst, 'Weak Against', 'text-red-400', '🛡️')}
      {immuneTo.size > 0 && renderTypeList(immuneTo, 'Immune To', 'text-gray-400', '🛡️')}
    </div>
  );
}

function TypeCard({ typeName }: { typeName: string }) {
  const [pokemon, setPokemon] = useState<TypePokemon | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFirstPokemonOfType() {
      try {
        // Get a sample Pokemon of this type
        const typeRes = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
        const typeData = await typeRes.json();
        
        // Get first 20 Pokemon of this type
        const pokemonList = typeData.pokemon.slice(0, 20);
        // Pick a random one for variety
        const randomIndex = Math.floor(Math.random() * Math.min(pokemonList.length, 10));
        const pokemonData = pokemonList[randomIndex].pokemon;
        
        const detailRes = await fetch(pokemonData.url);
        const detailData = await detailRes.json();
        
        const image = detailData.sprites.other['official-artwork'].front_default || 
                      detailData.sprites.front_default;
        
        setPokemon({
          id: detailData.id,
          name: detailData.name,
          image,
        });
      } catch (error) {
        console.error(`Failed to fetch Pokemon for type ${typeName}`, error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchFirstPokemonOfType();
  }, [typeName]);

  const bgColor = TYPE_COLORS[typeName] || "#A8A77A";

  return (
    <Link 
      href={`/pokemon/${pokemon?.id || typeName}`}
      className="group relative flex flex-col items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 min-w-[100px]"
    >
      <div className="relative w-12 h-12 mb-2">
        {isLoading ? (
          <div className="w-full h-full bg-white/10 rounded-full animate-pulse" />
        ) : pokemon?.image ? (
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            fill
            className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-200"
            sizes="48px"
          />
        ) : (
          <div className="w-full h-full rounded-full" style={{ backgroundColor: bgColor }} />
        )}
      </div>
      <span 
        className="text-xs font-semibold text-white capitalize px-2 py-1 rounded-full"
        style={{ backgroundColor: `${bgColor}66` }}
      >
        {typeName}
      </span>
      {pokemon && !isLoading && (
        <span className="text-[10px] text-white/40 mt-1">#{String(pokemon.id).padStart(3, '0')}</span>
      )}
    </Link>
  );
}
