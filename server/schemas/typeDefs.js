// typeDefs.js: Define the necessary Query and Mutation 

// User type:
// _id
// username
// email
// bookCount
// savedBooks (This will be an array of the Book type.) Clarify what the ! means

// Book type:
// bookId (Not the _id, but the book's id value returned from Google's Book API.)
// authors (An array of strings, as there may be more than one author.)
// description
// title
// image
// link

// Auth type:
// token
// user (References the User type.)

// type Query:
// me: User

// type Mutation:
// login: Accepts an email and password as parameters; returns an Auth type.
// addUser: Accepts a username, email, and password as parameters; returns an Auth type.
// saveBook: Accepts a book author's array, description, title, bookId, image, and link as parameters; returns a User type. (Look into creating what's known as an input type to handle all of these parameters!)
// removeBook: Accepts a book's bookId as a parameter; returns a User type.

const typeDefs = `
type User {
    _id: ID
    username: String
    email: String
    savedBooks: [Book]!
    bookCount: ???
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
    saveBook(authors: [String]!, description: String!, title: String!, bookId: ID!, image: String!, link: String!): User
    removeBook(bookId: ID!): User
}

`