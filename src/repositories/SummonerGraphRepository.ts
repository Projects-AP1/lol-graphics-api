import { AppDataSource } from "../data-source";
import { SummonerGraph } from '../entities/SummonerGraph';

export const summonerGraphRepository = AppDataSource.getRepository(SummonerGraph);