

import jwt from 'jsonwebtoken';

const maxAgeAccess: number = 20;
const maxAgeRefresh: number = 24 * 60 * 60;

const createAccessToken = function (id: any): string {
  return jwt.sign({ id }, "rdm secret access", { expiresIn: maxAgeAccess });
};

const createRefreshToken = function (id: any): string {
  return jwt.sign({ id }, "rdm secret refresh", { expiresIn: maxAgeRefresh });
};

export{ maxAgeAccess, maxAgeRefresh, createAccessToken, createRefreshToken };
