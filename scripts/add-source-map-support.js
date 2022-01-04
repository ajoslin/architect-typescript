/*
 * NOTE(ajoslin): this file is used during dev to add sourcemaps to compiled TS files.
 * This doesn't run on the prod build.
 */

const glob = require("glob");
const path = require("path");
const fs = require("fs");

glob
  .sync("src/**/!(node_modules)/*.js", {
    cwd: path.resolve(__dirname, ".."),
  })
  .forEach((file) => {
    const filepath = path.join(__dirname, "..", file);
    const contents = fs.readFileSync(filepath, "utf8");
    fs.writeFileSync(
      filepath,
      `require('source-map-support/register');\n${contents}`
    );
  });
