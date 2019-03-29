const express = require('express');
const router = express.Router();
const studentAuthenticate = require("../../middlewares/student-authenticate").studentAuthenticate;

let Marks = require('../../model/user').marks;
let TimeTable = require('../../model/user').timeTable;
let Student = require('../../model/user').student;
let Teacher = require('../../model/user').teacher;
let Assignment = require('../../model/user').assignment;
let Notice = require('../../model/user').notice;
let HealthForm = require('../../model/user').healthForm;

router.get('/student/marks', studentAuthenticate, (req, res) => {
    let o2 = {};

    Marks.find({student: req.decoded._id, school: req.decoded.school}).lean().then(data => {
        //console.log(req);
        for (let i = 0; i < data.length; i++) {
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

router.get('/student/timetable', studentAuthenticate, function (req, res) {
    console.log(req);
    TimeTable.find({school: req.decoded.school, class_section: req.decoded.class_section}).lean().then(data => {
        res.json({
            success: true,
            data: data
        });
    });
});


router.get('/student/assignment', studentAuthenticate, function (req, res) {
    Assignment.find({
        school: req.decoded.school,
        class_section: req.decoded.class_section
    }, function (err, data) {
        res.json({
            success: true,
            data: data
        });
    });
});

router.get('/student/notice', studentAuthenticate, function (req, res) {
    Notice.find({
        school: req.decoded.school,
        $or: [
            {'target': 'Student'}, {'target': 'Student and Teacher'}
        ]
    }).lean().then(data => {
        res.json({
            success: true,
            data: data
        });
    });
});

router.get('/student/teachers/', studentAuthenticate, function (req, res) {
    console.log(req);
    let query = {class_section: req.decoded.class_section};
    Teacher.find(query, function (err, data) {
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

router.get('/student/class/data', studentAuthenticate, function (req, res) {
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

router.get('/student/ranking', studentAuthenticate, function (req, res) {
    let student = {};
    Marks.find({
        school: req.decoded.school,
        class: req.decoded.class_section,
        subject: req.body.subject
    }).lean().then(rawData => {
        for (let i = 0; i < rawData.length; i++) {
            if (student[`${rawData[i].student}`]) {
                student[`${rawData[i].student}`] += rawData[i].marks;
            } else {
                student[`${rawData[i].student}`] = rawData[i].marks;
            }
        }
        let sortable = [];
        for (let key in student)
            if (student.hasOwnProperty(key))
                sortable.push([key, student[key]]); // each item is an array in format [key, value]

        // sort items by value
        sortable.sort(function (a, b) {
            return b[1] - a[1]; // compare numbers
        });
        console.log(sortable);
        let final = {};
        let top5 = [];
        let studentRank = {};
        for (let i = 0; i < sortable.length; i++) {
//
            if (sortable[i][0] == String(req.decoded._id)) {
                studentRank = {
                    id: sortable[i][0],
                    rank: i + 1
                };
            }
        }
        for (let i = 0; i < sortable.length; i++) {
            if (i < 5) {
                Student.findOne({_id: sortable[i][0]}).lean().then(data => {
                    console.log(data);
                    top5.push({
                        id: sortable[i][0],
                        name: data.firstname + " " + data.lastname,
                        rank: i + 1
                    });
                });
            } else {
                break;
            }
        }

        final.top5rank = top5;
        final.studentRank = studentRank;
        res.json({
            success: true,
            data: final
        });

    });
});

router.post('/student/rating', studentAuthenticate, function (req, res) {
    let name = req.body.name;
    let arr = name.split(" ");
    let query = {firstname: arr[0], lastname: arr[1]};
    Teacher.findOne(query).lean().then(data => {
        let sum = data.ratingSum;
        let num = data.ratingNumber;
        if (sum == null) {
            sum = Number(req.body.rating);
            num = 1;
        } else {
            sum += Number(req.body.rating);
            num++;
        }
        console.log(sum);
        console.log(num);
        let ans = sum / num;
        Teacher.update(query, {rating: ans, ratingSum: sum, ratingNumber: num}, function (err, data) {
            console.log(data);
            res.json({
                success: true,
                data: data
            });
        });
    });
});


router.post('/student/healthForm', studentAuthenticate, function (req, res , next) {
    var newHealthForm = {};
    var query = {'admissionNumber': req.decoded.admissionNumber, 'school': req.decoded.school};
    console.log(query);
    newHealthForm.admissionNumber = req.user._doc.admissionNumber;
    newHealthForm.school = req.user._doc.school;
    newHealthForm.bloodGroup = req.body.bloodGroup;
    newHealthForm.allergy = req.body.allergy;
    newHealthForm.chronicDisease = req.body.chronicDisease;
    newHealthForm.regularMedicine = req.body.regularMedicine;
    newHealthForm.tetanus = req.body.tetanus;
    newHealthForm.vaccinationCompleted = req.body.vaccinationCompleted;
    newHealthForm.fathersName = req.body.fathersName;
    newHealthForm.fathersNumber = req.body.fathersNumber;
    newHealthForm.mothersName = req.body.mothersName;
    newHealthForm.mathersNumber = req.body.mathersNumber;
    newHealthForm.doctorsName = req.body.doctorsName;
    newHealthForm.doctorsNumber = req.body.doctorsNumber;
    newHealthForm.fitToParticipate = req.body.fitToParticipate;
    HealthForm.findOneAndUpdate(query, newHealthForm, {upsert: true}, function (err, doc) {
        if (err) {
            return next(err);
        }
        res.json({
            success: true,
            data: doc
        });
    });
});


module.exports = router;