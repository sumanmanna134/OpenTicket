import mongoose from 'mongoose';
import { Password } from '../services/password';
//An interface that describe the properties that are
// required to create a new user

interface UserAttrs {
  name: string;
  phone: string;
  avatar: string;

  email: string;
  password: string;
}

//interface that describe the properties that a user model has

interface UserModel extends mongoose.Model<any> {
  //***** build call instead new User() again and again. *** important

  build(attrs: UserAttrs): UserDoc;
}

//An interface that describes the properties
//that a User document has

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String, // we refering actual constructor, hence we used "String" instead of "string"
      required: true,
    },
    phone: {
      type: String,
      default: null,
    },

    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

//bellow line will automatically generate createdAt & updatedAt fields
UserSchema.set('timestamps', true);

UserSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});
UserSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};
const User = mongoose.model<UserDoc, UserModel>('User', UserSchema);
export { User, UserDoc };
