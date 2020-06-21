const { execFileSync } = require("child_process");
const Benchmark = require("benchmark");
const suite = new Benchmark.Suite();
const honkitBin = require.resolve(".bin/honkit");
suite
    .add("run honkit build", () => {
        execFileSync(honkitBin, ["build"], {
            cwd: __dirname,
        });
    })
    .on("cycle", (event) => {
        console.log(String(event.target));
    })
    .run();
