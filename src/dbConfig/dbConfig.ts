import mongoose from "mongoose";

export const connect = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("MongoDB connected successfully");
        });

        connection.on("error", (error) => {
            console.log("MongoDb connection error", error);

            process.exit();
        });
    } catch (error) {
        console.log("Something went Wrong!!!");
        console.log(error);
    }
}