const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');
const fs = require('fs');
var vm = require("vm");
var orm = require("orm");
var http = require("http");
var Cookies = require( "cookies" )
var funcs = require("./myModules/routeadder.js");
var paging = require("orm-paging")
var databases = {};
var dba;
orm.connect("mysql://kaxuna1:dwrstn11@192.168.1.11/goodwill", function (err, db) {
    if (err) throw err;

    db.use(paging);
    var Products = db.define("products",{
        name:String,
        quant_type:Number,
        barcode:String,
        imported:Boolean
    },{
        methods: {
            
        },
        validations: {
            
        }
    });
    new Promise(function (resolve, reject) {

    });


    Products.settings.set("pagination.perpage", 10);
    console.log(Products.settings);

    var Users = db.define("users", {
        name: String,
        surname: String,
        address: String,
        email: String,
        mobile: String,
        password: String,
        personal_number: String,
        type: Number,
        username: String,
        filial_id: Number

    }, {
        methods: {
            fullName: function () {
                return this.name + ' ' + this.surname;
            }
        },
        validations: {}
    });
    var Sessions = db.define("sessions", {
        create_date: Date,
        isactive: Boolean,
        user_id: Number
    }, {
        methods: {
            getUser:function (reply,session) {
                var currentObject=this;
                Users.find(this.user_id,function (err,user) {
                    if (err) throw err;
                    console.log(user)
                    session.user=user[0];
                    reply(session)
                })
            }
            
        },
        validations: {
            
        }
    });
    databases["Users"] = Users;
    databases["Sessions"]=Sessions;
    databases["Products"]=Products;
    databases["db"]=db;
    // add the table to the database
    db.sync(function (err) {
        if (err) throw err;


        Users.find({}, function (err, users) {
            if (err) throw err;
            if (users.length > 0) {
            }
        })

    });
});


const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});
server.connection({port: 3000});

server.register(Inert, () => {
});


funcs.initRouts(server, databases, http,Cookies,paging);

server.start((err) => {

    if (err) {
        throw err;
    }

    console.log('Server running at:', server.info.uri);
});