"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";
import { useStepper } from "./Stepper";
import { useMe } from "@/hooks/customerHooks";
import { useAddressList, useCreateAddress, useUpdateAddress } from "@/hooks/addressHooks";
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
  const errors: any = {};
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
  const createAddressMutation = useCreateAddress();
  const updateAddressMutation = useUpdateAddress();
  
  // Zustand store
  const { setDeliveryInfo, setCurrentStep, orderData } = useOrderFormStore();
  
  const [editingAddress, setEditingAddress] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddressDetails, setSelectedAddressDetails] = useState<any>(null);

  const addresses = addressData?.addresses || [];
  
  // Check if everything is loaded
  const isLoading = userLoading || addressLoading;
  
  // Load existing data from store if available
  useEffect(() => {
    if (orderData.deliveryInfo.selectedAddressDetails) {
      setSelectedAddressDetails(orderData.deliveryInfo.selectedAddressDetails);
    }
  }, [orderData.deliveryInfo.selectedAddressDetails]);
  
  // Show loader until everything is ready
  if (isLoading) {
    return (
      <section className="px-[150px] flex justify-center items-center min-h-[600px]">
        <div className="flex flex-col items-center">
          <FiLoader className="animate-spin size-[40px] text-[#00B5A5] mb-5" />
          <p className="text-lg text-[#7D7D7D]">Loading delivery information...</p>
        </div>
      </section>
    );
  }
  
  // Update selected address details when selection changes
  const handleAddressSelection = (addressName: string, setFieldValue: any) => {
    const selectedAddress = addresses.find(addr => addr.addressName === addressName);
    if (selectedAddress) {
      setFieldValue('selectedAddressId', selectedAddress.id);
      setSelectedAddressDetails(selectedAddress);
    }
  };

  const handleCreateAddress = async (addressData: any) => {
    try {
      await createAddressMutation.mutateAsync(addressData);
      setShowAddressForm(false);
      toast.success("Address added successfully");
    } catch (error) {
      console.error("Create address error:", error);
      toast.error("Failed to add address");
    }
  };

  const handleUpdateAddress = async (addressId: string, addressData: any) => {
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
        selectedAddressId: orderData.deliveryInfo.selectedAddressId || "",
        notes: orderData.deliveryInfo.notes || "",
      }}
      validate={validateForm}
      onSubmit={(values) => {
        // Create the delivery info object
        const deliveryInfo = {
          selectedAddressId: values.selectedAddressId,
          notes: values.notes,
          selectedAddressDetails: selectedAddressDetails ? {
            id: selectedAddressDetails.id,
            division: selectedAddressDetails.division,
            district: selectedAddressDetails.district,
            zipCode: selectedAddressDetails.zipCode,
            area: selectedAddressDetails.area,
            fullAddress: selectedAddressDetails.fullAddress,
            addressName: selectedAddressDetails.addressName,
          } : null,
        };
        
        // Store in Zustand
        setDeliveryInfo(deliveryInfo);
        setCurrentStep(2);
        
        // Console log the form data for debugging
        console.log("=== STEP 2 COMPLETED ===");
        console.log("Form values submitted:", values);
        console.log("Selected address details:", selectedAddressDetails);
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
                  {({ field }: any) => (
                    <InputField
                      {...field}
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
                    onClick={() => setShowAddressForm(true)}
                    className="border border-[#7D7D7D] hover:border-none"
                    bgClassName="bg-[#00B5A5]"
                    textClassName="group-hover:text-white"
                    disabled={createAddressMutation.isPending}
                  >
                    {createAddressMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <FiLoader className="animate-spin size-4" />
                        Adding...
                      </div>
                    ) : (
                      "Add new Address"
                    )}
                  </ReusableButton2>
                </div>
              </div>

              {/* Show address form or address details */}
              {showAddressForm ? (
                <AddressForm
                  initial={{
                    division: "",
                    district: "",
                    zip: "",
                    area: "",
                    fullAddress: "",
                  }}
                  isEditing={false}
                  onCancel={() => setShowAddressForm(false)}
                  onSave={(addressData) => handleCreateAddress(addressData)}
                />
              ) : selectedAddressDetails ? (
                editingAddress ? (
                  <AddressForm
                    initial={{
                      division: selectedAddressDetails.division,
                      district: selectedAddressDetails.district,
                      zip: selectedAddressDetails.zipCode,
                      area: selectedAddressDetails.area,
                      fullAddress: selectedAddressDetails.fullAddress,
                    }}
                    isEditing={true}
                    onCancel={() => setEditingAddress(false)}
                    onSave={(addressData) => 
                      handleUpdateAddress(selectedAddressDetails.id, {
                        ...addressData,
                        zipCode: addressData.zip,
                      })
                    }
                  />
                ) : (
                  <AddressView 
                    data={{
                      division: selectedAddressDetails.division,
                      district: selectedAddressDetails.district,
                      zip: selectedAddressDetails.zipCode,
                      area: selectedAddressDetails.area,
                      fullAddress: selectedAddressDetails.fullAddress,
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
                  disabled={updateAddressMutation.isPending}
                >
                  {updateAddressMutation.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <FiLoader className="animate-spin size-4" />
                      Updating...
                    </div>
                  ) : (
                    "Review Order"
                  )}
                </ReusableButton2>
              </div>
            </div>
          </section>
        </Form>
      )}
    </Formik>
  );
}
