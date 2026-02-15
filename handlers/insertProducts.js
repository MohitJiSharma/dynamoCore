// Import required AWS SDK clients and commands
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");


// Create DynamoDB client
const client = new DynamoDBClient({
    region: "ap-southeast-2", // change to your region
});

// Function to insert data
exports.insertProducts = async (event) => {

    const { orderId, products } = JSON.parse(event.body);
    const tableName = process.env.DYNAMO_TABLE_ECOMM;

    let overAllResponse = [];
    for (const product of products){
        const params = {
        TableName: tableName, // replace with your table name
        Item: {
            pk: { S: `order#${orderId}` },          // Partition key (string)
            sk: { S: `product#${product.productId}` },          // Attribute (string)
            name: { S: `${product.name}` },     
            price: {S: `${product.price}`},// Attribute (number)
            createdAt: { S: new Date().toISOString() }   // Attribute (boolean)
        },
    };
    console.log("Command Params", JSON.stringify(params));

    try {
        const command = new PutItemCommand(params);
        const response = await client.send(command);
        overAllResponse.push[response];
        console.log("Item inserted successfully:", response);
       
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

     return {
            statusCode: 200,

            body: JSON.stringify({
                msg: "Success",
                body: overAllResponse

            })
        }
    
}

