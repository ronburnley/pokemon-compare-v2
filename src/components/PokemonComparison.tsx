import { useState } from 'react';
import {
  Grid,
  Box,
  Text,
  Image,
  VStack,
  HStack,
  Badge,
  Center,
  Tooltip,
  Flex,
} from '@chakra-ui/react';
import axios from 'axios';
import PokemonSelect from './PokemonSelect';

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  types: Array<{
    type: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
}

const PokemonComparison = () => {
  const [pokemon1, setPokemon1] = useState<Pokemon | null>(null);
  const [pokemon2, setPokemon2] = useState<Pokemon | null>(null);

  const fetchPokemonData = async (name: string, setPokemon: (data: Pokemon) => void) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      setPokemon(response.data);
    } catch (error) {
      console.error('Error fetching pokemon:', error);
    }
  };

  const StatComparison = ({ stat1, stat2, statName }: { stat1: number; stat2: number; statName: string }) => {
    const maxStat = 255; // Maximum possible base stat value
    const stat1Percentage = (stat1 / maxStat) * 100;
    const stat2Percentage = (stat2 / maxStat) * 100;

    return (
      <Box w="100%" mb={4}>
        <Text fontSize="md" fontWeight="bold" mb={2}>
          {statName.toUpperCase().replace('-', ' ')}
        </Text>
        <Grid templateColumns="100px 1fr 100px" gap={2} alignItems="center">
          <Text fontSize="sm" fontWeight="bold" textAlign="right" color={stat1 > stat2 ? "green.500" : "gray.600"}>
            {stat1}
          </Text>
          <Box position="relative" h="24px" bg="gray.100" borderRadius="full" overflow="hidden">
            <Tooltip label={`${pokemon1?.name}: ${stat1}`} placement="top">
              <Box
                position="absolute"
                left="0"
                top="0"
                bottom="0"
                width={`${stat1Percentage}%`}
                bg="blue.400"
                transition="width 0.3s ease-in-out"
              />
            </Tooltip>
            <Tooltip label={`${pokemon2?.name}: ${stat2}`} placement="top">
              <Box
                position="absolute"
                right="0"
                top="0"
                bottom="0"
                width={`${stat2Percentage}%`}
                bg="purple.400"
                transition="width 0.3s ease-in-out"
                opacity="0.8"
              />
            </Tooltip>
          </Box>
          <Text fontSize="sm" fontWeight="bold" color={stat2 > stat1 ? "green.500" : "gray.600"}>
            {stat2}
          </Text>
        </Grid>
      </Box>
    );
  };

  const PokemonCard = ({ pokemon }: { pokemon: Pokemon | null }) => {
    if (!pokemon) {
      return (
        <Box
          w="100%"
          h="400px"
          borderWidth={2}
          borderRadius="lg"
          p={4}
          bg="white"
          position="relative"
          overflow="hidden"
        >
          <Center h="100%" flexDirection="column" gap={4}>
            <Box
              w="150px"
              h="150px"
              position="relative"
              animation="bounce 2s infinite"
              sx={{
                "@keyframes bounce": {
                  "0%, 100%": {
                    transform: "translateY(0)",
                  },
                  "50%": {
                    transform: "translateY(-10px)",
                  },
                },
              }}
            >
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="50%"
                bg="red.500"
                borderTopRadius="full"
                borderBottom="4px solid #1a1a1a"
              />
              <Box
                position="absolute"
                top="50%"
                left="0"
                right="0"
                bottom="0"
                bg="white"
                borderBottomRadius="full"
                borderTop="4px solid #1a1a1a"
              />
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                w="40px"
                h="40px"
                borderRadius="full"
                bg="white"
                border="8px solid #1a1a1a"
                zIndex={1}
              />
            </Box>
            <Text fontSize="xl" fontWeight="bold" color="gray.600" textAlign="center">
              Select a Pokémon to Compare
            </Text>
          </Center>
        </Box>
      );
    }

    return (
      <Box
        w="100%"
        borderWidth={2}
        borderRadius="lg"
        p={4}
        boxShadow="lg"
        bg="white"
      >
        <VStack gap={4}>
          <Image
            src={pokemon.sprites.other['official-artwork'].front_default}
            alt={pokemon.name}
            w="200px"
            h="200px"
          />
          <Text fontSize="xl" fontWeight="bold" textTransform="capitalize">
            {pokemon.name}
          </Text>
          <HStack>
            {pokemon.types.map((type) => (
              <Badge
                key={type.type.name}
                colorScheme={getTypeColor(type.type.name)}
                fontSize="0.8em"
                textTransform="uppercase"
              >
                {type.type.name}
              </Badge>
            ))}
          </HStack>
          <Text fontSize="sm">
            Height: {pokemon.height / 10}m | Weight: {pokemon.weight / 10}kg
          </Text>
          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={1}>
              Abilities:
            </Text>
            <HStack wrap="wrap" justify="center">
              {pokemon.abilities.map((ability) => (
                <Badge key={ability.ability.name} colorScheme="purple">
                  {ability.ability.name.replace('-', ' ')}
                </Badge>
              ))}
            </HStack>
          </Box>
        </VStack>
      </Box>
    );
  };

  const getTypeColor = (type: string): string => {
    const typeColors: { [key: string]: string } = {
      normal: 'gray',
      fire: 'red',
      water: 'blue',
      electric: 'yellow',
      grass: 'green',
      ice: 'cyan',
      fighting: 'orange',
      poison: 'purple',
      ground: 'orange',
      flying: 'blue',
      psychic: 'pink',
      bug: 'green',
      rock: 'orange',
      ghost: 'purple',
      dragon: 'purple',
      dark: 'gray',
      steel: 'gray',
      fairy: 'pink',
    };
    return typeColors[type] || 'gray';
  };

  return (
    <VStack gap={8} w="100%">
      <Grid templateColumns={['1fr', '1fr', '1fr 1fr']} gap={8} w="100%">
        <Box>
          <PokemonSelect
            onSelect={(name: string) => fetchPokemonData(name, setPokemon1)}
          />
          <PokemonCard pokemon={pokemon1} />
        </Box>
        <Box>
          <PokemonSelect
            onSelect={(name: string) => fetchPokemonData(name, setPokemon2)}
          />
          <PokemonCard pokemon={pokemon2} />
        </Box>
      </Grid>

      {pokemon1 && pokemon2 && (
        <Box w="100%" p={6} borderWidth={2} borderRadius="lg" bg="white">
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between" mb={2}>
              <Text fontSize="md" fontWeight="bold" color="blue.500">
                {pokemon1.name.toUpperCase()}
              </Text>
              <Text fontSize="lg" fontWeight="bold">
                Base Stats Comparison
              </Text>
              <Text fontSize="md" fontWeight="bold" color="purple.500">
                {pokemon2.name.toUpperCase()}
              </Text>
            </HStack>
            {pokemon1.stats.map((stat, index) => (
              <StatComparison
                key={stat.stat.name}
                stat1={pokemon1.stats[index].base_stat}
                stat2={pokemon2.stats[index].base_stat}
                statName={stat.stat.name}
              />
            ))}
            <Box mt={2} p={2} bg="gray.50" borderRadius="md">
              <Flex justify="space-between">
                <HStack>
                  <Box w="3" h="3" bg="blue.400" borderRadius="full" />
                  <Text fontSize="sm">{pokemon1.name}</Text>
                </HStack>
                <HStack>
                  <Text fontSize="sm">{pokemon2.name}</Text>
                  <Box w="3" h="3" bg="purple.400" borderRadius="full" />
                </HStack>
              </Flex>
            </Box>
          </VStack>
        </Box>
      )}
    </VStack>
  );
};

export default PokemonComparison; 
