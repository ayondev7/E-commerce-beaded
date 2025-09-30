"use client";
import React from "react";
import ProfileLayout from "@/components/profile/ProfileLayout";
import ProfileInfoView, {
  type ProfileData,
} from "@/components/profile/ProfileInfoView";
import ProfileInfoForm from "@/components/profile/ProfileInfoForm";
import { withRouteProtection } from "@/components/auth/RouteProtector";

const ProfilePage = () => {
  const [editing, setEditing] = React.useState(false);
  const [profile, setProfile] = React.useState<ProfileData>({
    firstName: "Jenny",
    lastName: "Wilson",
    email: "info@example.com",
    phone: "01234567890",
    gender: "Male",
    dob: "1999-12-15",
  });

  return (
    <ProfileLayout>
      {editing ? (
        <ProfileInfoForm
          initial={profile}
          onCancel={() => setEditing(false)}
          onSave={(data) => {
            setProfile(data);
            setEditing(false);
          }}
        />
      ) : (
        <ProfileInfoView data={profile} onEdit={() => setEditing(true)} />
      )}
    </ProfileLayout>
  );
};

export default withRouteProtection(ProfilePage);
