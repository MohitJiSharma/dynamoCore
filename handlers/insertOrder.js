// Import required AWS SDK clients and commands
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");


// Create DynamoDB client
const client = new DynamoDBClient({
    region: "ap-southeast-2", // change to your region
});

// Function to insert data
exports.insertOrder = async (event) => {

    const { userId, orderId, totalPrice } = JSON.parse(event.body);
    const tableName = process.env.DYNAMO_TABLE_ECOMM;
    const params = {
        TableName: tableName, // replace with your table name
        Item: {
            pk: { S: `user#${userId}` },          // Partition key (string)
            sk: { S: `order#${orderId}` },          // Attribute (string)
            total: { S: totalPrice },              // Attribute (number)
            createdAt: { S: new Date().toISOString() }   // Attribute (boolean)
        },
    };
    console.log("Command Params", JSON.stringify(params));

    try {
        const command = new PutItemCommand(params);
        const response = await client.send(command);
        console.log("Item inserted successfully:", response);
        return {
            statusCode: 200,

            body: JSON.stringify({
                msg: "Success",
                body: response

            })
        }
    } catch (err) {
        console.error("Error inserting item:", err);
        return {
            statusCode: 500,

            body: JSON.stringify({
                msg: err.message,

            })
        }
    }
}

