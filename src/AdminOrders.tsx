import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

interface CartItem {
  product: { id: number; title: string };
  quantity: number;
}

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  email?: string;
  note?: string;
}

interface Order {
  id: number;
  order_code: string;
  customerInfo: CustomerInfo;
  cartItems: CartItem[];
  totalPrice: number;
  created_at: string;
  status?: "pending" | "completed" | "cancelled";
}

// Map trạng thái sang tiếng Việt
const statusText: Record<Exclude<Order["status"], undefined>, string> = {
  pending: "Chờ xử lý",
  completed: "Thành công",
  cancelled: "Đã hủy",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [newOrder, setNewOrder] = useState<
    Omit<Order, "id" | "created_at" | "status">
  >({
    order_code: "",
    customerInfo: { name: "", phone: "", address: "" },
    cartItems: [],
    totalPrice: 0,
  });
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Lấy danh sách đơn hàng
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else if (data) {
      const formatted: Order[] = data.map((o: any) => ({
        id: o.id,
        order_code: o.order_code,
        customerInfo: {
          name: o.customer_name,
          phone: o.customer_phone,
          address: o.customer_address,
          email: o.email,
          note: o.note,
        },
        cartItems: o.items || [],
        totalPrice: o.total_price,
        created_at: o.created_at,
        status: o.status || "pending",
      }));
      setOrders(formatted);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Thêm đơn hàng
  const addOrder = async () => {
    if (!newOrder.order_code || !newOrder.customerInfo.name) {
      alert("Vui lòng nhập mã đơn và tên khách hàng.");
      return;
    }
    const { error } = await supabase.from("orders").insert([
      {
        order_code: newOrder.order_code,
        customer_name: newOrder.customerInfo.name,
        customer_phone: newOrder.customerInfo.phone,
        customer_address: newOrder.customerInfo.address,
        email: newOrder.customerInfo.email,
        note: newOrder.customerInfo.note,
        items: newOrder.cartItems,
        total_price: newOrder.totalPrice,
        status: "pending", // Mặc định là 'pending'
      },
    ]);
    if (error) console.error(error);
    else {
      setNewOrder({
        order_code: "",
        customerInfo: { name: "", phone: "", address: "" },
        cartItems: [],
        totalPrice: 0,
      });
      fetchOrders(); // Lấy lại danh sách đơn hàng mới
    }
  };

  // Cập nhật trạng thái đơn hàng
  const updateStatus = async (id: number, status: Order["status"]) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    } else {
      fetchOrders(); // Lấy lại danh sách đơn hàng sau khi cập nhật trạng thái
    }
  };

  // Sửa đơn hàng
  const editOrder = (order: Order) => {
    setEditingOrder(order);
    setNewOrder({
      order_code: order.order_code,
      customerInfo: { ...order.customerInfo },
      cartItems: order.cartItems,
      totalPrice: order.totalPrice,
    });
  };

  // Cập nhật đơn hàng sau khi sửa
  const updateOrder = async () => {
    if (!newOrder.order_code || !newOrder.customerInfo.name) {
      alert("Vui lòng nhập mã đơn và tên khách hàng.");
      return;
    }
    const { error } = await supabase
      .from("orders")
      .update({
        order_code: newOrder.order_code,
        customer_name: newOrder.customerInfo.name,
        customer_phone: newOrder.customerInfo.phone,
        customer_address: newOrder.customerInfo.address,
        email: newOrder.customerInfo.email,
        note: newOrder.customerInfo.note,
        items: newOrder.cartItems,
        total_price: newOrder.totalPrice,
        status: "pending", // Giữ trạng thái mặc định là 'pending' khi sửa
      })
      .eq("id", editingOrder?.id);

    if (error) console.error(error);
    else {
      setEditingOrder(null);
      setNewOrder({
        order_code: "",
        customerInfo: { name: "", phone: "", address: "" },
        cartItems: [],
        totalPrice: 0,
      });
      fetchOrders();
    }
  };

  // Xóa đơn hàng
  const deleteOrder = async (id: number) => {
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
    } else {
      fetchOrders(); // Lấy lại danh sách đơn hàng sau khi xóa
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: 20 }}>Quản lý đơn hàng</h2>

      {/* Form thêm/sửa đơn hàng */}
      <div
        style={{
          marginBottom: 30,
          padding: 15,
          border: "1px solid #ddd",
          borderRadius: 5,
          maxWidth: 800,
        }}
      >
        <h3 style={{ marginBottom: 10 }}>
          {editingOrder ? "Sửa đơn hàng" : "Thêm đơn hàng mới"}
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <input
            placeholder="Mã đơn hàng"
            value={newOrder.order_code}
            onChange={(e) =>
              setNewOrder({ ...newOrder, order_code: e.target.value })
            }
            style={{ flex: 1, padding: 8 }}
          />
          <input
            placeholder="Tên khách hàng"
            value={newOrder.customerInfo.name}
            onChange={(e) =>
              setNewOrder({
                ...newOrder,
                customerInfo: {
                  ...newOrder.customerInfo,
                  name: e.target.value,
                },
              })
            }
            style={{ flex: 1, padding: 8 }}
          />
          <input
            placeholder="Số điện thoại"
            value={newOrder.customerInfo.phone}
            onChange={(e) =>
              setNewOrder({
                ...newOrder,
                customerInfo: {
                  ...newOrder.customerInfo,
                  phone: e.target.value,
                },
              })
            }
            style={{ flex: 1, padding: 8 }}
          />
          <input
            placeholder="Địa chỉ"
            value={newOrder.customerInfo.address}
            onChange={(e) =>
              setNewOrder({
                ...newOrder,
                customerInfo: {
                  ...newOrder.customerInfo,
                  address: e.target.value,
                },
              })
            }
            style={{ flex: 1, padding: 8 }}
          />
          <input
            type="number"
            placeholder="Tổng tiền"
            value={newOrder.totalPrice}
            onChange={(e) =>
              setNewOrder({ ...newOrder, totalPrice: Number(e.target.value) })
            }
            style={{ flex: 1, padding: 8 }}
          />
          <button
            onClick={editingOrder ? updateOrder : addOrder}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              marginTop: 10,
            }}
          >
            {editingOrder ? "Cập nhật" : "Thêm"}
          </button>
        </div>
      </div>

      {/* Bảng đơn hàng */}
      {orders.length === 0 ? (
        <p>Chưa có đơn hàng nào</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}
          >
            <thead>
              <tr style={{ background: "#f4f4f4", textAlign: "left" }}>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
                  ID
                </th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
                  Mã đơn
                </th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
                  Khách hàng
                </th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
                  SĐT
                </th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
                  Địa chỉ
                </th>
                <th
                  style={{
                    padding: 8,
                    borderBottom: "1px solid #ddd",
                    textAlign: "right",
                  }}
                >
                  Tổng tiền
                </th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
                  Ngày đặt
                </th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
                  Trạng thái
                </th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: 8 }}>{order.id}</td>
                  <td style={{ padding: 8 }}>{order.order_code}</td>
                  <td style={{ padding: 8 }}>{order.customerInfo.name}</td>
                  <td style={{ padding: 8 }}>{order.customerInfo.phone}</td>
                  <td style={{ padding: 8 }}>{order.customerInfo.address}</td>
                  <td style={{ padding: 8, textAlign: "right" }}>
                    {order.totalPrice.toLocaleString()} VND
                  </td>
                  <td style={{ padding: 8 }}>
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: 8 }}>
                    {statusText[order.status || "pending"]}
                  </td>
                  <td style={{ padding: 8, display: "flex", gap: 5 }}>
                    <button
                      onClick={() => updateStatus(order.id, "completed")}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                      }}
                    >
                      Hoàn thành
                    </button>
                    <button
                      onClick={() => updateStatus(order.id, "cancelled")}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                      }}
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => editOrder(order)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#777",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => deleteOrder(order.id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#777",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
