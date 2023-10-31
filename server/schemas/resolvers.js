const { User, Book } = require('../models');
const { signToken, AuthentificationError } = require('../utils/auth'); //import signToken from auth

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return await User.findOne(
                    { _id: context.user._id }
                ).populate('savedBooks');  //populate associated savedBooks list
            }
            throw AuthentificationError;
        },
    },
    //create user, server signs a token, and sends it back to the client
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user); //create token with the user's args/info

            return { token, user };

            //logs in a user, server signs a token, and sends it back to the client
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw AuthentificationError;
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw AuthentificationError;
            }

            const token = signToken(user);
            return { token, user };
        },
        // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
        // user comes from `req.user` created in the auth middleware function
        saveBook: async (parent, args, context) => {
            try {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id }, //find by the user._id - include user._id in the body
                    { $addToSet: { savedBooks: args } }, //pushes to savedBooks array these properties
                    {
                        new: true,
                        runValidators: true
                    }
                );
                return updatedUser.populate('savedBooks');
            } catch (err) {
                throw AuthentificationError;
            }
        },

        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                return await User.findOneAndUpdate(
                    { _id: context.user._id }, //find by the user._id - include user._id in the body
                    { $pull: { savedBooks: {bookId } }}, //pull from savedBooks array, by its bookId
                    { new: true }
                )
            }
            throw AuthentificationError;
        }
    },
};

module.exports = resolvers;