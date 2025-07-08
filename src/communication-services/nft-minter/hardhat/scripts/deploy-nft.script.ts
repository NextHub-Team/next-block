import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';

export async function deployNFTContract(
  providerUrl: string,
  privateKey: string,
  name: string,
  symbol: string,
): Promise<string> {
  const provider = new ethers.JsonRpcProvider(providerUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  const artifactPath = path.join(
    process.cwd(),
    'src/communication-services/nft-minter/hardhat/artifacts/contracts/MyNFT.sol/MyNFT.json',
  );

  console.log(`Reading artifact from: ${artifactPath}`);
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet,
  );

  console.log(`Deploying contract with name=${name}, symbol=${symbol}`);
  const contract = await factory.deploy(name, symbol);
  await contract.waitForDeployment();

  console.log(`Contract deployed at address: ${contract.target}`);
  return contract.target.toString();
}
