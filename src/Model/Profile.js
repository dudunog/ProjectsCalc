let data = {
  name: "Robô",
  avatar:
    "https://images.unsplash.com/photo-1535378620166-273708d44e4c?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=566&q=80",
  "monthly-budget": 5000,
  "days-per-week": 5,
  "hours-per-day": 5,
  "vacation-per-year": 10,
  "value-hour": 75,
};

module.exports = {
  get() {
    return data;
  },
  update(newData) {
    data = newData;
  },
};
