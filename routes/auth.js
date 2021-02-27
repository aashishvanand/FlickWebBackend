const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation, updatePasswordValidation } = require('../validate');
const Login = require('../model/Login');

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body)
    if (error) return res.status(428).json({ error: true, message: error.details[0].message });

    const checkEmail = await User.findOne({ email: req.body.email });
    if (checkEmail) return res.status(409).json({ error: true, message: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt)

    const reqUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: password
    })
    try {
        const savedUser = await reqUser.save();
        res.json({ user: savedUser._id });
    } catch (err) {
        res.status(400).send(err);
    }
})

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body)
    if (error) return res.status(428).json({ error: true, message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ error: true, message: 'Email does not exists' });

    const validatePassword = await bcrypt.compare(req.body.password, user.password);
    if (!validatePassword) return res.status(401).json({ error: true, message: 'Wrong Password' });

    const token = jwt.sign({ name: user.name }, process.env.jwtSecret)

    const loginToken = new Login({
        userID: user._id,
        token: token,
        loginTime: new Date()
    })
    try {
        const savedLoginToken = await loginToken.save();
    } catch (err) {
        res.status(400).send(err);
    }

    res.header('token', token);
    res.header('Access-Control-Expose-Headers', 'token')
    res.json({ error: false, message: 'Success', user: user.name });
})

router.post('/validateUserToken', async (req, res) => {
    const jwt_regex = /^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+/=]*)/;
    if (!jwt_regex.exec(req.body.token)) return res.json({ error: true, message: 'Invalid Token' });

    const user = await User.findOne({ name: req.body.user });
    if (!user) return res.status(401).json({ error: true, message: 'User does not exists' });

    const login = await Login.findOne({ userID: user._id, token: req.body.token });
    if (!login) return res.status(401).json({ error: true, message: 'Token does not exists' });

    res.json({ error: false, message: 'Success' });
})

router.post('/changePassword', async (req, res) => {
    const { error } = updatePasswordValidation(req.body)
    if (error) return res.status(428).json({ error: true, message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ error: true, message: 'Email does not exists' });

    const validatePassword = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!validatePassword) return res.status(401).json({ error: true, message: 'Wrong Old Password' });

    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(req.body.newPassword, salt);

    try {
        const updatePassword = await User.findOneAndUpdate({
            email: req.body.email 
        }, { password: newPassword });
    } catch (err) {
        res.status(400).send(err);
    }
    
    res.json({ error: false, message: 'Success' });
})

module.exports = router;