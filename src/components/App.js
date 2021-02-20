import React from 'react'
import './App.css'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import uniswapLogo from '../uniswap-logo.png'
import uniLogo from '../uni-logo.jpeg'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
  }),
  fetchOptions: {
    mode: 'no-cors'
  },
  cache: new InMemoryCache()
})

const UNI_QUERY = gql`
  query tokens($tokenAddress: Bytes!) {
    tokens(where: { id: $tokenAddress }) {
      name
      derivedETH
      totalLiquidity
      tradeVolumeUSD
    }
  }
`

const ETH_PRICE_QUERY = gql`
  query bundles {
    bundles(where: { id: "1" }) {
      ethPrice
    }
  }
`

function App() {
  const { loading: ethLoading, data: ethPriceData } = useQuery(ETH_PRICE_QUERY)
  const { loading: uniLoading, data: uniData } = useQuery(UNI_QUERY, {
    variables: {
      tokenAddress: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'
    }
  })

  const tokenName = uniData && uniData.tokens[0].name
  const uniPriceInEth = uniData && uniData.tokens[0].derivedETH
  const uniTradeVolumeUSD = uniData && uniData.tokens[0].tradeVolumeUSD
  const uniTotalLiquidity = uniData && uniData.tokens[0].totalLiquidity
  const ethPriceInUSD = ethPriceData && ethPriceData.bundles[0].ethPrice

  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={uniswapLogo} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp; Uniswap Explorer
        </a>
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 text-center" style={{paddingTop: 25 +'px'}}>
            <div className="content col-lg-6 d-flex text-center mr-auto ml-auto">
              <div>
                <img src={uniLogo} width="150" height="150" className="mb-4" alt="" />
                <h2>
                  Token Name:{' '}
                  {ethLoading || uniLoading
                    ? 'Loading token data...'
                    : tokenName}
                </h2>
                <h2>
                  UNI price:{' '}
                  {ethLoading || uniLoading
                    ? 'Loading token data...'
                    : '$' +
                      // parse responses as floats and fix to 2 decimals
                      (parseFloat(uniPriceInEth) * parseFloat(ethPriceInUSD)).toFixed(2)}
                </h2>
                <h2>
                  UNI total liquidity:{' '}
                  {uniLoading
                    ? 'Loading token data...'
                    : // display the total amount of UNI spread across all pools
                      parseFloat(uniTotalLiquidity).toFixed(0)}
                </h2>
                <h2>
                  UNI Trade Volume in USD:{' '}
                  {ethLoading || uniLoading
                    ? 'Loading token data...'
                    : '$' +
                      // parse responses as floats and fix to 2 decimals
                      parseFloat(uniTradeVolumeUSD).toFixed(2)}
                </h2>
              </div>
              <div className="col-lg-6 d-flex text-center">
              <iframe
                src="https://app.uniswap.org/#/swap?outputCurrency=0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
                height="660px"
                width="100%"
                id="myId"
              />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App
