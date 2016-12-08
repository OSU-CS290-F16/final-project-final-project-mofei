var  mongodb = require('mongodb');
var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db = new mongodb.Db('mydb', server, {safe:true});
/*db.open(function (err,db) {//连接数据库
     if(err)
         throw err;
     else{
        console.log("成功建立数据库连接");
        db.collection("users", function (err,collection) {
          collection.insert({username:"四",firstname:"张"}, function (err,docs) {
             if(err) throw  err;
             else{
                 console.log(docs);
             }
          })
        });
        db.collection("users", function (err,collection) {
            if(err) throw err;
            else{
                collection.find({}).toArray(function(err,docs){
                    if(err) throw  err;
                    else{
                        console.log(docs);
                    }
                });
            }
        });
        db.collection("users", function (err,collection) {
            if(err) throw err;
            else{
                collection.find({username:{$in:["延思","四"]}}).toArray(function(err,docs){
                    if(err) throw  err;
                    else{
                        console.log(docs);
                        db.close();
                    }
                });
            }
        });
     }
 });*/

/*var docs=[
    {type:"food",price:11},
    {type:"food",price:10},
    {type:"food",price:9},
    {type:"food",price:8},
    {type:"book",price:9}
];*/
db.open(function (err,db) {
    db.collection("goods", function (err,collection) {
        if(err) throw err;
        else{
            /*collection.insert(docs, function (err,docs) {
                if(err) throw  err;
                else{
                    collection.find({type:"food",price:{$lt:10}}).toArray(
                        function(err,docs){
                            if(err) throw err;
                            else{
                                console.log(docs);
                            }
                        }
                    );
                }
            })*/
            /*collection.remove({price:{$eq:9}},{safe:true},function(err,result){
               console.log(result);
            });*/
            /*var datas = collection.find({$or:[
        　　　　{type:"food"},
        　　　　{price:{$lt:10}}
        　　]}.toArray(function(err,docs){
                console.log(docs);
            });*/
            collection.find({$or:[{type:"food"},{price:{$lt:10}}]}).toArray(function(err,docs){
                if(err) throw  err;
                else{
                    console.log(docs);
                    db.close();
                }
            });
            //console.log(datas);
            db.close();
        }
    });
});
 db.on("close", function (err,db) {//关闭数据库
     if(err) throw err;
     else console.log("成功关闭数据库.");
 });
