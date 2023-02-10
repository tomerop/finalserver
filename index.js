const express = require ('express');
const mongoose = require ('mongoose');
mongoose.set("strictQuery", true);
const cors = require("cors");
const logIn = require('./middlewares/auth');
const usersRouter = require('./routes/users')
const postsRouter = require('./routes/posts')
const groupsRouter = require('./routes/groups')
const eventsRouter=require('./routes/events')

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/ImpactStudio")
  .then(() => {
    console.log("connected");
  })
  .catch(() => {
    console.log("couldnt connect");
  });

// middlewares

  app.use(express.json());
  app.use(cors());
  // app.use(logIn(req,res,next))

// routes
app.use('/api/users',usersRouter);
app.use('/api/posts', postsRouter)
app.use('/api/groups',groupsRouter);
app.use('/api/events',eventsRouter);




const port = process.env.PORT || 3500; 
app.listen(port, () => console.log(`active on ${port}`))
