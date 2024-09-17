import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import db from "./db.js";
import { typeDefs } from "./schema.js";

const resolvers = {
  Query: {
    games() {
      return db.games;
    },
    game(_, args) {
      console.log("Args received:", args);
      console.log("games in DB:", db.games);
      return db.games.find((game) => game.id === args.id);
    },
    reviews() {
      return db.reviews;
    },
    review(_, args) {
      console.log("Args received:", args);
      console.log("Reviews in DB:", db.reviews);
      return db.reviews.find((review) => review.id === args.id);
    },
    authors() {
      return db.authors;
    },
    author(_, args) {
      console.log("Args received:", args);
      console.log("authors in DB:", db.authors);
      return db.authors.find((author) => author.id === args.id);
    },
  },
  Game: {
    reviews(parent) {
      return db.reviews.filter((review) => review.game_id === parent.id);
    },
  },
  Author: {
    reviews(parent) {
      return db.reviews.filter((review) => review.authorId === parent.id);
    },
  },
  Review: {
    game(parent) {
      return db.games.find((game) => game.id === parent.game_id);
    },
    author(parent) {
      return db.authors.find((author) => author.id === parent.authorId);
    },
  },
  Mutation: {
    addGame(_, args) {
      const newGame = { id: String(db.games.length + 1), ...args };
      db.games.push(newGame);
      return newGame;
    },
    addReview(_, args) {
      const newReview = { id: String(db.reviews.length + 1), ...args };
      db.reviews.push(newReview);
      return newReview;
    },
    addAuthor(_, args) {
      const newAuthor = { id: String(db.authors.length + 1), ...args };
      db.authors.push(newAuthor);
      return newAuthor;
    },
    deleteGame(_, args) {
      db.games = db.games.filter((game) => game.id !== args.id);
      return db.games;
    },
  },
};

// server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log(`🚀 Server ready at ${url}`);
