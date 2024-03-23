import Message from "../../components/Message";
import Loader from "../../components/Loder";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">My Orders</h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-2">IMAGE</th>
                <th className="py-2">ID</th>
                <th className="py-2">DATE</th>
                <th className="py-2">TOTAL</th>
                <th className="py-2">DELIVERED</th>
                <th className="py-2"></th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="py-2">
                    <img
                      src={order.orderItems[0].image}
                      alt={order.user}
                      className="w-[6rem] mb-5"
                    />
                  </td>
                  <td className="py-2">{order._id}</td>
                  <td className="py-2">{order.createdAt.substring(0, 10)}</td>
                  <td className="py-2">DZD {order.totalPrice}</td>
                  <td className="py-2">
                    {order.isDelivered ? (
                      <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">
                        Completed
                      </p>
                    ) : (
                      <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full">
                        Pending
                      </p>
                    )}
                  </td>
                  <td className="py-2">
                    <Link to={`/order/${order._id}`}>
                      <button className="bg-purple-400 hover:bg-purple-900 text-white py-2 px-3 rounded">
                        View Details
                      </button>
                    </Link>
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

export default UserOrder;
