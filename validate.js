const Joi = require('joi');
const jwt = require('jsonwebtoken');

const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(5).required(),
        email: Joi.string().max(255).required().email(),
        password: Joi.string().min(5).required()
    });

    return schema.validate(data)
}

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().max(255).required().email(),
        password: Joi.string().min(5).required()
    });
    return schema.validate(data)
}

const movieValidation = (data) => {
    const schema = Joi.object({
        _id: Joi.string().required(),
        title: Joi.string().required(),
        synopsis: Joi.string().required(),
        genre: Joi.string().required(),
        productionYear: Joi.string().required(),
        poster: Joi.string().required(),
    });
    return schema.validate(data)
}

const updatePasswordValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        currentPassword: Joi.string().required(),
        newPassword: Joi.string().min(5).required()
    });
    return schema.validate(data)
}

const tokenValidation = (data) => {
    try {
        const verify = jwt.verify(data, process.env.jwtSecret);
        return true;
    }
    catch (err) {
        return err.msg;
    }
}


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.movieValidation = movieValidation;
module.exports.updatePasswordValidation = updatePasswordValidation;
module.exports.tokenValidation = tokenValidation;