"use client";
import React from "react";
import ProfileLayout from "@/components/profile/ProfileLayout";
import ProfileInfoView, {
  type ProfileData,
} from "@/components/profile/ProfileInfoView";
import ProfileInfoForm from "@/components/profile/ProfileInfoForm";
import { withRouteProtection } from "@/components/auth/RouteProtector";
import { useMe, useUpdateMe } from "@/hooks/customerHooks";

const ProfilePage = () => {
  const [editing, setEditing] = React.useState(false);
  const { data: profileData, isLoading, error } = useMe();
  const updateMeMutation = useUpdateMe();

  if (isLoading) {
    return (
      <ProfileLayout>
        <div className="bg-[#fafafa] pt-5 pb-10">
          <div className="px-8 border-b border-[#ebebeb] pb-5">
            <h3 className="text-[30px] leading-[38px] tracking-[-2%]">Profile Info</h3>
          </div>
          <div className="pt-5 px-8">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      </ProfileLayout>
    );
  }

  if (error) {
    return (
      <ProfileLayout>
        <div className="bg-[#fafafa] pt-5 pb-10">
          <div className="px-8 border-b border-[#ebebeb] pb-5">
            <h3 className="text-[30px] leading-[38px] tracking-[-2%]">Profile Info</h3>
          </div>
          <div className="pt-5 px-8">
            <div className="text-center text-red-500">Error loading profile data</div>
          </div>
        </div>
      </ProfileLayout>
    );
  }

  const profile: ProfileData = {
    name: profileData?.name || "",
    email: profileData?.email || "",
    phoneNumber: profileData?.phoneNumber || "",
    gender: profileData?.gender || "",
    dateOfBirth: profileData?.dateOfBirth || "",
  };

  const handleSave = async (data: ProfileData) => {
    try {
      await updateMeMutation.mutateAsync({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        gender: data.gender || null,
        dateOfBirth: data.dateOfBirth,
      });
      setEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <ProfileLayout>
      {editing ? (
        <ProfileInfoForm
          initial={profile}
          onCancel={() => setEditing(false)}
          onSave={handleSave}
        />
      ) : (
        <ProfileInfoView data={profile} onEdit={() => setEditing(true)} />
      )}
    </ProfileLayout>
  );
};

export default withRouteProtection(ProfilePage);
