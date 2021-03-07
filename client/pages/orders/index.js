const OrderIndex = ({ orders }) => {
  return (
    <ul>
      {orders.map((order) => {
        return (
          <li key={order.id}>
            {order.ticket.title} - {order.status}
          </li>
        );
      })}
    </ul>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  //In the MS we are filtering the orders by the currentUser
  const { data } = await client.get('/api/orders');

  return { orders: data };
};

export default OrderIndex;
