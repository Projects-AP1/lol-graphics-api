import { dateRopository } from "../repositories/DateRepository";
import { DateSearch } from "../entities/Date";
import fetch from "node-fetch";
import { infoMatchRepository } from "../repositories/InfoMatchRepository";
import { Raw } from "typeorm";
import InfoMatchController from "./InfoMatchesController";
import { sumonnerRepository } from "../repositories/SumonnerRepository";
export default class GetMatcheByPuuidController {
  hasInMatch = async () => {
    const sumonners = await sumonnerRepository.find();

    for (let sumonner of sumonners) {
      await  this.getMatch(sumonner.puuid , sumonner.name);
    }
  };

  getMatch = async (puuid: string, name: string) => {
    try {
      const atualDate = new Date();
      let matches: Array<string> = [];
      const info: InfoMatchController = new InfoMatchController();

      let dates = await this.returnDate(puuid);

      for (let date of dates) {
        if (
          atualDate.getTime() / 1000 >= Number(date.initialtimestamp)
        ) {
          let matche = await this.getMatchBypuuid(date, puuid);
          console.log( name +" : Foram encontradas " + matche.length + " partidas na semana " + date.initialdate)
          matches = matches.concat(matche);
        }
      }

      await info.getInfos(matches, puuid);
      console.log(
        matches.length != 0
          ? `Foram encontrados ${matches.length} partidas `
          : "Não tem partida em seu historico"
      );
    
    } catch (error) {
      console.error(error);
      return JSON.stringify(error);
    }
  };

  getMatchBypuuid = async (date: DateSearch, puuid: String) => {
    const response = await fetch(
      `${process.env.URL}/match/v5/matches/by-puuid/${puuid}/ids?startTime=${date.initialtimestamp}` +
        `&endTime=${date.finaltimestamp}&start=0&count=100&api_key=${process.env.TOKEN}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );

    return await response.json();
  };

  returnDate = async (puuid: any) => {
    const dateMatch = await infoMatchRepository.find({
      select: {
        datacriacaodojogo: true,
      },
      where: {
        puuid: puuid,
      },
      order: {
        datacriacaodojogo: "DESC",
      },
    });

    if (dateMatch.length > 0) {
      const dateFinal = await dateRopository
        .createQueryBuilder("date_search")
        .where("date_search.initialdate < :initialdate", {
          initialdate: dateMatch[0].datacriacaodojogo,
        })
        .orderBy("date_search.initialdate", "DESC")
        .limit(1)
        .execute();

      const dates = await dateRopository.findBy({
        initialdate: Raw(
          (alias) =>
            `${alias} >='${dateFinal[0].date_search_initialdate
              .toISOString()
              .substr(0, 10)}'`
        ),
      });

      return dates;
    } else {
      const dates = await dateRopository.find();
      return dates;
    }
  };
}
