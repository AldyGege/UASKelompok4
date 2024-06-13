var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require("path")
const multer = require('multer');
const bcrypt = require('bcrypt');
const Model_Alat = require("../model/Model_Alat.js");
const Model_Users = require("../model/Model_Users.js");
const Model_Kelas = require("../model/Model_Kelas.js");
const e = require('express');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    let classes = await Model_Kelas.getAll();
    let tools = await Model_Alat.getAll();
    res.render('index', { 
      title: 'Express',
      classes: classes,
      tools: tools 
    });
  } catch (error) {
    console.error(error);
    res.render('index', { 
      title: 'Express',
      classes: [],
      tools: [] 
    });
  }
});

router.get('/register', function(req, res, next) {
  res.render('auth/register');
});

router.get('/register_tutor', function(req, res, next) {
  res.render('auth/register_tutor');
});
router.get('/register_user', function(req, res, next) {
  res.render('auth/register_user');
});
router.get('/login', function(req, res, next) {
  res.render('auth/login');
});
router.get('/daftar_mentor', function(req, res, next) {
  let nama_users;
  res.render('users/detail_common/daftar_mentor', { nama_users: nama_users });
});
router.get('/apply', function(req, res, next) {
  res.render('users/detail_common/PageApply');
});
router.get('/class', function(req, res, next) {
  let nama_users;
  res.render('users/detail_common/detail_kelas', { nama_users: nama_users });
});
router.get('/course', function(req, res, next) {
  let nama_users;
  res.render('users/detail_common/detail_course', { nama_users: nama_users });
});

// router.get('/view_alur_belajar', function(req, res, next) {
//   let nama_users;
//   res.render('users/detail_common/alur_belajar', { nama_users: nama_users });
// });
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

router.post('/saveusers',upload.single("file_user"),async (req, res) => {
  let { nama_users, email,password , role} = req.body;
  try {
      let enkripsi = await bcrypt.hash(password, 10);
      let Data = {
          nama_users,
          email,
          role,
          file_user:req.file.filename,
          password: enkripsi,
      };
      await Model_Users.Store(Data);
      req.flash('success', 'Berhasil Register!');
      res.redirect('/login');
  } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal menyimpan pengguna');
      res.redirect('/register');
  }
});


router.post('/log', async (req, res) => {
    let {email, password } = req.body;
    try {
    let Data = await Model_Users.Login(email);
    if (Data.length > 0) {
      let enkripsi = Data[0].password;
      let cek = await bcrypt.compare(password, enkripsi);
      if (cek) {
        req.session.userId = Data[0].id_users;
        req.session.role = Data[0].role;
        //Awal Tambahan
        if(Data[0].role == 1){
        req.flash('success', 'Berhasil login!');
        res.redirect('/superusers');
        }else if(Data[0].role == 2){
          req.flash('Success', 'berhasil Login');
          res.redirect('/users');
        }
        else if(Data[0].role == 3){
          req.flash('Success', 'berhasil Login');
          res.redirect('/commonusers');
        }
        else{
          res.redirect('/login')
        }
        //Akhir Kondisi
      } else {
        req.flash('error', 'email atau password salah!');
        res.redirect('/login');
      }
    } else {
      req.flash('error', 'akun Tidak Ditemukan!');
      res.redirect('/login');
    }
  } catch (err) {
    res.redirect('/login');
    req.flash('error', 'error pada fungsi');
    console.log(err);
  }    
});

router.get('/logout', function (req, res) {
  req.session.destroy(function(err) {
    if(err) {
      console.error(err);
    } else {
      res.redirect('/login');
    }
  });
});



module.exports = router;