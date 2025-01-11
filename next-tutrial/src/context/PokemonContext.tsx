import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type PokemonContextType = {
  selectedPokemonUrl: string | null;
  setSelectedPokemonUrl: (url: string | null) => void;
  selectedPokemonImage: string | null;
  setSelectedPokemonImage: (url: string | null) => void;
};

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export const PokemonProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPokemonUrl, setSelectedPokemonUrl] = useState<string | null>(
    null
  );
  const [selectedPokemonImage, setSelectedPokemonImage] = useState<string | null>(
    null
  );

  useEffect(() => {
    console.log('🩷', selectedPokemonUrl, selectedPokemonImage);
  }, [selectedPokemonUrl]);

  return (
    <PokemonContext.Provider
      value={{
        selectedPokemonUrl,
        setSelectedPokemonUrl,
        selectedPokemonImage,
        setSelectedPokemonImage,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemonContext = () => {
  const context = useContext(PokemonContext);
  if (!context) {
    throw new Error('usePokemonContext must be used within a PokemonProvider');
  }
  return context;
};
