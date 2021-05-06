const Job = require("../Model/Job");
const JobUtils = require("../Utils/JobUtils");
const Profile = require("../Model/Profile");

module.exports = {
  get(req, res) {
    return res.render("job");
  },
  async create(req, res) {
    Job.create({
      name: req.body.name,
      daily_hours: req.body.daily_hours,
      total_hours: req.body.total_hours,
      created_at: Date.now(),
    });

    return res.redirect("/");
  },
  async show(req, res) {
    const jobId = req.params.id;
    const jobs = await Job.get();

    const job = jobs.find((job) => Number(job.id) === Number(jobId));

    if (!job) {
      return res.send("Job not found!");
    }

    const profile = await Profile.get();

    job.budget = JobUtils.calculateBudget(job, profile.value_hour);

    return res.render("job-edit", { job });
  },
  async update(req, res) {
    const updatedJob = {
      id: req.params.id,
      name: req.body.name,
      total_hours: req.body.total_hours,
      daily_hours: req.body.daily_hours,
    };

    await Job.update(updatedJob);

    return res.redirect("/job/" + updatedJob.id);
  },
  async delete(req, res) {
    const jobId = req.params.id;

    await Job.delete(jobId);

    return res.redirect("/");
  },
};
