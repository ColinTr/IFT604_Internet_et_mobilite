const KourseModel = require('../models/kourse');

class KourseService {

    async addKourse(dashboard, title, elements){
        const kourse = new KourseModel({
            _dashboard: dashboard,
            title: title,
            elements: elements
        });
        await kourse.save();

        return kourse;
    }

    async getKourse(id){
        return await KourseModel.findById(id);
    }

    async getKoursesFromDashboard(dashboard){
        return await KourseModel.find({_dashboard: dashboard});
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