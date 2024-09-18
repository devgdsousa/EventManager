import { Router } from "express";
import { EventsController} from "../controllers/eventsController";
import { registerController } from "../controllers/registerController";
import { signinController } from "../controllers/signinController";
import { authMiddleware } from "../middlewares/auth";

const routes = Router();
const eventController = new EventsController();

// Auth
routes.post("/register", registerController);
routes.post("/signin", signinController);

// CRUD
routes.post("/events", authMiddleware, eventController.createEvent.bind(eventController));
routes.get("/events", authMiddleware, eventController.getEvents);
routes.get("/events/:id", authMiddleware, eventController.getEventById);
routes.delete("/events/:id", authMiddleware, eventController.deleteEvent);
routes.put("/events/:id", authMiddleware, eventController.updateEvent);

export default routes;
