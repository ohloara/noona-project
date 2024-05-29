const User = require("../model/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userController = {};

userController.createUser = async (req, res)=>{
    try{
        const {email, name, password} = req.body;
        const user = await User.findOne({email});
        if(user){
            throw new Error('이미 가입이 된 유저입니다.');
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        const newUser = new User({email,name,password:hash});
        await newUser.save();
        res.status(200).json({status:"success"});
    }catch(err){
        res.status(400).json({status:"fail", err:err.message});
    }
}

userController.loginWithEmail=async (req,res)=>{
    try{
        const{email,password} = req.body;
        const user = await User.findOne({email}, "-createdAt -updatedAt -__v");
        if(user){
            const isMach = bcrypt.compareSync(password, user.password);
            if(isMach){
                const token = user.generateToken();
                return res.status(200).json({status: "success", user, token});
            }
        }
        throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
    }catch(err){
        res.status(400).json({status: "fail", err:err.message});
    }
}

userController.getUser = async(req, res)=>{
    try{
        const {userId} = req;
        const user = await User.findById(userId);
        if(!user){
            console.log('error!!!');
            throw new Error("can not find user");
        }
        res.status(200).json({status:"sucess", user});
    }catch(err){
        res.status(400).json({status: "fail!!", err:err.message});
    }
}

module.exports = userController;