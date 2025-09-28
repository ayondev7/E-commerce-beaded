"use client"
import React from "react"
import AddressForm, { AddressData } from "./AddressForm"
import AddressCard from "./Address/AddressCard"
import AddCard from "./Address/AddCard"

const emptyAddress: AddressData = {
  type: "",
  division: "",
  district: "",
  area: "",
  address: "",
  zip: "",
}


const Addresses: React.FC = () => {
  const [items, setItems] = React.useState<AddressData[]>([
    {
      id: "1",
      type: "Home",
      division: "Dhaka",
      district: "Dhaka",
      area: "Gulshan",
      address: "House-54, Road-8, Niketan, Gulshan Dhaka",
      zip: "1401",
    },
    {
      id: "2",
      type: "Work",
      division: "Dhaka",
      district: "Dhaka",
      area: "Gulshan",
      address: "House-54, Road-8, Niketan, Gulshan Dhaka",
      zip: "1401",
    },
  ])
  const [defaultId, setDefaultId] = React.useState<string | undefined>("1")
  const [mode, setMode] = React.useState<"list" | "add" | { type: "edit"; id: string }>(
    "list"
  )

  const upsert = (data: AddressData) => {
    if (typeof mode === "object" && mode.type === "edit") {
      const id = mode.id
      setItems((arr) => arr.map((a) => (a.id === id ? { ...data, id } : a)))
    } else {
      setItems((arr) => [
        ...arr,
        { ...data, id: Math.random().toString(36).slice(2) },
      ])
    }
    setMode("list")
  }

  if (mode === "add") {
    return (
      <AddressForm
        title="Add New Address"
        initial={emptyAddress}
      />
    )
  }
  if (typeof mode === "object" && mode.type === "edit") {
    const current = items.find((i) => i.id === mode.id)!
    return (
      <AddressForm
        title="Edit Address"
        initial={current}
      />
    )
  }

  return (
    <div className="overflow-x-hidden pb-[250px]">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((a) => (
          <AddressCard
            key={a.id}
            data={a}
            isDefault={a.id === defaultId}
            onSetDefault={() => setDefaultId(a.id)}
            onEdit={() => setMode({ type: "edit", id: a.id! })}
            onDelete={() => setItems((arr) => arr.filter((x) => x.id !== a.id))}
          />
        ))}
        <AddCard onAdd={() => setMode("add")} />
      </div>
    </div>
  )
}

export default Addresses
