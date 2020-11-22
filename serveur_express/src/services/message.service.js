const MessageModel = require('../models/message');

class MessageService {

    async addMessage(dashboard, content, author, taggedUsers){
        const message = new MessageModel({
            _dashboard: dashboard,
            content: content,
            author: author,
            taggedUsers: [...new Set(taggedUsers)],
            date: new Date()
        });
        await message.save();

        return message;
    }

    async getMessage(id){
        return await MessageModel.findById(id);
    }

    async getMessagesFromDashboard(dashboardId){
        return await MessageModel.find({_dashboard: dashboardId});
    }

    async getMessagesFromUser(userId){
        return await MessageModel.find({author: userId});
    }

    async getMessagesTaggingUser(userId){
        return await MessageModel.find({taggedUsers: userId});
    }

    async updateMessage(id, update){
        const filter = {_id: id};
        await MessageModel.findOneAndUpdate(filter, update);
        return await MessageModel.findById(id);
    }

    async removeMessage(id){
        return await MessageModel.deleteOne({_id: id});
    }

}

module.exports = new MessageService();