import fs from "fs";
import SimpleNodeLogger from "simple-node-logger";

const fileName = "system.log";

const log = SimpleNodeLogger.createSimpleLogger({
    logFilePath: fileName,
    timestampFormat: "YYYY-MM-DD HH:mm:ss"
});

function logToFile(string) {
    const stats = fs.statSync(fileName);
    const fileSizeInBytes = stats.size;
    if (fileSizeInBytes > 5000000) {
        fs.writeFile(fileName, "");
    }
    log.info(string);
}

export default logToFile;