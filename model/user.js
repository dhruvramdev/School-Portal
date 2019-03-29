var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var studentSchema = mongoose.Schema({
    admissionNumber: {
        type: String,
        default: null
    },
    rollNumber: {
        type: String,
        default: null
    },
    school: {
        type: String,
        default: null
    },
    ratingSum: {
        type: Number,
        default: null
    },
    ratingNumber: {
        type: Number,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    firstname: {
        type: String,
        default: null
    },

    lastname: {
        type: String,
        default: null
    },
    class_section: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    typeOf: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    age: {
        type: String,
        default: null
    },

    subject: {
        type: Array,
        default: null
    }


});


var schoolSchema = mongoose.Schema({
    name: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    typeOf: {
        type: String,
        default: null
    },

    password: {
        type: String,
        default: null
    },
    subject: {
        type: Array,
        default: null
    }


});


var teacherSchema = mongoose.Schema({
    emp_id: {
        type: String,
        default: null
    },
    rating: {
        type: Number,
        default: null
    },
    ratingSum: {
        type: Number,
        default: null
    },
    ratingNumber: {
        type: Number,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    typeOf: {
        type: String,
        default: null
    },

    address: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    firstname: {
        type: String,
        default: null
    },

    lastname: {
        type: String,
        default: null
    },
    class_section: {
        type: Array,
        default: null
    },

    password: {
        type: String,
        default: null
    },
    subject: {
        type: Array,
        default: null
    },
    school: {
        type: String,
        default: null
    }


});


var noticeSchema = mongoose.Schema({
    topic: {
        type: String,
        default: null
    },
    date: {
        type: String,
        default: null
    },
    filePath: {
        type: String,
        default: null
    },

    description: {
        type: String,
        default: null
    },
    target: {
        type: String,
        default: null
    },
    school: {
        type: String,
        default: null
    }


});

var contactSchema = mongoose.Schema({
    topic: {
        type: String,
        default: null
    },

    firstname: {
        type: String,
        default: null
    },
    lastname: {
        type: String,
        default: null
    },
    class_section: {
        type: Array,
        default: null
    },
    typeOf: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    target: {
        type: String,
        default: null
    },
    school: {
        type: String,
        default: null
    }


});


var assignmentSchema = mongoose.Schema({
    topic: {
        type: String,
        default: null
    },
    deadline: {
        type: String,
        default: null
    },
    filePath: {
        type: String,
        default: null
    },

    description: {
        type: String,
        default: null
    },
    class_section: {
        type: Array,
        default: null
    },
    teacherFirstname: {
        type: String,
        default: null
    },
    teacherLastname: {
        type: String,
        default: null
    },
    school: {
        type: String,
        default: null
    }


});


var examSchema = mongoose.Schema({
    name: {
        type: String,
        default: null
    },
    class: {
        type: Array,
        default: null
    },
    school: {
        type: String,
        default: null
    }
});


var marksSchema = mongoose.Schema({
    examName: {
        type: String,
        default: null
    },
    subject: {
        type: String,
        default: null
    },
    student: {
        type: String,
        default: null
    },
    marks: {
        type: Number,
        default: null
    },
    class: {
        type: String,
        default: null
    },
    school: {
        type: String,
        default: null
    }

});

var timeTableSchema = mongoose.Schema({
    class_section: {
        type: String,
        default: null
    },
    filePath: {
        type: String,
        default: null
    },
    school: {
        type: String,
        default: null
    }


});

var blogScenma = mongoose.Schema({
    title: {
        type: String,
        default: null
    },
    date: {
        type: String,
        default: null
    },
    name: {
        type: String,
        default: null
    },
    content: {
        type: String,
        default: null
    }


});

var healthFormSchema = mongoose.Schema({
    admissionNumber: {
        type: String,
        default: null
    },
    school: {
        type: String,
        default: null
    },
    bloodGroup: {
        type: String,
        default: null
    },
    allergy: {
        type: String,
        default: null
    },
    chronicDisease: {
        type: String,
        default: null
    },
    regularMedicine: {
        type: String,
        default: null
    },
    tetanus: {
        type: String,
        default: null
    },
    vaccinationCompleted: {
        type: String,
        default: null
    },
    fathersName: {
        type: String,
        default: null
    },
    fathersNumber: {
        type: String,
        default: null
    },
    mothersName: {
        type: String,
        default: null
    },
    mathersNumber: {
        type: String,
        default: null
    },
    doctorsName: {
        type: String,
        default: null
    },
    doctorsNumber: {
        type: String,
        default: null
    },
    fitToParticipate: {
        type: String,
        default: null
    }


});


schoolSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

schoolSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

teacherSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

teacherSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

studentSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

studentSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};


var obj = {};
obj.healthForm = mongoose.model('healthForm', healthFormSchema);
obj.blog = mongoose.model('blog', blogScenma);
obj.timeTable = mongoose.model('timeTable', timeTableSchema);
obj.contact = mongoose.model('contact', contactSchema);
obj.student = mongoose.model('student', studentSchema);
obj.teacher = mongoose.model('teacher', teacherSchema);
obj.school = mongoose.model('school', schoolSchema);
obj.notice = mongoose.model('notice', noticeSchema);
obj.assignment = mongoose.model('assignment', assignmentSchema);
obj.exam = mongoose.model('exam', examSchema);
obj.marks = mongoose.model('marks', marksSchema);


module.exports = obj;