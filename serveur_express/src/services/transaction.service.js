const TransactionModel = require('../models/transaction');

class TransactionService {

    async addTransaction(dashboard, from, to, type, montant, object, date){
        const transaction = new TransactionModel({
            _dashboard: dashboard,
            from: from,
            to: to,
            type: type,
            montant: montant,
            object: object,
            date: date
        });
        await transaction.save();

        return transaction;
    }

    async getTransaction(id){
        return await TransactionModel.findById(id);
    }

    async getTransactionsFromDashboard(dashboardId){
        return await TransactionModel.find({_dashboard: dashboardId});
    }

    async getTransactionsFrom(from){
        return await TransactionModel.find({from: from});
    }

    async getTransactionsTo(to){
        return await TransactionModel.find({to: to});
    }

    async getTransactionsFromTo(from, to){
        return await TransactionModel.find({from: from, to: to});
    }

    async updateTransaction(id, update){
        const filter = {_id: id};
        await TransactionModel.findOneAndUpdate(filter, update);
        return await TransactionModel.findById(id);
    }

    async removeTransaction(id){
        return await TransactionModel.deleteOne({_id: id});
    }

}

module.exports = new TransactionService();