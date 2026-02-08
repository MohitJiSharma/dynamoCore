// Import AWS SDK v3 DynamoDB client
const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");

// Create DynamoDB client
const client = new DynamoDBClient({ region: "ap-southeast-2" }); // change to your region

// Lambda handler or standalone function
exports.fetchDynamoRecord = async (event) => {
  const params = {
    TableName: process.env.DYNAMO_TABLE_BOOKS_COMP, // replace with your table name
    Key: {
      book_id: { S: "123" },
      releaseDate: { S: "2026-02-08T06:24:37.835Z" }
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
