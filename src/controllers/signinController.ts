import { Request, Response } from "express";
import prisma from "../../prisma/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const SECRET_KEY = "MhpgN0`iTT.`D{`N4u=4):K<z-REYf";

export async function signinController(request: Request, response: Response) {
  const { email, password } = request.body;

  // Procura o usuário por email
  const userExists = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  // Se não foi encontrado nenhum usuário com o email então retornamos
  if (!userExists) {
    return response.json({ erro: "Credenciais inválias" });
  }

  // Comparando a senha criptografada do usuário com a senha passando na requisição
  const isValidPassword = await bcrypt.compare(password, userExists.password);

  // Se a senha não for válida então retorna erro
  if (!isValidPassword) {
    return response.json({ erro: "Credenciais inválidas" });
  }

  // Gerando o token

  const token = await jwt.sign(
    { id: userExists.id, name: userExists.name, email: userExists.email },
    SECRET_KEY
  );

  return response.json(token);
}
