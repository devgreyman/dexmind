import { ethers } from "hardhat";

async function main() {
  console.log("Deploying DexMind RWA Vaults on X Layer...");

  const DexMindVault = await ethers.getContractFactory("DexMindVault");

  // Deploy US Treasuries Vault
  const ustVault = await DexMindVault.deploy("Short-Term US Treasuries Vault", "dmUST");
  await ustVault.waitForDeployment();
  console.log(`UST Vault deployed to: ${await ustVault.getAddress()}`);

  // Deploy Real Estate Vault
  const reitVault = await DexMindVault.deploy("Real Estate Rent Vault", "dmREIT");
  await reitVault.waitForDeployment();
  console.log(`REIT Vault deployed to: ${await reitVault.getAddress()}`);

  // Deploy Gold Vault
  const goldVault = await DexMindVault.deploy("Gold Bullion Yield Vault", "dmGOLD");
  await goldVault.waitForDeployment();
  console.log(`Gold Vault deployed to: ${await goldVault.getAddress()}`);

  console.log("All vaults successfully deployed on X Layer!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
