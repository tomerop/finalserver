const express = require("express");
const { Posts, validatePost } = require("../models/posts");
const {Comment,validateComment}=require('../models/comments')
const {Users}=require('../models/users')
const router = express.Router();
const auth = require("../middlewares/auth");

router.get('/',auth,async (req,res)=>{ //all
    const allPost = await Posts.find().populate('user').populate('group').populate({path:'comments',populate:{path:'user',model:'Users'}});
    res.send(allPost);
})

router.get('/:group',auth,async(req,res)=>{
    const allGroupPosts=await Posts.findOne({ group:{groupName: req.params.group} }).populate('user').populate('group').populate({path:'comments',populate:{path:'user',model:'Users'}})
    res.send(allGroupPosts);
})


router.post('/:userId',async(req,res)=>{//new post
  // let user= await Users.findOne({_id:req.params.userId})
  // if(!user.isTeacher) return res.status(400).send('no access')
  // if (user.isTeacher){
        // const { error } = validatePost(req.body);
        // if (error) return res.status(400).send(error.details[0].message);
        // let post = new Posts(req.body);
        // try {
        //   post = await post.save();
        // } catch (err) {
        //   res.status(500).send("somethong went wrong");
        // }
        // console.log(post);

})
router.patch('/addcomment/:postid',auth,async(req,res)=>{//add comment by postObjectid
  const {error}=validateComment(req.body)
  if (error) return res.status(400).send('comment not valid')
  let comment=new Comment(req.body)
  comment=await comment.save()
  try {
    let post=await Posts.findById(req.params.postid)
    post.comments=[...post.comments,comment['_id']]
    post= await post.save()
  } catch (error) {
    res.status(500).send('cannot add comment')
  }
})
router.patch('/deleteComment/:userId/:postid/:commentid',auth,async(req,res)=>{//delete comment by postObjectid
  let post=await  Posts.findById(req.params.postid)
  
  let comments=post.comments//מערך אובייקטים תגובות של הפוסט
  let theComment = comments.filter(singleCom => {
    return singleCom['_id'] === req.params.commentid
  })// אובייקט של התגובה הספציפית
  let theUser=await Users.findById(req.params.userId)
  if ((theComment.user[_id]==req.params.userId)||(theUser.isTeacher)){
  try {
    comments = comments.filter(singleCom => {
      return singleCom['_id'] !== req.params.commentid
    })
    post.comments=comments
    post=await post.save()
  } catch (error) {
    res.status(500).send('cannot delete comment')
  }
}else res.status(400).send('access denied')})
//protected toute

router.delete('/:userId/:postid',auth,async (req,res)=>{ //delete by post objectId
  let user= await Users.findOne({_id:req.params.userId})
  if(!user.isTeacher) return res.status(400).send('no access')
  if (user.isTeacher){
    const filter = {_id:req.params.postid}
    try {
        let post = await Posts.findOneAndDelete(filter);
          res.status(200).send(post+ '  deleted')
      } catch (err) {
        res.status(500).send("somethong went wrong");
      }
    }})

module.exports = router;