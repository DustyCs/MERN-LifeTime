// require('dotenv').config();
// const { MongoClient, ServerApiVersion } = require('mongodb');

// const uri = process.env.MONGODB_URI;

// if (!uri) {
//   throw new Error("MONGODB_URI is not defined in the environment variables.");
// }

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// let database;

// module.exports = {
//     connectDB: async () => {
//         try {
//             await client.connect();
//             database = client.db("blogData");
//             console.log("Connected to MongoDB successfully");
//         } catch (error) {
//             console.error("MongoDB connection error:", error);
//             process.exit(1); // Exit process if connection fails
//         }
//     },
//     getDB: () => {
//         if (!database) {
//             throw new Error("Database not connected. Call connectDB() first.");
//         }
//         return database;
//     }
// };

// console.log("connect running");

// Updated for mongoose

require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process if connection fails
  }
};

module.exports = connectDB;
