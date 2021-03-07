import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from '@rmltickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    // Idealmente se debería publicar un evento de caracter: order-updated
    // o algo así, cada vez que se modifica el main resource del microservicio
    // pero para ahorrar tiempo no lo hizo Stephen. Además cuando una orden ya está
    // completada, en nuestra app no hay nada más que hacer.

    msg.ack();
  }
}

