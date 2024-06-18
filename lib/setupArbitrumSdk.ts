import {
  addCustomNetwork,
  getL2Network,
  L1Network,
  L2Network,
} from '@arbitrum/sdk'
import { ethers } from 'ethers'

export enum ChainId {
  BASE = 8453,
  DEGEN = 666666666,
  CHEESE = 383353,
  ARBITRUM = 42161,
}

const rpcURLs: Record<ChainId, string | null> = {
  [ChainId.BASE]: 'https://mainnet.base.org/',
  [ChainId.DEGEN]: 'https://rpc.degen.tips/http',
  [ChainId.CHEESE]: 'https://cheesechain.calderachain.xyz/http',
  [ChainId.ARBITRUM]: 'https://arb1.arbitrum.io/rpc',
}

const getRpcUrl = (chainId: ChainId) => rpcURLs[chainId]

const setupParentChild = (parent: ChainId, child: ChainId) => {
  const customL1Network: L1Network = {
    blockTime: 10,
    chainID: parent,
    explorerUrl: '',
    isCustom: true,
    name: 'Arbitrum',
    partnerChainIDs: [child],
    isArbitrum: false,
  }

  const customL2Network: L2Network = {
    chainID: ChainId.CHEESE,
    confirmPeriodBlocks: 25,
    ethBridge: {
      bridge: '0xA337997ab18164Dfe1e8A94E8D912e8d4e2ce173',
      inbox: '0x58e3F0ed71ac29501326aeE9564674E43812cc24',
      outbox: '0x9bAA9C2c313510D4f3CB2673b2f2603ED45d6eDd',
      rollup: '0xb9E6B5AcB523D431f6D136C56d371271456757E7',
      sequencerInbox: '0x714d792CB8BFB9F70Cde071904d8743280267ab2',
    },
    explorerUrl: 'https://cheesechain.calderaexplorer.xyz',
    isArbitrum: true,
    isCustom: true,
    name: 'Cheese',
    partnerChainID: ChainId.ARBITRUM,
    retryableLifetimeSeconds: 7 * 24 * 60 * 60,
    nitroGenesisBlock: 0,
    nitroGenesisL1Block: 0,
    depositTimeout: 900000,
    tokenBridge: {
      l1CustomGateway: '0x762AE18EDA279709C106eC76d4b3985366D87C3F',
      l1ERC20Gateway: '0x4D692d1B2E5Cef2A6092de572231D54D07691aA0',
      l1GatewayRouter: '0xA4BD9786c885EB99Cb6C6886d8f9CE8d96cE99F6',
      l1MultiCall: '0x909b042B88F587d745dBF52e2569545376f6eAA4',
      l1ProxyAdmin: '0xB9b62DF4C8F4605E0772d05506203D7bd4d2F968',
      l1Weth: '0x0000000000000000000000000000000000000000',
      l1WethGateway: '0x0000000000000000000000000000000000000000',
      l2CustomGateway: '0x1Dd3e9AbA3A50D071C250356551c774B5F28B567',
      l2ERC20Gateway: '0x8737E402817e5B82B0ED43dC791e4E260e00c9d5',
      l2GatewayRouter: '0x1E7090DCA131C7DE551becE4eCd2eBD5a37Aff0D',
      l2Multicall: '0x36528Af3c5Ef49fDbB87EcB87027c98DeeD57a00',
      l2ProxyAdmin: '0xe63cE9FeF9FC31FfcbD54D1aCfFEAcAf737e2626',
      l2Weth: '0x0000000000000000000000000000000000000000',
      l2WethGateway: '0x0000000000000000000000000000000000000000',
    },
    blockTime: 0.25,
    partnerChainIDs: [],
  }

  try {
    addCustomNetwork({
      customL2Network,
    })
  } catch (e) {
    console.log('Failed to add custom network', e['message'])
  }
}

export const setupArbitrumSdk = async () => {
  setupParentChild(ChainId.ARBITRUM, ChainId.CHEESE)

  const l1Url = getRpcUrl(ChainId.ARBITRUM)
  const l2Url = getRpcUrl(ChainId.CHEESE)

  if (!l1Url) throw new Error('No rpc for L1')
  if (!l2Url) throw new Error('No rpc for the specified L2 chainId')

  const l1RpcProvider = new ethers.providers.JsonRpcProvider(l1Url)
  const l2RpcProvider = new ethers.providers.JsonRpcProvider(l2Url)

  const l2Network = await getL2Network(l2RpcProvider)

  return {
    l1RpcProvider,
    l2RpcProvider,
    l2Network,
  }
}
