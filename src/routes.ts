import { Router } from "express";
import InfoMatchController from "./controllers/InfoMatchesController";
import SumonnerController from './controllers/SumonnerController';
import GetMatcheByPuuidController from './controllers/GetMatcheByPuuidController';

const routes = Router();
    
/***************************************************************/
/*                         SUMONNER                            */   
routes.put('/api/sumonnerUpdate', new SumonnerController().update)
routes.get('/api/sumonnerList', new SumonnerController().listSummoners)
routes.get('/api/getSumonnerGrath', new SumonnerController().getSumonnerGrath)
routes.post('/api/sumonnerApiByName',  new SumonnerController().getSumonnerByName)
routes.post('/api/sumonnerSave', new SumonnerController().create)
/**************************************************************/

routes.post('/api/infoMatchCreate', new InfoMatchController().create)
// routes.post('/infoMatchList', new InfoMatchController().List)
 routes.get('/api/getMatchBypuuid', new GetMatcheByPuuidController().hasInMatch)


export default routes