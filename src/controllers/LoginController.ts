import { Request, Response } from "express";
import { usersRepository } from "../repositories/UsersRepository";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../middleware/auth";
import { CustomRequest } from '../middleware/auth';

export default class LoginController {
  async login(req: Request, res: Response) {
    const { username, password } = req.body;

    const foundUser = await usersRepository.findOne({
      where: {
        username: username,
        password: password,
      },
    });

    if(foundUser){
        const token = jwt.sign({username: foundUser.username, name: foundUser.email}, SECRET_KEY,{
            expiresIn: 60,
        });

        const Authorization ={
            username: username,
            token: token,
        }
        return res.status(200).json(Authorization)
     
    }else{
        return res.status(400).json("Usuário ou Senha incorreto")
    }
  }
}
