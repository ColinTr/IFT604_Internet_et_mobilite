const KourseElementModel = require('../models/kourseElement');

class KourseElementService {

    async addKourseElement(name, img){
        const element = new KourseElementModel({
            name: name,
            img: img
        });
        await element.save();

        return element;
    }

    async getKourseElement(id){
        return await KourseElementModel.findById(id);
    }

    async getKourseElementsByName(name){
        return await KourseElementModel.find({name: name});
    }

    async updateKourseElement(id, update){
        const filter = {_id: id};
        await KourseElementModel.findOneAndUpdate(filter, update);
        return await KourseElementModel.findById(id);
    }

    async removeKourseElement(id){
        return await KourseElementModel.deleteOne({_id: id});
    }

}

module.exports = new KourseElementService();