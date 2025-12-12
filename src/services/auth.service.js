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

export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    const existingUser = db
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
