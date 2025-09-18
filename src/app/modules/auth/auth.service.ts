import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import config from '../../../config';
import pool from '../../../utils/dbClient';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { CreateSchoolUserInput, LoginInput, JwtPayloadUser } from './auth.interface';

export const AuthService = {
  async registerUser(payload: CreateSchoolUserInput) {
    const hashed = await bcrypt.hash(payload.password, Number(config.bycrypt_salt_rounds || 10));
    const values = [
      payload.name,
      payload.email || null,
      hashed,
      payload.username,
      payload.mobile_no,
      payload.photo || null,
      payload.school_id,
      payload.address || null,
      payload.role || 'school_admin',
    ];

    const result = await pool.query(
      `INSERT INTO school_user 
        (name, email, password, username, mobile_no, photo, school_id, address, role)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, name, email, username, mobile_no, photo, school_id, address, role, created_at, updated_at` ,
      values
    );

    return result.rows[0];
  },

  async loginUser(payload: LoginInput) {
    const identifier = payload.usernameOrMobile;
    const userRes = await pool.query(
      `SELECT id, name, email, password, username, mobile_no, photo, school_id, address, role
       FROM school_user
       WHERE username = $1 OR mobile_no = $1
       LIMIT 1`,
      [identifier]
    );

    if (userRes.rowCount === 0) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
    }

    const user = userRes.rows[0];
    const match = await bcrypt.compare(payload.password, user.password);
    if (!match) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
    }

    const jwtPayload: JwtPayloadUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      school_id: user.school_id,
    };

    const accessToken = jwtHelpers.createToken(
      jwtPayload,
      config.jwt_secret as string,
      config.jwt_expires_in as string
    );

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        mobile_no: user.mobile_no,
        photo: user.photo,
        school_id: user.school_id,
        address: user.address,
        role: user.role,
      },
    };
  },
};


