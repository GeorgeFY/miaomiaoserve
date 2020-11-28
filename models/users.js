var mongoose = require('mongoose');
mongoose.set('useCreateIndex',true);

var connect = mongoose.createConnection("mongodb://yuan:123456@localhost:27017/miaomiao",{
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

var UserSchema = new mongoose.Schema({
	username : { type : String , required : true , index : { unique : true } },
	password : { type : String , required : true },
	email : { type : String , required : true , index : { unique : true } },
	date : { type : Date , default : Date.now() },
	isAdmin:{type:Boolean,default:false}
});

var UserModel = connect.model('user' , UserSchema);
UserModel.createIndexes();

var save = (data)=>{
	//console.log("data.........",data)
	var user = new UserModel(data);
	//console.log("user.........",data)
	//console.log(user)
	return user.save()
			.then(()=>{
				return true
			})
			.catch((err)=>{
				console.log(err)
				return false
			})
};

var findLogin = (data)=>{
	return UserModel.findOne(data)
}
var updatePassword = (email,password)=>{
	return UserModel.update({email},{$set:{password}})
			.then(()=>{
				return true
			})
			.catch((err)=>{
				console.log(err)
				return false
			})
}
module.exports = {
	save,
	findLogin,
	updatePassword
}
