import mongoose, { Schema, model, type InferSchemaType } from 'mongoose'

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio.'],
      minlength: [2, 'El nombre debe tener al menos 2 caracteres.'],
      maxlength: [40, 'El nombre no puede superar los 40 caracteres.'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio.'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: [true, 'La contraseña protegida es obligatoria.'],
      select: false,
    },

    avatar: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

export type UserData = InferSchemaType<typeof userSchema>

const User = mongoose.models.User || model('User', userSchema)

export default User
