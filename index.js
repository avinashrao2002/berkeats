const express = require("express");
const app = express();
const { ApolloServer } = require("apollo-server-express");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { Player } = require("./player");
const { Restaurant } = require("./restaurants");
const cors = require('cors')
app.use(express.json())
app.use(cors())
mongoose
  .connect("mongodb://localhost/avinashdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to avinashdb"))
  .catch((error) => console.log(error));


const resolvers = {
  Query: {
    info: () => "Hello World",
    restaurants: async () => {
      const restaurants = await Restaurant.find().sort({name: "asc"});
      return restaurants;
    },
    getRestaurantByName: async (parent, args) => {
        const restaurant = await Restaurant.findOne({name: args.name})
        return restaurant
    }
  },
  Mutation: {
    createPlayer: async (parent, args) => {
      const player = new Player({ name: args.name });
      await player.save();
      return player;
    },

    getPlayer: async (parent, args) => {
      const player = await Player.findOne({ name: args.name });
      if (!player) {
        return {
          name: "undefined",
          message: "This player does not exist in this database",
        };
      }
      return player;
    },
    
    createRestaurant: async (parent, args) => {
      const restaurant = new Restaurant({
        name: args.name,
        open: args.open,
        stars: args.stars,
        full_address: args.full_address,
        categories: args.categories,
        price: args.price,
        photo_url: args.photo_url,
      });
      restaurant.save();
      return restaurant;
    },
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.gql"), "utf8"),
  resolvers,
});

// const uploadData = async () => {
//   let array = [
   
//   ];
//   for (let x = 0; x < array.length; x = x + 1) {
//     const restaurant = new Restaurant({
//       name: array[x].name,
//       open: array[x].open,
//       stars: array[x].stars,
//       full_address: array[x].full_address,
//       categories: array[x].categories,
//       price: array[x].price,
//       photo_url: array[x].photo_url,
//     });
//     restaurant.save();

//   }
// };

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`server ready at http://localhost:4000${server.graphqlPath}`)
);
