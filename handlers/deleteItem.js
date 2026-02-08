// Import AWS SDK v3 DynamoDB client
const { DynamoDBClient, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");

// Create DynamoDB client
const client = new DynamoDBClient({ region: process.env.REGION }); // change to your region

exports.deleteItem = async () => {
  const params = {
    TableName: process.env.DYNAMO_TABLE, // replace with your actual table name
    Key: {
      ISBN: { S: "12345" } // replace with your partition key name and value
      // If your table has a sort key, include it here:
      // Edition: { N: "2" }
    }
  };

  try {
    const command = new DeleteItemCommand(params);
    const response = await client.send(command);
    console.log("Item deleted successfully:", response);
    return { statusCode: 200, body: JSON.stringify({ message: "Item deleted" }) };
  } catch (err) {
    console.error("Error deleting item:", err);
    return { statusCode: 500, body: JSON.stringify(err) };
  }
};