"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";
import { useStepper } from "./Stepper";
import { useMe } from "@/hooks/customerHooks";
import { useAddressList, useUpdateAddress } from "@/hooks/addressHooks";
import { useOrderFormStore } from "@/store/orderFormStore";
import SelectField from "@/components/generalComponents/Form/SelectField";
import InputField, {
  baseInputClass,
} from "@/components/generalComponents/Form/InputField";
import AddressView from "./Address/AddressView";
import AddressForm, {
  AddressData as AddressDataForm,
} from "./Address/AddressForm";
import ReusableButton2 from "../generalComponents/ReusableButton2";

// Simple validation function since Yup might not be available
const validateForm = (values: FormValues) => {
  const errors: Record<string, string> = {};
  if (!values.selectedAddressId) {
    errors.selectedAddressId = "Please select a delivery address";
  }
  return errors;
};

type FormValues = {
  selectedAddressId: string;
  notes: string;
};

export default function DeliveryInfo() {
  const router = useRouter();
  const { next } = useStepper();
  const { data: userInfo, isLoading: userLoading } = useMe();
  const { data: addressData, isLoading: addressLoading } = useAddressList();
  const updateAddressMutation = useUpdateAddress();
  
  // Zustand store
  const { setDeliveryInfo, setCurrentStep, orderData } = useOrderFormStore();
  
  const [editingAddress, setEditingAddress] = useState(false);
  const [selectedAddressDetails, setSelectedAddressDetails] = useState<Record<string, unknown> | null>(null);

  const addresses = addressData?.addresses || [];
  
  // Check if everything is loaded
  const isLoading = userLoading || addressLoading;
  
  // Load existing data from store if available
  useEffect(() => {
    // No need to load selectedAddressDetails since we're not storing it
  }, []);
  
  // Show loader until everything is ready
  if (isLoading) {
    return (
      <section className="px-[150px] flex justify-center items-center min-h-[700px]">
        <div className="flex flex-col items-center">
          <FiLoader className="animate-spin size-[40px] text-[#00B5A5] mb-5" />
          <p className="text-lg text-[#7D7D7D]">Loading delivery information...</p>
        </div>
      </section>
    );
  }
  
  // Update selected address details when selection changes
  const handleAddressSelection = (addressName: string, setFieldValue: (field: string, value: unknown) => void) => {
    const selectedAddress = addresses.find(addr => addr.addressName === addressName);
    if (selectedAddress) {
      setFieldValue('selectedAddressId', addressName); // Store address name instead of ID
      setSelectedAddressDetails(selectedAddress as Record<string, unknown>);
    }
  };

  const handleUpdateAddress = async (addressId: string, addressData: Record<string, unknown>) => {
    try {
      await updateAddressMutation.mutateAsync({ id: addressId, payload: addressData });
      setEditingAddress(false);
      toast.success("Address updated successfully");
      // Update selected address details
      const updatedAddress = { ...selectedAddressDetails, ...addressData };
      setSelectedAddressDetails(updatedAddress);
    } catch (error) {
      console.error("Update address error:", error);
      toast.error("Failed to update address");
    }
  };
  return (
    <Formik
      initialValues={{
        selectedAddressId: "",
        notes: orderData.deliveryInfo.notes || "",
      }}
      validate={validateForm}
      onSubmit={(values) => {
        // Find the selected address by name to get the actual ID
        const selectedAddress = addresses.find(addr => addr.addressName === values.selectedAddressId);
        
        // Create the delivery info object with only essential data
        const deliveryInfo = {
          selectedAddressId: selectedAddress?.id || "",
          notes: values.notes,
        };
        
        // Store in Zustand
        setDeliveryInfo(deliveryInfo);
        setCurrentStep(2);
        
        // Console log the form data for debugging
        console.log("=== STEP 2 COMPLETED ===");
        console.log("Form values submitted:", values);
        console.log("Delivery info stored:", deliveryInfo);
        
        // Proceed to next step
        next();
      }}
    >
      {({ values, errors, touched, setFieldValue, handleSubmit }) => (
        <Form>
          <section className="px-[150px] grid md:grid-cols-[2fr_3fr] gap-20">
            {/* Left: Personal & Payment */}
            <div className="space-y-10">
              <div>
                <h2 className="text-[32px] mb-[35px]">Personal Info</h2>
                <div className="bg-[#fafafa] px-8 py-[75px] grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <div className="uppercase text-base text-[#7D7D7D] mb-1">Name</div>
                    <div className="text-lg">{userInfo?.name || "Not provided"}</div>
                  </div>
                  <div>
                    <div className="uppercase text-base text-[#7D7D7D] mb-1">
                      Phone No.
                    </div>
                    <div className="text-lg">{userInfo?.phoneNumber || "Not provided"}</div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[32px] mb-3">Payment Info</h2>
                <p className="text-base text-[#7D7D7D] leading-[26px]">
                  Cash on Delivery is available right now
                </p>
              </div>

              <div>
                <h2 className="text-[32px] mb-2">Notes</h2>
                <Field name="notes">
                  {({ field, form }: { field: { value: string }; form: { setFieldValue: (field: string, value: unknown) => void } }) => (
                    <InputField
                      value={field.value}
                      onChange={(value) => form.setFieldValue('notes', value)}
                      placeholder="Notes"
                      inputClassName={baseInputClass}
                      className="max-w-[400px]"
                    />
                  )}
                </Field>
              </div>
            </div>

            {/* Right: Address */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Delivery Address</h2>
              <div>
                <div className="mb-2 text-sm">Your Address</div>
                <div className="flex gap-3 items-center justify-between">
                  <div className="relative w-[300px]">
                    <SelectField
                      value={values.selectedAddressId}
                      onChange={(value) => handleAddressSelection(value, setFieldValue)}
                      options={addresses.map(addr => addr.addressName)}
                      placeholder="Select address"
                      triggerClassName={baseInputClass}
                      className="w-full"
                    />
                    {errors.selectedAddressId && touched.selectedAddressId && (
                      <span className="absolute -bottom-5 left-0 text-red-500 text-sm">
                        {errors.selectedAddressId}
                      </span>
                    )}
                  </div>
                  <ReusableButton2
                    type="button"
                    onClick={() => router.push('/address')}
                    className="border border-[#7D7D7D] hover:border-none"
                    bgClassName="bg-[#00B5A5]"
                    textClassName="group-hover:text-white"
                  >
                    Add new Address
                  </ReusableButton2>
                </div>
              </div>

              {/* Show address details and editing form */}
              {selectedAddressDetails ? (
                editingAddress ? (
                  <AddressForm
                    initial={{
                      division: (selectedAddressDetails as import("@/types").Address).division,
                      district: (selectedAddressDetails as import("@/types").Address).district,
                      zip: (selectedAddressDetails as import("@/types").Address).zipCode,
                      area: (selectedAddressDetails as import("@/types").Address).area,
                      fullAddress: (selectedAddressDetails as import("@/types").Address).fullAddress,
                    }}
                    isEditing={true}
                    isLoading={updateAddressMutation.isPending}
                    onCancel={() => setEditingAddress(false)}
                    onSave={(addressData) => 
                      handleUpdateAddress((selectedAddressDetails as import("@/types").Address).id, {
                        ...addressData,
                        zipCode: addressData.zip,
                      })
                    }
                  />
                ) : (
                  <AddressView 
                    data={{
                      division: (selectedAddressDetails as import("@/types").Address).division,
                      district: (selectedAddressDetails as import("@/types").Address).district,
                      zip: (selectedAddressDetails as import("@/types").Address).zipCode,
                      area: (selectedAddressDetails as import("@/types").Address).area,
                      fullAddress: (selectedAddressDetails as import("@/types").Address).fullAddress,
                    }} 
                    onEdit={() => setEditingAddress(true)} 
                  />
                )
              ) : null}

              <div className="flex justify-end gap-4 pt-2">
                <ReusableButton2
                  type="button"
                  onClick={() => router.push('/all/all/shop')}
                  className="border border-black w-[251px]"
                >
                  continue shopping
                </ReusableButton2>
                <ReusableButton2
                  type="submit"
                  className="bg-[#00b5a6] w-[251px]"
                  textClassName="text-white"
                >
                  Review Order
                </ReusableButton2>
              </div>
            </div>
          </section>
        </Form>
      )}
    </Formik>
  );
}
