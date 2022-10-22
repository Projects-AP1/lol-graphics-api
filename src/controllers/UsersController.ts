import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Users } from "../entities/Users";
import { usersRepository } from "../repositories/UsersRepository";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import SendEmail from "./SendEmailController";

export default class UsersController {
  async create(req: Request, res: Response) {
    const { username, passwordUser, email, puuid } = req.body;

    try {
      const userExist = await usersRepository.findOne({
        where: {
          username: username,
        },
      });

      if (userExist?.username) {
        return res.status(200).json("Usuario já esta cadastrado Já Cadastrado");
      }

      const saltRounds = 8;
      //encriptando a senha
      const password = await bcrypt.hash(passwordUser, saltRounds);

      const autenticationtoken = uuidv4();
      const authenticated = "FALSE";

      const newUser = usersRepository.create({
        username,
        password,
        email,
        puuid,
        autenticationtoken,
        authenticated,
      });

      await usersRepository.save(newUser);

      new SendEmail().sendEmailRegistration(
        username,
        autenticationtoken,
        email
      );

      return res
        .status(200)
        .json(
          "Usuario cadastrado com sucesso!, um email de confirmação foi enviado"
        );
    } catch (error) {
      console.error(error);
    }
  }

  async validUserName(req: Request, res: Response) {
    const { username } = req.body;

    try {
      const existUserName = await usersRepository.findOne({
        where: {
          username: username,
        },
      });

      if (!existUserName?.username) {
        return res.status(400).json("Nome de usuario já está cadastrado!");
      }

      return res.status(200).json("Nome de usuario ainda não está cadastrado!");
    } catch (error) {
      console.error(error);
    }
  }
  async validEmail(req: Request, res: Response) {
    const { email } = req.body;

    try {
      const existUserName = await usersRepository.findOne({
        where: {
          email: email,
        },
      });

      if (!existUserName?.email) {
        return res.status(400).json("Email de usuario já está cadastrado!");
      }

      return res
        .status(200)
        .json("Email de usuario ainda não está cadastrado!");
    } catch (error) {
      console.error(error);
    }
  }

  async updateUser(req: Request, res: Response) {
    const { userName, password, email, puuid } = req.body;

    try {
      await AppDataSource.createQueryBuilder()
        .update(Users)
        .set({
          password: password,
          email: email,
          puuid: puuid,
        })
        .where("username = userName", { userName: userName })
        .execute();
      return res.status(200).json("Usuario atualizado com sucesso!");
    } catch (error) {
      console.error(error);
    }
  }

  async confirmEmail(req: Request, res: Response) {
    const validUser = await usersRepository.findOne({
      where: {
        autenticationtoken: req.params.token,
      },
    });

    if (validUser?.authenticated == "FALSE") {
      await AppDataSource.createQueryBuilder()
        .update(Users)
        .set({
          authenticated: "TRUE",
        })
        .where("username = userName", { userName: validUser.username })
        .execute();

      return res.status(200).json("Email Confirmado com sucesso!");
    } else if (validUser?.authenticated == "TRUE") {
      return res.status(200).json("Email já foi confirmado!");
    }
    return res.status(200).json("Usuario não foi encontrado");
  }
}
