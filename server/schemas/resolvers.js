const { User, Book } = require('../models')

const resolvers = {
    Query: {
        // get all users
        users: async () => {
            return User.find()
            .select('-__v -password')
            .populate('savedBooks');
        },
        // get a user by username
        user: async (parent, { username }) => {
            return User.findOne({ username })
            .select('-__v -password')
            .populate('savedBooks');
        },
        // get all books
        savedBooks: async (parent, { bookId }) => {
            return Book.find()
            .select('-__v');
        }
    }
  };
  
  module.exports = resolvers;