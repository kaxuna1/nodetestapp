/**
 * Created by kaxa on 4/17/16.
 */
this.initRouts=function (server,databases,http,cookie,paging) {

    var products = require("./products.js");
    
    
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true,
                index: true
            }
        }
    });
    server.route({
        method:"POST",
        path:'/loginapi',
        handler:function (request, reply) {
            var username=request.payload.username;
            var password=request.payload.password;
           // console.log(request.payload);
            databases.Users.find({username:username,password:password},function (err, users) {
                console.log(users);
                if(users.length>0){

                    databases.Sessions.create({
                        create_date: new Date(),
                        isactive: true,
                        user_id: users[0].id
                    },function (err) {
                        if (err) throw err;
                        databases.Sessions.find({user_id:users[0].id},["id","Z"],1,function (err,sessions) {
                            console.log(users[0].fullName());
                            sessions[0].getUser(reply,sessions[0]);
                            //reply(sessions[0])
                        })

                    })
                }
            })
        }

    });
    server.route({
        method:"GET",
        path:"/getsessionstatus",
        handler:function (request, reply) {
           var sessionID=request.state.projectSessionId;
            databases.Sessions.find(parseInt(sessionID),function (err, sessions) {
                reply(sessions[0])
            })
        }
    });
    server.route({
        method:"GET",
        path:"/logout",
        handler:function (request, reply) {
            var sessionID=request.state.projectSessionId;
            databases.Sessions.find(parseInt(sessionID),function (err, sessions) {
                sessions[0].isactive=false;
                sessions[0].save();
                reply(true)
            })
        }
    });
    server.route({
        method:"GET",
        path:"/getproducts/{page}",
        handler:function (request, reply) {
            products.getProducts(request, reply,http,databases,request.params.page+1)
        }
    });
    server.route({
        method:"GET",
        path:'/users/{user}',
        handler:function (request, reply) {
            var k=databases.Users.find({username:request.params.user },function (err, users) {
                reply(users)
            })
        }

    });
}