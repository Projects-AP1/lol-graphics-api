import { Request, Response } from "express";
import { sumonnerRepository } from "../repositories/SumonnerRepository";
import { AppDataSource } from "../data-source";
import { Sumonner } from "../entities/Sumonner";
import { SummonerGraph } from "../entities/SummonerGraph";
import fetch from "node-fetch";
import { summonerGraphRepository } from "../repositories/SummonerGraphRepository";
import { rescheduleJob } from "node-schedule";

export default class SumonnerController {
  static getSumonnerByPuuid(puuid: string) {
    throw new Error("Method not implemented.");
  }
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

      return res.status(201).json({
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

    await AppDataSource.createQueryBuilder()
      .update(Sumonner)
      .set({ name: name })
      .where("puuid = :puuid", { puuid: puuid })
      .execute();

    return res.status(201).json("Atualizado Com sucesso!");
  }

   listSummoners = async (req: Request, res: Response) => {
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

  getSumonnerByPuuid = async (puuid: string) => {
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

  hasInSummoner = async () => {
    const summonerGraphQuery = summonerGraphRepository
      .createQueryBuilder()
      .select("summonerpuuid")
      .getSql();

    const summonersToSave = await AppDataSource.getRepository(Sumonner)
      .createQueryBuilder()
      .where(`puuid NOT IN (${summonerGraphQuery})`)
      .execute();

    if (summonersToSave.length) {
      return await this.saveSummonerGraph(summonersToSave);
    }
    return await this.updateSummonerGrath();
  };

  updateSummonerGrath = async () => {
    const sumonners = await sumonnerRepository.find();

    sumonners.forEach(async (summoner) => {
      const sumo = await this.getSumonnerByPuuid(summoner.puuid);
      await AppDataSource.createQueryBuilder()
        .update(SummonerGraph)
        .set({
          name: sumo.name,
          urlimg: `${process.env.URL_IMG}/img/profileicon/${sumo.profileIconId}.png`,
          nivel: sumo.nivel,
        })
        .where("summonerpuuid = :summonerpuuid", { summonerpuuid: sumo.puuid })
        .execute();
    });

    return rescheduleJob;
  };

  saveSummonerGraph = async (summoners: any[]) => {
    try {
      for (const sumonner of summoners) {
        const sumo = await this.getSumonnerByPuuid(sumonner.Sumonner_puuid);

        summonerGraphRepository.save({
          summonerpuuid: sumo.puuid,
          name: sumo.name,
          urlimg: `${process.env.URL_IMG}/img/profileicon/${sumo.profileIconId}.png`,
          nivel: sumo.summonerLevel,
        });
      }
      console.log("Summoners saved");
    } catch (err) {
      console.log(err);
    }
  };

  getSumonnerGrath = async (req: Request, res: Response) => {
    const graphData = await summonerGraphRepository.find({
      order: {
        nivel: "DESC",
      },
    });

    return res.status(200).json(graphData);
  };
}
