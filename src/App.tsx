import { Container, Heading, VStack } from '@chakra-ui/react';
import PokemonComparison from './components/PokemonComparison';

function App() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack gap={8}>
        <Heading as="h1" size="2xl" textAlign="center" color="blue.600">
          Pokémon Comparison
        </Heading>
        <PokemonComparison />
      </VStack>
    </Container>
  );
}

export default App;
