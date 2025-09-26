"use client"
import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface AddressData {
  id?: string
  type: "Home" | "Work" | "Other" | ""
  name?: string
  division: string
  district: string
  area: string
  precedence?: "Default" | "Secondary" | "";
  address: string
  zip: string
}

interface AddressFormProps {
  title?: string
  initial: AddressData
  onCancel?: () => void
  onSave: (data: AddressData) => void
}

const AddressForm: React.FC<AddressFormProps> = ({ title = "Add New Address", initial, onCancel, onSave }) => {
  const [form, setForm] = React.useState<AddressData>(initial)
  const update = (k: keyof AddressData, v: string) => setForm((p) => ({ ...p, [k]: v }))

  return (
    <div className="mx-auto max-w-5xl px-4">
      <div className="mb-6 text-center text-2xl uppercase tracking-wide">{title}</div>
      <div className="rounded-md border bg-white/50 p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#6D6D6D]">Select Address Type</label>
            <Select value={form.type} onValueChange={(v) => update("type", v)}>
              <SelectTrigger className="w-full justify-between"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Home">Home</SelectItem>
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#6D6D6D]">Address Name (optional)</label>
            <Input value={form.name || ""} onChange={(e) => update("name", e.target.value)} placeholder="Enter Address Name" />
          </div>
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#6D6D6D]">Select Division</label>
            <Input value={form.division} onChange={(e) => update("division", e.target.value)} placeholder="Select" />
          </div>
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#6D6D6D]">Select District</label>
            <Input value={form.district} onChange={(e) => update("district", e.target.value)} placeholder="Select" />
          </div>
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#6D6D6D]">Select Area</label>
            <Input value={form.area} onChange={(e) => update("area", e.target.value)} placeholder="Select" />
          </div>
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#6D6D6D]">Precedence</label>
            <Select value={form.precedence || ""} onValueChange={(v) => update("precedence", v)}>
              <SelectTrigger className="w-full justify-between"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Default">Default</SelectItem>
                <SelectItem value="Secondary">Secondary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#6D6D6D]">Full Address</label>
            <textarea
              className="border-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 w-full rounded-md border bg-transparent p-3 text-sm outline-none"
              rows={5}
              value={form.address}
              placeholder="Please enter your full address"
              onChange={(e) => update("address", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#6D6D6D]">ZIP Code</label>
            <Input value={form.zip} onChange={(e) => update("zip", e.target.value)} placeholder="Enter ZIP" />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          {onCancel && <Button variant="outline" onClick={onCancel}>Cancel</Button>}
          <Button onClick={() => onSave(form)}>Save Address</Button>
        </div>
      </div>
    </div>
  )
}

export default AddressForm
