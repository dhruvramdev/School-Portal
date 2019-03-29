const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const router = express.Router();

const authController = require('./api/auth-controller');
const authenticate = require("../middlewares/authenticate").authenticate;

const teacherRouter = require('./api/teacher-controller');
const studentRouter = require('./api/student-controller');
const schoolRouter = require('./api/school-controller');

let Exam = require('../model/user').exam;
let Contact = require('../model/user').contact;
let Marks = require('../model/user').marks;
let Student = require('../model/user').student;
let School = require('../model/user').school;
let Teacher = require('../model/user').teacher;
let Blog = require('../model/user').blog;

// Node Mailer Setup
let nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'focado11@gmail.com',
        pass: 'schoolportal'
    },
    tls: {
        rejectUnauthorized: false
    }
});


// School Routes

router.post('/school/login', authController.schoolLogin);
router.post('/school/signup', authController.schoolSignup);
router.use('/', schoolRouter);

// Teacher Routes
router.post('/teacher/login', authController.teacherLogin);
router.use('/', teacherRouter);

// Student Routes
router.post('student/login', authController.studentLogin);
router.use('/', studentRouter);


// Common
router.get('/blog', function (req, res) {
    Blog.find({}).limit(10).exec(function (err, data) {
        if (err) throw err;
        res.json({
            success: true,
            data: data
        });
    });
});


router.get('/data/', authenticate, (req, res) => {
    res.json({
        success: true,
        data: req.decoded
    });
});

router.get('/exams', authenticate, function (req, res) {
    let arr = [];
    if (req.decoded.school) {
        Exam.find({school: req.decoded.school}).then((data) => {
            for (let i = 0; i < data.length; i++) {
                console.log(data[i].name);
                arr.push(data[i].name);
                // console.log(arr);
            }
            console.log(arr);
            res.json({
                success: true,
                data: arr
            });
        }).catch(err => {
            console.log(err);
            throw  new Error("Unable to Fetch Exams");
        });
    } else {
        res.json({
            success: false,
            message: "Not Valid Student , Teacher Token"
        });
    }
});

router.get('/exam/data', authenticate, (req, res) => {
    let obj = {};
    let marks;
    console.log(req);
    Marks.find({school: req.decoded.school, examName: req.body.examName}).lean().then(data => {
        for (let i = 0; i < data.length; i++) {
            if (obj[`${data[i].subject}`]) {
                marks = data[i].marks;
                obj[`${data[i].subject}`].push(marks);
            } else {
                obj[`${data[i].subject}`] = [];
                marks = data[i].marks;
                obj[`${data[i].subject}`].push(marks);
            }
        }
        console.log(obj);
        let tosend = {};
        for (let i in obj) {
            let arr = obj[i];
            let max = 0;

            let sum = 0;
            for (let j = 0; j < arr.length; j++) {
                sum += arr[j];
                if (arr[j] > max) {
                    max = arr[j];
                }
            }
            sum = sum / arr.length;
            tosend[i] = {};
            tosend[i].max = max;
            tosend[i].avg = sum;
        }
        res.json({
            success: true,
            data: tosend
        });
    }).catch(err => {
        throw  err;
    });
});

router.post('/contact', function (req, res) {
    let contact = new Contact();
    console.log(req);
    if (req.body.tosend === 'School Administration') {
        contact.description = req.body.description;
        contact.topic = req.body.subject;
        contact.firstname = req.decoded.firstname;
        contact.lastname = req.decoded.lastname;
        contact.school = req.decoded.school;
        contact.target = req.body.tosend;
        contact.typeOf = req.decoded.role;
        if (contact.typeOf === "Student") {
            contact.class_section = req.decoded.class_section;
        }
        contact.save(function (err) {
            if (err) throw (err);
            res.json({
                success: true,
                data: contact
            });
        });

    }
    if (req.body.tosend === 'Focado Team') {
        let mailOptions = {
            from: 'focado11@gmail.com',
            to: 'mohankukreja1@gmail.com',
            subject: req.body.subject,
            text: `firstname : ${req.decoded.firstname},
				   lastname : ${req.decoded.lastname},
				   school : ${req.decoded.school}
				   description: ${req.body.description}
			`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                res.json({
                    success: true,
                    data: "Mail Sent to Focada Team"
                });
            }
        });

    }
});

router.post('/change/password', authenticate, function (req, res, next) {
    if (req.body.type === "Teacher") {
        Teacher.findOne({email: req.body.email}, function (err, data) {
            console.log(data);
            let newPass = Math.random().toString(36).substring(7);

            console.log(newPass);
            let temp = bcrypt.hashSync(newPass, bcrypt.genSaltSync(10), null);
            Teacher.findOneAndUpdate({email: req.body.email}, {$set: {password: temp}}, {new: true}, function (err, doc) {
                if (err) {
                    console.log("Something wrong when updating data!");
                }
                let mailOptions = {
                    from: 'focado11@gmail.com',
                    to: `${req.body.email}`,
                    subject: 'password changed',
                    text: `New Password set to ${newPass}`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        return next(err);
                    } else {
                        console.log('Email sent: ' + info.response);
                        res.json({
                            success: true,
                            data: "Mail Sent!"
                        });
                    }
                });

            });


        });
    } else if (req.body.type === "Student") {
        Student.findOne({email: req.body.email}, function (err, data) {
            console.log(data);
            let newPass = Math.random().toString(36).substring(7);

            console.log(newPass);
            let temp = bcrypt.hashSync(newPass, bcrypt.genSaltSync(10), null);
            Student.findOneAndUpdate({email: req.body.email}, {$set: {password: temp}}, {new: true}, function (err, doc) {
                if (err) {
                    console.log("Something wrong when updating data!");
                }
                let mailOptions = {
                    from: 'focado11@gmail.com',
                    to: `${req.body.email}`,
                    subject: 'password changed',
                    text: `New Password set to ${newPass}`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        return next(err);
                    } else {
                        console.log('Email sent: ' + info.response);
                        res.json({
                            success: true,
                            data: "Mail Sent!"
                        });
                    }
                });

            });


        });
    } else {
        School.findOne({email: req.body.email}, function (err, data) {
            console.log(data);
            let newPass = Math.random().toString(36).substring(7);

            console.log(newPass);
            let temp = bcrypt.hashSync(newPass, bcrypt.genSaltSync(10), null);
            School.findOneAndUpdate({email: req.body.email}, {$set: {password: temp}}, {new: true}, function (err, doc) {
                if (err) {
                    console.log("Something wrong when updating data!");
                }
                let mailOptions = {
                    from: 'focado11@gmail.com',
                    to: `${req.body.email}`,
                    subject: 'password changed',
                    text: `New Password set to ${newPass}`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        return next(err);
                    } else {
                        console.log('Email sent: ' + info.response);
                        res.json({
                            success: true,
                            data: "Mail Sent!"
                        });
                    }
                });

            });


        });
    }


});


module.exports = router;