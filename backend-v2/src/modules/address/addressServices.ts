import { prisma } from "../../config/db.js";
import type { Address } from "@prisma/client";

export const removeDefaultFromOtherAddresses = async (customerId: string, excludeAddressId: string | null = null) => {
  const whereCondition: any = {
    customerId,
    isDefault: true
  };
  
  if (excludeAddressId) {
    whereCondition.id = { not: excludeAddressId };
  }

  await prisma.address.updateMany({
    where: whereCondition,
    data: { isDefault: false }
  });
};

export const ensureFirstAddressIsDefault = async (customerId: string, isDefault: boolean) => {
  if (!isDefault) {
    const existingAddressCount = await prisma.address.count({
      where: { customerId }
    });
    
    if (existingAddressCount === 0) {
      return true;
    }
  }
  return isDefault;
};

export const findAddressByIdAndCustomer = async (addressId: string, customerId: string) => {
  return await prisma.address.findFirst({
    where: { 
      id: addressId,
      customerId 
    }
  });
};

export const buildUpdateData = (validationData: any, existingAddress: Address) => {
  const data: any = {};
  const fields = ['addressType', 'addressName', 'division', 'district', 'area', 'zipCode', 'fullAddress', 'isDefault'];
  
  fields.forEach(field => {
    if (typeof validationData[field] !== "undefined" && validationData[field] !== (existingAddress as any)[field]) {
      data[field] = validationData[field];
    }
  });
  
  return data;
};
