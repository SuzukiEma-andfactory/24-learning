import { PokemonProvider } from "@/context/PokemonContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PokemonProvider>
      <Component {...pageProps} />
    </PokemonProvider>
  );
}
