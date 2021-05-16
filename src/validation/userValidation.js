const {check} = require('express-validator')

let updatePassword = [
    check("password","Mật khẩu không chính xác")
    .isLength({min:6}),
    check("newPassword","Mật khẩu mới chưa hợp lệ")
    .isLength({min:6}),
    check("confirmPassword","Xác nhận mật khẩu chưa chính xác")
    .custom((value,{req})=>{
        return value === req.body.newPassword
    })
]

module.exports ={
    updatePassword : updatePassword
} 