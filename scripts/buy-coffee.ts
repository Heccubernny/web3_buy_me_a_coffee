import { ethers } from "hardhat";
/**
 * @description Returns the ethereum balance
 * @param address
 */

async function getBalance(address: string) {
  const balanceBigInt: bigint = await ethers.provider.getBalance(address);
  return ethers.formatEther(balanceBigInt);
}

/**
 * @description Returns all the  ethereum balances
 * @param addresses
 */
async function printBalances(addresses: []) {
  let idx: number = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance:`, await getBalance(address));
    idx++;
  }
}

// Logs the memos stored on-chain from coffee purchases.
async function printMemos(memos: any[]) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const tipperMessage = memo.message;
    console.log(
      `At ${timestamp}, ${tipper} (${tipperAddress}) said: "${tipperMessage}"`
    );
  }
}

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = ethers.parseEther("0.1");

  //Get example accounts

  const [owner, tipper, tipper2, tipper3] = await ethers.getSigners();

  //Get the conntract to deploy

  const buyMeACoffee = await ethers.deployContract("BuyMeACoffee");
  await buyMeACoffee.waitForDeployment();

  const buyMeACoffeeAddress = await buyMeACoffee.getAddress();

  console.log("BuyMeACoffee deployed to ", buyMeACoffeeAddress);

  //Check balance before the coffee purchase
  const addresses: string[] | any = [
    owner.address,
    tipper.address,
    buyMeACoffeeAddress,
  ];
  console.log("=== Start ===");
  await printBalances(addresses);

  //Buy the owner a few coffees
  const tip = { value: ethers.parseEther("1") };
  await buyMeACoffee
    .connect(tipper)
    .buyCoffee("Carolina", "You're the best!", tip);
  await buyMeACoffee
    .connect(tipper2)
    .buyCoffee("Vitto", "Amazing teacher", tip);
  await buyMeACoffee
    .connect(tipper3)
    .buyCoffee("Kay", "I love my Proof of Knowledge", tip);

  // Check balances after coffee purchase.
  console.log("== bought coffee ==");
  await printBalances(addresses);

  //Withdraw funds
  await buyMeACoffee.connect(owner).withdrawTips();

  //Check balance after withdraw.
  console.log("== withdrawTips ==");
  await printBalances(addresses);

  //Read all the momos left for the owner
  console.log("== memos ==");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);

  console.log(
    `Locked with ${ethers.formatEther(
      lockedAmount
    )}ETH and unlock timestamp ${unlockTime} deployed to ${buyMeACoffeeAddress}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
