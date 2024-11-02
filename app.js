import express, { response } from 'express'
import { data } from './data.js'
import { Comments }  from './comments.js'
import mongoose from 'mongoose';
import PostModel from './models/PostSchema.js';
import UserModel from './models/UserSchema.js';
import bcrypt from 'bcryptjs';
import cors from 'cors';

const app = express();
//PORT
const PORT = 1900;

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors())

// Fake Link
// const DBURI = 'mongodb+srv://john:Johnwick@cluster0.tvanh.mongodb.net/'


// Real link
const DBURI = 'mongodb+srv://**********:***********@cluster0.iz89k.mongodb.net/'; 

mongoose.connect(DBURI);

mongoose.connection.on('connected', (res) => console.log('Mongodb Connected'))
mongoose.connection.on('error', (err) => console.log('error', err))


app.listen(PORT, ()=>{
    console.log('server is running')
});


app.get('/', (request, response)=>{
    response.send('server is running on /')
})


// Api and Data base for SignUp


app.post('/SignUp', async(req, res) => {
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

app.get('/getSign', async (req, res) => {
    const getData = await UserModel.find({})

    res.json({
        message:'Data get successful',
        data: getData,
    })


})



// Api for Login to Database

app.post('/login', async(req, res)=>{
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

  res.json({
    message: 'User Login successfully',
    status: true
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


// app.get('/food', (request, response) => {
//     response.json([{
//         id: 1,
//         name: 'Pizza',
//         price: 10.99,
//         desc: 'Very good test'
//     },
//     {
//         id: 2,
//         name: 'Burger',
//         price: 7.99,
//         desc: 'Really Good test'
//     },
//     {
//         id: 3,
//         name: 'Tacos',
//         price: 14.99,
//         desc: 'Very like test'
//     },]

// )
// })

app.get('/Comments', (request, response) =>{
    response.send(Comments)
})

// app.get('/products', (request, response) => {
//     response.send(data)
// })

