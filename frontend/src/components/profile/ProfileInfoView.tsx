import React from "react"
import { Button } from "@/components/ui/button"

export interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  gender: "Male" | "Female" | "Other" | ""
  dob?: string
}

interface ProfileInfoViewProps {
  data: ProfileData
  onEdit: () => void
}

const InfoRow: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[11px] uppercase tracking-wide text-[#6D6D6D]">{label}</span>
    <span className="text-sm">{value || "-"}</span>
  </div>
)

const ProfileInfoView: React.FC<ProfileInfoViewProps> = ({ data, onEdit }) => {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg">Profile Info</h3>
        <Button variant="ghost" onClick={onEdit} className="text-sm">Edit</Button>
      </div>
      <div className="rounded-md border bg-white/50 p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <InfoRow label="First name" value={data.firstName} />
          <InfoRow label="Email" value={data.email} />
          <InfoRow label="Gender" value={data.gender} />
          <InfoRow label="Last name" value={data.lastName} />
          <InfoRow label="Phone no." value={data.phone} />
          <InfoRow label="Date of Birth" value={data.dob} />
        </div>
      </div>
    </div>
  )
}

export default ProfileInfoView
