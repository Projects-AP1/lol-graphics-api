import {scheduleJob} from "node-schedule";
import SumonnerController from '../controllers/SumonnerController';
import GetMatcheByPuuidController from '../controllers/GetMatcheByPuuidController';

export const jobSaveDataSummonerGrath = () => {
  scheduleJob("*/1 * * * *", async ()=> {
    new SumonnerController().hasInSummoner();
    console.log('rotina Sumonner')
  });

  scheduleJob("*/30 * * * *", async ()=> {
    new GetMatcheByPuuidController().hasInMatch();
    console.log('rotina Match')
  });
};

