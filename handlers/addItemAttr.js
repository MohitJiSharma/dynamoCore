const { DynamoDBClient, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");




exports.addItemAttr = async (event) => {
 

  const tableName = process.env.DYNAMO_TABLE;

  const client = new DynamoDBClient({ region: process.env.Region});



  try {
    const command = new UpdateItemCommand({
      TableName: tableName,
      Key: {ISBN: {S:"12345"}}, // Example: { id: { S: "123" } }
      UpdateExpression: "SET #attr = :val",
      ExpressionAttributeNames: {
        "#attr": "publisher",
      },
      ExpressionAttributeValues: {
        ":val": {S:"Diamond"},
      },
      ReturnValues: "ALL_NEW",
    });

    const response = await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Attribute added successfully",
        updatedItem: response.Attributes,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};