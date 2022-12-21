const { User, Book } = require('../models')
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password');

                return userData;
            }

            throw new AuthenticationError('Not logged in');
         },
        // // get all users
        // users: async () => {
        //     return User.find()
        //     .select('-__v -password')
        //     .populate('savedBooks');
        // },
        // // get a user by username
        // user: async (parent, { username }) => {
        //     return User.findOne({ username })
        //     .select('-__v -password')
        //     .populate('savedBooks');
        // },
        // // get all books
        // savedBooks: async (parent, { bookId }) => {
        //     return Book.find()
        //     .select('-__v');
        // }
    },
    Mutation: {
        addUser: async (parent, args) => {
          const user = await User.create(args);
          const token = signToken(user);
  
          return { token, user };
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
            
            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, { bookData }, context) => {
            if (context.user) {
                const updatedUser = await User
                    .findOneAndUpdate(
                        { _id: context.user._id }, 
                        { $addToSet: { savedBooks: bookData } },
                        { new: true },
                    )
                    .populate('books');
                return updatedUser;
            };
            throw new AuthenticationError("You must be logged in to save books!");
        },

        removeBook: async (parent, { bookId }, context) => {
            console.log(bookId);
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true },
                );
                return updatedUser;
            };
            throw new AuthenticationError("You must be logged in to delete books!");
        }
    }
};
  
  module.exports = resolvers;