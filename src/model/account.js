'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jsonWebToken from 'jsonwebtoken';

const HASH_ROUNDS = 8;
const TOKEN_SEED_LENGTH = 128;
const TEST_SECRET = 'Tv33tRX1150CuHtH9oaexr4IwUWHkjdD6fsj8Y4QllBs515Gv0BzR4TUYb4T8092FW5W6VEz9IksI27mRK6k771yR5ydbv4jz7kjR';

const accountSchema = mongoose.Schema({
  passwordHash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true,
  },
  createdOn: {
    type: Date,
    default: () => new Date(),
  },
});

function pCreateToken() {
  this.tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  return this.save()
    .then((account) => {
      return jsonWebToken.sign(
        { tokenSeed: account.tokenSeed },
        TEST_SECRET,
      );
    });
  // TODO: error management;
}

accountSchema.methods.pCreateToken = pCreateToken;

const Account = mongoose.model('account', accountSchema);

Account.create = (username, email, password) => {
  return bcrypt.hash(password, HASH_ROUNDS)
    .then((passwordHash) => {
      password = null; // eslint-disable-line
      const tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
      return new Account({
        username,
        email,
        passwordHash,
        tokenSeed,
      }).save();
    });
};

export default Account;
