const { GraphQLError } = require('graphql'); //so that we can through Auth error - in lieu of telling the user specifically what the error is

const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  AuthentificationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNATHENTICATED',
    }
  }),

  // function for our authenticated routes
  authMiddleware: function ({ req }, res, next) { //destructure req so we have access to client req, retrieve from it the info needed to create the token
    // allows token to be sent via  req.query or headers
    let token = req.query.token || req.headers.authorization; // 'Bear <token>'

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    return req; //return the req object so it can be passed to resolver as "context"
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
