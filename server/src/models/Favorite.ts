import mongoose, { Schema, model, type InferSchemaType } from 'mongoose'

const favoriteSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El propietario es obligatorio.'],
      index: true,
    },

    characterId: {
      type: Number,
      required: [true, 'El ID del personaje es obligatorio.'],
      min: [1, 'El ID del personaje debe ser válido.'],
    },

    name: {
      type: String,
      required: [true, 'El nombre del personaje es obligatorio.'],
      trim: true,
    },

    image: {
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

// Evita que un usuario guarde dos veces al mismo personaje.
favoriteSchema.index(
  { owner: 1, characterId: 1 },
  { unique: true },
)

export type FavoriteData = InferSchemaType<typeof favoriteSchema>

const Favorite =
  mongoose.models.Favorite || model('Favorite', favoriteSchema)

export default Favorite
