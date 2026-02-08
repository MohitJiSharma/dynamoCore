const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: process.env.Region });

exports.fetchGSI = async () => {
  const tableName = process.env.DYNAMO_TABLE_BOOKS_LSI;

  try {
    const command = new QueryCommand({
      
      TableName: tableName,
      KeyConditionExpression: "#id = :idVal AND #sk > :skVal",
      ExpressionAttributeNames: {
        "#id": "book_id",   //partiiton key  
        "#price": "price" ,  //LSI
        "#sk": "releaseDate"  //Sort Key
      },
      ExpressionAttributeValues: {
        ":idVal": { S: "12345" },   // partition key value
        ":priceVal": { N: "299" },   // LSI key value
        ":skVal": {S: "2026-01-08"}   //Sort Key
      },
      FilterExpression: "#price > :priceVal",
      ProjectionExpression: "book_id, title, author, price, releaseDate",
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