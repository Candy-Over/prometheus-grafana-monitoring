import "dotenv/config";
import express from "express";
import { promMiddleware } from "./middleware/promMiddleware.js";
import client from "prom-client"


const app = express();
const PORT = process.env.PORT || 8000

// Promethious middleware
app.use(promMiddleware);

app.get("/", (req, res)=>{
    return res.send("Hello World");
});

app.get("/user/:id",(req, res)=>{
    return res.send(`User id: ${req.params.id}`)
})

app.get("/slow", async (req, res)=>{
    const time=Math.random()*1000
    await new Promise((r)=>setTimeout(r, (Math.random())*1000));
    return res.send(`Request process taken ${time}`)
});

app.get("/active", async (req, res) =>{
    await new Promise(r=>setTimeout(r, 1000));
    return res.send("Active request ended");
})



// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});


app.listen(PORT, ()=>{
    console.log(`Server started at port: ${PORT}`)
})

