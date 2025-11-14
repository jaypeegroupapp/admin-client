// src/lib/db.ts
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const ENV = process.env.ENV!;
const CLIENT = process.env.CLIENT!;

if (!MONGODB_URI) throw new Error("MONGODB_URI is not set");

let cached = (global as any)._mongoose as {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  gfs: GridFSBucket | null;
};

if (!cached) {
  cached = (global as any)._mongoose = { conn: null, promise: null, gfs: null };
}

export async function connectDB() {
  if (cached.conn && cached.gfs)
    return { mongoose: cached.conn, gfs: cached.gfs };

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        dbName: `${CLIENT}-${ENV}`, // your dynamic DB name
      })
      .then((m) => m);
  }

  cached.conn = await cached.promise;

  if (!cached.gfs) {
    if (!cached.conn.connection.db) {
      throw new Error("Database connection not established");
    }
    cached.gfs = new mongoose.mongo.GridFSBucket(cached.conn.connection.db, {
      bucketName: "uploads",
    });
  }

  return { mongoose: cached.conn, gfs: cached.gfs };
}
