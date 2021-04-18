const Job = require("../Model/Job");
const JobUtils = require("../Utils/JobUtils");
const Profile = require("../Model/Profile");

module.exports = {
  get(req, res) {
    return res.render("job");
  },
  create(req, res) {
    const jobs = Job.get();
    const lastId = jobs[jobs.length - 1]?.id || 1;

    jobs.push({
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
    const jobs = Job.get();

    const job = jobs.find((job) => Number(job.id) === Number(jobId));

    if (!job) {
      return res.send("Job not found!");
    }

    const profile = Profile.get();

    job.budget = JobUtils.calculateBudget(job, profile["value-hour"]);

    return res.render("job-edit", { job });
  },
  update(req, res) {
    const jobId = req.params.id;
    const jobs = Job.get();

    const job = jobs.find((job) => Number(job.id) === Number(jobId));

    if (!job) {
      return res.send("Job not found!");
    }

    const updatedJob = {
      ...job,
      name: req.body.name,
      "total-hours": req.body["total-hours"],
      "daily-hours": req.body["daily-hours"],
    };

    const newJobs = jobs.map((job) => {
      if (Number(job.id) === Number(jobId)) {
        job = updatedJob;
      }

      return job;
    });

    Job.update(newJobs);

    return res.redirect("/job/" + jobId);
  },
  delete(req, res) {
    const jobId = req.params.id;
    const jobs = Job.get();

    const newJobs = jobs.filter((job) => Number(job.id) !== Number(jobId));
    Job.update(newJobs);

    return res.redirect("/");
  },
};