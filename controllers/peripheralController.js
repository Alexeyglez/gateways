import Peripheral from "../models/Peripheral.js";
import Gateway from "../models/Gateway.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";

export const getPeripherals = async (req, res) => {
  const peripherals = await Peripheral.find();
  res.status(StatusCodes.OK).json({ peripherals, count: peripherals.length });
};

export const getSinglePeripheral = async (req, res) => {
  const { id: peripheralId } = req.params;
  const peripheral = await Peripheral.findOne({ _id: peripheralId });
  if (!peripheral) {
    throw new NotFoundError(`No peripheral with id ${peripheralId}`);
  }
  res.status(StatusCodes.OK).json({ peripheral });
};

export const deletePeripheral = async (req, res) => {
  const { id: peripheralId } = req.params;
  const peripheral = await Peripheral.findOne({ _id: peripheralId });
  if (!peripheral) {
    throw new NotFoundError(`No peripheral with id ${peripheralId}`);
  }
  await peripheral.remove();
  res.status(StatusCodes.OK).json({ msg: "Success! peripheral removed." });
};

export const createPeripheral = async (req, res) => {
  const { uid, vendor, date, status, gateway } = req.body;
  if (!uid || !vendor) {
    throw new BadRequestError("PLease provide all values");
  }
  /*const gatewayExists = await Gateway.findOne({ _id: gateway });
  if (!gatewayExists) {
    throw new NotFoundError(`No gateway with id ${gateway}`);
  }*/
  const peripheral = await Peripheral.create(req.body);
  res.status(StatusCodes.CREATED).json({ peripheral });
};

export const updatePeripheral = async (req, res) => {
  const { id: peripheralId } = req.params;
  const { uid, vendor, date, status, gatewayId } = req.body;
  if (!uid || !vendor || !date || !status || !gatewayId) {
    throw new BadRequestError("PLease provide all values");
  }
  const gatewayExists = await Gateway.findOne({ _id: gatewayId });
  if (!gatewayExists) {
    throw new NotFoundError(`No gateway with id ${gatewayId}`);
  }
  const peripheral = await Peripheral.findOneAndUpdate(
    { _id: peripheralId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!peripheral) {
    throw new NotFoundError(`No peripheral with id ${peripheralId}`);
  }
  res.status(StatusCodes.OK).json({ peripheral });
};
