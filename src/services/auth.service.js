import { db } from '../config/database.js';
import logger from '../config/logger.js';
import bcrypt from 'bcrypt';
import { user } from '../models/user.model.js';
import { eq } from 'drizzle-orm';

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (e) {
    logger.error('error hashing password', e);
    throw new Error('Error hashing password');
  }
};


export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (e) {
    logger.error(`Error comparing password: ${e}`);
    throw new Error('Error comparing password');
  }
};


export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if ((await existingUser).length > 0) throw new Error('User alredy exisits');
    const passwordhash = await hashPassword(password);
    const [newUser] = await db
      .insert(user)
      .values({ name, email, password: passwordhash, role })
      .returning({ id: user.id, email: user.email, role: user.role });

    logger.info(`user ${email} created successfully! `);
    return newUser;
  } catch (e) {
    logger.error('error creating user', e);
    throw new Error('error creating user');
  }
};

export const authenticateUser = async ({ email, password }) => {
  try {
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!existingUser) {
      throw new Error('User not found');
    }

    const isPasswordValid = await comparePassword(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    logger.info(`User ${existingUser.email} authenticated successfully`);
    return {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
      created_at: existingUser.created_at,
    };
  } catch (e) {
    logger.error(`Error authenticating user: ${e}`);
    throw e;
  }
};