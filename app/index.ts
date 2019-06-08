import Express, {Response} from "express";

const app = Express();

app.get("/", (_, res: Response) => {
  res.send("Hello, world!!");
});
app.listen(3000, () => console.log("server start"));
