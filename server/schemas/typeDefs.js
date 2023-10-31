//only making the bookId required (!) since not all books have all the other fields
const typeDefs = `
type User {
    _id: ID
    username: String
    email: String
    savedBooks: [Book]
    bookCount: Int
}

type Book {
    authors: [String]!
    description: String
    bookId: ID!
    image: String
    link: String
    title: String
}

type Auth {
    token: ID!
    user: User
}

type Query {
    me: User
}

type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(authors: [String], description: String, title: String, bookId: ID!, image: String, link: String): User
    removeBook(bookId: ID!): User
}

`;

module.exports = typeDefs;

