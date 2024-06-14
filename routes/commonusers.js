var express = require("express");
const Model_Activity = require("../model/Model_Activity");
const Model_Users = require("../model/Model_Users");
const Model_Alur_Belajar = require("../model/Model_Alur_Belajar");
const Model_Alat = require("../model/Model_Alat");
const Model_Video = require("../model/Model_Video");
const Model_Kelas = require("../model/Model_Kelas");
const Model_Kategori_Pembelajaran = require("../model/Model_Kategori");

var router = express.Router();

router.get('/', async function (req, res, next) {
  try {
      let id = req.session.userId;
      let Data = await Model_Users.getId(id);
      if (Data.length > 0) {
          // Kondisi pengecekan
          if (Data[0].role != 3) {
              res.redirect('/logout');
          } else {
              // Ambil data alat, alur_belajar, dan kelas_pembelajaran
              let alat = await Model_Alat.getAll();
              let alur_belajar = await Model_Alur_Belajar.getAll();
              let kategori = await Model_Kategori_Pembelajaran.getAll();
              let kelas_pembelajaran = await Model_Kelas.getAll();

              // Ambil video terbaru
              let latestVideos = await Model_Video.getAll(); // Menambahkan ini untuk mendapatkan video terbaru

              function extractYouTubeId(url) {
                var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
                var match = url.match(regExp);
                return (match && match[7].length == 11) ? match[7] : false;
              }
              // Render halaman dengan data
              res.render("users/detail_common/commonusers", {
                  title: "Users Home",
                  email: Data[0].email,
                  nama_users: Data[0].nama_users,
                  file_user: Data[0].file_user,
                  role: req.session.role,
                  alat: alat,
                  alur_belajar: alur_belajar,
                  kategori: kategori,
                  kelas_pembelajaran: kelas_pembelajaran,
                  videos: latestVideos,
                  extractYouTubeId: extractYouTubeId // Mengirimkan data video terbaru ke view// Mengirimkan fungsi extractYouTubeId ke view
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
        let kategori = await Model_Kategori_Pembelajaran.getId(kategoriId);
        let kategoris = await Model_Kategori_Pembelajaran.getAll();

        // Render halaman dengan data
        res.render("users/detail_common/detail_kelas", {
          title: "Users Home",
          email: Data[0].email,
          nama_users: Data[0].nama_users,
          role: req.session.role,
          alat: alat,
          kelas: kelas,
          alur_belajar: alur_belajar,
          kategoris: kategori[0],
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
    let kategoriId = req.params.id;

    let kategori = await Model_Kategori_Pembelajaran.getAll();
    let alur_belajar = await Model_Alur_Belajar.getAll();

    if (id) {
      let Data = await Model_Users.getId(id);
      let activityRows = await Model_Activity.getByIdUsers(id);
      let activityRows2 = await Model_Activity.getByIdUsers2(id);
      let kelas = await Model_Kelas.getId(kategoriId);
      let video = await Model_Video.getByIdKelas(kategoriId);

      res.render("users/detail_common/detail_course", {
        title: "Users Home",
        iduser: req.session.userId,
        email: Data[0].email || '',
        nama_users: Data[0].nama_users || '',
        role: req.session.role,
        globalVideoIDs: 1,
        activities: activityRows,
        activitiescls: activityRows2,
        kelas: kelas[0],
        video: video,
        idvideo: video[0],
        kategori: kategori,
        alur_belajar: alur_belajar // Include alur_belajar
      });

    } else {
      let alat = await Model_Alat.getAll();
      let video = await Model_Video.getByIdKelas(kategoriId);
      let kelas = await Model_Kelas.getId(kategoriId);
      let activityRows = await Model_Activity.getByIdUsers(id);
      let activityRows2 = await Model_Activity.getByIdUsers2(id);
     

      res.render("users/detail_common/detail_course", {
        iduser: 0,
        title: "Users Home",
        email: '', // No user email since user ID is null
        nama_users: '', // No user name since user ID is null
        role: req.session.role,
        activities:activityRows,
        alat: alat,
        activitiescls: activityRows2,
        video: video,
        idvideo: video[0],
        kelas: kelas[0],
        alur_belajar: alur_belajar, // Include alur_belajar
        globalVideoIDs: 1,
        kategori: kategori // Include kategori
      });
    }
  } catch (error) {
    next(error);
  }
});


router.get('/alur/:id', async function (req, res, next) {
  try {
    let id = req.session.userId;
    let Data = await Model_Users.getId(id);
    if (Data.length > 0) {
      // Kondisi pengecekan
      if (Data[0].role != 3) {
        res.redirect('/logout');
      } else {
        // Get the alur_belajar ID from the URL parameter
        let alurBelajarId = req.params.id;

        // Ambil data alat dan alur_belajar
        let alat = await Model_Alat.getAll();
        let kelas = await Model_Kelas.getByIdAlurBelajar(alurBelajarId);
        let video = await Model_Video.getAll();
        let alur_belajar = await Model_Alur_Belajar.getAll();
        let alur_belajarR = await Model_Alur_Belajar.getId(alurBelajarId);
        let kategori = await Model_Kategori_Pembelajaran.getAll();

        // Render halaman dengan data
        res.render("users/detail_common/alur_belajar", {
          title: "Users Home",
          email: Data[0].email,
          nama_users: Data[0].nama_users,
          role: req.session.role,
          alat: alat,
          kelas: kelas,
          video: video,
          alur: alur_belajar[0],
          alurr: alur_belajarR[0],
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



router.post('/tonton/:id', async function (req, res, next) {
  try {
    let { id_video } = req.body; 
    let Data = {
      id_users: req.session.userId,
      id_video: id_video,
    };
    await Model_Activity.create(Data);
    req.flash("success", "Berhasil menyimpan data");
    res.redirect("/profile/commonuser");
  } catch (error) {
    console.log(error); // Menampilkan pesan kesalahan ke konsol
    req.flash("error", "Gagal menyimpan data");
    res.redirect("/profile/commonuser");
  }
});

router.post('/gabung', async function (req, res, next) {
  try {
    let { id_kelas } = req.body; 
    let Data = {
      id_users: req.session.userId,
      id_kelas: id_kelas,
    };
    await Model_Activity.create(Data);
    req.flash("success", "Berhasil menyimpan data");
    res.redirect("/profile/commonuser");
  } catch (error) {
    console.log(error); // Menampilkan pesan kesalahan ke konsol
    req.flash("error", "Gagal menyimpan data");
    res.redirect("/profile/commonuser");
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
