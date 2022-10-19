import { Router } from "express";

import {
  getAllGateways,
  getSingleGateway,
  createGateway,
  deleteGateway,
  updateGateway,
  addPeripheral,
} from "../controllers/gatewayController.js";

const router = Router();

router.route("/").get(getAllGateways).post(createGateway);
router
  .route("/:id")
  .get(getSingleGateway)
  .delete(deleteGateway)
  .patch(updateGateway);

router.route("/:id/add").put(addPeripheral);

export default router;
