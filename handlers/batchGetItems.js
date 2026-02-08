const { DynamoDBClient, BatchGetItemCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: process.env.REGION});

exports.batchGetItems = async (event) => {
  try {
    // Example: keys to fetch (you can pass these via event)
    const keys = [
      { book_id: { S: "123" },
        releaseDate: {S: "2026-02-08T06:24:37.835Z"}
    
    },
      { book_id: { S: "12345" },
      releaseDate: {S: "2026-02-08T06:51:52.840Z"}
    }
    ];

    const params = {
      RequestItems: {
        BooksComposite: {
          Keys: keys,
          ProjectionExpression: "book_id, author, createdAt, price, releaseDate, title"
        }
      }
    };

    const data = await client.send(new BatchGetItemCommand(params));
    console.log(JSON.stringify(data));

    // Handle unprocessed keys (retry if needed)
    if (data.UnprocessedKeys && Object.keys(data.UnprocessedKeys).length > 0) {
      console.log("Retrying unprocessed keys:", data.UnprocessedKeys);
      const retryData = await client.send(
        new BatchGetItemCommand({ RequestItems: data.UnprocessedKeys })
      );
      data.Responses.Books.push(...retryData.Responses.MyTable);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data.Responses.BooksComposite)
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};