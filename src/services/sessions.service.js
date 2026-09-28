import { usersRepository } from "../repositories/users.repository.js";
import { hashPassword } from "../utils/hash.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export const sessionsService = {
  async getSessions() {
    return [];
  },

  async registerUser(data = {}) {
    const { first_name, last_name, email, password } = data;

    if (!first_name || !last_name || !email || !password) {
      const error = new Error("Faltan campos obligatorios");
      error.status = 400;
      throw error;
    }

    if (typeof first_name !== "string" || typeof last_name !== "string" || typeof email !== "string" || typeof password !== "string") {
      const error = new Error("Los campos enviados no tienen un formato válido");
      error.status = 400;
      throw error;
    }

    const normalizedFirstName = first_name.trim();
    const normalizedLastName = last_name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedFirstName || !normalizedLastName) {
      const error = new Error("Faltan campos obligatorios");
      error.status = 400;
      throw error;
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      const error = new Error("El email no tiene un formato válido");
      error.status = 400;
      throw error;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      const error = new Error(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
      error.status = 400;
      throw error;
    }

    const existingUser = await usersRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      const error = new Error("El email ya está registrado");
      error.status = 409;
      throw error;
    }

    const hashedPassword = await hashPassword(password);

    try {
      const user = await usersRepository.create({
        first_name: normalizedFirstName,
        last_name: normalizedLastName,
        email: normalizedEmail,
        password: hashedPassword,
        role: "user"
      });

      return {
        id: user._id.toString(),
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      };
    } catch (error) {
      if (error.code === 11000) {
        const duplicateError = new Error("El email ya está registrado");
        duplicateError.status = 409;
        throw duplicateError;
      }

      throw error;
    }
  }
};
