var {Email} = require("../untils/config.js")
var UserModel = require("../models/users.js")
var login = async(req,res,next)=>{
	var {username,password} = req.body;
	var result = await UserModel.findLogin({
		username,
		password
	})
	if(result){
		req.session.username = username
		req.session.isAdmin = result.isAdmin
		res.send({
			msg:"登入成功",
			status:0
		})
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
	var result = await UserModel.save({
		username,
		password,
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
				isAdmin:req.session.isAdmin
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
		var result = UserModel.updatePassword(email,password)
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

module.exports = {
	login,
	register,
	verify,
	logout,
	getUser,
	findPassword
}