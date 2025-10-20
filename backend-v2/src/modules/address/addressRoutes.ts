import { Router } from "express";
import autMiddleware from "../../middleware/authMiddleware.js";
import addressController from "./addressController.js";

const router = Router();

router.get("/get-user-addresses", autMiddleware, addressController.getUserAddresses);
router.post("/add-new-address", autMiddleware, addressController.addNewAddress);
router.patch("/update-address/:addressId", autMiddleware, addressController.updateAddress);
router.patch("/set-default-address/:addressId", autMiddleware, addressController.setDefaultAddress);
router.patch("/remove-default-address/:addressId", autMiddleware, addressController.removeDefaultAddress);
router.delete("/delete-address/:addressId", autMiddleware, addressController.deleteAddress);

export default router;
