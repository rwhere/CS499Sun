var AWS = require('aws-sdk');
var express = require('express');

var app = express();

AWS.config.update({
  region: "us-west-2"
});

var docClient = new AWS.DynamoDB.DocumentClient();
var tableName = "cs499";

//add item to DB
function putItem(id, name) {
  var params = {
      TableName:tableName,
      Item:{
          "id": id,
          "name": name
      }
  };
  console.log("Adding a new item...");
  docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded: ", name);
       }
    });
}

//query the DB
function queryDB(id, name, res) {
  var params = {
    TableName: tableName,
    Key:{
        "id": id,
        "name": name
    }
  };
  docClient.get(params, function(err, data) {
      if (err) {
          console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
      }
  });
}

//delete item from DB
function deleteItem(id, name) {
  var params = {
    TableName: tableName,
    Key:{
        "id": id,
        "name": name
    }
  };
  console.log("Attempting a conditional delete...");
  docClient.delete(params, function(err, data) {
      if (err) {
          console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
      }
  });
};

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})
