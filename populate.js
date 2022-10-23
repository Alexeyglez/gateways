import { readFile } from "fs/promises";

import dotenv from "dotenv";
dotenv.config();

import connectdb from "./db/connectdb.js";
import Peripheral from "./models/Peripheral.js";
import Gateway from "./models/Gateway.js";

const start = async () => {
  try {
    await connectdb(process.env.MONGO_URL);
    await Peripheral.deleteMany();
    await Gateway.deleteMany();
    const jsonPeripherals = JSON.parse(
      await readFile(
        new URL("./mock-data/peripheralDevices.json", import.meta.url)
      )
    );
    const jsonGateways = JSON.parse(
      await readFile(new URL("./mock-data/gateways.json", import.meta.url))
    );
    await Peripheral.create(jsonPeripherals);
    await Gateway.create(jsonGateways);
    console.log("Success!!!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
