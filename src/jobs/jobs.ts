import * as schedule from "node-schedule";

const event = schedule.scheduleJob("*/1 * * * *", function () {
    
  console.log("This runs every 5 minutes");
});

