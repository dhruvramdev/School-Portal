const generateToken = require("../../config/token").generateToken;
var School = require('../../model/user').school;
var Teacher = require('../../model/user').teacher;
var Student = require('../../model/user').student;


module.exports = {

    schoolSignup: function (req, res, next) {

        var email = req.body.email;

        School.findOne({'email': email}, function (err, user) {
            if (err) {
                return next(err);
            }
            if (user) {
                return next(new Error("User Already Exists"));
            }
            if (req.body.password != req.body.confirmpassword) {
                return next(new Error("Confirm password is not equal to password"));
            }
            var newUser = new School();
            newUser.typeOf = 'School';
            newUser.name = req.body.name;
            newUser.email = req.body.email;
            newUser.password = newUser.encryptPassword(req.body.password);
            newUser.save(function (err) {
                if (err) return next(err);

                return {
                    success: true,
                    data: newUser,
                    token: generateToken(newUser, 'School')
                };
            });
        });
    },

    schoolLogin: function (req, res, next) {

        let email = req.body.email;

        School.findOne({'email': email}, function (err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(new Error("User Email Not Found"));
            }
            if (!user.validPassword(req.body.password)) {
                return next(new Error("Incorrect Password"));
            }

            return {
                success: true,
                data: user,
                token: generateToken(user, 'School')

            };

        });
    },

    studentLogin: (req, res, next) => {

        let email = req.body.email;

        Student.findOne({'email': email}, function (err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(new Error("User Email Not Found"));
            }
            if (!user.validPassword(req.body.password)) {
                return next(new Error("Incorrect Password"));
            }

            return {
                success: true,
                data: user,
                token: generateToken(user, 'Student')

            };

        });
    },


    teacherLogin: (req, res, next) => {

        let email = req.body.email;

        Teacher.findOne({'email': email}, function (err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(new Error("User Email Not Found"));
            }
            if (!user.validPassword(req.body.password)) {
                return next(new Error("Incorrect Password"));
            }


            return {
                success: true,
                data: user,
                token: generateToken(user, 'Teacher')

            };
        });
    }

};