import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

//stan = client. stan is the term that use in the documentation.
//The second argument is the client id
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);
  try {

    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20,
    });

  } catch (err) {
    console.error(err);
  }

  //LO QUE ESTÁ ABAJO LO COMENTE PORQUE ES LO MISMO QUE HACE EL OBJETO QUE INSTANCIAMOS, SÓLO QUE TENGO ANOTADO COSAS IMPORTANTES COMO BACK UP

  // //We need to send a plain string, we can not send an object
  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 20,
  // });

  // //The third argument (optional) is a callbak function which is trigger after that we publish the data
  // stan.publish('ticket:created', data, () => {
  //   console.log('Event published');
  // });
});
