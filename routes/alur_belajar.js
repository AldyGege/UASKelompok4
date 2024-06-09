var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require('multer')
var connection = require("../config/database.js");
const Model_Users = require("../model/Model_Users.js");
const Model_Alur_Belajar = require("../model/Model_Alur_Belajar.js");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/upload");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.get("/", async function (req, res, next) {
  try {
    let id = req.session.userId;
    let Data = await Model_Users.getId(id);
    if (Data.length > 0) {
      let rows = await Model_Alur_Belajar.getAll();
      res.render("alur_belajar/alur_belajar", {
        data: rows,
      });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.redirect("/login");
  }
});

router.get("/create", async function (req, res, next) {
  try {
    res.render("alur_belajar/create", {
      alur_belajar: "",
    });
  } catch (error) {
    console.log(error); // Menampilkan pesan kesalahan ke konsol
    next(error); // Meneruskan kesalahan ke penanganan kesalahan berikutnya (jika ada)
  }
});

router.post("/store", upload.single("file_alur_belajar"),
  async function (req, res, next) {
    try {
      let { alur_belajar } = req.body;
      let Data = {
        alur_belajar,
        file_alur_belajar: req.file.filename
      };
      await Model_Alur_Belajar.Store(Data);
      req.flash("success", "Berhasil menyimpan data");
      res.redirect("/alur_belajar");
    } catch (error) {
      console.log(error); // Menampilkan pesan kesalahan ke konsol
      req.flash("error", "Gagal menyimpan data");
      res.redirect("/alur_belajar");
    }
  }
);

router.get("/edit/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let rows = await Model_Alur_Belajar.getId(id);

    if (rows.length > 0) {
      res.render("alur_belajar/edit", {
        id: rows[0].id_alur_belajar,
        alur_belajar: rows[0].alur_belajar,
        file_alur_belajar: rows[0].file_alur_belajar,
      });
    } else {
      res.status(404).send('Data not found');
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/update/:id", upload.single("file_alur_belajar"), async function (req, res, next) {
  try {
    let id = req.params.id;
    let filebaru = req.file ? req.file.filename : null;
    let rows = await Model_Alur_Belajar.getId(id);
    const namaFileLama = rows[0].file_alur_belajar;
    if (filebaru && namaFileLama) {
      const pathFileLama = path.join(__dirname, "../public/images/upload", namaFileLama);
      fs.unlinkSync(pathFileLama);
    }

    let { alur_belajar } = req.body;
    let file_alur_belajar = filebaru || namaFileLama;
    let Data = {
      alur_belajar,
      file_alur_belajar,
    };

    await Model_Alur_Belajar.Update(id, Data);
    req.flash("success", "Berhasil menyimpan data");
    res.redirect("/alur_belajar");
  } catch (error) {
    console.log(error);
    req.flash("error", "Terjadi kesalahan pada fungsi");
    res.redirect("/alur_belajar");
  }
});

router.get("/delete/:id", async function (req, res) {
  let id = req.params.id;
  let rows = await Model_Alur_Belajar.getId(id);
  const namaFileLama = rows[0].file_alur_belajar;
  if (namaFileLama) {
    const pathFileLama = path.join(__dirname, '../public/images/upload', namaFileLama);
    fs.unlinkSync(pathFileLama);
  }
  await Model_Alur_Belajar.Delete(id);
  req.flash("success", "Berhasil menghapus data");
  res.redirect("/alur_belajar");
});

module.exports = router;
