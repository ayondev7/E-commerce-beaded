"use client"
import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ProfileData } from "./ProfileInfoView"
import { genders } from "@/constants/genders"

interface ProfileInfoFormProps {
  initial: ProfileData
  onCancel?: () => void
  onSave: (data: ProfileData) => void
}

const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({ initial, onCancel, onSave }) => {
  const [form, setForm] = React.useState<ProfileData>(initial)

  const update = (k: keyof ProfileData, v: string) => setForm((p) => ({ ...p, [k]: v }))

  return (
    <div className="bg-red-500">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg">Edit Profile Info</h3>
        <Button size="sm" onClick={() => onSave(form)}>Save</Button>
      </div>
      <div className="rounded-md border bg-white/50 p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#6D6D6D]">First Name</label>
            <Input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="Enter First Name" />
          </div>
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#6D6D6D]">Email</label>
            <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="Enter Email" />
          </div>
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#6D6D6D]">Gender</label>
            <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
              <SelectTrigger className="w-full justify-between">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {genders.map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {gender}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#6D6D6D]">Last Name</label>
            <Input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="Enter Last Name" />
          </div>
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#6D6D6D]">Phone No.</label>
            <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Enter Phone No" />
          </div>
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#6D6D6D]">Date of Birth</label>
            <Input type="date" value={form.dob || ""} onChange={(e) => update("dob", e.target.value)} placeholder="Select" />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
          )}
          <Button onClick={() => onSave(form)}>Save</Button>
        </div>
      </div>
    </div>
  )
}

export default ProfileInfoForm
