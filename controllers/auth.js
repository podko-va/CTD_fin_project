const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')


const register = async (req, res) => {
    const user = await User.create({ ...req.body })
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ user: {name: user.name, secret: user.password }, token })
}

const login = async (req,res) => {
    const {email, password} = req.body
    if(!email || !password){
        throw new BadRequestError('please provide emaill and password')
    }

    const user  = await User.findOne({email})
    console.log(user)
    console.log(email)
    console.log(password)
    if (!user){
        throw new UnauthenticatedError('invalid Credentials')
    }
    //compare pass
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect){
        throw new UnauthenticatedError('invalid password')
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user:{name:user.name}, token})
}   

module.exports = {
    register,
    login,
}