import { prisma } from "../../config/db.js";
import { validateCreateAddress, validateUpdateAddress } from "./addressValidation.js";
import {
  findAddressByIdAndCustomer,
  buildUpdateData
} from "./addressServices.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ValidationError, NotFoundError, BadRequestError } from "../../utils/errors.js";
import type { Request, Response } from "express";

const getUserAddresses = asyncHandler(async (req: Request, res: Response) => {
	const customerId = req.customer!.id;
	
	const addresses = await prisma.address.findMany({
		where: { customerId },
		orderBy: [
			{ isDefault: "desc" },
			{ createdAt: "desc" }
		]
	});
	
	return res.status(200).json({ addresses });
});

const addNewAddress = asyncHandler(async (req: Request, res: Response) => {
	const customerId = req.customer!.id;
	const validation = validateCreateAddress(req.body);
	
	if (!validation.success) {
		throw new ValidationError("Invalid input", validation.errors);
	}
	
	let { addressType, addressName, division, district, area, zipCode, fullAddress, isDefault } = validation.data;
	
	const address = await prisma.$transaction(async (tx) => {
		if (isDefault) {
			await tx.address.updateMany({
				where: {
					customerId,
					isDefault: true
				},
				data: { isDefault: false }
			});
		}
		
		if (!isDefault) {
			const existingAddressCount = await tx.address.count({
				where: { customerId }
			});
			
			if (existingAddressCount === 0) {
				isDefault = true;
			}
		}
		
		return await tx.address.create({
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
	});
	
	return res.status(201).json({ 
		message: "Address created successfully", 
		address 
	});
});

const updateAddress = asyncHandler(async (req: Request, res: Response) => {
	const { addressId } = req.params;
	const customerId = req.customer!.id;
	
	if (!addressId) {
		throw new BadRequestError("Address ID is required");
	}
	
	const validation = validateUpdateAddress(req.body);
	if (!validation.success) {
		throw new ValidationError("Invalid input", validation.errors);
	}
	
	const existingAddress = await findAddressByIdAndCustomer(addressId, customerId);
	
	if (!existingAddress) {
		throw new NotFoundError("Address not found");
	}
	
	const data = buildUpdateData(validation.data, existingAddress);
	
	if (Object.keys(data).length === 0) {
		throw new BadRequestError("No fields provided to update");
	}
	
	const updatedAddress = await prisma.$transaction(async (tx) => {
		if (data.isDefault) {
			await tx.address.updateMany({
				where: {
					customerId,
					isDefault: true,
					id: { not: addressId }
				},
				data: { isDefault: false }
			});
		}
		
		return await tx.address.update({
			where: { id: addressId },
			data
		});
	});
	
	return res.status(200).json({ 
		message: "Address updated successfully", 
		address: updatedAddress 
	});
});

const setDefaultAddress = asyncHandler(async (req: Request, res: Response) => {
	const { addressId } = req.params;
	const customerId = req.customer!.id;
	
	if (!addressId) {
		throw new BadRequestError("Address ID is required");
	}
	
	const existingAddress = await findAddressByIdAndCustomer(addressId, customerId);
	
	if (!existingAddress) {
		throw new NotFoundError("Address not found");
	}
	
	if (existingAddress.isDefault) {
		throw new BadRequestError("Address is already set as default");
	}
	
	const updatedAddress = await prisma.$transaction(async (tx) => {
		await tx.address.updateMany({
			where: {
				customerId,
				isDefault: true
			},
			data: { isDefault: false }
		});
		
		return await tx.address.update({
			where: { id: addressId },
			data: { isDefault: true }
		});
	});
	
	return res.status(200).json({ 
		message: "Address set as default successfully", 
		address: updatedAddress 
	});
});

const removeDefaultAddress = asyncHandler(async (req: Request, res: Response) => {
	const { addressId } = req.params;
	const customerId = req.customer!.id;
	
	if (!addressId) {
		throw new BadRequestError("Address ID is required");
	}
	
	const existingAddress = await findAddressByIdAndCustomer(addressId, customerId);
	
	if (!existingAddress) {
		throw new NotFoundError("Address not found");
	}
	
	if (!existingAddress.isDefault) {
		throw new BadRequestError("Address is not set as default");
	}
	
	const updatedAddress = await prisma.address.update({
		where: { id: addressId },
		data: { isDefault: false }
	});
	
	return res.status(200).json({ 
		message: "Default address status removed successfully", 
		address: updatedAddress 
	});
});

const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
	const { addressId } = req.params;
	const customerId = req.customer!.id;
	
	if (!addressId) {
		throw new BadRequestError("Address ID is required");
	}
	
	const existingAddress = await findAddressByIdAndCustomer(addressId, customerId);
	
	if (!existingAddress) {
		throw new NotFoundError("Address not found");
	}
	
	const deletedAddress = await prisma.address.delete({
		where: { id: addressId }
	});
	
	return res.status(200).json({ 
		message: "Address deleted successfully", 
		address: deletedAddress 
	});
});

const addressController = {
	getUserAddresses,
	addNewAddress,
	updateAddress,
	setDefaultAddress,
	removeDefaultAddress,
	deleteAddress
};

export default addressController;
