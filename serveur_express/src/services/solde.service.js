const SoldeModel = require('../models/solde');

class SoldeService {

    async addSolde(dashboard, user, value){
        const solde = new SoldeModel({
            _dashboard: dashboard,
            _user: user,
            value: value
        });
        await solde.save();

        return solde;
    }

    async getSolde(id){
        return await SoldeModel.findById(id);
    }

    async getSoldesFromDashboard(dashboard){
        return await SoldeModel.find({_dashboard: dashboard});
    }

    async updateSolde(id, update){
        const filter = {_id: id};
        await SoldeModel.findOneAndUpdate(filter, update);
        return await SoldeModel.findById(id);
    }

    async removeSolde(id){
        return await SoldeModel.deleteOne({_id: id});
    }

}

module.exports = new SoldeService();