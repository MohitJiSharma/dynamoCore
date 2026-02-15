// Import AWS SDK v3 DynamoDB client
const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");

// Create DynamoDB client
const client = new DynamoDBClient({ region: "ap-southeast-2" }); // change to your region

// Lambda handler or standalone function
exports.fetchUsersSingleTable = async (event) => {
  const params = {
    TableName: process.env.DYNAMO_TABLE_ECOMM, // replace with your table name
    Key: {
      pk: { S: "1" },
      sk: { S: "details" }
    },
   
  };

  try {
    const command = new GetItemCommand(params);
    const response = await client.send(command);

    if (response.Item) {
      // Convert DynamoDB JSON format to normal JS object

      return { statusCode: 200, body: JSON.stringify(response) };
    } else {
      return { statusCode: 404, body: "Item not found" };
    }
  } catch (err) {
    console.error("Error fetching item:", err);
    return { statusCode: 500, body: JSON.stringify(err) };
  }
};
