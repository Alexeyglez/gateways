import { Router } from "express";

const router = Router();

import {
  createPeripheral,
  deletePeripheral,
  getPeripherals,
  getSinglePeripheral,
  updatePeripheral,
} from "../controllers/peripheralController.js";

router.route("/").get(getPeripherals).post(createPeripheral);
router
  .route("/:id")
  .get(getSinglePeripheral)
  .delete(deletePeripheral)
  .patch(updatePeripheral);

export default router;
