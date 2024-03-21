const {
  genneraAccessToken,
  genneraRefreshToken,
  refreshTokenJwtService,
} = require("../JwtService/JwtService");
const { avatarPath } = require("../constant/pathImages");
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const Address = require("../models/AddressModel");

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
      res.status(200).json({
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
  async address(req, res) {
    const userId = req.userInfo.id;
    const address = req.body;

    const checkUser = await User.findOne({
      _id: userId,
    });
    if (!checkUser) {
      return res.status(400).send("người dùng không tồn tại");
    }
    try {
      const embeddedDocuments = checkUser.address;
      const isDefaultAddressExists = embeddedDocuments.some(
        (embeddedDocument) =>
          embeddedDocument.ischeck &&
          embeddedDocument.ischeck === address.ischeck
      );
      if (isDefaultAddressExists) {
        return res.status(400).send("Chỉ được phép có một địa chỉ mặc định");
      }
      const newAddress = new Address(address);
      await newAddress.save();

      const updateUser = await User.findByIdAndUpdate(userId, {
        $push: { address: newAddress },
      });
      return res.status(200).json({
        status: "success",
        message: "cập nhâpj thành công",
        data: updateUser,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }

  async updateAddress(req, res) {
    const address = req.body;
    const idAdress = req.params.id;
    const userId = req.userInfo.id;

    const checkUser = await User.findOne({
      _id: userId,
    });
    if (!checkUser) {
      return res.status(400).send("người dùng không tồn tại");
    }
    try {
      const embeddedDocuments = checkUser.address;
      const updateAddress = await Address.findByIdAndUpdate(idAdress, address, {
        new: true,
      });

      const addressIndex = embeddedDocuments.findIndex((embeddedDocument) =>
        embeddedDocument._id.equals(idAdress)
      );
      if (addressIndex !== -1) {
        embeddedDocuments[addressIndex]._doc = updateAddress;
      }

    

      await Address.findByIdAndUpdate(idAdress, address);
      await User.updateOne(
        { _id: userId, "address._id": idAdress },
        {
          $set: {
            "address.$.company": address.company,
            "address.$.name": address.name,
            "address.$.selectedDistrict": address.selectedDistrict,
            "address.$.selectedProvince": address.selectedProvince,
            "address.$.selectedWard": address.selectedWard,
            "address.$.telephone": address.telephone,
            "address.$.street": address.street,
            "address.$.value": address.value,
            "address.$.ischeck": address.ischeck,
            "address.$.region": address.region,
          },
        }
      );
      return res.status(200).json({
        status: "success",
        message: "Cập nhật thành công",
        data: address,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
  async detailAddress(req, res) {
    const idAddress = req.params.id;
    if (!idAddress) {
      return res.status(400).json({
        status: "error",
        message: "không có địa chỉ id",
      });
    }

    try {
      const address = await Address.findOne({
        _id: idAddress,
      });
      return res.status(200).json({
        status: "success",
        message: "update thành công",
        data: address,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
  async deleteAddress(req, res) {
    const idAddress = req.params.id;
    const userId = req.userInfo.id;

    if (!idAddress) {
      return res.status(400).json({
        status: "error",
        message: "lõi ko tìm thấy địa chỉ id",
      });
    }
    try {
      const address = await Address.findOneAndDelete(idAddress);
      await User.updateOne(
        { _id: userId },
        { $pull: { address: { _id: idAddress } } }
      
      );
      return res.status(200).json({
        status: "success",
        message: "delete thành công",
        data: address,
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
