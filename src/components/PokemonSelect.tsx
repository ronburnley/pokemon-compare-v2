import { useState, useEffect } from 'react';
import Select from 'react-select';
import { Box, IconButton, HStack, keyframes } from '@chakra-ui/react';
import axios from 'axios';

interface PokemonOption {
  value: string;
  label: string;
}

interface PokemonSelectProps {
  onSelect: (name: string) => void;
}

const rollAnimation = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(90deg); }
  50% { transform: rotate(180deg); }
  75% { transform: rotate(270deg); }
  100% { transform: rotate(360deg); }
`;

const DiceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
    <circle cx="8" cy="8" r="1.5"/>
    <circle cx="12" cy="12" r="1.5"/>
    <circle cx="16" cy="16" r="1.5"/>
  </svg>
);

const PokemonSelect = ({ onSelect }: PokemonSelectProps) => {
  const [options, setOptions] = useState<PokemonOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000');
        const pokemonList = response.data.results.map((pokemon: { name: string }) => ({
          value: pokemon.name,
          label: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
        }));
        setOptions(pokemonList);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching pokemon list:', error);
        setIsLoading(false);
      }
    };

    fetchPokemonList();
  }, []);

  const handleRandomPick = () => {
    if (options.length > 0 && !isRolling) {
      setIsRolling(true);
      const randomIndex = Math.floor(Math.random() * options.length);
      
      // Animate for 1 second before selecting
      setTimeout(() => {
        onSelect(options[randomIndex].value);
        setIsRolling(false);
      }, 1000);
    }
  };

  return (
    <HStack mb={4} width="100%" spacing={2}>
      <Box flex={1}>
        <Select
          options={options}
          isLoading={isLoading}
          onChange={(option) => option && onSelect(option.value)}
          placeholder="Select a Pokémon..."
          styles={{
            control: (base) => ({
              ...base,
              borderRadius: '0.375rem',
              borderColor: '#E2E8F0',
              '&:hover': {
                borderColor: '#CBD5E0',
              },
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected
                ? '#4299E1'
                : state.isFocused
                ? '#EBF8FF'
                : 'white',
              color: state.isSelected ? 'white' : 'black',
            }),
          }}
        />
      </Box>
      <IconButton
        aria-label="Random Pokémon"
        icon={<DiceIcon />}
        onClick={handleRandomPick}
        isDisabled={isLoading}
        animation={isRolling ? `${rollAnimation} 0.5s linear infinite` : undefined}
        _hover={{ 
          transform: 'scale(1.1)',
          bg: 'blue.100'
        }}
        transition="all 0.2s"
        bg="white"
        border="1px solid"
        borderColor="gray.200"
      />
    </HStack>
  );
};

export default PokemonSelect; 