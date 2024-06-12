var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require('multer')
var connection = require("../config/database.js");
const Model_Kategori = require("../model/Model_Kategori.js");
const Model_Alat = require("../model/Model_Alat.js");
const Model_Users = require("../model/Model_Users.js");
const Model_Kelas = require("../model/Model_Kelas.js");

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
      let rows = await Model_Kelas.getAll();
      res.render("kelas_pembelajaran/kelas", {
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
    let kategori = await Model_Kategori.getAll();
    let alat = await Model_Alat.getAll();
    res.render("kelas_pembelajaran/create", {
      judul: "",
      deskripsi: "",
      harga_kelas: "",
      link_kelas: "",
      id_kategori: "",
      id_alat: "",
      data1: kategori,
      data2: alat,
    });
  } catch (error) {
    console.log(error); // Menampilkan pesan kesalahan ke konsol
    next(error); // Meneruskan kesalahan ke penanganan kesalahan berikutnya (jika ada)
  }
});


router.post(
  "/store",
  upload.single("file_kelas"),
  async function (req, res, next) {
    try {
      let { judul, deskripsi, harga_kelas, link_kelas, id_kategori, id_alat } = req.body;
      let Data = {
        judul,
        deskripsi,
        harga_kelas,
        link_kelas,
        id_kategori,
        id_alat,
        file_kelas: req.file.filename
      };
      await Model_Kelas.Store(Data);
      req.flash("success", "Berhasil menyimpan data");
      res.redirect("/kelas_pembelajaran");
    } catch (error) {
      console.log(error); // Menampilkan pesan kesalahan ke konsol
      req.flash("error", "Gagal menyimpan data");
      res.redirect("/kelas_pembelajaran");
    }
  }
);


router.get("/edit/(:id)", async function (req, res, next) {
  try {
    let id = req.params.id;
    let kategori = await Model_Kategori.getAll();
    let alat = await Model_Alat.getAll();
    let rows = await Model_Kelas.getId(id);
    
    // Periksa apakah ada data yang ditemukan untuk ID yang diberikan
    if (rows.length > 0) {
      res.render("kelas_pembelajaran/edit", {
        id: rows[0].id_kelas,
        judul: rows[0].judul,
        deskripsi: rows[0].deskripsi,
        harga_kelas: rows[0].harga_kelas,
        link_kelas: rows[0].link_kelas,
        file_kelas: rows[0].file_kelas,
        id_kategori: rows[0].id_kategori,
        data1: kategori,
        id_alat: rows[0].id_alat,
        data2: alat,
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

router.post("/update/:id", upload.single("file_kelas"), async function (req, res, next) {
  try {
      let id = req.params.id;
      let filebaru = req.file ? req.file.filename : null;
      let rows = await Model_Kelas.getId(id);
      const namaFileLama = rows[0].file_kelas;
      if (filebaru && namaFileLama) {
          const pathFileLama = path.join(__dirname, "../public/images/upload", namaFileLama);
          fs.unlinkSync(pathFileLama);
      }

      let { judul, deskripsi, harga_kelas, link_kelas, id_kategori, id_alat } = req.body;
      let file_kelas = filebaru || namaFileLama;
      let Data = {
        judul,
        deskripsi,
        harga_kelas,
        link_kelas,
        id_kategori,
        id_alat,
        file_kelas
      };

      await Model_Kelas.Update(id, Data);
      req.flash("Success", "Berhasil menyimpan data");
      res.redirect("/kelas_pembelajaran");
  } catch (error) {
      console.log(error); // Menampilkan pesan kesalahan ke konsol
      req.flash("error", "Terjadi kesalahan pada fungsi");
      res.redirect("/kelas_pembelajaran");
  }
});



router.get("/delete/(:id)", async function (req, res) {
  let id = req.params.id;
  let rows = await Model_Kelas.getId(id)
  const namaFileLama = rows[0].file_kelas;
  if(namaFileLama){
    const pathFileLama = path.join(__dirname, '../public/images/upload', namaFileLama);
    fs.unlinkSync(pathFileLama);
  }
  await Model_Kelas.Delete(id);
  req.flash("Success", "berhasil menghapus data");
  res.redirect("/kelas_pembelajaran");
});

module.exports = router;
