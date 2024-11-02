import jwt from 'jsonwebtoken';

const UserVerifyMiddle = (req, res, next) => {
    try{

        const token = req.headers.authorization.split(" ")[1]
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        
        if(decoded){
            next()
        }
    }
    catch{
        res.json({
            message: 'token invalid',
            status: false
        })
    }
}

export default UserVerifyMiddle;