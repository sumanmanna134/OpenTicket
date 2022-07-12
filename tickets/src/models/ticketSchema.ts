import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

//ticketAttrs Interface
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
  device: string;
  ip: string | string[];
}
interface TicketModel extends mongoose.Model<any> {
  build(attrs: TicketAttrs): TicketDoc;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

const TicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      default: 0.0,
      required: true,
    },
    userId: {
      type: String,
    },
    device: {
      type: String,
    },
    ip: {
      type: String,
      default: null,
    },
    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, retEle) {
        retEle.ticketId = retEle._id;
        delete retEle._id;
      },
    },
  }
);
TicketSchema.set('versionKey', 'version');
TicketSchema.plugin(updateIfCurrentPlugin);

TicketSchema.set('timestamps', true);
TicketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};
const Ticket = mongoose.model<TicketDoc, TicketModel>('tickets', TicketSchema);

export { Ticket, TicketDoc };
