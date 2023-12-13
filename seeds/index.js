

const mongoose = require('mongoose');

const cities=require('./cities');
const {places,descriptors}=require('./seedHelpers');
//

//import model-------------------------------
const Campground=require('../models/campground');
mongoose.connect('mongodb://127.0.0.1:27017/yelp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(()=>{
    console.log("Mongo__Connection Open")
  })
  .catch(err=>{
    console.log("Oh No ~Mongo__Connection Error!")
    console.log(err)
  });



  const sample=(array)=>array[Math.floor(Math.random() * array.length)];

  const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author:'657465b0ab412b13a0c85843',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:'https://source.unsplash.com/collection/483251',
            description:'layrsnflnadkvha nvafo adfhaiosf asf hoahfoasdfl',
            price:'',
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})