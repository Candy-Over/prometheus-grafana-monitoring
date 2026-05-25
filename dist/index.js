import "dotenv/config";
import express from "express";
const app = express();
const PORT = process.env.PORT || 8000;
app.get("/", (req, res) => {
    return res.send("Hello World");
});
app.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
});
//# sourceMappingURL=index.js.map