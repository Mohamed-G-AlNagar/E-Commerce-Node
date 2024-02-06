const main = (req, res) => {
  res.setHeader("Content-Type", "text/html"); // Set content type to HTML
  res.write("<h1>Welcome To Mohamed Gaber Al-Nagar Node API</h1>\n");
  res.write(
    `<div style="color: red; font-size: 24px;">Postman Collection: <a href='https://documenter.getpostman.com/view/32077555/2s9YywffND'>Link</a> </div>`
  );
  res.end();
};
export default main;
