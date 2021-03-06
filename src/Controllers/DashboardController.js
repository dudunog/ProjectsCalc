const Job = require("../Model/Job");
const JobUtils = require("../Utils/JobUtils");
const Profile = require("../Model/Profile");

module.exports = {
  async index(req, res) {
    const jobs = await Job.get();
    const profile = await Profile.get();

    let statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length,
    };

    //Total de horas por dia de todos os jobs em progresso
    let jobTotalHours = 0;

    const updatedJobs = jobs.map((job) => {
      const remaining = JobUtils.remainingDays(job);
      const status = remaining <= 0 ? "done" : "progress";

      //Setando o statusCount
      statusCount[status] += 1;

      jobTotalHours =
        status === "progress"
          ? (jobTotalHours += Number(job.daily_hours))
          : jobTotalHours;

      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profile.value_hour),
      };
    });

    //Cálculo da qtd de horas livres no dia

    const freeHours = profile.hours_per_day - jobTotalHours;

    return res.render("index", {
      jobs: updatedJobs,
      profile: profile,
      statusCount: statusCount,
      freeHours: freeHours,
    });
  },
};
