
const express = require("express");
const { Users, validateUser } = require("../models/users");
const router = express.Router();
const auth = require("../middlewares/auth");


 router.get("/:userId", async (req, res) => { //all
  let user= await Users.findOne({_id:req.params.userId})
  if(!user.isTeacher) return res.status(400).send('no access')
  if (user.isTeacher){
   const allUsers = await Users.find().populate('groups');
   res.send(allUsers);
 }});

router.get("/byId/:userId/:id",auth, async (req, res) => {  //by name
  let user= await Users.findOne({_id:req.params.userId})
  if(!user.isTeacher) return res.status(400).send('no access')
  if (user.isTeacher){
    let user = await Users.findOne({ _id: req.params.id }).populate('groups');
    if (!user) return res.status(400).send("User not exist")
    else res.status(200).send(user)
}});

router.get("/byGroup/:userId/:group", async (req, res) => {  //by name
  let user= await Users.findOne({_id:req.params.userId})
  if(!user.isTeacher) return res.status(400).send('no access')
  if (user.isTeacher){
    let user = await Users.findOne( {groups:{groupName:req.params.group}}).populate('groups');
    if (!user) return res.status(400).send("Group not exist")
    else res.status(200).send(user)
}});


router.post('/:userId', async (req,res)=>{ //new user //autg
  let user= await Users.findOne({_id:req.params.userId})
  if(!user.isTeacher) return res.status(400).send('no access')
  if (user.isTeacher){
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        let user = await Users.findOne({ email: req.body.email }).populate('groups');
        if (user) return res.status(400).send("User already exsist ");
        user = new Users(req.body);
        try {
          user = await user.save();
          res.status(200).send('succsess')
        } catch (err) {
          res.status(500).send("somethong went wrong");
        }
        console.log(user);
}})


router.patch('/:userId/:id',auth,async (req,res)=>{ //change details by object id
  let user= await Users.findOne({_id:req.params.userId})
  if(!user.isTeacher) return res.status(400).send('no access')
  if (user.isTeacher){
let id=req.params.id
const filter = {_id:id}
const update =  req.body ;

try {
    let user = await Users.findOneAndUpdate(filter, update, {
        new: true
      }).populate('groups');
      res.status(200).send(user)
  } catch (err) {
    res.status(500).send("somethong went wrong");
  }
}})

module.exports = router;