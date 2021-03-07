import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      // ms = miliseconds. For this reason we need to divide it by 1000
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft(); //We need to show inmediately how many seconds we have.
    const timerId = setInterval(findTimeLeft, 1000); //After 1000ms we will call the findTimeLeft function again and again.

    //This return inside useEffect is called when we stop showing the current component. Is a cleanUp function.
    return () => {
      //We need to finish the interval. Otherwise it will run for ever.
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      Time lef to pay: {timeLeft} seconds
      {/* We multiply by 100 the amount because stripe use cents, not dollars. */}
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51II3iLHRhoSZb2OfPIKlUOQrYWymdqHRAYTNyzUGIsh7obxXfSJmh5Xdyjm781Y70e2dBYfu1WGA002VZPBFpBng00LkhQCrwl"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  //We extract the value in [orderId] showed in the browser url
  const { orderId } = context.query;

  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
