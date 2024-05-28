var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require('multer')
const Model_Alat = require("../model/Model_Alat.js");
const Model_Users = require("../model/Model_Users.js");

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
      let rows = await Model_Alat.getAll();
      res.render("alat/alat_index", {
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
    res.render("alat/create", {
      nama_alat: "",
    });
  } catch (error) {
    console.log(error); // Menampilkan pesan kesalahan ke konsol
    next(error); // Meneruskan kesalahan ke penanganan kesalahan berikutnya (jika ada)
  }
});


router.post(
  "/store",
  upload.single("file_alat"),
  async function (req, res, next) {
    try {
      let { nama_alat } = req.body;
      let Data = {
        nama_alat,
        file_alat: req.file.filename
      };
      await Model_Alat.Store(Data);
      req.flash("success", "Berhasil menyimpan data");
      res.redirect("/alat");
    } catch (error) {
      console.log(error); // Menampilkan pesan kesalahan ke konsol
      req.flash("error", "Gagal menyimpan data");
      res.redirect("/alat");
    }
  }
);


router.get("/edit/(:id)", async function (req, res, next) {
  try {
    let id = req.params.id;
    let rows = await Model_Alat.getId(id);
    
    // Periksa apakah ada data yang ditemukan untuk ID yang diberikan
    if (rows.length > 0) {
      res.render("alat/edit", {
        id: rows[0].id_alat,
        nama_alat: rows[0].nama_alat,
      });
    } else {
      // Jika tidak ada data yang ditemukan, kembalikan respon 404
      res.status(404).send('Data not found');
    }
  } catch (error) {
    console.log(error); // Menampilkan pesan kesalahan ke konsol
    next(error); // Meneruskan kesalahan ke penanganan kesalahan berikutnya (jika ada)
  }
});

router.post("/update/:id", upload.single("file_alat"), async function (req, res, next) {
  try {
      let id = req.params.id;
      let filebaru = req.file ? req.file.filename : null;
      let rows = await Model_Alat.getId(id);
      const namaFileLama = rows[0].file_alat;
      if (filebaru && namaFileLama) {
          const pathFileLama = path.join(__dirname, "../public/images/upload", namaFileLama);
          fs.unlinkSync(pathFileLama);
      }

      let { nama_alat,} = req.body;
      let file_alat = filebaru || namaFileLama;
      let Data = {
        nama_alat,
        file_alat
      };

      await Model_Alat.Update(id, Data);
      req.flash("Success", "Berhasil menyimpan data");
      res.redirect("/alat");
  } catch (error) {
      console.log(error); // Menampilkan pesan kesalahan ke konsol
      req.flash("error", "Terjadi kesalahan pada fungsi");
      res.redirect("/alat");
  }
});



router.get("/delete/(:id)", async function (req, res) {
  let id = req.params.id;
  let rows = await Model_Alat.getId(id)
  const namaFileLama = rows[0].file_kelas;
  if(namaFileLama){
    const pathFileLama = path.join(__dirname, '../public/images/upload', namaFileLama);
    fs.unlinkSync(pathFileLama);
  }
  await Model_Alat.Delete(id);
  req.flash("Success", "berhasil menghapus data");
  res.redirect("/alat");
});

module.exports = router;
