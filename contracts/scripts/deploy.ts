import { ethers } from "hardhat";

async function main() {
  const factory = await ethers.getContractFactory("UwabeConfigToken");
  const UwabeConfigToken = await factory.deploy();

  await UwabeConfigToken.deployed();

  console.log(
    `Deployed to ${UwabeConfigToken.address}!`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
