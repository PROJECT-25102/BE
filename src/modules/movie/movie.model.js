import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    poster: { type: String, required: true },
    category: { type: [String], required: true },
    trailer: String,
    actor: { type: [String], required: true },
    director: { type: String, required: true },
    rating: { type: Number, default: 5 },
    ageRequire: {
      type: String,
      enum: ["P", "K", "C13", "C16", "C18"],
      default: "P",
    },
    duration: { type: Number, required: true },
    releaseDate: { type: Date, required: true },
    isFeatured: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
