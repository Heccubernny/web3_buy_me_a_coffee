import { ethers } from "hardhat";

async function main(){
    //Get example accounts

  const [owner, tipper, tipper2, tipper3] = await ethers.getSigners();

  //Get the conntract to deploy

  const buyMeACoffee = await ethers.deployContract("BuyMeACoffee");
  await buyMeACoffee.waitForDeployment();

  const buyMeACoffeeAddress = await buyMeACoffee.getAddress();
  console.log("BuyMeACoffee deployed to ", buyMeACoffeeAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});