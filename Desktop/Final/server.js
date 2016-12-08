var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var query = require("querystring");
var  mongodb = require('mongodb');
var mongoose = require('mongoose');
var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db = new mongodb.Db('mydb', server, {safe:true});
db.open(function (err,db) {//连接数据库
     if(err)
         throw err;
     else{
        console.log("成功建立数据库连接");
     }
 });
 db.on("close", function (err,db) {//关闭数据库
     if(err) throw err;
     else console.log("成功关闭数据库.");
 });

var app = express();
var usersData = require('./users-data');
var port = process.env.PORT || 3000;

// Use Handlebars as the view engine for the app.
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');
/*
 * Here, you should set up the routing for the app.  The routing needs to
 * handle four main cases:
 *
 *   * Files in public/ should be served statically and should be availale
 *     out of the root path ('/').  For example, the file public/style.css
 *     should be available at the path '/style.css'.
 *
 *   * The root path ('/') should be routed to the index page implemented by
 *     views/index-page.handlebars.
 *
 *   * The dynamic path '/notes/<USER>' should be routed to the notes page
 *     implemented by views/notes-page.handlebars, but only for existing users.
 *
 *   * Any non-existent path, or any path '/notes/<USER>' for a user that
 *     does not exist should be routed to the 404 page implemented by
 *     views/404-page.handlebars.
 *
 * Each of these pages must receive the appropriate data to fill in the
 * corresponding Handlebars templates.  In particular:
 *
 *   * For every page, the page title (displayed in the browser tab) must be
 *     set.  See views/layouts/main.handlebars to figure out how to set this.
 *     For the index and 404 pages, the title should simply be 'ToDoIt'.
 *     For a user's notes page, the title should be 'ToDoIt - <NAME>', where
 *     <NAME> is the "logged-in" user's name.
 *
 *   * The index page must receive data to enable it to complete the list of
 *     users in your template in views/partials/user-select.handlebars.
 *
 *   * The navbar (implemented in views/partials/header.handlebars), is set
 *     up to display the user's name whenever there is a user "logged in".
 *     You must provide the appropriate data to your pages to make this happen.
 *
 *   * The notes page obviously must receive the data it needs to display the
 *     "logged-in" user's notes.
 */

/*
 * The below route is included just so you can connect with the server.  You
 * should eventually get rid of this.
 */
/*app.get('*', function (req, res) {
  res.send('The server is listening!')
});*/

var url = require("url");
//全局变量，用户信息
app.locals.usersData = usersData;
//首页
app.get('/', function (req, res) {
    app.locals.userName = null;
    db.collection("article", function (err,collection) {
      if(err) throw err;
      else{
          //查询所有数据
          collection.find({}).sort({'add_time':-1}).toArray(function(err,docs){
              if(err) throw  err;
              else{
                console.log(docs);
                  app.locals.articles = docs;
                  res.render('index-page');
              }
          });
      }
    });
});
//notes页，没有选择用户无法访问
app.get('/notes/*', function (req, res) {
  var pathname = url.parse(req.url).pathname;
  var pathname = pathname.split('/');
  if(pathname.length < 3 || pathname['2'] == ''){
    res.render('404-page');
  }else{
    var t = false;
    for(var val in usersData){
      if(val == pathname[2].split('%20')[0].toLowerCase()){
        t = true;
        var data = {};
        data[val] = usersData[val]
        app.locals.perData = data;
      }
    }
    //查询该用户下的文章
    db.collection("article", function (err,collection) {
      if(err) throw err;
      else{
        collection.find({'author':pathname[2].replace('%20',' ')}).sort({'add_time':-1}).toArray(function(err,docs){
            if(err) throw  err;
            else{
                app.locals.articles = docs;
                if(t){
                    app.locals.userName = pathname[2].replace('%20',' ');
                    res.render('notes-page');
                }else{
                    res.render('404-page');
                }
            }
        });
      }
    })
  }
});
//notes页，提交用户发表文章，修改发表的文章
app.post('/notes/*', function (req, res) {
  var pathname = url.parse(req.url).pathname;
  var pathname = pathname.split('/');
  if(pathname.length < 3 || pathname['2'] == ''){
    res.render('404-page');
  }else{
    var t = false;
    for(var val in usersData){
      if(val == pathname[2].split('%20')[0].toLowerCase()){
        t = true;
        var data = [];
        data[val] = usersData[val]
        app.locals.perData = data;
      }
    }
    var postdata = '';
    req.on("data",function(chunk){
      postdata += chunk;
    })
    req.on("end",function(){
      var params = query.parse(postdata);
      params['author'] =  pathname[2].replace('%20',' ');
      params['add_time'] =  getNowFormatDate();
      db.collection("article", function (err,collection) {
        if(params['id'] == ""){
          console.log(1);
          collection.insert(params, function (err,docs) {
             if(err) throw  err;
             else{
                 console.log(docs);
             }
          })
        }else{
          collection.update({'_id':mongoose.Types.ObjectId(params['id'])}, {$set: {title:params['title'],content:params['content']}}, function(error, bars){
             if(err) throw  err;
             else{
                console.log(2);
             }
          });
        }
      });

      db.collection("article", function (err,collection) {
        if(err) throw err;
        else{
          collection.find({'author':pathname[2].replace('%20',' ')}).sort({'add_time':-1}).toArray(function(err,docs){
              if(err) throw  err;
              else{
                  app.locals.articles = docs;
                  if(t){
                      app.locals.userName = pathname[2].replace('%20',' ');
                      res.render('notes-page');
                  }else{
                      res.render('404-page');
                  }
              }
          });
        }
      })
    });
  }
});

//notes页，删除文章
app.post('/del', function (req, res) {
  var re = {};
  re['flag'] = 0;
  var postdata = '';
  req.on("data",function(chunk){
    postdata += chunk;
  })
  req.on("end",function(){
    var params = query.parse(postdata);
    db.collection("article", function (err,collection) {
      if(params['id'] != ""){
        collection.remove({'_id':{$eq:mongoose.Types.ObjectId(params['id'])}}, function(error, bars){
           if(err) throw  err;
           else{
            re['flag'] = 1;
            console.log(JSON.stringify(re));
            //return res.json(re);
           }
        });
      }
    });
  })
});

// 监听
app.listen(port, function () {
  console.log("== Listening on port", port);
});

//设置静态文件访问路由
app.use(express.static(__dirname + '/public')); 

//404页面
app.get('*', function(req, res) {
  res.status(404).render('404-page', {
    pageTitle: '404'
  });
});
//获取当前时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
} 