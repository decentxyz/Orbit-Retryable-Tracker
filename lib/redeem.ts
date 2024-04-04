import { setupArbitrumSdk } from './setupArbitrumSdk';
import { L1TransactionReceipt } from '@arbitrum/sdk';
import yargs from 'yargs'
import { ethers } from 'ethers';
require('dotenv').config();

async function main() {
  // Hardcoded array of hashes
  const hashes = [
    '0xe0f23e97c44a76a690d285ccf3da34d8626566dd584e3ef93b1140fe43e1af52',
  ];

  const {
    l1RpcProvider,
    l2RpcProvider,
    l2Network
  } = await setupArbitrumSdk();

  const privateKey = process.env.PRIVATE_KEY as string;
  const l1Signer = new ethers.Wallet(privateKey, l1RpcProvider);
  const l2Signer = new ethers.Wallet(privateKey, l2RpcProvider);

  for (const hash of hashes) {
    const l1Receipt = await l1RpcProvider.getTransactionReceipt(hash);
    const l1TransactionReceipt = new L1TransactionReceipt(l1Receipt);
    const messages = await l1TransactionReceipt.getL1ToL2Messages(l2Signer);
    const l1ToL2Msg = messages[0];

    const tx = await l1ToL2Msg.redeem();
    const { transactionHash: redeemHash } = await tx.wait();
    console.log(`${hash},${redeemHash}`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
