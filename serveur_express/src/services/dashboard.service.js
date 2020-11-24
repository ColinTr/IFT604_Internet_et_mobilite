const DashboardModel = require("../models/dashboard");

class DashboardService {
  async addDashboard(name, users) {
    const dashboard = new DashboardModel({
      name: name,
      users: [...new Set(users)],
    });
    await dashboard.save();

    return dashboard;
  }

  async updateDashboard(id, update) {
    const filter = { _id: id };
    await DashboardModel.findOneAndUpdate(filter, update);
    return await DashboardModel.findById(id);
  }

  async getDashboard(id) {
    return await DashboardModel.findById(id);
  }

  async removeDashboard(id) {
    return await DashboardModel.deleteOne({ _id: id });
  }
}

module.exports = new DashboardService();
