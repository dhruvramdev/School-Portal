const passport = require('passport');
var LocalStratergy = require('passport-local');

var School = require('../model/user').school;
var Teacher = require('../model/user').teacher;
var Student = require('../model/user').student;


passport.serializeUser(function (user, done) {
    var key = {
        id: user.id,
        type: user._doc.typeOf
    };
    done(null, key);
});

passport.deserializeUser(function (key, done) {
    if (key.type == 'School') {
        School.findById(key.id, function (err, user) {
            done(err, user);
        });
    } else if (key.type == 'Student') {
        Student.findById(key.id, function (err, user) {
            done(err, user);
        });
    } else if (key.type == 'Teacher') {
        Teacher.findById(key.id, function (err, user) {
            done(err, user);
        });
    }
});


passport.use('school.signup', new LocalStratergy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {

    School.findOne({'email': email}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            req.flash('userError', 'user already exists');
            return done(null, false);
        }
        if (req.body.password != req.body.confirmpassword) {
            req.flash('passError', 'confirm password is not equal to password');
            res.redirect('/signup');
        }
        var newUser = new School();
        newUser.typeOf = 'School';
        newUser.name = req.body.name;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);
        newUser.save(function (err) {
            if (err) return done(err);

            return done(null, newUser);
        });
    });
}));

// passport.use('student.signup',new LocalStratergy({
// 	usernameField: 'email',
// 	passwordField: 'password',
// 	passReqToCallback : true
// },function (req,email,password, done) {
//
// 	Student.findOne({'email':email},function (err,user) {
// 		if(err){
// 			return done(err);
// 		}
// 		if(user){
// 			req.flash('userError', 'user already exists')
// 			return done(null,false);
// 		}
// 		var newUser=new Student();
// 		newUser.typeOf = 'Student';
//
// 		newUser.email=req.body.email;
// 		newUser.password=newUser.encryptPassword(req.body.password);
// 		newUser.save(function (err) {
// 			if(err) return done(err);
//
// 			return done(null,newUser);
// 		})
// 	})
// }));


passport.use('school.login', new LocalStratergy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {

    School.findOne({'email': email}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            req.flash('loggingError', 'user email not found');
            return done(null, false);
        }
        if (!user.validPassword(req.body.password)) {
            req.flash('passworderror', 'incorrect password');
            return done(null, false);
        }
        return done(null, user);
    });

}));

passport.use('student.login', new LocalStratergy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {

    Student.findOne({'email': email}, function (err, user) {
        if (err) {
            console.log('hello');
            return done(err);

        }
        if (!user) {
            req.flash('loggingError', 'user email not found');
            console.log('hello');
            return done(null, false);
        }
        if (!user.validPassword(req.body.password)) {

            req.flash('passworderror', 'incorrect password');
            console.log('hello');
            return done(null, false);
        }
        return done(null, user);
    });

}));


passport.use('teacher.login', new LocalStratergy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {

    Teacher.findOne({'email': email}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            req.flash('loggingError', 'user email not found');

            return done(null, false);
        }
        if (!user.validPassword(req.body.password)) {
            req.flash('passworderror', 'incorrect password');
            console.log('hello');
            return done(null, false);
        }
        return done(null, user);
    });

}));