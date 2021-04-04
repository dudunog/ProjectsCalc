const express = require("express");
const routes = express.Router();

const viewsPath = __dirname + "/Views/";

const Profile = {
  data: {
    name: "Jakeline",
    avatar:
      "https://avatars.githubusercontent.com/u/17316392?s=460&u=6912a91a70bc89745a2079fdcdad3bc3ce370f13&v=4",
    "monthly-budget": 5000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 10,
    "value-hour": 75,
  },
  controllers: {
    index(req, res) {
      return res.render(viewsPath + "profile", { profile: Profile.data });
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

      Profile.data = {
        ...Profile.data,
        ...req.body,
        "value-hour": valueHour,
      };

      console.log(Profile.data["value-hour"]);
      return res.redirect("/profile");
    },
  },
};

const Job = {
  data: [
    {
      id: 1,
      name: "Pizzaria Guloso",
      "daily-hours": 2,
      "total-hours": 1,
      created_at: Date.now(),
    },
    {
      id: 2,
      name: "OneTwo Project",
      "daily-hours": 3,
      "total-hours": 47,
      created_at: Date.now(),
    },
  ],
  controllers: {
    index(req, res) {
      const updatedJobs = Job.data.map((job) => {
        const remaining = Job.services.remainingDays(job);
        const status = remaining <= 0 ? "done" : "progress";

        return {
          ...job,
          remaining,
          status,
          budget: Job.services.calculateBudget(job, Profile.data["value-hour"]),
        };
      });

      return res.render(viewsPath + "index", { jobs: updatedJobs });
    },
    get(req, res) {
      return res.render(viewsPath + "job");
    },
    create(req, res) {
      console.log(req.body);
      const lastId = Job.data[Job.data.length - 1]?.id || 1;

      Job.data.push({
        id: lastId + 1,
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
        created_at: Date.now(),
      });

      return res.redirect("/");
    },
    show(req, res) {
      const jobId = req.params.id;

      const job = Job.data.find((job) => Number(job.id) === Number(jobId));

      if (!job) {
        return res.send("Job not found!");
      }

      job.budget = Job.services.calculateBudget(
        job,
        Profile.data["value-hour"]
      );

      return res.render(viewsPath + "job-edit", { job });
    },
    update(req, res) {
      const jobId = req.params.id;

      const job = Job.data.find((job) => Number(job.id) === Number(jobId));

      if (!job) {
        return res.send("Job not found!");
      }

      const updatedJob = {
        ...job,
        name: req.body.name,
        "total-hours": req.body["total-hours"],
        "daily-hours": req.body["daily-hours"],
      };

      Job.data = Job.data.map((job) => {
        if (Number(job.id) === Number(jobId)) {
          job = updatedJob;
        }

        return job;
      });

      return res.redirect("/job/" + jobId);
    },
    delete(req, res) {
      const jobId = req.params.id;

      Job.data = Job.data.filter((job) => Number(job.id) !== Number(jobId));

      return res.redirect("/");
    },
  },
  services: {
    remainingDays(job) {
      //Calcula o tempo para a conclusão de um projeto
      const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed();

      //Calcula a data prevista para a conclusão de um projeto
      const createdDate = new Date(job.created_at);
      const dueDay = createdDate.getDate() + Number(remainingDays);
      const dueDateInMs = createdDate.setDate(dueDay);

      //Tempo restante, em milissegundso, para conclusão de um projeto
      const timeDiffInMs = dueDateInMs - Date.now();

      //Transforma o tempo restante em dias
      const dayInMs = 1000 * 60 * 60 * 24;
      const dayDiff = Math.floor(timeDiffInMs / dayInMs);

      return dayDiff;
    },
    calculateBudget: (job, valueHour) => valueHour * job["total-hours"],
  },
};

routes.get("/", Job.controllers.index);
routes.get("/job", Job.controllers.get);
routes.post("/job", Job.controllers.create);
routes.get("/job/:id", Job.controllers.show);
routes.post("/job/:id", Job.controllers.update);
routes.post("/job/delete/:id", Job.controllers.delete);
routes.get("/profile", Profile.controllers.index);
routes.post("/profile", Profile.controllers.update);

module.exports = routes;
