const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')


// const register = async (req, res) => {
//     const user = await User.create({ ...req.body })
//     const token = user.createJWT();
//     res.status(StatusCodes.CREATED).json({ user: {name: user.name, secret: user.password }, token })
// }

const register = async (req, res) => {
    const { name, email, password, isPsychologist = false, isCoordinator = false, timezone = 'EDT', gender = 'unspecified' } = req.body;
    
    try {
        const user = await User.create({
            name,
            email,
            password,
            isPsychologist,
            isCoordinator,
            timezone,
            gender
        });
        
        const token = user.createJWT();
        
        res.status(StatusCodes.CREATED).json({
            user: {
                name: user.name,
                secret: user.password,
                isPsychologist: user.isPsychologist,
                isCoordinator: user.isCoordinator,
                timezone: user.timezone,
                gender: user.gender
            },
            token
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

const login = async (req,res) => {
    const {email, password} = req.body
    if(!email || !password){
        throw new BadRequestError('please provide emaill and password')
    }
    const user  = await User.findOne({email})
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
};

const decodeJWT = async (req,res) => {
    const { token } = req.body;
    const decodedUser = User.decodeJWT(token);
    if (decodedUser) {
           res.status(200).json({ userId: decodedUser.userId, name: decodedUser.name });
       } else {
           res.status(401).json({ message: 'Invalid or expired token.' });
       }
    };

module.exports = {
    register,
    login,
    decodeJWT    
}