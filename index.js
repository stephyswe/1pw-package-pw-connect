import { OnePasswordConnect, ItemBuilder } from "@1password/connect";
import * as readline from "readline-sync";
import * as dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "./.env") });

async function RunOnce() {
  try {
    // CREATE CLIENT
    const op = OnePasswordConnect({
      serverURL: process.env.OP_CONNECT_HOST,
      token: process.env.OP_CONNECT_TOKEN,
      keepAlive: true,
    });

    // Get all vaults
    let allVaults = await op.listVaults();
    // console.log("allVaults", allVaults);

    // How to get one vault id
    let vaultId = allVaults[0].id;
    // console.log("vaultId", vaultId);
    let vault = await op.getVault("ve7tntitvzl7vsglbtmtjttcaa");

    // get one vault item
    const item = await op.getItem(vaultId, "dev_item");
    console.log(item.fields[2].value); // Outputs: '123'
    // console.log(item.fields.find((field) => field.id === "credential")?.value);

    // create .env.1pw file

    const pathToEnvFile = path.resolve(__dirname, "../.env.1pw");

    

  } catch (error) {
    console.log("error", error);
  }
}

async function main() {
  await RunOnce();
  console.log("finished");
}

main();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const steps = {
  intro:
    "\nHello from 1Password! In order to demonstrate creating, editing, retrieving and, eventually, deleting an item, the following steps are taken: \n",
  step1:
    "1. The SDK has contacted the Connect Server, and a client has been created, based on the provided OP_CONNECT_TOKEN.",
  step2:
    "2. An item containing the secret string has been successfully created.",
  step3:
    "3. The item containing the secret string has been successfully added in the default vault.",
  step4:
    "4. The item containing the secret string has been successfully retrieved from the default vault.\n",
  confirmation:
    "Would you like to delete the newly created item from your vault? (y/n)",
  confirmation2:
    "Your answer should be either 'y' or 'n'. Would you like to delete the newly created item from your vault? (y/n)",
  step5:
    "\n5. The item containing the secret string has been successfully deleted from the default vault.\n",
  outro: "All done!",
};

async function runAll() {
  console.log(steps["intro"]);

  console.log("env", process.env.OP_CONNECT_HOST);

  // CREATE CLIENT
  const op = OnePasswordConnect({
    serverURL: process.env.OP_CONNECT_HOST,
    token: process.env.OP_CONNECT_TOKEN,
    keepAlive: true,
  });
  console.log(steps["step1"]);

  // CREATE ITEM
  const newItem = new ItemBuilder()
    .addField({
      value: process.env.SECRET_STRING,
      type: "STRING",
    })
    .setCategory("LOGIN")
    .build();
  console.log(steps["step2"]);

  // ADD ITEM TO VAULT
  const createdItem = await op.createItem(process.env.OP_VAULT, newItem);
  console.log(steps["step3"]);

  await sleep(10000);

  // RETRIEVE ITEM FROM VAULT
  const retrievedItem = await op.getItem(process.env.OP_VAULT, createdItem.id);
  console.log(steps["step4"]);

  var answer = readline.question(steps["confirmation"]);

  while (answer != "y" && answer != "n") {
    answer = readline.question(steps["confirmation2"]);
  }

  if (answer == "y") {
    // DELETE ITEM FROM VAULT
    await op.deleteItem(process.env.OP_VAULT, retrievedItem.id);
    console.log(steps["step5"]);
  }

  console.log(steps["outro"]);
}
