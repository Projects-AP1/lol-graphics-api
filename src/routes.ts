import { Router } from "express";
import InfoMatchController from "./controllers/InfoMatchesController";
import SumonnerController from './controllers/SumonnerController';
import GetMatcheByPuuidController from './controllers/GetMatcheByPuuidController';
import UsersController from './controllers/UsersController';
import LoginController from './controllers/LoginController';
import { auth } from './middleware/auth';
import SendEmail from "./controllers/SendEmailController";

const routes = Router();
    
/***************************************************************/
/*                         SUMONNER                            */   
routes.put('/api/sumonnerUpdate',auth,new SumonnerController().update)
routes.get('/api/sumonnerList',auth, new SumonnerController().listSummoners)
routes.get('/api/getSumonnerGrath',auth,new SumonnerController().getSumonnerGrath)
routes.post('/api/sumonnerApiByName',auth,new SumonnerController().getSumonnerByName)
routes.post('/api/sumonnerSave',auth,new SumonnerController().create)
/**************************************************************/

/***************************************************************/
/*                         USERS                               */  
routes.post('/api/userSave', new UsersController().create)
routes.post('/api/userUpdate',auth,new UsersController().updateUser)
/***************************************************************/


/***************************************************************/
/*                         LOGIN                               */  
routes.post('/api/login', new LoginController().login)

routes.post('/api/infoMatchCreate', new InfoMatchController().create)
routes.get('/api/confirmEmail/:token', new UsersController().confirmEmail)
routes.get('/api/getMatchBypuuid', new GetMatcheByPuuidController().hasInMatch)


export default routes