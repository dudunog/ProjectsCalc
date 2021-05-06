module.exports = {
  remainingDays(job) {
    //Calcula o tempo para a conclusão de um projeto
    const remainingDays = (job.total_hours / job.daily_hours).toFixed();

    //Calcula a data prevista para a conclusão de um projeto
    const createdDate = new Date(job.created_at);
    const dueDay = createdDate.getDate() + Number(remainingDays);
    const dueDateInMs = createdDate.setDate(dueDay);

    //Tempo restante, em milissegundso, para conclusão de um projeto
    const timeDiffInMs = dueDateInMs - Date.now();

    //Transforma o tempo restante em dias
    const dayInMs = 24 * 60 * 60 * 1000;
    const dayDiff = Math.ceil(timeDiffInMs / dayInMs);

    //Tempo restante, em dias, para conclusão de um projeto
    return dayDiff;
  },
  calculateBudget: (job, valueHour) => valueHour * job.total_hours,
};
