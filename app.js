import express, { response } from 'express'
import { data } from './data.js'
import Foods from './foods.js'
import mongoose from 'mongoose';
import PostModel from './models/PostSchema.js';
import UserModel from './models/UserSchema.js';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import UserVerifyMiddle from './MiddleWare/UserVerify.js';



dotenv.config(); 
const app = express();
//PORT
const port = process.env.PORT;

// Real link
const DBURI = process.env.MONGODB_URI; 

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors())

// Fake Link
// const DBURI = 'mongodb+srv://topag44302:admin@cluster0.5zr0d.mongodb.net/'



mongoose.connect(DBURI);

mongoose.connection.on('connected', (res) => console.log('Mongodb Connected'))
mongoose.connection.on('error', (err) => console.log('error', err))


app.listen(port, ()=>{
    console.log('server is running')
});


app.get('/', (request, response)=>{
    response.send('server is running on /')
})


// Api and Data base for SignUp


app.post('/api/signup',async(req, res) => {
    const { firstName, lastName,  email, password } = req.body;

    if(!firstName || !lastName || !email || !password){
        res.json({
            message: 'required field are missing',
            status: false
        })
        return;
    }

    const emailExist = await UserModel.findOne({ email })
    if(emailExist !== null){
        res.json({
            message: 'Email already exist',
            status: false
        })
        return;
    }

    const hashPassword = await bcrypt.hash(password, 10)
    
    const userObj = {firstName, lastName,  email, password: hashPassword}

    const createUser = await UserModel.create(userObj)

    res.json({
        message: 'User created successfully',
        status: true
    })

})


// get signup Data

app.get('/getsign', UserVerifyMiddle ,async (req, res) => {
    const getData = await UserModel.find({})

    res.json({
        message:'Data get successful',
        data: getData,
    })


})



// Api for Login to Database

app.post('/login' ,async(req, res)=>{
    const { email, password } = req.body;
    
    if(!email || !password){
        res.json({
            message: 'required field are missing',
            status: false
        })
        return;
    }

    const emailExist = await UserModel.findOne({ email });

  if (!emailExist) {
    res.json({
      message: "Invalid email & password",
      status: false,
    });
    return;
  }

  const comparePassword = await bcrypt.compare(password, emailExist.password);

  if(!comparePassword) {
    res.json({
        message: "Invalid email & password",
        status: false,
      });
      return;
  }

  var token = jwt.sign({ email: emailExist.email, Password: emailExist.password }, process.env.JWT_SECRET_KEY);

  res.json({
    message: 'User Login successfully',
    status: true,
    response: token
})
})






// Api for Data base 

app.post('/createPost', async(req, res)=>{
    
    const {title, desc, postID} = req.body
    
    if(!title || !desc || !postID){
        res.json({
            message: "required filled missing",
            status: true
        })
        return;
    }
    
    const postObj = {
        title, desc, postID
    }
    
    const response = await PostModel.create(postObj)
    
    res.json({
        message: "Data create Successfully",
        // data: response
    })
})


// for update data to database

app.put('/updatePost', async (req, res) => {
    const {title, desc, postID} = req.body
   
    const updatePost = await PostModel.findByIdAndUpdate(postID, {title, desc})
    res.json({
        message: "Data update Successfully",
        data: updatePost
    })
    
})


// for deletePost to database

app.delete('/deletePost/:id', async(req, res)=>{
    const id = req.params.id;
    await PostModel.findByIdAndDelete(id);
    res.send("Data deleted successfully")

})


//for get data from data base

app.get('/getPost', async(req, res) => {
    const getData = await PostModel.find({})
    res.json({ 
        message: "Data get Successfully",
        data: getData
    })
    res.send('get Post')
})


// Api for practice

app.get('/foods', (request, response) =>{
    response.send(Foods)
})
