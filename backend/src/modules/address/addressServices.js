import { prisma } from "../../config/db.js";

export const removeDefaultFromOtherAddresses = async (customerId, excludeAddressId = null) => {
  const whereCondition = {
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

export const ensureFirstAddressIsDefault = async (customerId, isDefault) => {
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

export const findAddressByIdAndCustomer = async (addressId, customerId) => {
  return await prisma.address.findFirst({
    where: { 
      id: addressId,
      customerId 
    }
  });
};

export const buildUpdateData = (validationData, existingAddress) => {
  const data = {};
  const fields = ['addressType', 'addressName', 'division', 'district', 'area', 'zipCode', 'fullAddress', 'isDefault'];
  
  fields.forEach(field => {
    if (typeof validationData[field] !== "undefined" && validationData[field] !== existingAddress[field]) {
      data[field] = validationData[field];
    }
  });
  
  return data;
};