import { Request, Response } from "express";
import { sumonnerRepository } from "../repositories/SumonnerRepository";
import { AppDataSource } from "../data-source";
import { Sumonner } from "../entities/Sumonner";
import { ILike } from "typeorm";
import fetch from "node-fetch";
import { json } from 'stream/consumers';
export default class SumonnerController {
  async create(req: Request, res: Response) {
    const { puuid, name } = req.body;

    try {
      const userExists = await sumonnerRepository.findOne({
        where: {
          puuid: puuid,
        },
      });

      if (userExists?.puuid != null) {
        return res.status(400).json(`The summoner is already registered!`);
      }

      const newSumonner = sumonnerRepository.create({
        name,
        puuid,
      });

      await sumonnerRepository.save(newSumonner);

      return res
        .status(201)
        .json({
          summoner: newSumonner,
          message: "Summoner registered successfully",
        });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async update(req: Request, res: Response) {
    const { puuid, name } = req.body;

    const userExists = await sumonnerRepository.findOne({
      where: {
        puuid: puuid,
      },
    });

    if (userExists?.puuid === null) {
      return res.status(200).json(`O invocador ${userExists.name} não existe!`);
    }

    const updateSumonner = await AppDataSource.createQueryBuilder()
      .update(Sumonner)
      .set({ name: name })
      .where("puuid = :puuid", { puuid: puuid })
      .execute();

    return res.status(201).json("Atualizado Com sucesso!");
  }

  list = async (req: Request, res: Response) => {
    // const { name } = req.body;

    const sumonners = await sumonnerRepository.find();
    return res.status(200).json(sumonners);
  };

  getSumonnerByName = async (req: Request, res: Response) => {
    const { name } = req.body;

    const result = await this.getSumonnerApi(name);

    if (result?.status?.status_code == 404) {
      res.status(200).json("Invocador não existe!");
    }

    return res.status(200).json(result);
  };

  getSumonnerByPuuid = async (puuid: String) => {
    const response = await fetch(
      `${process.env.URLBR1}/summoner/v4/summoners/by-puuid/${puuid}?api_key=${process.env.TOKEN}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
    return response.json();
  };

  getSumonnerApi = async (name: String) => {
    const response = await fetch(
      `${process.env.URLBR1}/summoner/v4/summoners/by-name/${name}?api_key=${process.env.TOKEN}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
    return response.json();
  };

  getSumonnerGrath = async (req: Request, res: Response) => {
    const sumonners = await sumonnerRepository.find();
    const sumonnerArray = [];
    for (let sumonner of sumonners) {
     const sumo = await this.getSumonnerByPuuid(sumonner.puuid);

     sumonnerArray.push(
      {
        "name":sumo.name,
        "profileIconId": sumo.profileIconId,
        "steps": sumo.summonerLevel
      }
     ) 
    }
    
    return res.status(200).json(sumonnerArray);
  };
}
