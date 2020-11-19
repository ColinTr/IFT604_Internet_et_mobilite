const KourseModel = require('../models/kourse');

class KourseService {

    async addKourse(dashboard, elements){
        const kourse = new KourseModel({
            _dashboard: dashboard,
            elements: elements
        });
        await kourse.save();

        return kourse;
    }

    async getKourse(id){
        return await KourseModel.findById(id);
    }

    async getKoursesFromDashboard(name){
        return await KourseModel.find({name: name});
    }

    async updateKourse(id, update){
        const filter = {_id: id};
        await KourseModel.findOneAndUpdate(filter, update);
        return await KourseModel.findById(id);
    }

    async removeKourse(id){
        return await KourseModel.deleteOne({_id: id});
    }

}

module.exports = new KourseService();