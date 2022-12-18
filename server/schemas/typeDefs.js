// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        _id: ID
        bookId: String
        authors: [String]
        description: String
        image: String
        link: String
        title: String
    }

    type Query {
        me: User
        users: [User]
        user(username: String!): User
        savedBooks(bookId: String!): [Book]
    }

    type Auth {
        token: ID!
        user: User
    }

    input SavedBookInput {
        bookId: String
        authors: [String]
        description: String
        image: String
        link: String
        title: String
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(bookData: SavedBookInput): User
    }
    `;

// export the typeDefs
module.exports = typeDefs;