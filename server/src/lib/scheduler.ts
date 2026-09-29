import cron from "node-cron";
import { sendHourlyReminder } from './expo-push';



export const startScheduler = () => {

  cron.schedule("*/30 * * * *", async () => {
    console.log("Running hourly reminder job...");
    await sendHourlyReminder();
  });

  console.log("Scheduler started.");

}

