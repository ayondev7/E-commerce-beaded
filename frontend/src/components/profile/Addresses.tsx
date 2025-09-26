"use client"
import React from "react"
import AddressForm, { AddressData } from "./AddressForm"
import { Button } from "@/components/ui/button"

const emptyAddress: AddressData = {
  type: "",
  division: "",
  district: "",
  area: "",
  address: "",
  zip: "",
}

const Card: React.FC<{
  data: AddressData
  isDefault?: boolean
  onEdit: () => void
  onDelete: () => void
  onSetDefault?: () => void
}> = ({ data, isDefault, onEdit, onDelete, onSetDefault }) => {
  return (
    <div className="relative rounded-md border p-4">
      <div className="mb-2 flex items-center gap-2 uppercase text-xs text-[#6D6D6D]">
        <span className="font-medium">{data.type || "Address"}</span>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-[11px] uppercase text-[#6D6D6D]">Division</div>
          <div>{data.division || "-"}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-[#6D6D6D]">District</div>
          <div>{data.district || "-"}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-[#6D6D6D]">Area</div>
          <div>{data.area || "-"}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-[#6D6D6D]">ZIP Code</div>
          <div>{data.zip || "-"}</div>
        </div>
        <div className="col-span-2">
          <div className="text-[11px] uppercase text-[#6D6D6D]">Full Address</div>
          <div>{data.address || "-"}</div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        {isDefault ? (
          <span className="text-xs font-medium text-orange-500 uppercase">Default Address</span>
        ) : (
          <button className="text-xs uppercase text-[#6D6D6D] hover:text-foreground" onClick={onSetDefault}>Set as Address</button>
        )}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>Edit</Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>Delete</Button>
        </div>
      </div>
    </div>
  )
}

const Addresses: React.FC = () => {
  const [items, setItems] = React.useState<AddressData[]>([
    { id: "1", type: "Home", division: "Dhaka", district: "Dhaka", area: "Gulshan", address: "House-54, Road-8, Niketan, Gulshan Dhaka", zip: "1401" },
    { id: "2", type: "Work", division: "Dhaka", district: "Dhaka", area: "Gulshan", address: "House-54, Road-8, Niketan, Gulshan Dhaka", zip: "1401" },
  ])
  const [defaultId, setDefaultId] = React.useState<string | undefined>("1")
  const [mode, setMode] = React.useState<"list" | "add" | { type: "edit"; id: string }>("list")

  const upsert = (data: AddressData) => {
    if ((mode as any).type === "edit") {
      const id = (mode as { type: "edit"; id: string }).id
      setItems((arr) => arr.map((a) => (a.id === id ? { ...data, id } : a)))
    } else {
      setItems((arr) => [...arr, { ...data, id: Math.random().toString(36).slice(2) }])
    }
    setMode("list")
  }

  if (mode === "add") {
    return <AddressForm title="Add New Address" initial={emptyAddress} onCancel={() => setMode("list")} onSave={upsert} />
  }
  if (typeof mode === "object" && mode.type === "edit") {
    const current = items.find((i) => i.id === mode.id)!
    return <AddressForm title="Edit Address" initial={current} onCancel={() => setMode("list")} onSave={upsert} />
  }

  return (
    <div className="mx-auto max-w-5xl px-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((a) => (
          <Card
            key={a.id}
            data={a}
            isDefault={a.id === defaultId}
            onSetDefault={() => setDefaultId(a.id)}
            onEdit={() => setMode({ type: "edit", id: a.id! })}
            onDelete={() => setItems((arr) => arr.filter((x) => x.id !== a.id))}
          />
        ))}
        <button onClick={() => setMode("add")} className="rounded-md border border-dashed p-4 text-center text-[#6D6D6D] hover:bg-gray-50">
          <div className="text-3xl">+</div>
          <div className="mt-2 text-sm uppercase">Add New Address</div>
        </button>
      </div>
    </div>
  )
}

export default Addresses
