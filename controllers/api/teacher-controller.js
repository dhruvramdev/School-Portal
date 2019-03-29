const express = require('express');
const router = express.Router();
const teacherAuthenticate = require("../../middlewares/teacher-authenticate").teacherAuthenticate;

let Marks = require('../../model/user').marks;
let Student = require('../../model/user').student;
let Teacher = require('../../model/user').teacher;
let Notice = require('../../model/user').notice;
let Exam = require('../../model/user').exam;

router.post('/teacher/upload/marks', teacherAuthenticate, (req, res, next) => {
    let docsToBeInserts = [];
    let body = req.body;
    Object.keys(body).forEach(key => {
        if (key === 'examName' || key === 'subject' || key === 'class') {
            return;
        } else {
            docsToBeInserts.push({
                examName: body.examName,
                subject: body.subject,
                class: body.class,
                school: req.decoded.school,
                student: key,
                marks: body[key]
            });
        }
    });

    console.log(docsToBeInserts);
    Marks.insertMany(docsToBeInserts).then(docs => {
        console.log(docs);
        res.json({
            success: true,
            data: docs
        });
    }).catch(err => {
        console.log(err);
        return next(new Error("Unable to Upload Marks"));
    });
});


router.post('/teacher/rating', function (req, res, next) {
    let name = req.body.name;
    let arr = name.split(" ");
    let query = {firstname: arr[0], lastname: arr[1]};
    Student.findOne(query).lean().then(data => {
        let rat = data.rating;
        let finalans;
        if (rat == null) {
            finalans = Number(req.body.rating);
            Student.update(query, {rating: finalans}, function (err, data) {
                if (err) {
                    return next(err);
                }
                res.json({
                    success: true,
                    data: data
                });
            });
        } else {
            let ans = rat + Number(req.body.rating);
            console.log(req.body.rating);
            ans = ans / 20;
            ans = ans * 10;
            console.log(ans);
            console.log(rat);
            Student.update(query, {rating: ans}, function (err, data) {
                if (err) {
                    return next(err);
                }
                res.json({
                    success: true,
                    data: data
                });
            });
        }
    });
});


router.get('/teacher/marks', teacherAuthenticate, (req, res) => {
    let o2 = {};
    Marks.find({student: req.body.id, school: req.decoded.school}).lean().then(data => {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            if (!o2[data[i].examName]) {
                o2[data[i].examName] = {};
            }
            o2[data[i].examName][data[i].subject] = data[i].marks;
        }

        console.log(o2);
        res.json({
            success: true,
            data: o2
        });
    });
});

router.get('/teacher/class/data', teacherAuthenticate, function (req, res) {
    let obj = {};
    Marks.find({class: req.decoded.class_section, school: req.decoded.school}).lean().then(data => {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            if (obj[`${data[i].subject}`]) {
                let temp = {};
                temp.examName = data[i].examName;
                temp.marks = data[i].marks;
                obj[`${data[i].subject}`].push(temp);
            } else {
                obj[`${data[i].subject}`] = [];
                let temp = {};
                temp.examName = data[i].examName;
                temp.marks = data[i].marks;
                obj[`${data[i].subject}`].push(temp);
            }
        }
        console.log(obj);
        let tosend = {};
        for (i in obj) {
            let arr = obj[i];
            let max = 0;

            let sum = 0;
            for (let j = 0; j < arr.length; j++) {
                sum += arr[j].marks;
                if (arr[j].marks > max) {
                    max = arr[j].marks;
                }
            }
            sum = sum / arr.length;
            tosend[i] = {};
            tosend[i].max = max;
            tosend[i].avg = sum;
        }
        res.json({
            success: false,
            data: tosend
        });
    }).catch(err => {
        throw  err;
    });

});

router.get('/teacher/subjects', teacherAuthenticate, function (req, res) {
    res.json({
        success: true,
        data: req.decoded.subject
    });
});

router.get('/teacher/notice', teacherAuthenticate, function (req, res) {
    Notice.find({
        school: req.decoded.school,
        $or: [
            {'target': 'Teacher'}, {'target': 'Student and Teacher'}
        ]
    }).lean().then(data => {
        res.json({
            success: true,
            data: data
        });
    });
});

router.get('/teacher/rating', teacherAuthenticate, function (req, res) {
    let query = {firstname: req.decoded.firstname, lastname: req.decoded.lastname};
    Teacher.findOne(query).then(function (data) {
        res.json({
            success: true,
            data: data.rating
        });
    });
});

router.get('/teacher/students', teacherAuthenticate, function (req, res) {
    let query = {class_section: req.decoded.class_section};
    Student.find(query, function (err, data) {
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            let name = data[i].firstname + ' ' + data[i].lastname;
            arr.push(name);
        }
        res.json({
            success: true,
            data: arr
        });
    });
});


router.get('/teacher/students', teacherAuthenticate, function (req, res) {
    let query = {class_section: req.decoded.class_section};
    Student.find(query).then(data => {
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            let obj = {};
            obj.id = String(data[i]._id);
            obj.name = data[i].firstname + ' ' + data[i].lastname;
            arr.push(obj);
        }
        res.json({
            success: true,
            data: arr
        });
    });
});

router.post('/teacher/exams', teacherAuthenticate, function (req, res) {
    Exam.find({school: req.decoded.school}).lean().then(data => {

        let obj = {};
        for (let j = 0; j < data.length; j++) {


            let ans = data[j].class;
            let data2 = req.decoded.class_section;
            let ans2 = [];
            for (let i = 0; i < data2.length; i++) {
                ans2.push(data2[i].split("-")[0]);

            }

            console.log(ans2);
            let dataF = ans.filter(value => -1 !== ans2.indexOf(value));
            console.log(dataF);
            let ret = [];
            for (let i = 0; i < data2.length; i++) {
                for (let k = 0; k < dataF.length; k++) {
                    let temp = data2[i].search(dataF[j]);
                    if (temp == -1) {

                    } else {
                        ret.push(data2[i]);
                    }
                }
            }
            obj[`${data[j].name}`.trim()] = ret;


        }
        res.json(obj);

    });
});



module.exports = router;