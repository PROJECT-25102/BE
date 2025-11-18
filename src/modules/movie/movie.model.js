import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    poster: { type: String, required: true },
    category: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    },
    statusRelease: {
      type: String,
      enum: ["upcoming", "nowShowing", "released"],
      default: "upcoming",
    },
    trailer: String,
    actor: { type: [String], required: true },
    director: { type: String, required: true },
    rating: { type: Number, default: 5 },
    ageRequire: {
      type: String,
      enum: ["P", "K", "C13", "C16", "C18"],
      default: "P",
    },
    country: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    subLanguage: {
      type: String,
    },
    duration: { type: Number, required: true },
    releaseDate: { type: Date, required: true },
    endDate: {
      type: Date,
      required: true,
    },
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
