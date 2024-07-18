const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://meetpatel21k:72PkX9s5gqmV1dDI@cluster0.oadpr8e.mongodb.net/gofoodmern';

const mongoDB = async () => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected successfully");

    const db = mongoose.connection.db;

    const foodItemsCollection = db.collection("foodItems");
    const foodItemsData = await foodItemsCollection.find({}).toArray();

    const foodCategoryCollection = db.collection("foodCategory");
    const foodCategoryData = await foodCategoryCollection.find({}).toArray();

    global.foodItems = foodItemsData;
    global.foodCategories = foodCategoryData;

    // console.log(global.foodItems);
    // console.log(global.foodCategories);
  } catch (err) {
    console.error("---", err);
  }
}

module.exports = mongoDB;



