import React from "react"

interface OrderItem {
  id: string
  date: string
  status: "Processing" | "Shipped" | "Completed" | "Canceled"
}

const statuses: OrderItem["status"][] = ["Processing", "Shipped", "Completed", "Canceled"]

const OrdersList: React.FC = () => {
  const [active, setActive] = React.useState<OrderItem["status"]>("Processing")
  const orders: OrderItem[] = new Array(3).fill(null).map((_, i) => ({ id: `#VD0694${20 + i}`, date: "29th March, 2022", status: active }))
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 md:grid-cols-[200px_1fr]">
      <aside className="rounded-md border">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm ${active === s ? "border-l-2 border-[#00B5A5] bg-[#00B5A5]/5 text-[#00B5A5]" : "text-[#6D6D6D]"}`}
          >
            <span>{s}</span>
            <span className="rounded bg-black/10 px-2 text-xs">3</span>
          </button>
        ))}
      </aside>
      <section className="rounded-md border p-4">
        <ul className="divide-y">
          {orders.map((o) => (
            <li key={o.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <div className="text-sm">Order ID: <span className="font-medium">{o.id}</span></div>
                <div className="mt-1 inline-flex items-center gap-2 text-xs uppercase">
                  <span className="text-[#6D6D6D]">Order Status:</span>
                  <span className="rounded bg-yellow-100 px-2 py-0.5 text-yellow-700">Pending</span>
                </div>
              </div>
              <div className="text-sm text-[#6D6D6D]">{o.date}</div>
              <button className="text-sm uppercase">View Details →</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default OrdersList
