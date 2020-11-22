const logger = require('../utils/logger');
const Erreur = require('../utils/erreur');
const service = require('../services/message.service');

exports.getMessages = async (req,res,next) =>{
   service.getMessagesFromDashboard("5fb6854e78d5fb5120db159f")
       .then((response)=>{
           logger.info("DANS LE RESPONSE ",response)
           res.send(response).end()
       })
       .catch((error)=>{
           logger.error(error)
       })
}

exports.createMessage = async (req,res,next) => {
    const body = req.body;

    if(body._dashboard === undefined || body.content === undefined || body.author === undefined){
        logger.error("Contenu manquant dans le body de la requête.")
        return res.status(400).send(new Erreur('Contenu manquant dans le body de la requête.'));
    }

    service.addMessage(body._dashboard, body.content, body.author, body.taggedUsers)
        .then((message)=>{
            logger.info("L'ajout du message à fonctionné")
            return res.status(200)
        })
        .catch((err)=>{
            logger.error("L'ajout du message à échoué")
            return res.status(400)
        })
    
}

exports.deleteMessage = async (req,res,next) => {

}