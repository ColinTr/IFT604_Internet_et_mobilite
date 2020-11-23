const logger = require('../utils/logger');
const Erreur = require('../utils/erreur');
const config = require('../utils/config');
const service = require('../services/message.service');

exports.getMessages = async (req, res) =>{
   service.getMessagesFromDashboard(config.MONGODB_DASHBOARD_ID)
       .then((response)=>{
           res.send(response).end();
       })
       .catch((error)=>{
           logger.error(error)
       })
};

exports.createMessage = async (req, res) => {
    const body = req.body;

    if(body._dashboard === undefined || body.content === undefined || body.author === undefined){
        logger.error("Contenu manquant dans le body de la requête.");
        return res.status(400).send(new Erreur('Contenu manquant dans le body de la requête.'));
    }

    service.addMessage(body._dashboard, body.content, body.author, body.taggedUsers)
        .then((message)=>{
            return res.status(200).end();
        })
        .catch((err)=>{
            logger.error(err);
            return res.status(400).end();
        });
};

exports.deleteMessage = async (req,res) => {
    const idMessage =  req.params['id_message'];

    service.removeMessage(idMessage)
        .then((response)=>{
            return res.status(204).end();
        })
        .catch((err)=>{
            logger.error(err);
            return res.status(400).send(new Erreur("Impossible de supprimer le message")).end();
        })
};