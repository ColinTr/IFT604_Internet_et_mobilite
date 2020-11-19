const UserModel = require('../models/user');

// WARNING - Will probably change with the oauth integration

class UserService {

    async addUser(username, password, token, refreshToken){
        const user = new UserModel({
            username: username,
            password: password,
            token: token,
            refreshToken: refreshToken,
            created: new Date()
        });
        await user.save();

        return user;
    }

    async updateUser(id, update){
        const filter = {_id: id};
        await UserModel.findOneAndUpdate(filter, update);
        return await UserModel.findById(id);
    }

    async getUser(id){
        return await UserModel.findById(id);
    }

    async getUsersByName(name){
        return await UserModel.find({username: name})
    }

    async removeUser(id){
        return await UserModel.deleteOne({_id: id});
    }

}

module.exports = new UserService();