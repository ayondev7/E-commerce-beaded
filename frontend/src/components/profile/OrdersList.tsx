import React from "react";
import { orderStatuses, OrderStatus } from "@/constants/orderStatuses";
import { LuArrowRight } from "react-icons/lu";
import { useUserOrders } from "@/hooks/orderHooks";
import { Order } from "@/types";

interface OrderItem {
  id: string;
  date: string;
  status: OrderStatus;
  orderId: string;
}

const statusStyles: Record<OrderStatus, string> = {
  Pending: "text-yellow-600 bg-yellow-600/15",
  Shipped: "text-blue-600 bg-blue-600/15",
  Completed: "text-green-600 bg-green-600/15",
  Canceled: "text-red-600 bg-red-600/15",
};

type Props = {
  onViewDetails?: (orderId: string) => void;
};

const OrdersList: React.FC<Props> = ({ onViewDetails }) => {
  const [active, setActive] = React.useState<OrderStatus>("Pending");
  const { data: ordersData, isLoading, error } = useUserOrders();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const mapOrderStatus = (status: string): OrderStatus => {
    const statusMap: Record<string, OrderStatus> = {
      pending: "Pending",
      shipped: "Shipped", 
      delivered: "Completed",
      cancelled: "Canceled",
    };
    return statusMap[status] || "Pending";
  };

  const orders = ordersData?.orders || [];
  const filteredOrders = orders.filter(order => 
    mapOrderStatus(order.orderStatus) === active
  );

  const handleView = (orderId: string) => {
    onViewDetails?.(orderId);
  };

  const getOrderCount = (status: OrderStatus) => {
    return orders.filter(order => mapOrderStatus(order.orderStatus) === status).length;
  };

  if (isLoading) {
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
              <span className={`text-lg leading-[26px] ${active === s ? "text-white" : ""}`}>{s} (0)</span>
            </button>
          ))}
        </aside>
        <section className="bg-[#f8f8f8] text-lg leading-[26px] flex items-center justify-center">
          <div>Loading orders...</div>
        </section>
      </div>
    );
  }

  if (error) {
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
              <span className={`text-lg leading-[26px] ${active === s ? "text-white" : ""}`}>{s} (0)</span>
            </button>
          ))}
        </aside>
        <section className="bg-[#f8f8f8] text-lg leading-[26px] flex items-center justify-center">
          <div className="text-red-500">Error loading orders</div>
        </section>
      </div>
    );
  }

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
            <span className={`text-lg leading-[26px] ${active === s ? "text-white" : ""}`}>{s} ({getOrderCount(s)})</span>
          </button>
        ))}
      </aside>

      <section className="bg-[#f8f8f8] text-lg leading-[26px]">
        {filteredOrders.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-500">No {active.toLowerCase()} orders found</div>
          </div>
        ) : (
          <ul>
            {filteredOrders.map((order) => (
              <li key={order.id} className="px-6 pt-5 pb-[30px] flex w-full justify-between items-start">
                <div>
                  <div>
                    <div className="mb-3">
                      <span className="font-semibold text-[#9C9C9C]">
                        Order ID:
                      </span>{" "}
                      <span className="">#{order.id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="mb-[22px] inline-flex items-center gap-2 uppercase">
                      <span className="font-semibold text-[#9C9C9C]">
                        Order Status:
                      </span>
                      <span
                        className={`py-2 px-4 font-semibold ${
                          statusStyles[mapOrderStatus(order.orderStatus)]
                        }`}
                      >
                        {mapOrderStatus(order.orderStatus)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleView(order.id)}
                    className="flex justify-center gap-x-2.5 items-center uppercase text-[#00b5a6] hover:cursor-pointer"
                  >
                    <span>View Details </span><LuArrowRight className="size-4" />
                  </button>
                </div>
                <div className="text-[#7D7D7D] font-medium">{formatDate(order.createdAt)}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default OrdersList;
