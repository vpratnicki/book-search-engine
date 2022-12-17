const { User, Book } = require('../models')
const { AuthenticationError } = require('apollo-server-express');


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
    },
    Mutation: {
        addUser: async (parent, args) => {
          const user = await User.create(args);
  
          return user;
        },
        login: async (parent, { email, password }) => {

            const user = await User.findOne ({ email });
            if (!user) {
              throw new AuthenticationError('Incorrect credentials');
            }
    
            const correctPW = await user.isCorrectPassword(password);
            if (!correctPW) {
              throw new AuthenticationError('Incorrect Credentials');
            }
            
            return user;
        }
    }
};
  
  module.exports = resolvers;