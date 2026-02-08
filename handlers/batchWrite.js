// Import AWS SDK v3 DynamoDB client
const { DynamoDBClient, BatchWriteItemCommand } = require("@aws-sdk/client-dynamodb");

// Create DynamoDB client
const client = new DynamoDBClient({ region: "ap-southeast-2" }); // change to your region

exports.batchWrite = async () => {
    const params = {
        RequestItems: {
            Books_LSI: [ // <-- replace with your table name
                {
                    PutRequest: {
                        Item: {
                            book_id: { S: "12345" },          // Partition key (string)
                            price: { N: "369" },          // Attribute (string)
                            title: { S: "How to be great again" },              // Attribute (number)
                            author: { S: "Mohit Ji" },
                            releaseDate: {S: new Date().toISOString()},
                            createdAt: { S: new Date().toISOString() }   // Attribute (boolean)
                        }
                    }
                },
                {
                    PutRequest: {
                        Item: {
                            book_id: { S: "123456" },          // Partition key (string)
                            price: { N: "10000" },          // Attribute (string)
                            title: { S: "How to be great again4" },              // Attribute (number)
                            author: { S: "Mohit Ji" },
                            releaseDate: {S: new Date().toISOString()},
                            createdAt: { S: new Date().toISOString() }   // Attribute (boolean)
                        }
                    }
                }
            ]
        }
    };

    try {
        const command = new BatchWriteItemCommand(params);
        const response = await client.send(command);
        console.log("Batch write response:", response);

        // If some items were not processed, DynamoDB returns them in UnprocessedItems
        if (response.UnprocessedItems && Object.keys(response.UnprocessedItems).length > 0) {
            console.warn("Some items were not processed:", response.UnprocessedItems);
        }

        return { statusCode: 200, body: JSON.stringify({ message: "Batch write completed" }) };
    } catch (err) {
        console.error("Error writing batch:", err);
        return { statusCode: 500, body: JSON.stringify(err) };
    }
};