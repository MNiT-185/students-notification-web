const {check} = require('express-validator')

let loginValidator = [
    check('email')
    .exists().withMessage('Vui lòng cung cấp địa chỉ Email')
    .notEmpty().withMessage('Địa chỉ email không được để trông')
    .isEmail().withMessage('Email không hợp lệ'),
    check('password')
    .exists().withMessage('Vui lòng cung cấp password')
    .notEmpty().withMessage('Password không được để trông')
    .isLength({min: 8}).withMessage('Password tối thiểu 8 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,'Password không hợp lệ'),
]

module.exports = {
    loginValidator : loginValidator
}