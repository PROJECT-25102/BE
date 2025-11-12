import { Router } from "express";
import {
  createCategory,
  getAllCategory,
  getDetailCategory,
  updateCategory,
  updateStatusCategory,
} from "./category.controller.js";

const categoryRouter = Router();

categoryRouter.get("/", getAllCategory);
categoryRouter.get("/detail/:id", getDetailCategory);
categoryRouter.post("/", createCategory);
categoryRouter.patch("/update/:id", updateCategory);
categoryRouter.patch("/status/:id", updateStatusCategory);

export default categoryRouter;
