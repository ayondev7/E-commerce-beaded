import { prisma } from "../../config/db.js";
import { validateCreateAddress, validateUpdateAddress } from "./addressValidation.js";

const getUserAddresses = async (req, res, next) => {
	try {
		const customerId = req.customer.id;
		
		const addresses = await prisma.address.findMany({
			where: { customerId },
			orderBy: [
				{ isDefault: "desc" }, // Default addresses first
				{ createdAt: "desc" }   // Then by creation date
			]
		});
		
		return res.status(200).json({ addresses });
	} catch (err) {
		return next(err);
	}
};

	const addNewAddress = async (req, res, next) => {
		try {
			const customerId = req.customer.id;
			const validation = validateCreateAddress(req.body);
			
			if (!validation.success) {
				return res.status(400).json({ message: "Invalid input", errors: validation.errors });
			}
			
			const { addressType, addressName, division, district, area, zipCode, fullAddress, isDefault } = validation.data;
			
			// If this is being set as default, remove default status from ALL other addresses first
			if (isDefault) {
				await prisma.address.updateMany({
					where: { 
						customerId,
						isDefault: true 
					},
					data: { isDefault: false }
				});
			}
			
			// If no address is being set as default, but this is the first address, make it default
			if (!isDefault) {
				const existingAddressCount = await prisma.address.count({
					where: { customerId }
				});
				
				// If this is the first address, make it default automatically
				if (existingAddressCount === 0) {
					isDefault = true;
				}
			}
			
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
	};const updateAddress = async (req, res, next) => {
	try {
		const { addressId } = req.params;
		const customerId = req.customer.id;
		
		if (!addressId) {
			return res.status(400).json({ message: "Address ID is required" });
		}
		
		const validation = validateUpdateAddress(req.body);
		if (!validation.success) {
			return res.status(400).json({ message: "Invalid input", errors: validation.errors });
		}
		
		// Check if address exists and belongs to the customer
		const existingAddress = await prisma.address.findFirst({
			where: { 
				id: addressId,
				customerId 
			}
		});
		
		if (!existingAddress) {
			return res.status(404).json({ message: "Address not found" });
		}
		
		const data = {};
		const { addressType, addressName, division, district, area, zipCode, fullAddress, isDefault } = validation.data;
		
		if (typeof addressType !== "undefined" && addressType !== existingAddress.addressType) {
			data.addressType = addressType;
		}
		if (typeof addressName !== "undefined" && addressName !== existingAddress.addressName) {
			data.addressName = addressName;
		}
		if (typeof division !== "undefined" && division !== existingAddress.division) {
			data.division = division;
		}
		if (typeof district !== "undefined" && district !== existingAddress.district) {
			data.district = district;
		}
		if (typeof area !== "undefined" && area !== existingAddress.area) {
			data.area = area;
		}
		if (typeof zipCode !== "undefined" && zipCode !== existingAddress.zipCode) {
			data.zipCode = zipCode;
		}
		if (typeof fullAddress !== "undefined" && fullAddress !== existingAddress.fullAddress) {
			data.fullAddress = fullAddress;
		}
		if (typeof isDefault !== "undefined" && isDefault !== existingAddress.isDefault) {
			data.isDefault = isDefault;
			
			// If setting as default, remove default status from other addresses
			if (isDefault) {
				await prisma.address.updateMany({
					where: { 
						customerId,
						isDefault: true,
						id: { not: addressId }
					},
					data: { isDefault: false }
				});
			}
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

const setDefaultAddress = async (req, res, next) => {
	try {
		const { addressId } = req.params;
		const customerId = req.customer.id;
		
		if (!addressId) {
			return res.status(400).json({ message: "Address ID is required" });
		}
		
		// Check if address exists and belongs to the customer
		const existingAddress = await prisma.address.findFirst({
			where: { 
				id: addressId,
				customerId 
			}
		});
		
		if (!existingAddress) {
			return res.status(404).json({ message: "Address not found" });
		}
		
		if (existingAddress.isDefault) {
			return res.status(400).json({ message: "Address is already set as default" });
		}
		
		// Remove default status from all other addresses
		await prisma.address.updateMany({
			where: { 
				customerId,
				isDefault: true 
			},
			data: { isDefault: false }
		});
		
		// Set this address as default
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

const removeDefaultAddress = async (req, res, next) => {
	try {
		const { addressId } = req.params;
		const customerId = req.customer.id;
		
		if (!addressId) {
			return res.status(400).json({ message: "Address ID is required" });
		}
		
		// Check if address exists and belongs to the customer
		const existingAddress = await prisma.address.findFirst({
			where: { 
				id: addressId,
				customerId 
			}
		});
		
		if (!existingAddress) {
			return res.status(404).json({ message: "Address not found" });
		}
		
		if (!existingAddress.isDefault) {
			return res.status(400).json({ message: "Address is not set as default" });
		}
		
		// Remove default status
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

const deleteAddress = async (req, res, next) => {
	try {
		const { addressId } = req.params;
		const customerId = req.customer.id;
		
		if (!addressId) {
			return res.status(400).json({ message: "Address ID is required" });
		}
		
		// Check if address exists and belongs to the customer
		const existingAddress = await prisma.address.findFirst({
			where: { 
				id: addressId,
				customerId 
			}
		});
		
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