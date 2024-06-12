var express = require("express");
var router = express.Router();
const Model_Video = require("../model/Model_Video.js");
const Model_Users = require("../model/Model_Users.js");
const Model_Kelas = require("../model/Model_Kelas.js");

router.get("/", async function (req, res, next) {
    try {
      let id = req.session.userId;
      let Data = await Model_Users.getId(id);
      if (Data.length > 0) {
        let rows = await Model_Video.getAll();
        
        // Mendefinisikan fungsi extractYouTubeId di server
        function extractYouTubeId(url) {
          var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
          var match = url.match(regExp);
          return (match && match[7].length == 11) ? match[7] : false;
        }
  
        res.render("video/video", {
          data: rows,
          extractYouTubeId: extractYouTubeId // Mengirim fungsi ke template
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
    let id = req.session.userId;
    let kelas = await Model_Kelas.getAll();
    res.render("video/create", {
      id_users : id,
      judul_video: "",
      link_video: "",
      id_kelas: "",
      data1: kelas,
    });
  } catch (error) {
    console.log(error); // Menampilkan pesan kesalahan ke konsol
    next(error); // Meneruskan kesalahan ke penanganan kesalahan berikutnya (jika ada)
  }
});

router.post("/store", async function (req, res, next) {
    try {
      let {  judul_video, link_video, id_kelas, id_users  } = req.body;
      console.log(req.body); // Tambahkan logging untuk debugging
      let Data = {
        judul_video,
        link_video,
        id_kelas,
        id_users
      };
      await Model_Video.Store(Data);
      req.flash("success", "Berhasil menyimpan data");
      res.redirect("/users");
    } catch (error) {
      console.log(error); // Menampilkan pesan kesalahan ke konsol
      req.flash("error", "Gagal menyimpan data");
      res.redirect("/");
    }
  });
  
  router.get("/getall", async function (req, res, next) {
    try {
        let id = req.session.userId;
        let videos = await Model_Video.getByIdUsers(id);
        res.json(videos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" }); // Beri respon status 500 jika terjadi kesalahan
    }
});

router.get("/edit/(:id)", async function (req, res, next) {
  try {
    let id = req.params.id;
    let rows = await Model_Video.getId(id);
    let kelas = await Model_Kelas.getAll(id);
    // Periksa apakah ada data yang ditemukan untuk ID yang diberikan
    if (rows.length > 0) {
      res.render("users/detail_users/edit", {
        id: rows[0].id_video,
        id_users: id,
        judul_video: rows[0].judul_video,
        link_video: rows[0].link_video,
        id_kelas: rows[0].id_kelas,
        data1: kelas,
      });
    } else {
      res.status(404).send('Data not found');
    }
  } catch (error) {
    console.log(error); // Menampilkan pesan kesalahan ke konsol
    next(error); // Meneruskan kesalahan ke penanganan kesalahan berikutnya (jika ada)
  }
});
router.get("/", async function (req, res, next) {
  try {
      let id = req.session.userId;
      let Data = await Model_Video.getByIdUsers(id);
      res.render("video/video", { data: Data });
  } catch (error) {
      console.log(error);
      res.redirect("/login");
  }
});
router.post("/update/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let { judul_video, link_video, id_kelas,id_users} = req.body;
    let Data = {
      judul_video,
      link_video,
      id_kelas,
    };
    await Model_Video.Update(id, Data);
    req.flash("Success", "Berhasil menyimpan data");
    res.redirect("/users");
  } catch (error) {
    console.log(error); // Menampilkan pesan kesalahan ke konsol
    req.flash("error", "Terjadi kesalahan pada fungsi");
    res.redirect("/users");
  }
});

router.get("/delete/(:id)", async function (req, res) {
  let id = req.params.id;
  await Model_Video.Delete(id);
  req.flash("Success", "Berhasil menghapus data");
  res.redirect("/users");
});

module.exports = router;
