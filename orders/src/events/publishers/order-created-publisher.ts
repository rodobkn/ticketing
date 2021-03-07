import { Publisher, OrderCreatedEvent, Subjects } from '@rmltickets/common'; 

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
