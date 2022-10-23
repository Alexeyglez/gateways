import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import Gateway from "../models/Gateway.js";
//import { isIPv4 } from "is-ip";
import net from "net";
import Peripheral from "../models/Peripheral.js";

export const getAllGateways = async (req, res) => {
  const gateways = await Gateway.find().populate("peripheralDevice");
  res.status(StatusCodes.OK).json({ gateways, count: gateways.length });
};

export const getSingleGateway = async (req, res) => {
  const { id: gatewayId } = req.params;
  const gateway = await Gateway.findOne({ _id: gatewayId });
  if (!gateway) {
    throw new NotFoundError(`No found gateway with serial number ${gatewayId}`);
  }

  res.status(StatusCodes.OK).json({ gateway });
};

export const createGateway = async (req, res) => {
  const { serialNumber, gatewayName, address, peripheralDevice } = req.body;

  if (!serialNumber || !gatewayName || !address || !peripheralDevice) {
    throw new BadRequestError("Please provide all values");
  }
  const serialNumberAlreadyExists = await Gateway.findOne({
    serialNumber: serialNumber,
  });
  if (serialNumberAlreadyExists) {
    throw new BadRequestError("Serial number already exists");
  }
  if (!net.isIPv4(address)) {
    throw new BadRequestError("Please provide a correct ip address");
  }
  const gateway = await Gateway.create({
    serialNumber,
    gatewayName,
    address,
    peripheralDevice,
  });
  res.status(StatusCodes.CREATED).json({ gateway });
};

export const updateGateway = async (req, res) => {
  const { id: gatewayId } = req.params;
  const { serialNumber, gatewayName, address } = req.body;

  if (!serialNumber || !gatewayName || !address) {
    throw new BadRequestError("Please provide all values");
  }
  if (!isIPv4(address)) {
    throw new BadRequestError("Please provide a correct ip address");
  }

  const gateway = await Gateway.findOneAndUpdate({ _id: gatewayId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!gateway) {
    throw new NotFoundError(`No gateway with id ${gatewayId}`);
  }
  res.status(StatusCodes.OK).json({ gateway });
};

export const deleteGateway = async (req, res) => {
  const { id: gatewayId } = req.params;
  const gateway = await Gateway.findOne({ _id: gatewayId });
  if (!gateway) {
    throw new NotFoundError(`No found gateway with serial number ${gatewayId}`);
  }
  await gateway.remove();
  res.status(StatusCodes.OK).json({ msg: "Success! Gateway removed." });
};

export const addPeripheral = async (req, res) => {
  const { id: gatewayId } = req.params;
  const { peripheral } = req.body;

  const gateway = await Gateway.findOne({ _id: gatewayId });
  if (!gateway) {
    throw new NotFoundError(`No gateway with id ${gatewayId}`);
  }

  if (!peripheral) {
    throw new BadRequestError("No peripheral device provided");
  }

  if (gateway.peripheralDevice.length >= 10) {
    throw new BadRequestError(
      "The gateway cannnot have more 10 peripherals devices"
    );
  }

  if (gateway.peripheralDevice.includes(peripheral)) {
    throw new BadRequestError("The peripheral is already exists in gateway");
  }
  gateway.peripheralDevice.push(peripheral);
  const peripheralDevice = await Peripheral.findOne({ _id: peripheral });

  peripheralDevice.gateway = gateway._id;
  await peripheralDevice.save();

  await gateway.save();
  res.status(StatusCodes.OK).json({ gateway });
};

export const deletePeripheral = async (req, res) => {
  const { id: gatewayId } = req.params;
  const { peripheral } = req.body;

  const gateway = await Gateway.findOne({ _id: gatewayId });
  if (!gateway) {
    throw new NotFoundError(`No gateway with id ${gatewayId}`);
  }
  if (!peripheral) {
    throw new BadRequestError("No peripheral device provided");
  }
  if (!gateway.peripheralDevice.includes(peripheral)) {
    throw new BadRequestError("The peripheral device is not exists in gateway");
  }
  gateway.peripheralDevice.splice(gateway.peripheralDevice.indexOf(peripheral));
  const peripheralDevice = await Peripheral.findOne({ _id: peripheral });

  peripheralDevice.gateway = null;
  await peripheralDevice.save();
  await gateway.save();
  res
    .status(StatusCodes.OK)
    .json({ msg: "Success! peripheral device removed!" });
};
