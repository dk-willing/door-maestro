const { app, env } = require("./src/app");

// Turn on in local development
app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
