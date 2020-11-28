const nodemailer = require('nodemailer');
/* var Mongoose = {
	url : 'mongodb://yuan:123456@localhost:27017/miaomiao',
	connect(){
		mongoose.createConnection(this.url,{
			useNewUrlParser:true},(err)=>{
				if(err){
					console.log('--------------')
					console.log('数据库链接失败',err)
					console.log('--------------')
					return;
				}else{
					console.log('数据库链接成功')
					//db.close()
				}
				
			})
	}
} */

var Email = {
	config:{
		host: "smtp.qq.com",
		port: 587,
		auth: {
		    user: "466912902@qq.com", // generated ethereal user
		    pass: "tnijkztghdbocaeb", // generated ethereal password
		}
	},
	get transporter(){
		return nodemailer.createTransport(this.config);
	},
	get verify(){
		return Math.random().toString().substring(2,6);
	},
	get time(){
		return Date.now();
	}
}
module.exports = {
	/* Mongoose, */
	Email
}