import { prisma } from "../../config/db.js";
import { validateCreateAddress, validateUpdateAddress } from "./addressValidation.js";
import {
  removeDefaultFromOtherAddresses,
  ensureFirstAddressIsDefault,
  findAddressByIdAndCustomer,
  buildUpdateData
} from "./addressServices.js";
import type { Request, Response, NextFunction } from "express";

const getUserAddresses = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const customerId = req.customer!.id;
		
		const addresses = await prisma.address.findMany({
			where: { customerId },
			orderBy: [
				{ isDefault: "desc" },
				{ createdAt: "desc" }
			]
		});
		
		return res.status(200).json({ addresses });
	} catch (err) {
		return next(err);
	}
};

	const addNewAddress = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const customerId = req.customer!.id;
			const validation = validateCreateAddress(req.body);
			
			if (!validation.success) {
				return res.status(400).json({ message: "Invalid input", errors: validation.errors });
			}
			
			let { addressType, addressName, division, district, area, zipCode, fullAddress, isDefault } = validation.data;
			
			if (isDefault) {
				await removeDefaultFromOtherAddresses(customerId);
			}
			
			isDefault = await ensureFirstAddressIsDefault(customerId, isDefault);
			
			const address = await prisma.address.create({
				data: {
					customerId,
					addressType,
					addressName,
					division,
					district,
					area,
					zipCode,
					fullAddress,
					isDefault
				}
			});
			
			return res.status(201).json({ 
				message: "Address created successfully", 
				address 
			});
		} catch (err) {
			return next(err);
		}
	};const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { addressId } = req.params;
		const customerId = req.customer!.id;
		
		if (!addressId) {
			return res.status(400).json({ message: "Address ID is required" });
		}
		
		const validation = validateUpdateAddress(req.body);
		if (!validation.success) {
			return res.status(400).json({ message: "Invalid input", errors: validation.errors });
		}
		
		const existingAddress = await findAddressByIdAndCustomer(addressId, customerId);
		
		if (!existingAddress) {
			return res.status(404).json({ message: "Address not found" });
		}
		
		const data = buildUpdateData(validation.data, existingAddress);
		
		if (data.isDefault) {
			await removeDefaultFromOtherAddresses(customerId, addressId);
		}
		
		if (Object.keys(data).length === 0) {
			return res.status(400).json({ message: "No fields provided to update" });
		}
		
		const updatedAddress = await prisma.address.update({
			where: { id: addressId },
			data
		});
		
		return res.status(200).json({ 
			message: "Address updated successfully", 
			address: updatedAddress 
		});
	} catch (err) {
		return next(err);
	}
};

const setDefaultAddress = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { addressId } = req.params;
		const customerId = req.customer!.id;
		
		if (!addressId) {
			return res.status(400).json({ message: "Address ID is required" });
		}
		
		const existingAddress = await findAddressByIdAndCustomer(addressId, customerId);
		
		if (!existingAddress) {
			return res.status(404).json({ message: "Address not found" });
		}
		
		if (existingAddress.isDefault) {
			return res.status(400).json({ message: "Address is already set as default" });
		}
		
		await removeDefaultFromOtherAddresses(customerId);
		
		const updatedAddress = await prisma.address.update({
			where: { id: addressId },
			data: { isDefault: true }
		});
		
		return res.status(200).json({ 
			message: "Address set as default successfully", 
			address: updatedAddress 
		});
	} catch (err) {
		return next(err);
	}
};

const removeDefaultAddress = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { addressId } = req.params;
		const customerId = req.customer!.id;
		
		if (!addressId) {
			return res.status(400).json({ message: "Address ID is required" });
		}
		
		const existingAddress = await findAddressByIdAndCustomer(addressId, customerId);
		
		if (!existingAddress) {
			return res.status(404).json({ message: "Address not found" });
		}
		
		if (!existingAddress.isDefault) {
			return res.status(400).json({ message: "Address is not set as default" });
		}
		
		const updatedAddress = await prisma.address.update({
			where: { id: addressId },
			data: { isDefault: false }
		});
		
		return res.status(200).json({ 
			message: "Default address status removed successfully", 
			address: updatedAddress 
		});
	} catch (err) {
		return next(err);
	}
};

const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { addressId } = req.params;
		const customerId = req.customer!.id;
		
		if (!addressId) {
			return res.status(400).json({ message: "Address ID is required" });
		}
		
		const existingAddress = await findAddressByIdAndCustomer(addressId, customerId);
		
		if (!existingAddress) {
			return res.status(404).json({ message: "Address not found" });
		}
		
		const deletedAddress = await prisma.address.delete({
			where: { id: addressId }
		});
		
		return res.status(200).json({ 
			message: "Address deleted successfully", 
			address: deletedAddress 
		});
	} catch (err) {
		return next(err);
	}
};

const addressController = {
	getUserAddresses,
	addNewAddress,
	updateAddress,
	setDefaultAddress,
	removeDefaultAddress,
	deleteAddress
};

export default addressController;
