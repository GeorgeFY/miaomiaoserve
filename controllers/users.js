var {Email,userHead} = require("../untils/config.js")
var UserModel = require("../models/users.js")
var fs =require('fs')
var url = require('url')
var { setCrypto,createVerify } = require('../untils/base.js')
var login = async(req,res,next)=>{
	var {username,password,verifyImg} = req.body;
	//console.log(verifyImg)
	//console.log(req.session.verifyImg)
	if(verifyImg !== req.session.verifyImg){
		res.send({
			msg:"验证码验证失败",
			status:-3
		})
		return
	}
	var result = await UserModel.findLogin({
		username,
		password:setCrypto(password)
	})
	if(result){
		req.session.username = username
		req.session.isAdmin = result.isAdmin
		req.session.HeadPic = result.HeadPic 
		if(result.isFreeze){
			res.send({
				msg:"账号已冻结",
				status:-2
			})
		}else{
			res.send({
				msg:"登入成功",
				status:0
			})
		}
		
	}else{
		res.send({
			msg:"登入失败",
			status:-1
		})
	}
}

var register = async(req,res,next)=>{
	var {username, password, email,verify} = req.body;
	/* console.log("username is yuan :",username)
	console.log("password is yuan :",password)
	console.log("email is yuan :",email)
	console.log("email is yuan :",req.session.email)
	console.log("verify is yuan :",req.session.verify) */
	if( email !== req.session.email || verify !== req.session.verify ){
		res.send({
			msg : '验证码错误',
			status : -1
		});
		return;
	}
	if((Email.time - req.session.time)/1000 > 60){
		res.send({
			msg:"验证码已过期",
			status:-3
		})
		return;
	}
	var result = await UserModel.save({
		username,
		password: setCrypto(password),
		email
	})
	console.log("yuan result",result)
	if(result){
		res.send({
			msg:"注册成功",
			status:0
		})
	}else{
		res.send({
			msg:"注册失败",
			status:-2
		})
	}
}

var verify = async(req,res,next)=>{
	/* res.send({
		msg:"测试",
		status:0
	}) */
	var email = req.query.email;
	var verify= Email.verify;
	
	req.session.verify = verify;
	req.session.email = email;
	req.session.time = Email.time;
	
	console.log("req.session.verify",req.session.verify)
	console.log("req.session.email",req.session.email)
	
	var info = await Email.transporter.sendMail({
	    from: '袁方 466912902@qq.com', // sender address
	    to: email, // list of receivers
	    subject: "袁方测试邮箱验证码", // Subject line
	    text: "验证码："+verify, // plain text body
	},(err)=>{
		if(!err){
			res.send({
				msg:"验证码发送成功",
				status:0
			})
		}else{
			res.send({
				msg:"验证码发送失败",
				status:-1
			})
		}
	});
}

var logout = async(req,res,next)=>{
	req.session.username = ''
	res.send({
		mag:"退出成功",
		status:0
	})
}

var getUser = async(req,res,next)=>{
	if(req.session.username){
		res.send({
			msg:"获取用户信息",
			status:0,
			data:{
				username:req.session.username,
				isAdmin:req.session.isAdmin,
				HeadPic :req.session.HeadPic
			}
		})
	}else{
		res.send({
			msg:"获取用户信息失败",
			status:-1
		})
	}
}

var findPassword = async(req,res,next)=>{
	var {email,password,verify} = req.body;
	if(email === req.session.email && verify === req.session.verify){
		var result = UserModel.updatePassword(email,setCrypto(password))
		if(result){
			res.send({
				msg:"密码修改成功",
				status:0
			})
		}else{
			res.send({
				msg:"密码修改失败",
				status:-2
			})
		}
	}else{
		res.send({
			msg:"验证码错误",
			status:-1
		})
	}
	
}

var verifyImg = async(req,res,next)=>{
	var result = await createVerify(req,res);
	if(result){
		res.send(result)
		console.log(result,"yuanfang")
	}
}

var uploadUserHead = async(req,res,next)=>{
	//console.log(req.file);
	await fs.rename('public/uploads/' + req.file.filename,'public/uploads/' +req.session.username +'.jpg',err=>{
		if(err){
			console.log('重命名失败',err);
		}else{
			console.log('重命名成功');
		}
	})
	var result = await UserModel.updateUserHead(req.session.username,url.resolve(userHead.baseUrl,req.session.username + '.jpg'))
	if(result){
		res.send({
			msg:'头像上传成功',
			status:0,
			data:{
				HeadPic:url.resolve(userHead.baseUrl,req.session.username + '.jpg')
			}
		})
	}else{
		res.send({
			msg:'头像上传失败',
			status:-1
		})
	}
}

module.exports = {
	login,
	register,
	verify,
	logout,
	getUser,
	findPassword,
	verifyImg,
	uploadUserHead
}