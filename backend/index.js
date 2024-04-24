const express = require("express");
const mainRouter = require("./routes/index.js")
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(express.json());

//.use  is used to create middlewares or run middlewares before functions
app.use("/api/v1", mainRouter);

app.use("api/v2", v2Router);

app.listen(3000);
