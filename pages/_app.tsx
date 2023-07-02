import type { AppProps } from "next/app";

import Layout from "../components/layout/Layout";
import { ChakraProvider } from '@chakra-ui/react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChainProvider, defaultTheme } from '@cosmos-kit/react';
import { chains, assets } from 'chain-registry';
import { silk, silkAssets } from '../config/silk'
import { wallets as keplrWallets } from '@cosmos-kit/keplr'
import "react-toastify/dist/ReactToastify.css";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={defaultTheme}>
      <ChainProvider
          chains={[...chains, silk]}
          assetLists={[...assets, silkAssets]}
          wallets={keplrWallets}
        >
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </ChainProvider>
    </ChakraProvider>
  );
}

export default MyApp;
