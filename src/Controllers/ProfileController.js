const Profile = require("../Model/Profile");

module.exports = {
  async index(req, res) {
    return res.render("profile", { profile: await Profile.get() });
  },

  async update(req, res) {
    const data = req.body;

    //Quantidade de semanas por ano
    const weeksPerYear = 52;

    //Remove as semanas de férias e determina a quantidade média de semanas por mês
    const weeksPerMonth = (weeksPerYear - data.vacation_per_year) / 12;

    //Quantidade de horas trabalhadas por semana
    const weekTotalHours = data.hours_per_day * data.days_per_week;

    //Quantidade de horas trabalhadas por mês
    const monthlyTotalHours = weekTotalHours * weeksPerMonth;

    //Valor da horas
    const valueHour = data.monthly_budget / monthlyTotalHours;

    const profile = await Profile.get();

    await Profile.update({
      ...profile,
      ...req.body,
      value_hour: valueHour,
    });

    return res.redirect("/profile");
  },
};
