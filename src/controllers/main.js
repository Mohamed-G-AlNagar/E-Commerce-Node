const main = (req, res) => {
  res.write("Welcome To Mohamed Gaber Al-Nagar Node API\n");
  res.write(
    `Postman Collection: <a href='https://documenter.getpostman.com/view/32077555/2s9YywffND'>Postman Collection</a>`
  );
  res.end();
};

export default main;
