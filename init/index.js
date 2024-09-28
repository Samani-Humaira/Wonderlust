const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

main()
.then(res => console.log("mongoose connected"))
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

const init = async () =>{
  await   Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({...obj,owner:"65534f57c01600ca2f488e8e"}));
   const result =  Listing.insertMany(initData.data);
   console.log("Initialized data");
}

init();
console.log("Initialized");