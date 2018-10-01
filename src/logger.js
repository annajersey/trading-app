const SimpleNodeLogger = require("simple-node-logger"),
    opts = {
        logFilePath: "system.log",
        timestampFormat: "YYYY-MM-DD HH:mm:ss"
    };
const log = SimpleNodeLogger.createSimpleLogger(opts);
export default log;