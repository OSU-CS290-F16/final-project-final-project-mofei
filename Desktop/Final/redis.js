var redis = require('redis'),
RDS_PORT  = 6379,          //端口号
RDS_HOST  = '127.0.1.1',   //服务器IP
RDS_PWD   = 'hello，123',
//RDS_OPTS = {auth_pass:RDS_PWD},//设置项
RDS_OPTS = {},//设置项
client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);
//没有设置密码 不需要使用
/*client.auth(RDS_PWD,function(){
    console.log('通过认证');
});*/

client.on('ready',function(err){
	/*client.set('author', 'Wilson',redis.print);
	client.get('author', redis.print);*/
    console.log('redis ready');
});

client.on('end',function(err){
    console.log('end');
});
client.on('connect',function(){
	//封装操作函数
	exports.set = function(key,value){
		client.set(key, value);
	}
	exports.get = function(key,call_back){
		client.get(key, call_back());
	}
	exports.hmset = function(key,value){
		client.hmset(key,value);
	}
	exports.hgetall =function(key,call_back){
	 	client.hgetall(key, call_back());
	}
});
/*function tt(key,value,call_back){
	client.set(key, value,call_back());
}
client.on('connect',function(){
	tt('j','w',function(){console.log("jw")});
    var key = 'skills';
      client.sadd(key, 'C#','java',redis.print);
      client.sadd(key, 'nodejs');
      client.sadd(key, "MySQL");
      
      client.multi()      
      .sismember(key,'C#')
      .smembers(key)
      .exec(function (err, replies) {
            console.log("MULTI got " + replies.length + " replies");
            replies.forEach(function (reply, index) {
                console.log("Reply " + index + ": " + reply.toString());
            });
            client.quit();
    });
});*/
/*client.on('connect',function(){
	client.hmset('short', {'js':'javascript','C#':'C Sharp'}, redis.print);
    client.hmset('short', 'SQL','Structured Query Language','HTML','HyperText Mark-up Language', redis.print);

    client.hgetall("short", function(err,res){
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }            
        console.dir(res);
    });
});*/



