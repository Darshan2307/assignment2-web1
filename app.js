var express = require("express");
var path = require("path");
var fs = require("fs");
var app = express();
const exphbs = require("express-handlebars");
const data = require("./datasetB/datasetB.json");

//defining port number
const port = process.env.port || 3000;

app.use(express.urlencoded({ extended: true }));

//this gives access to public folder
app.use(express.static(path.join(__dirname, "public")));

// Set Templating Enginge
app.engine(".hbs", exphbs.engine({ extname: ".hbs",
helpers: {
    replaceZeroWithNA: function (value) {
        return value === 0 ? "N/A" : value;
      },
    eq: function (a, b) {
        return a === b;
      }
} }));
app.set("view engine", "hbs");

//get route for "/"(main route)
app.get("/", function (req, res) {
  res.render("index", { title: "Express" });
});

//get route for "users"
app.get("/users", function (req, res) {
  res.send("respond with a resource");
});

app.get("/data", (req, res) => {
  res.render("data", { data: "JSON data is loaded and ready!" });
  // console.log(data);
});

app.get("/data/product/:index", (req, res) => {
  const index = parseInt(req.params.index);

  if (isNaN(index) || index < 0) {
    return res.status(400).json({ error: "Invalid index provided" });
  }

  res.render("product", {product: data[index].title});
});

app.get("/data/search/prdId", (req, res) => {
  res.send(`<form action="/data/search/prdId" method="post">
          <input type="text" name="pId" placeholder="Enter productID">
          <input type="submit" >
      </form>`);
});

app.post("/data/search/prdId", (req, res) => {
    const prodId = req.body.pId;
    const indexData = data.find((d) => d.asin === prodId);
    if (!indexData) {
      res.send("Invalid index");
    }
    res.render("prdId", {product: indexData});
});

app.get("/data/search/prdName", (req, res) => {
  res.send(`<form action="/data/search/prdName" method="post">
            <input type="text" name="pId" placeholder="Enter product name">
            <input type="submit" >
        </form>`);
});

app.post("/data/search/prdName", (req, res) => {
  const prodName = req.body.pId;

    const indexData = data.filter((d) => d.title.includes(prodName));
    if (!indexData) {
      res.send("Invalid Product Name");
    }
    res.render("prdName", {products: indexData});
});


app.get("/allData", (req,res) => {
    res.render("allData", {products: data});
})

//wrong route API call
app.get("*", function (req, res) {
  res.render("error", { title: "Error", message: "Wrong Route" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
