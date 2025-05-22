const foodController = require('../Controller/controller');
const express = require('express');
const Router = express.Router();

const multer = require("multer");
const { storage } = require("../config/cloudinary");

const upload = multer({ storage });

Router.post("/add",foodController.createUser);
Router.post("/login", foodController.loginUser);
Router.get("/users", foodController.getUsers); 
Router.get("/users/:email", foodController.searchUser);              
Router.put("/update/:id", foodController.updateUser);        
Router.delete("/delete/:id", foodController.deleteUser);

Router.post("/addFood", upload.single("image"), foodController.createFood);
Router.get("/foods", foodController.getAllFood);
Router.get("/foods/:id", foodController.searchFoodById);
Router.delete("/deleteFood/:id", foodController.deleteFood);
Router.put("/updateFood/:id", upload.single("image"), foodController.updateFood);

module.exports = Router;