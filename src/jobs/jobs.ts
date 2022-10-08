import {scheduleJob} from "node-schedule";
import SumonnerController from '../controllers/SumonnerController';

export const jobSaveDataSummonerGrath = () => {
  scheduleJob("*/1 * * * *", async()=> {
    new SumonnerController().hasInSummoner();
    console.log('rotina')
  });
};

