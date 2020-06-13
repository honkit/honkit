const { execFileSync } = require("child_process");
const Benchmark = require("benchmark");
const suite = new Benchmark.Suite();
const githonBin = require.resolve(".bin/githon");
suite
    .add("run githon build", () => {
        execFileSync(githonBin, ["build"], {
            cwd: __dirname,
        });
    })
    .on("cycle", (event) => {
        console.log(String(event.target));
    })
    .run();
