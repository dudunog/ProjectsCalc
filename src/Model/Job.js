const Database = require("../db/config");

module.exports = {
  async get() {
    const db = await Database();

    const data = await db.all("SELECT * FROM jobs");

    await db.close();

    return data;
  },
  async create(newJob) {
    const db = await Database();

    await db.run(`INSERT INTO jobs (
      name,
      daily_hours,
      total_hours,
      created_at
    ) VALUES (
      '${newJob.name}',
      ${newJob.daily_hours},
      ${newJob.total_hours},
      ${newJob.created_at}
    )`);

    await db.close();
  },
  async update(updatedJob) {
    const db = await Database();

    db.run(`UPDATE jobs SET 
      name = '${updatedJob.name}',
      daily_hours = ${updatedJob.daily_hours},
      total_hours = ${updatedJob.total_hours}
      WHERE id = ${updatedJob.id}
    `);

    await db.close();
  },
  async delete(id) {
    const db = await Database();

    await db.run(`DELETE FROM jobs WHERE id = ${id}`);

    await db.close();
  },
};
