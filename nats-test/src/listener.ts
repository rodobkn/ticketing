///<reference path="../node_modules/@types/node/index.d.ts"/>
import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

//The second argument is the client id
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  //This is for notify to NATS that this instance will be shutted down. Therefore NATS won't try to send more healthchecks or events to this instance.
  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit(); //This is to exit manually of this program
  });

  new TicketCreatedListener(stan).listen();



  //TODO LO QUE ESTA ABAJO ES PARA HACER LO MISMO QUE HACE NUESTRA CLASE QUE CREAMOS. LO DEJO PORQUE TENGO COMENTADO VARIAS COSAS SOBRE EL FUNCIONAMIENTO DE 'stan'

  // //We are setting up the options for a subscription
  // const options = stan
  //   .subscriptionOptions() //Indicate that we want to set up some subscription options
  //   .setManualAckMode(true) //Activamos la opción en la cual le tenemos que avisar al NATS que todo salió bien con el evento recibido. En caso contrario el NATS enviará el mismo evento 30 segundos después, ya sea a esta misma instancia, o otra instancia de este mismo archivo
  //   .setDeliverAllAvailable() //Cuando iniciamos la subscripción, NATS nos mandará todos los eventos que ya ocurrieron en el pasado (QUE NO ESTÁN MARCADOS COMO PROCESADOR si agregamos la opción 'setDurableName').
  //   .setDurableName('order-service') //This is a DURABLE SUSCRIPTION. Cuando la instancia vuelva a la vida, recibirá todos los eventos que no le llegaron mientras estaba muerta.

  // const subscription = stan.subscribe(
  //   'ticket:created', //First argument is the name of the channel subscribed
  //   'order-service-queue-group', //The second argument(optional) is the name of a queue group
  //   options //third optional argument, is some extra options attached to the subscription
  // );

  // subscription.on('message', (msg: Message) => {
  //   const data = msg.getData();

  //   if (typeof data === 'string') {
  //     console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
  //   }

  //   msg.ack(); //This is the way how we say to the NATS that we recieved suscesfully the event.
  // });
});

//The two lines below will be executed when we TERMinate the program or INTerrumpt the program. Therefore we will executed stan.close()
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
