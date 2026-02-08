const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: process.env.Region });

exports.queryRecords = async () => {
  const tableName = process.env.DYNAMO_TABLE_BOOKS_COMP;

  try {
    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "#pk = :pkVal AND #sk > :skVal",
      ExpressionAttributeNames: {
        "#pk": "book_id",     // partition key
        "#sk": "releaseDate", // sort key
      },
      ExpressionAttributeValues: {
        ":pkVal": { S: "12345" },   // partition key value
        ":skVal": { S: "2026-02-08" },   // sort key value
      },
      ProjectionExpression: "book_id, Title, Author, Price, releaseDate",
    });

    const response = await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Query successful",
        items: response.Items,
        count: response.Count,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};