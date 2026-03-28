const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();



app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://property-platform-six.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// 🔥 IMPORTANT (preflight fix)
app.options("*", cors());


app.use(express.json());



app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/brokers", require("./routes/brokerRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/investments", require("./routes/investmentRoutes"));
app.use("/api/leads", require("./routes/leadRoutes"));
app.use("/api/portfolio", require("./routes/portfolioRoutes"));
app.use("/api/commissions", require("./routes/commissionRoutes"));
app.use("/api", require("./routes/transactionRoutes"));

app.get("/test", (req, res) => {
  res.send("Working");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});