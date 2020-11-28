var index= async (req,res,next)=>{
	res.send({
		msg:'管理员权限',
		status:0
	})
}

module.exports = {
	index
}