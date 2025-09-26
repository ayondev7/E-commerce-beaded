import React from "react";
import { orderStatuses, OrderStatus } from "@/constants/orderStatuses";
import { LuArrowRight } from "react-icons/lu";

interface OrderItem {
  id: string;
  date: string;
  status: OrderStatus;
}

const statusStyles: Record<OrderStatus, string> = {
  Pending: "text-yellow-600 bg-yellow-600/15",
  Shipped: "text-blue-600 bg-blue-600/15",
  Completed: "text-green-600 bg-green-600/15",
  Canceled: "text-red-600 bg-red-600/15",
};

type Props = {
  onViewDetails?: (details: {
    id: string;
    date: string;
    status: OrderStatus;
    items: Array<{ id: string; name: string; image: string; qty: number; price: number }>;

    deliveryFee: number;
    discount: number;
    address: string;
    notes?: string;
  }) => void;
};

const OrdersList: React.FC<Props> = ({ onViewDetails }) => {
  const [active, setActive] = React.useState<OrderStatus>("Pending");

  const orders: OrderItem[] = Array.from({ length: 3 }, (_, i) => ({
    id: `#VD0694${20 + i}`,
    date: "29th March, 2022",
    status: active,
  }));

  const handleView = (o: OrderItem) => {
    const sampleItems = [
      {
        id: "1",
        name: "FLOWER CHILD BARBIE BRACELET",
        image: "/public/home/categories/1.png".replace("/public", ""),
        qty: 1,
        price: 599,
      },
      {
        id: "2",
        name: "FLOWER CHILD BARBIE BRACELET",
        image: "/public/home/categories/1.png".replace("/public", ""),
        qty: 1,
        price: 599,
      },
      {
        id: "3",
        name: "FLOWER CHILD BARBIE BRACELET",
        image: "/public/home/categories/1.png".replace("/public", ""),
        qty: 1,
        price: 599,
      },
      {
        id: "4",
        name: "FLOWER CHILD BARBIE BRACELET",
        image: "/public/home/categories/1.png".replace("/public", ""),
        qty: 1,
        price: 599,
      },
      {
        id: "5",
        name: "FLOWER CHILD BARBIE BRACELET",
        image: "/public/home/categories/1.png".replace("/public", ""),
        qty: 1,
        price: 599,
      },
      {
        id: "6",
        name: "FLOWER CHILD BARBIE BRACELET",
        image: "/public/home/categories/1.png".replace("/public", ""),
        qty: 1,
        price: 599,
      },
    ];

    onViewDetails?.({
      id: o.id,
      date: o.date,
      status: o.status,
      items: sampleItems,
      deliveryFee: 60,
      discount: 100,
      address: "H-54, R-8, Niketan, Gulshan,\nDhaka",
      notes: undefined,
    });
  };

  return (
    <div className="grid grid-cols-[20%_80%]">
      <aside className="border border-[#D9D9D9] bg-[#f8f8f8] flex flex-col justify-center gap-y-5">
        {orderStatuses.map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={`flex w-full items-center hover:cursor-pointer justify-center px-[17px] py-1.5 ${
              active === s
                ? "bg-[#00b5a6] text-white font-semibold"
                : "text-[#1E1E1E]"
            }`}
          >
            <span className={`text-lg leading-[26px] ${active === s ? "text-white" : ""}`}>{s} (3)</span>
          </button>
        ))}
      </aside>

      <section className="bg-[#f8f8f8] text-lg leading-[26px]">
        <ul>
          {orders.map((o) => (
            <li key={o.id} className="px-6 pt-5 pb-[30px] flex w-full justify-between items-start">
              <div>
                <div>
                  <div className="mb-3">
                    <span className="font-semibold text-[#9C9C9C]">
                      {" "}
                      Order ID:
                    </span>{" "}
                    <span className="">{o.id}</span>
                  </div>
                  <div className="mb-[22px] inline-flex items-center gap-2  uppercase">
                    <span className="font-semibold text-[#9C9C9C]">
                      Order Status:
                    </span>
                    <span
                      className={`py-2 px-4 font-semibold ${
                        statusStyles[o.status]
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleView(o)}
                  className="flex justify-center gap-x-2.5 items-center uppercase text-[#00b5a6] hover:cursor-pointer"
                >
                  <span>View Details </span><LuArrowRight className="size-4" />
                </button>
              </div>
              <div className=" text-[#7D7D7D] font-medium">{o.date}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default OrdersList;
