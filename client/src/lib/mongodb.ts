import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
console.log("MongoDB URI hostname:", uri?.split("@").pop()?.split("/")[0]);

console.log("MongoDB URI protocol:", uri?.split("://")[0]);
console.log("MongoDB URI contains port:", /:\d{4,5}/.test(uri || ""));

if (!uri) {
  throw new Error(
    "MONGODB_URI is missing. Please check client/.env.local"
  );
}

const options = {};

type MongoGlobal = typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

const globalForMongo = globalThis as MongoGlobal;

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!globalForMongo.mongoClientPromise) {
    const client = new MongoClient(uri, options);

    globalForMongo.mongoClientPromise = client.connect();
  }

  clientPromise = globalForMongo.mongoClientPromise;
} else {
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;