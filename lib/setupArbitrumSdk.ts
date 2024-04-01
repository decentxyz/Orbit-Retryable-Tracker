import { addCustomNetwork, getL2Network, L1Network, L2Network } from "@arbitrum/sdk";
import { ethers } from 'ethers';

export enum ChainId {
  BASE = 8453,
  DEGEN = 666666666,
}

const rpcURLs: Record<ChainId, string | null> = {
  [ChainId.BASE]: 'https://mainnet.base.org/',
  [ChainId.DEGEN]: 'https://rpc.degen.tips/http',
};

const getRpcUrl = (chainId: ChainId) => rpcURLs[chainId];

const setupBaseDegen = () => {
  const customL1Network: L1Network = {
    blockTime: 10,
    chainID: ChainId.BASE,
    explorerUrl: '',
    isCustom: true,
    name: 'Base',
    partnerChainIDs: [ChainId.DEGEN],
    isArbitrum: false,
  }

  const customL2Network: L2Network = {
    chainID: ChainId.DEGEN,
    confirmPeriodBlocks: 20,
    ethBridge: {
      bridge: '0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C',
      inbox: '0x21A1e2BFC61F30F2E81E0b08cd37c1FC7ef776E7',
      outbox: '0xe63ddb12FBb6211a73F12a4367b10dA0834B82da',
      rollup: '0xD34F3a11F10DB069173b32d84F02eDA578709143',
      sequencerInbox: '0x6216dD1EE27C5aCEC7427052d3eCDc98E2bc2221',
    },
    explorerUrl: 'https://explorer.degen.tips',
    isArbitrum: true,
    isCustom: true,
    name: 'Degen',
    partnerChainID: ChainId.BASE,
    retryableLifetimeSeconds: 7 * 24 * 60 * 60,
    nitroGenesisBlock: 0,
    nitroGenesisL1Block: 0,
    depositTimeout: 900000,
    tokenBridge: {
      l1CustomGateway: '0x457fb5fC5dcE35cBf644e36eFD13566574CB5171',
      l1ERC20Gateway: '0xBeeC380b80c1679Cdc73805a1F809c8DcE31C680',
      l1GatewayRouter: '0x7cFA460bBA19C712Ce5e3a199B8dFCd5E730E6FB',
      l1MultiCall: '0x24107E688696CE56e94635AB8c008E187C3C0702',
      l1ProxyAdmin: '0xFB48D385Fa3da33762B350e1d705b9E46054E677',
      l1Weth: '0x0000000000000000000000000000000000000000',
      l1WethGateway: '0x0000000000000000000000000000000000000000',
      l2CustomGateway: '0x2964b500c584b363DA9F0d38eaAd76b4Ab319143',
      l2ERC20Gateway: '',
      l2GatewayRouter: '0xD971e60b7eE1BEddE5B48F644a342A78E1535452',
      l2Multicall: '0x5304b5DbBfCe2fb40AE11Ed51E70699FC1F25fC9',
      l2ProxyAdmin: '0x2Ef661C018E0B6eD1C7fd214097Fc04A30F19088',
      l2Weth: '0x0000000000000000000000000000000000000000',
      l2WethGateway: '0x0000000000000000000000000000000000000006',
    },
    blockTime: 0.25,
    partnerChainIDs: [],
  };

  try {
    addCustomNetwork({
      customL1Network,
      customL2Network,
    })
  } catch (e) {
    console.log("Failed to add custom network", e['message']);
  };
}

export const setupArbitrumSdk = async () => {
  setupBaseDegen();

  const l1Url = getRpcUrl(ChainId.BASE);
  const l2Url = getRpcUrl(ChainId.DEGEN);

  if (!l1Url) throw new Error('No rpc for L1');
  if (!l2Url) throw new Error('No rpc for the specified L2 chainId');

  const l1RpcProvider = new ethers.providers.JsonRpcProvider(l1Url);
  const l2RpcProvider = new ethers.providers.JsonRpcProvider(l2Url);

  const l2Network = await getL2Network(l2RpcProvider);

  return {
    l1RpcProvider,
    l2RpcProvider,
    l2Network,
  }
}
