const { User } = require('../models');
const { signToken, AuthentificationError } = require('../utils/auth'); //import signToken from auth

const resolvers = {
    Query: {
        // ????????? find user by id or by username
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({
                    $or: [{ _id: context.user._id }, { username: context.user.username }],
                }).populate('savedBooks');  //populate associated savedBooks list
            }
            throw AuthentificationError;
        },
    },
    //create user, server signs a token, and sends it back to the client
    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
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
        saveBook: async (parent, { authors, description, bookId, image, link, title }, context) => {
            try {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id }, //find by the user._id - include user._id in the body
                    { $addToSet: { savedBooks: { authors, description, bookId, image, link, title } } }, //pushes to savedBooks array these properties
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
                return User.findOneAndUpdate(
                    { _id: context.user._id }, //find by the user._id - include user._id in the body
                    { $pull: { savedBooks: bookId } }, //pull from savedBooks array, by its bookId
                    { new: true }
                )
            }
            throw AuthentificationError;
        }
    },
};

module.exports = resolvers;