/* jshint expr: true */
'use strict';
process.env.NODE_ENV = 'test';


let path         = require('path'),
    config       = require(path.resolve(`app/config/env/${process.env.NODE_ENV}`)),
    chai         = require('chai'),
    mongoose     = require('mongoose'),
    chaiHttp     = require('chai-http'),
    server         = require(path.resolve('./server')),
    should         = chai.should(),
    expect         = chai.expect;


let User = require(path.resolve("./app/models/User"));

chai.use(chaiHttp);
describe('#######- I-Dispatch Test Cases -########', function(){
 describe('1==> User Module Cases', function(){
 /*Method to Register any user*/
    function register(user,done){
        chai.request(server)
        .post('/api/user-signup')
        .send(user)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql(1);
            res.body.data.should.be.a('object');
            res.body.errors.should.be.a('array');                    
            done();
        });
    }
    describe("#1.1 - User Registration with Email,Username,Phone", function(){
        before(function(done) {
            User.remove({}, function(err) {
               done();
            });
        });
        it('Save User First with Email', function(done) {
          let user = {"firstname":"Mayank","lastname":"Singh","mobile":"9971967452","email":"mayank_singh@seologistics.com","username":"memayank00","password":"Mayank12345.","ccode":"+91","isEmailActive":true};
          register(user,done)
        });
        it('Save user again with existing Email', function(done) {
           let user = {"firstname":"Mayank","lastname":"Singh","mobile":"9971967452","email":"mayank_singh@seologistics.com","username":"memayank00","password":"Mayank12345.","ccode":"+91","isEmailActive":true};
            chai.request(server)
                .post('/api/user-signup')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(0);
                    res.body.data.should.be.a('array');
                    res.body.errors.should.be.a('array');                    
                    done();
                });
        }); 
      });
     describe("#1.2 - Add note on other user profile", function(){
         it('Save user again with existing Email', function(done) {
         	let user = {"firstname":"Deepak","lastname":"Yadav","mobile":"9971967466","email":"deepak_yadav@seologistics.comm","username":"medeepak00","password":"Depak12345.","ccode":"+91","isEmailActive":true};
         	register(user,done)
         });
     });

    });


    /*#2- User Register finally*/
    /*describe("#2 - User Register finally", function(){
        describe("#2.1 - Patient Register", function(){
            before(function(done) {
                Patient.remove({}, function(err) {
                    Doctor.remove({}, function(err) {
                        done();
                    });
                });
            });
            it('if User is Patient', function(done) {
               let user = {"ccode":"+91_IN","accept":true,"usertype":"patient","gender":"male","tz":"Asia/Calcutta","password":"Mayank12345.","name":"Mayank Kumar Singh","mobile":"9971967452","email":"memayank01@gmail.com","confirmPwd":"Mayank12345.","otp":"XXXX","loc":{"latitude":28.5355161,"longitude":77.3910265}};
                chai.request(server)
                    .post('/api/register-me-finally')
                    .send(user)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property("ACK").eql("success");
                        done();
                    });
            }); 
        });
        describe("#2.2 - Doctor Register", function(){
           before(function(done) {
                Patient.remove({}, function(err) {
                    Doctor.remove({}, function(err) {
                        done();
                    });
                });
           }); 
           it('if User is Doctor', function(done) {
               let user = {"ccode":"+91_IN","accept":true,"usertype":"doctor","gender":"male","tz":"Asia/Calcutta","password":"Mayank12345.","name":"Mayank Kumar Singh","mobile":"9971967452","email":"memayank02@gmail.com","confirmPwd":"Mayank12345.","otp":"XXXX","license":"123456","loc":{"latitude":28.5355161,"longitude":77.3910265}};
                chai.request(server)
                    .post('/api/register-me-finally')
                    .send(user)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property("ACK").eql("success");
                        done();
                    });
           });
        });
    });*/
});
