//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose=require("mongoose");

const homeStartingContent = "Welcome to my Daily Journel page.You can write your daily Journel here";
const aboutContent = "This page helps you to add your Daily Journel";
const contactContent = "You can contact me by my Email";

const app = express();

mongoose.set("strictQuery",true);
const db="mongodb+srv://21je0110:21je0110@cluster0.dltlu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const connectDB = async () => {
  try {
    await mongoose.connect(db, { useNewUrlParser: true });
    console.log("MongoDB connected");
  } catch (err) {
    console.log(err.message);
    //exit process with failure
    process.exit(1);
  }
};
connectDB();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = new mongoose.Schema({
  title:String,
  content:String
});

const Post = mongoose.model("Post",postSchema);

app.get("/",function(req,res){
    Post.find({},function(err,foundposts){
      if(!err)res.render("home",{homeStartingContent:homeStartingContent,posts:foundposts});
    })
})



app.get("/contact",function(req,res){
  res.render("contact",{contactContent:contactContent});
})

app.get("/about",function(req,res){
  res.render("about",{aboutContent:aboutContent});
})


app.get("/compose",function(req,res){
  res.render("compose");
})

app.get("/posts/:postId",function(req,res){
  let query=req.params.postId;
  Post.findById(query,function(err,post){
    res.render("post",{title:post.title,content:post.content});
  })
})
app.post("/compose",function(req,res){

  const post = new Post({
    title:req.body.postTitle,
    content:req.body.postBody
  })

  post.save();

  res.redirect("/");
})





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
