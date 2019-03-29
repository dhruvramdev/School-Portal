const express = require('express');
const schoolAuthenticate = require("../../middlewares/school-authenticate").schoolAuthenticate;
const router = express.Router();
let Student = require('../../model/user').student;
let Teacher = require('../../model/user').teacher;
let School = require('../../model/user').school;
let Notice = require('../../model/user').notice;
let Contact = require('../../model/user').contact;
let Exam = require('../../model/user').exam;
let HealthForm = require('../../model/user').healthForm;
let Blog = require('../../model/user').blog;

router.post('/school/add/student', schoolAuthenticate, (req, res, next) => {
    Student.findOne({'email': req.body.email}).then(user => {

        if (user) {
            return next(new Error("User Already Exists"));
        }
        console.log(req.body);
        let newUser = new Student();
        newUser.typeOf = 'Student';
        newUser.firstnamegit = req.body.firstname;
        newUser.lastname = req.body.lastname;
        newUser.phone = req.body.phone;
        newUser.age = req.body.age;
        newUser.admissionNumber = req.body.admissionNumber;
        newUser.rollNumber = req.body.rollNumber;
        newUser.address = req.body.address;
        newUser.school = req.decoded.name;
        newUser.email = req.body.email;
        newUser.subject = req.body.subject;
        newUser.class_section = req.body.class_section;
        newUser.password = newUser.encryptPassword(req.body.password);
        newUser.save().then(doc => {
            res.json({
                success: true,
                data: doc
            });
        }).catch(err => {
            console.log(err);
            throw new Error("Unable to Save Student Data");
        });
    }).catch(err => {
        throw err;
    });
});


router.post('/school/add/teacher', schoolAuthenticate, (req, res, next) => {
    Teacher.findOne({'email': req.body.email}).then(user => {

        if (user) {
            return next(new Error("User Already Exists"));
        }
        console.log(req.body);
        let newUser = new Teacher();
        newUser.typeOf = 'Teacher';
        newUser.school = req.decoded.name;
        newUser.email = req.body.email;
        newUser.firstname = req.body.firstname;
        newUser.lastname = req.body.lastname;
        newUser.phone = req.body.phone;
        newUser.subject = req.body.subject;
        newUser.class_section = req.body.class_section.split(',');
        newUser.password = newUser.encryptPassword(req.body.password);
        newUser.save().then(doc => {
            res.json({
                success: true,
                data: doc
            });
        }).catch(err => {
            console.log(err);
            throw new Error("Unable to Save Teacher Data");
        });
    }).catch(err => {
        throw err;
    });
});

router.post('/school/add/exam', schoolAuthenticate, function (req, res) {
    let newExam = new Exam();
    newExam.name = req.body.subject;
    newExam.class = req.body.class;
    newExam.school = req.decoded.name;
    console.log(newExam.school);
    newExam.save(function (err) {
        if (err) throw (err);
        res.json({
            success: true,
            data: newExam
        });
    });
});


router.post('/school/subjects', schoolAuthenticate, function (req, res) {
    let query = {name: req.decoded.name};
    let arr;
    let ans = req.body.subject;
    arr = ans.split(',');

    School.update(query, {subject: arr}, function (err, data) {
        console.log(data);
        res.json({
            success: true,
            data: data
        });
    });
});


router.get('/school/subjects', schoolAuthenticate, function (req, res) {
    res.json({
        success: true,
        data: req.decoded.subject
    });
});

router.get('/school/notices', schoolAuthenticate, function (req, res) {
    Notice.find({school: req.decoded.name}).lean().then(data => {
        res.json({
            success: true,
            data: data
        });
    });
});

router.get('/school/contact', schoolAuthenticate, function (req, res) {
    Contact.find({school: req.decoded.name}).lean().then(data => {
        res.json({
            success: true,
            data: data
        });
    });
});

router.get('/school/healthForm', schoolAuthenticate, function (req, res, next) {
    let query = {'admissionNumber': req.body.admissionNumber, 'school': req.decoded.name};
    console.log(req);
    HealthForm.find(query, function (err, user) {
        if (err) {
            return next(err);
        }
        res.json({
            success: true,
            data: user
        });
    });
});

router.post('/blog', function (req, res, next) {
    let newBlog = new Blog();
    newBlog.title = req.body.title;
    newBlog.content = req.body.content;
    newBlog.name = req.body.name;
    newBlog.date = req.body.date;
    newBlog.save(function (err) {
        if (err) return next(err);

        res.json({
            success: true,
            data: newBlog
        });

    });
});


module.exports = router;