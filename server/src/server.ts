import express from "express";
import cors from "cors";
import { config } from "@/config/index";
import indexRouter from "./routes";
import { startScheduler } from "./lib/scheduler";


const StartServer = async () => {

    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use('/api', indexRouter);
    
    app.listen(config.PORT, () => {
        console.log(`Server running on port ${config.PORT}`);
        startScheduler();
    });
    

}

StartServer();