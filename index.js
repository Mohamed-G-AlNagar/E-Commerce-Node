import initDBConnection from "./DB/initConnection.js";
import server from "./myApp.js";

initDBConnection();

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
