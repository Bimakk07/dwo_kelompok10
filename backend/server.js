const express = require("express");
const cors = require("cors");

const purchaseRoutes = require("./routes/purchase");
const salesRoutes = require("./routes/sales");
const vendorRoutes = require("./routes/vendor");
const customerRoutes = require("./routes/customer");
const summaryRoutes = require("./routes/summary"); // tambahkan ini
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

//ROUTES
app.use("/api/auth", authRoutes); 
app.use("/api/purchase", purchaseRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/summary", summaryRoutes); // tambahkan ini

app.listen(5000, () => {
    console.log("Server berjalan di port 5000");
});
