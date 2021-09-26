const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const { initialize } = require("zokrates-js/node");
const cors = require("@koa/cors");

const { Proof } = require("./proof");

const app = new Koa();
app.use(bodyParser());
app.use(cors());

async function main() {
  const zok = await initialize();

  const commit = new Proof(zok, "commit");

  app.use((ctx) => {
    const { inputs } = ctx.request.body;
    if (inputs.length < 4) {
      ctx.body = JSON.stringify({ error: "provide 4 inputs" });
      return;
    }

    const out = commit.proof(inputs);
    ctx.body = JSON.stringify(out);
  });

  app.listen(5001, () => {
    console.log("Listening on port: 5001");
  });
}

if (require.main === module) {
  main();
}
