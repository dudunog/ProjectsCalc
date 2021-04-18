const Profile = require("../Model/Profile");

module.exports = {
  index(req, res) {
    return res.render("profile", { profile: Profile.get() });
  },

  update(req, res) {
    const data = req.body;

    //Quantidade de semanas por ano
    const weeksPerYear = 52;

    //Remove as semanas de férias e determina a quantidade média de semanas por mês
    const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12;

    //Quantidade de horas trabalhadas por semana
    const weekTotalHours = data["hours-per-day"] * data["days-per-week"];

    //Quantidade de horas trabalhadas por mês
    const monthlyTotalHours = weekTotalHours * weeksPerMonth;

    //Valor da horas
    const valueHour = data["monthly-budget"] / monthlyTotalHours;

    Profile.update({
      ...Profile.get(),
      ...req.body,
      "value-hour": valueHour,
    });

    return res.redirect("/profile");
  },
};
