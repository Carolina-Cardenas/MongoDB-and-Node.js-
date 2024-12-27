import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/HOTEL-Bonsai")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

const roomSchema = new mongoose.Schema({
  quantity: Number,
  price: Number,
  description: String,
  capacity: Number,
  isAvailable: Boolean,
});

const Room = mongoose.model("Room", roomSchema);
app.get("/rooms", async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

app.post("/rooms", async (req, res) => {
  const room = new Room(req.body);
  await room.save();
  res.json(room);
});

app.put("/rooms/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const updatedRoom = await Room.findByIdAndUpdate(id, updatedData, {
    new: true,
  });

  if (!updatedRoom) {
    return res.status(404).json({ error: "Room not found" });
  }
  res.json(updatedRoom);
});

app.delete("/rooms/:id", async (req, res) => {
  const { id } = req.params;
  const deletedRoom = await Room.findByIdAndDelete(id);
  if (!deletedRoom) {
    return res.status(404).json({ error: "Room not found" });
  }
  res.json({ messeges: "Room deleted successfully", room: deletedRoom });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
