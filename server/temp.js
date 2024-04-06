const { spawn } = require("child_process");

function runEmotionDetection() {
    return new Promise((resolve, reject) => {
        const childPython = spawn("python", ["algo.py"]);

        let res = "";

        childPython.stdout.on("data", (data) => {
            console.log(`stdout : ${data}`);
            res = `${data}`;
        });

        childPython.stderr.on("data", (data) => {
            console.log(data);
        });

        childPython.on("close", (code) => {
            console.log(`child process exited with code ${code}`);
            // Resolve the promise with the result
            
            resolve(res);
        });

        setTimeout(() => console.log(res), 10000);
    });
}

module.exports = { runEmotionDetection };
