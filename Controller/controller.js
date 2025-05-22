const jwt = require('jsonwebtoken')
const userModel = require('../Model/user');
const foodModel = require('../Model/food');
const cloudinary = require("cloudinary").v2;

const multer = require("multer");
const { storage } = require("../config/cloudinary");

const parser = multer({ storage });


// CREATE
const createUser = async (req, res) => {
    try {
        const userObj = await userModel.create({
            user_name: req.body.name,
            user_email: req.body.email,
            user_pass: req.body.pass,
            user_address: req.body.address,
            user_phone: req.body.phone
        });

        if (!userObj) {
            return res.status(403).json({ message: "Unable to create User" });
        }

        return res.status(200).json({ message: "SignUp Done", user: userObj });
    } catch (error) {
        console.error("Error creating user:", error.message);
        return res.status(500).json({ message: "Unable to create User", error: error.message });
    }
};

// READ (all users)
const getUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving users", error: error.message });
    }
};

// UPDATE (by ID)
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                user_name: req.body.name,
                user_email: req.body.email,
                user_pass: req.body.pass,
                user_address: req.body.address,
                user_phone: req.body.phone
            },
            { new: true } // Return updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        return res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

// DELETE (by ID)
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const deletedUser = await userModel.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully", user: deletedUser });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};

const createFood = async (req, res) => {
  try {
    // multer + cloudinary adds file info in req.file
    const imageUrl = req.file.path; // Cloudinary URL

    const foodObj = await foodModel.create({
      name: req.body.name,
      price: req.body.price,
      desc: req.body.desc,
      image: imageUrl,
    });

    res.status(201).json({ message: "Food added successfully", food: foodObj });
  } catch (error) {
    console.error("Error creating food:", error.message);
    res.status(500).json({ message: "Failed to add food", error: error.message });
  }
};

const getAllFood = async (req, res) => {
  try {
    const foods = await foodModel.find();
    return res.status(200).json({
      message: "All food items fetched successfully",
      foods: foods,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch food items",
      error: error.message,
    });
  }
};

const deleteFood = async(req,res) => {
    try{
        const foodId = req.params.id;

        const foodDetails = await foodModel.findById(foodId);

        if (!foodDetails) return res.status(404).json({ message: "Food not found" });
        const imageParts = foodDetails.image.split('/');
        const public_id = imageParts.slice(-2).join('/').split('.')[0];
        console.log("Public id is: ", public_id);
        await cloudinary.uploader.destroy(public_id);
        await foodModel.findByIdAndDelete(foodId);
        return res.status(200).json({ message: "Food and image deleted successfully" });
    }catch (error) {
    return res.status(500).json({
      message: "Failed to fetch food items",
      error: error.message,
    });
  }
}

const updateFood = async (req, res) => {
  try {
    const foodId = req.params.id;
    const existingFood = await foodModel.findById(foodId);

    if (!existingFood) {
      return res.status(404).json({ message: "Food not found" });
    }

    // If new image is uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      const imageUrl = existingFood.image; // old image URL
      const imageParts = imageUrl.split("/");
      // Get public_id (folder + file name without extension)
      const public_id = imageParts.slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(public_id);

      // Update with new image URL from multer + Cloudinary
      existingFood.image = req.file.path;
    }

    // Update other fields if provided
    if (req.body.name) existingFood.name = req.body.name;
    if (req.body.price) existingFood.price = req.body.price;
    if (req.body.desc) existingFood.desc = req.body.desc;

    // Save updated document
    const updatedFood = await existingFood.save();

    return res.status(200).json({
      message: "Food updated successfully",
      food: updatedFood,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating food",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, pass } = req.body;

    // Find user by email
    const userObj = await userModel.findOne({ user_email: email });
    if (!userObj) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords (plain text)
    if (userObj.user_pass !== pass) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { user_id: userObj._id, user_email: userObj.user_email },
      process.env.privateKey,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: userObj._id,
        name: userObj.user_name,
        email: userObj.user_email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// SEARCH user by email
const searchUser = async (req, res) => {
  try {
    const email = req.params.email;  // email passed as route param

    const userObj = await userModel.findOne({ user_email: email });

    if (!userObj) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User found", user: userObj });
  } catch (error) {
    return res.status(500).json({ message: "Error searching user", error: error.message });
  }
};

const searchFoodById = async (req, res) => {
  try {
    const foodId = req.params.id;

    const foodItem = await foodModel.findById(foodId);

    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    return res.status(200).json({ message: "Food item found", food: foodItem });
  } catch (error) {
    return res.status(500).json({ message: "Error searching food item", error: error.message });
  }
};


module.exports = {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
    createFood,
    getAllFood,
    deleteFood,
    updateFood,
    loginUser,
    searchUser,
    searchFoodById
};

console.log("User Controller is working");
