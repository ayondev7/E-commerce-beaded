"use client";
import React from "react";
import { FiLoader } from "react-icons/fi";
import AddressForm, { AddressData } from "./AddressForm";
import AddressCard from "./Address/AddressCard";
import AddCard from "./Address/AddCard";
import {
  useAddressList,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/hooks/addressHooks";
import toast from "react-hot-toast";

const emptyAddress: AddressData = {
  addressType: "",
  division: "",
  district: "",
  area: "",
  fullAddress: "",
  zipCode: "",
};

const Addresses: React.FC = () => {
  const { data: addressData, isLoading, error } = useAddressList();
  const [mode, setMode] = React.useState<
    "list" | "add" | { type: "edit"; id: string }
  >("list");

  const createAddressMutation = useCreateAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();
  const setDefaultAddressMutation = useSetDefaultAddress();

  

  const addresses = addressData?.addresses || [];

  const upsert = (data: AddressData) => {
    if (typeof mode === "object" && mode.type === "edit") {
      updateAddressMutation.mutate(
        {
          id: mode.id,
          payload: {
            addressType: data.addressType,
            addressName: data.addressName,
            division: data.division,
            district: data.district,
            area: data.area,
            fullAddress: data.fullAddress,
            zipCode: data.zipCode,
            isDefault: data.isDefault,
          },
        },
        {
          onSuccess: () => {
            toast.success("Address updated successfully");
            setMode("list");
          },
          onError: () => {
            toast.error("Failed to update address");
          },
        }
      );
    } else {
      createAddressMutation.mutate(
        {
          addressType: data.addressType,
          addressName: data.addressName || "",
          division: data.division,
          district: data.district,
          area: data.area,
          fullAddress: data.fullAddress,
          zipCode: data.zipCode,
          isDefault: data.isDefault || false,
        },
        {
          onSuccess: () => {
            toast.success("Address created successfully");
            setMode("list");
          },
          onError: () => {
            toast.error("Failed to create address");
          },
        }
      );
    }
  };

  const handleSetDefault = (id: string) => {
    setDefaultAddressMutation.mutate(id, {
      onSuccess: () => toast.success("Default address updated"),
      onError: () => toast.error("Failed to set default address"),
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      deleteAddressMutation.mutate(id, {
        onSuccess: () => toast.success("Address deleted successfully"),
        onError: () => toast.error("Failed to delete address"),
      });
    }
  };

  const isAnyMutationLoading =
    createAddressMutation.isPending ||
    updateAddressMutation.isPending ||
    deleteAddressMutation.isPending ||
    setDefaultAddressMutation.isPending;

  if (mode === "add") {
    return (
      <AddressForm
        title="Add New Address"
        initial={emptyAddress}
        onSave={upsert}
        onCancel={() => setMode("list")}
        isLoading={createAddressMutation.isPending}
      />
    );
  }
  if (typeof mode === "object" && mode.type === "edit") {
    const current = addresses.find((i) => i.id === mode.id)!;
    const editData: AddressData = {
      id: current.id,
      addressType: current.addressType as "Home" | "Work" | "Other",
      addressName: current.addressName,
      division: current.division,
      district: current.district,
      area: current.area,
      fullAddress: current.fullAddress,
      zipCode: current.zipCode,
      isDefault: current.isDefault,
    };
    return (
      <AddressForm
        title="Edit Address"
        initial={editData}
        onSave={upsert}
        onCancel={() => setMode("list")}
        isLoading={updateAddressMutation.isPending}
      />
    );
  }

  if (isLoading || isAnyMutationLoading) {
    return (
      <div className="flex flex-col items-center justify-center overflow-hidden">
        <FiLoader className="animate-spin size-[30px] text-[#00B5A5]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-8 text-red-500">
        Failed to load addresses
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden pb-[250px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {addresses.map((a) => (
          <AddressCard
            key={a.id}
            data={{
              id: a.id,
              addressType: a.addressType as "Home" | "Work" | "Other",
              addressName: a.addressName,
              division: a.division,
              district: a.district,
              area: a.area,
              fullAddress: a.fullAddress,
              zipCode: a.zipCode,
              isDefault: a.isDefault,
            }}
            isDefault={a.isDefault}
            onSetDefault={() => handleSetDefault(a.id)}
            onEdit={() => setMode({ type: "edit", id: a.id })}
            onDelete={() => handleDelete(a.id)}
            isDeleting={deleteAddressMutation.isPending}
            isSettingDefault={setDefaultAddressMutation.isPending}
          />
        ))}
        <AddCard onAdd={() => setMode("add")} />
      </div>
    </div>
  );
};

export default Addresses;
