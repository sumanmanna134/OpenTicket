import mongoose from 'mongoose';
//An interface that describe the properties that are
// required to create a new user

interface UserAttrs {
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
const UserSchema = new mongoose.Schema({
  email: {
    type: String, // we refering actual constructor, hence we used "String" instead of "string"
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};
const User = mongoose.model<UserDoc, UserModel>('User', UserSchema);
export { User };
