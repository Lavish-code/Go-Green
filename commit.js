const fs = require("fs");
const moment = require("moment");
const simpleGit = require("simple-git");
const random = require("random");

const git = simpleGit();

// Read commit dates from commits.json
const commits = JSON.parse(fs.readFileSync("commits.json", "utf8"));

(async () => {
  for (let c of commits) {
    const date = moment(c.date);

    // Create a dummy file to commit
    fs.writeFileSync("dummy.txt", date.format());

    // Add and commit with backdated timestamp
    await git.add(".");
    await git.commit("goGreen commit", {
      "--date": date.format("YYYY-MM-DDTHH:mm:ss")
    });

    console.log(`Committed for ${date.format("YYYY-MM-DD")}`);
  }
})();
