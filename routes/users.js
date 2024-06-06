var express = require("express");
const Model_Users = require("../model/Model_Users");
var router = express.Router();

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    let id = req.session.userId;
    let Data = await Model_Users.getId(id);
    if (Data.length > 0) {
      //Kondisi pengecekan
      if(Data[0].role != 2){
        res.redirect('/logout')
      }else{
      res.render("users/detail_users/index", {
        title: "Users Home",
        email: Data[0].email,
        nama_users: Data[0].nama_users,
        role: req.session.role
      });
    }
    //Akhir Kondisi

    } else {
      res.status(401).json({ error: "user tidak ada" });
    }
  } catch (error) {
    res.status(501).json("Butuh akses login");
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
