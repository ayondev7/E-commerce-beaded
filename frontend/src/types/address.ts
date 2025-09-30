export type Address = {
  id: string;
  addressType: string;
  addressName: string;
  division: string;
  district: string;
  area: string;
  zipCode: string;
  fullAddress: string;
  isDefault: boolean;
  customerId: string;
  createdAt: string;
  updatedAt: string;
};

export type AddressListResponse = {
  addresses: Address[];
};

export type CreateAddressPayload = {
  addressType: string;
  addressName: string;
  division: string;
  district: string;
  area: string;
  zipCode: string;
  fullAddress: string;
  isDefault?: boolean;
};

export type UpdateAddressPayload = Partial<CreateAddressPayload>;