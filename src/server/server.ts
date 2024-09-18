import express from "express";
import routes from "../routes/eventsRoutes"
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors());

app.use(routes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
