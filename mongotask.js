const { MongoClient } = require("mongodb");
const readline = require("readline");

const uri = "mongodb://localhost:27017/meghanath";
const client = new MongoClient(uri);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("meghanath");
    const collection = database.collection("product");

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Do you want to (I)nsert, (U)pdate, or (D)elete a document? ", async (action) => {
      switch (action.toLowerCase()) {
        case 'i':
          await insertDocument(collection, rl);
          break;
        case 'u':
          await updateDocument(collection, rl);
          break;
        case 'd':
          await deleteDocument(collection, rl);
          break;
        default:
          console.log("Invalid action. Exiting...");
          rl.close();
          await client.close();
      }
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

async function insertDocument(collection, rl) {
  rl.question("Enter name: ", async (name) => {
    rl.question("Enter age: ", async (age) => {
      const documentToInsert = { name, age: parseInt(age) };
      const result = await collection.insertOne(documentToInsert);
      console.log(`Document inserted with _id: ${result.insertedId}`);
      rl.close();
      await client.close();
    });
  });
}

async function updateDocument(collection, rl) {
  rl.question("Enter name to update the age : ", async (nameToUpdate) => {
    rl.question("Enter new age: ", async (newAge) => {
      const result = await collection.updateOne(
        { name: nameToUpdate },
        { $set: { age: parseInt(newAge) } }
      );

      if (result.modifiedCount > 0) {
        console.log(` document updated`);
      } else {
        console.log("No documents matched the update criteria.");
      }

      rl.close();
      await client.close();
    });
  });
}

async function deleteDocument(collection, rl) {
  rl.question("Enter name to delete: ", async (nameToDelete) => {
    const result = await collection.deleteOne({ name: nameToDelete });
    console.log(`${result.deletedCount} document(s) deleted`);
    rl.close();
    await client.close();
  });
}

connectToMongoDB();