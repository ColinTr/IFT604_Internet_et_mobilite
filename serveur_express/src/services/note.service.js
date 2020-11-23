const NoteModel = require('../models/note');

class NoteService {

    async addNote(dashboard, title, content, author, users){
        const note = new NoteModel({
            _dashboard: dashboard,
            title: title,
            content: content,
            author: author,
            taggedUsers: [...new Set(users)],
            date: new Date()
        });
        await note.save();

        return note;
    }

    async getNote(id){
        return await NoteModel.findById(id);
    }

    async getNotesFromDashboard(dashboardId){
        return await NoteModel.find({_dashboard: dashboardId});
    }

    async getNotesFromUser(userId){
        return await NoteModel.find({author: userId});
    }

    async getNotesTaggingUser(userId){
        return await NoteModel.find({taggedUsers: userId});
    }

    async updateNote(id, update){
        const filter = {_id: id};
        await NoteModel.findOneAndUpdate(filter, update);
        return await NoteModel.findById(id);
    }

    async deleteNote(id){
        return await NoteModel.deleteOne({_id: id});
    }

}

module.exports = new NoteService();