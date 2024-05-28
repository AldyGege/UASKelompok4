var express = require("express");
var router = express.Router();
const Model_KategoriPembelajaran = require("../model/Model_Kategori.js");
const Model_Users = require("../model/Model_Users.js");

router.get("/", async function (req, res, next) {
  try {
    let id = req.session.userId;
    let Data = await Model_Users.getId(id);
    if (Data.length > 0) {
      let rows = await Model_KategoriPembelajaran.getAll();
      res.render("kategori_pembelajaran/kategori", {
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
    res.render("kategori_pembelajaran/create", {
      nama_kategori: "",
    });
  } catch (error) {
    console.log(error); // Menampilkan pesan kesalahan ke konsol
    next(error); // Meneruskan kesalahan ke penanganan kesalahan berikutnya (jika ada)
  }
});

router.post("/store", async function (req, res, next) {
  try {
    let { nama_kategori } = req.body;
    let Data = {
      nama_kategori,
    };
    await Model_KategoriPembelajaran.Store(Data);
    req.flash("success", "Berhasil menyimpan data");
    res.redirect("/kategori_pembelajaran");
  } catch (error) {
    console.log(error); // Menampilkan pesan kesalahan ke konsol
    req.flash("error", "Gagal menyimpan data");
    res.redirect("/kategori_pembelajaran");
  }
});

router.get("/edit/(:id)", async function (req, res, next) {
  try {
    let id = req.params.id;
    let rows = await Model_KategoriPembelajaran.getId(id);
    
    // Periksa apakah ada data yang ditemukan untuk ID yang diberikan
    if (rows.length > 0) {
      res.render("kategori_pembelajaran/edit", {
        id: rows[0].id_kategori,
        nama_kategori: rows[0].nama_kategori,
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

router.post("/update/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let { nama_kategori } = req.body;
    let Data = {
      nama_kategori
    };
    await Model_KategoriPembelajaran.Update(id, Data);
    req.flash("Success", "Berhasil menyimpan data");
    res.redirect("/kategori_pembelajaran");
  } catch (error) {
    console.log(error); // Menampilkan pesan kesalahan ke konsol
    req.flash("error", "Terjadi kesalahan pada fungsi");
    res.redirect("/kategori_pembelajaran");
  }
});

router.get("/delete/(:id)", async function (req, res) {
  let id = req.params.id;
  await Model_KategoriPembelajaran.Delete(id);
  req.flash("Success", "Berhasil menghapus data");
  res.redirect("/kategori_pembelajaran");
});

module.exports = router;
