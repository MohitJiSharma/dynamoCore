// Import required AWS SDK clients and commands
const { DynamoDBClient, PutItemCommand } = require ("@aws-sdk/client-dynamodb");


// Create DynamoDB client
const client = new DynamoDBClient({
    region: "ap-southeast-2", // change to your region
});

// Function to insert data
exports.dynamoInsert = async (event) => {
    const tableName = process.env.DYNAMO_TABLE_BOOKS_COMP;
    const params = {
        TableName: tableName, // replace with your table name
        Item: {
            book_id: { S: "123" },          // Partition key (string)
            price: { S: "369.369" },          // Attribute (string)
            title: { S: "How to be great again" },              // Attribute (number)
            author: { S: "MOhit Ji" },
            releaseDate: {S: new Date().toISOString()},
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
                msg:"Success",
                body: response

            })
        }
    } catch (err) {
        console.error("Error inserting item:", err);
        return {
            statusCode: 500,

            body: JSON.stringify({
                msg:err.message,
                
            })
    }
}}

