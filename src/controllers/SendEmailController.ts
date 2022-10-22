
import transporter from '../config/nodemail.config';



export default class SendEmail{


    sendEmailRegistration = async (username: string, autenticationtoken: string, email: string) => {

        const mailOptions = {
            from: "lolgraphs342@gmail.com",
            to: email,//email
            subject: 'LolGraphs Confirme seu e-mail',
            text: '',
            html: `<h1>Olá ${username}, tudo bem?</h1>
                  </b>
                  </b>
                  <p>Por favor reliaze a confirmação do email clicando <a href="http://localhost:8080/api/confirmEmail/${autenticationtoken}">Aqui!</a></p>
                  
                  `
            
          };
          

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email enviado: ' + info.response);
            }
          });

    }

    

}