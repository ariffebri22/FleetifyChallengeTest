const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const Router = require("./src/routers");
const helmet = require("helmet");

const port = process.env.PORT;
const app = express();

const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.status(200).json({ status: 200, message: "Server running" });
});

app.use("/api/v1", Router);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
