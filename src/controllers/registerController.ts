import { Request, Response } from "express";
import prisma from "../../prisma/db";
import bcrypt from "bcryptjs";

export async function registerController(request: Request, response: Response) {
  const { name, email, password } = request.body;

  // Verificar se todos os campos estão presentes
  if (!name || !email || !password) {
    return response.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  // Verificar se o usuário já existe
  const userExists = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  // Se o usuário existir, retorna um erro
  if (userExists) {
    return response.status(400).json({ error: "Usuário já existe." });
  }

  try {
    // Criptografando a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criando o usuário no banco de dados
    const user = await prisma.user.create({
      data: {
        name, // Certifique-se de que o campo `name` está sendo passado
        email,
        password: hashedPassword,
      },
    });

    // Retornando o usuário criado
    return response.status(201).json(user);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return response.status(500).json({ error: "Erro ao criar usuário." });
  }
}
