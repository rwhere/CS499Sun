var express = require("express");
var AWS = require('aws-sdk');
var fs = require('fs')
var app = express();
var s3 = new AWS.S3();

var myBucket = 'cs499-waer';

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", function(req, res) {

  var jsonText = '{ "student" : [' +
  '{ "firstName" : "Ashley", "lastName" : "Jones" },' +
  '{ "firstName" : "Michael", "lastName": "Jordan" },' +
  '{ "firstName" : "James", "lastName" : "Cameron" } ]}';
  res.send(jsonText);
});

app.get("/one", function(req, res) {
  var name = req.query.name;
  var userId = req.query.id;
  console.log("id: " + userId);
  res.send("your name is " + name + " and your id is " + userId);
});

app.post("/two", function(req, res) {
  var name = req.param("name");
  var userId = req.param("id");
  res.send("your NAME is " + name + " and your ID is " + userId);
});

app.get("/upload", function(req, res) {
  uploadFileToS3(req.query.key);
  res.send("OK");
});

app.get('/list', function(req, res){
	var params = {
	  Bucket: myBucket
	};
	s3.listObjects(params, 	function(err, data){
	  for(var i = 0; i < data.Contents.length; i++) {
	  	data.Contents[i].Url = 'https://s3-us-west-1.amazonaws.com/' + data.Name + '/' + data.Contents[i].Key;
	  }
	  res.send(data.Contents);
	})
})

app.post("/delete", function(req, res) {
  deleteFromS3(req.query.key);
  res.send("OK");
});

//create a bucket in s3
app.post("/create", function(req, res) {
  var myBucket = req.query.myBucket;
  var myKey = req.query.key;
  s3.createBucket({Bucket: myBucket}, function(err, data) {

  if (err) {

     console.log(err);

     } else {

       params = {Bucket: myBucket, Key: myKey, Body: 'I can create a bucket!'};

       s3.putObject(params, function(err, data) {

           if (err) {

               console.log(err)

           } else {

               console.log("Successfully uploaded data to myBucket/myKey");

           }

        });

     }

  });

});

//upload an object to a bucket
function uploadFileToS3(imageFilePath) {
	fs.readFile(imageFilePath, function (err, data) {
		params = {Bucket: myBucket, Key: imageFilePath, Body: data, ACL: "public-read", ContentType: "image/jpeg"};
	    s3.putObject(params, function(err, data) {
	         if (err) {
	             console.log(err)
	         } else {
	             console.log("Successfully uploaded data to " + myBucket, data);
	             fs.unlink(imageFilePath);
	         }
	    });
	});
}

//delete an object from a bucket
function deleteFromS3(theKey) {
    var params = {
    Bucket: myBucket,
    Key: theKey
  };
  s3.deleteObject(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
}

app.listen(9999, function() {
  console.log("Listening on port 9999...");
});
