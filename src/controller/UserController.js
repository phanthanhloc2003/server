const {
  genneraAccessToken,
  genneraRefreshToken,
  refreshTokenJwtService,
} = require("../JwtService/JwtService");
const { avatarPath } = require("../constant/pathImages");
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class UserController {
  async signUp(req, res, next) {
    try {
      const { name, email, password, confirmPassword, phone } = req.body;

      let newPassword = password.toString();
      const hash = await bcrypt.hashSync(newPassword, saltRounds);

      const checkUser = await User.findOne({
        email: email,
      });

      if (checkUser !== null) {
        return res.status(400).json({
          status: "error",
          message: "User already exists",
        });
      }

      if (!name || !email || !password || !confirmPassword || !phone) {
        return res.status(400).json({
          status: "error",
          message: "All input fields are required",
        });
      } else if (password !== confirmPassword) {
        return res.status(400).json({
          status: "error",
          message: "Passwords do not match",
        });
      }

      const user = new User({ ...req.body, password: hash });

      await user.save().then(() => {
        return res.status(201).json({
          status: "success",
          message: "User created",
        });
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          status: "error",
          message: "All input fields are required",
        });
      }
      const checkUser = await User.findOne({
        email: email,
      });

      if (checkUser === null) {
        return res.status(400).json({
          status: "error",
          message: "The User is not defined",
        });
      }
      let newPassword = password.toString();
      const comparePasword = bcrypt.compareSync(
        newPassword,
        checkUser.password
      );
      if (!comparePasword) {
        return res.status(400).json({
          status: "error",
          message: "The password or user is incorrect",
        });
      }

      const access_Token = await genneraAccessToken({
        id: checkUser._id,
        isAdmin: checkUser.isAdmin,
      });
      
      const refresh_Token = await genneraRefreshToken({
        id: checkUser._id,
        isAdmin: checkUser.isAdmin,
      });

      return res.status(200).json({
        status: "success",
        message: "Login successful",
        access_Token,
        refresh_Token,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async updateUser(req, res, next) {
    try {
      const userId = req.params.id;
      const data = req.body;
      const user = await User.findById({
        _id: userId,
      });
      if (user === null) {
        return res.status(400).json({
          status: "error",
          message: "User not found",
        });
      }
      const updateUser = await User.findByIdAndUpdate(userId, data, {
        new: true,
      });

      res.json({
        status: "success",
        message: "User updated",
        data: updateUser,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async deleteUser(req, res, next) {
    try {
      const userId = req.params.id;
      const user = await User.findById({
        _id: userId,
      });
      if (user === null) {
        return res.status(400).json({
          status: "error",
          message: "User not found",
        });
      }
      const deleteUser = await User.findByIdAndDelete(userId);
      res.json({
        status: "success",
        message: "User deleted",
        data: deleteUser,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await User.find();
      res.json({
        status: "success",
        message: "Users found",
        data: users,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
  async getDetailsId(req, res, next) {
    try {
      const userId = req.params.id;

      const checkUser = await User.findOne({
        _id: userId,
      });

      if (checkUser === null) {
        return res.status(400).json({
          status: "error",
          message: "The User is not defined",
        });
      }

      const detailsId = await User.findById(userId);
      res.json({
        status: "success",
        message: "User details found",
        data: detailsId,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async refreshToken(req, res, next) {
    try {
      const token = req.body.refreshToken;
      if (!token) {
        return res.status(400).json({
          status: "error",
          message: "no a token",
        });
      }
      const refreshToken = await refreshTokenJwtService(token);
      res.json({
        status: "success",
        message: "User details refreshToken",
        data: refreshToken,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error a",
        message: error.message,
      });
    }
  }
  async passwork(req, res, next) {
    const current = req.body.current;
    const newPassword = req.body.newPassword;
    const password = req.body.password;
    const userId = req.params.id;
    const checkUser = await User.findOne({
      _id: userId,
    });

    try {
      const comparePasword = bcrypt.compareSync(current, checkUser.password);
      if (!comparePasword) {
        return res.status(400).json({
          status: "error",
          message: "mật khẩu không đúng",
        });
      }

      if (!(newPassword === password)) {
        return res.status(400).json({
          status: "error",
          message: "mật khẩu không giống nhau",
        });
      }

      const hash = await bcrypt.hashSync(password, saltRounds);
    

      const updateUser = await User.findByIdAndUpdate(
        userId,
        { password: hash },
        {
          new: true,
        }
      );
      return res.status(200).json({
        status: "success",
        message: "Login successful",
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async uploadImage(req, res, next) {
    if (!req.file) return res.status(400).send("Upload File Không THành Công.");
    try {
      const result = await User.updateOne(
        {
          email: req.body.username,
        },
        {
          avata: `${avatarPath}${req.file.filename}`,
        }
      );
      const user = await User.findOne({
        email: req.body.username,
      });
      res.json({
        status: "success",
        message: "User details found",
        data: user,
      });
    } catch (error) {
      return res.status(400).send("Update Avatar Không THành Công.");
    }
  }
}

module.exports = new UserController();
