var express = require("express");
const Model_Users = require("../model/Model_Users");
const Model_Alat = require("../model/Model_Alat");
const Model_Video = require("../model/Model_Video");
const Model_Kelas = require("../model/Model_Kelas");
const Model_Alur_Belajar = require("../model/Model_Alur_Belajar");
const Model_Kategori_Pembelajaran = require("../model/Model_Kategori");
var router = express.Router();

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    let id = req.session.userId;
    let Data = await Model_Users.getId(id);
    if (Data.length > 0) {
      // Kondisi pengecekan
      if (Data[0].role != 3) {
        res.redirect('/logout');
      } else {
        // Ambil data alat dan alur_belajar
        let alat = await Model_Alat.getAll();
        let alur_belajar = await Model_Alur_Belajar.getAll();
        let kategori = await Model_Kategori_Pembelajaran.getAll();
        
        // Render halaman dengan data
        res.render("users/detail_common/commonusers", {
          title: "Users Home",
          email: Data[0].email,
          nama_users: Data[0].nama_users,
          role: req.session.role,
          alat: alat,
          alur_belajar: alur_belajar,
          kategori: kategori
        });
      }
    } else {
      res.redirect('/logout');
    }
  } catch (error) {
    next(error);
  }
});

router.get('/class/:id', async function (req, res, next) {
  try {
    let id = req.session.userId;
    let Data = await Model_Users.getId(id);
    if (Data.length > 0) {
      // Kondisi pengecekan
      if (Data[0].role != 3) {
        res.redirect('/logout');
      } else {
        // Get the category ID from the URL parameter
        let kategoriId = req.params.id;

        // Ambil data alat dan alur_belajar
        let alat = await Model_Alat.getAll();
        let kelas = await Model_Kelas.getIdK(kategoriId);
        let alur_belajar = await Model_Alur_Belajar.getAll();
        let kategori = await Model_Kategori_Pembelajaran.getId(kategoriId); // Adjust this method as per your model structure

        // Render halaman dengan data
        res.render("users/detail_common/detail_kelas", {
          title: "Users Home",
          email: Data[0].email,
          nama_users: Data[0].nama_users,
          role: req.session.role,
          alat: alat,
          kelas: kelas,
          alur_belajar: alur_belajar,
          kategori: kategori[0]
        });
      }
    } else {
      res.redirect('/logout');
    }
  } catch (error) {
    next(error);
  }
});

router.get('/course/:id', async function (req, res, next) {
  try {
    let id = req.session.userId;
    let Data = await Model_Users.getId(id);
    if (Data.length > 0) {
      // Kondisi pengecekan
      if (Data[0].role != 3) {
        res.redirect('/logout');
      } else {
        // Get the category ID from the URL parameter
        let kategoriId = req.params.id;

        // Ambil data alat dan alur_belajar
        let alat = await Model_Alat.getAll();
        let video = await Model_Video.getByIdKelas(kategoriId);
        let kelas = await Model_Kelas.getId(kategoriId);
        let alur_belajar = await Model_Alur_Belajar.getAll();
        let kategori = await Model_Kategori_Pembelajaran.getId(kategoriId); // Adjust this method as per your model structure

        // Render halaman dengan data
        res.render("users/detail_common/detail_course", {
          title: "Users Home",
          email: Data[0].email,
          nama_users: Data[0].nama_users,
          role: req.session.role,
          alat: alat,
          video: video,
          kelas: kelas[0],
          alur_belajar: alur_belajar,
          kategori: kategori[0]
        });
      }
    } else {
      res.redirect('/logout');
    }
  } catch (error) {
    next(error);
  }
});



router.get("/daftartutor", async function (req, res, next) {
  try {
    res.render("users/detail_common/commonusers/daftar_mentor", {
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

module.exports = router;
