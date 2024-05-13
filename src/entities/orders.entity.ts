import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Users } from './users.entity';
import { OrderDetails } from './orderdetails.entity';

@Entity({
  name: 'orders',
})
export class Orders {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date')
  date: Date;

  @ManyToOne(() => Users, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @OneToOne(() => OrderDetails, (orderDetails) => orderDetails.order)
  @JoinColumn()
  orderDetails: OrderDetails;
}
