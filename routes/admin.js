var express = require('express');
var adminController = require("../controllers/admin.js")
var router = express.Router();

//判断是否为管理员

router.use((req,res,next)=>{
	if(req.session.username && req.session.isAdmin){
		next()
	}else{
		res.send({
			msg:'不是管理员',
			status:-1
		})
	}
})
/* GET admin listing. */
router.get('/', adminController.index);

module.exports = router;