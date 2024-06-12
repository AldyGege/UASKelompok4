var express = require("express");
var router = express.Router();
const Model_Video = require("../model/Model_Video.js");
const Model_Users = require("../model/Model_Users.js");
const Model_Kelas = require("../model/Model_Kelas.js");

// Route to display all videos for the logged-in user
router.get("/", async function (req, res, next) {
  try {
    let id = req.session.userId;
    let userData = await Model_Users.getId(id);

    if (userData.length > 0) {
      let rows = await Model_Video.getByUserId(id);

      // Extract YouTube ID function
      function extractYouTubeId(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
      }

      res.render("video/video", {
        data: rows,
        extractYouTubeId: extractYouTubeId
      });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.redirect("/login");
  }
});

// Route to display the form for creating a new video
router.get("/create", async function (req, res, next) {
  try {
    let id = req.session.userId;
    let kelas = await Model_Kelas.getAll();
    res.render("video/create", {
      id_users: id,
      judul_video: "",
      link_video: "",
      id_kelas: "",
      data1: kelas,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Route to handle the submission of the new video form
router.post("/store", async function (req, res, next) {
  try {
    let { judul_video, link_video, id_kelas, id_users } = req.body;
    console.log(req.body); // Debug logging
    let Data = {
      judul_video,
      link_video,
      id_kelas,
      id_users
    };
    await Model_Video.Store(Data);
    req.flash("success", "Berhasil menyimpan data");
    res.redirect("/video");
  } catch (error) {
    console.log(error);
    req.flash("error", "Gagal menyimpan data");
    res.redirect("/");
  }
});

// Route to display the form for editing a video
router.get("/edit/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let rows = await Model_Video.getId(id);
    let kelas = await Model_Kelas.getAll(id);
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
    console.log(error);
    next(error);
  }
});

// Route to handle the update of an existing video
router.post("/update/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let { judul_video, link_video, id_kelas } = req.body;
    let Data = {
      judul_video,
      link_video,
      id_kelas,
    };
    await Model_Video.Update(id, Data);
    req.flash("Success", "Berhasil menyimpan data");
    res.redirect("/video");
  } catch (error) {
    console.log(error);
    req.flash("error", "Terjadi kesalahan pada fungsi");
    res.redirect("/video");
  }
});

// Route to handle the deletion of a video
router.get("/delete/:id", async function (req, res) {
  try {
    let id = req.params.id;
    await Model_Video.Delete(id);
    req.flash("Success", "Berhasil menghapus data");
    res.redirect("/video");
  } catch (error) {
    console.log(error);
    req.flash("error", "Gagal menghapus data");
    res.redirect("/video");
  }
});

module.exports = router;
