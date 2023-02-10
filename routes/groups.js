const express = require("express");
const { Groups, validateGroup } = require("../models/group");
const router = express.Router();
const auth = require("../middlewares/auth");
const { Users } = require("../models/users");

router.get('/',async (req,res)=>{ //all
    const allGroups = await Groups.find();
    res.send(allGroups);
})

router.post('/:userId' ,auth,async(req,res)=>{ //post
  let user= await Users.findOne({_id:req.params.userId})
  if(!user.isTeacher) return res.status(400).send('no access')
  if (user.isTeacher){
    const { error } = validateGroup(req.body);
    if (error) return res.status(400).send('hi');
  
    let group = await Groups.findOne({ groupName: req.body.groupName });
    if (group) return res.status(400).send("group already exsist ");
    group = new Groups(req.body);
    try {
      group = await group.save();
      res.status(200).send(group)
    } catch (err) {
      res.status(500).send("somethong went wrong");
    }
    console.log(group)};
})

router.delete('/:userId',auth,async (req,res)=>{ //delete by name
  let user= await Users.findOne({_id:req.params.userId})
  if(!user.isTeacher) return res.status(400).send('no access')
  if (user.isTeacher){
    let groupName=req.body.groupName
    const filter = {groupName:groupName}
    
    try {
        let group = await Groups.findOneAndDelete(filter);
          res.status(200).send(group+ '  deleted')
      } catch (err) {
        res.status(500).send("somethong went wrong");
      }
    }})
module.exports = router;