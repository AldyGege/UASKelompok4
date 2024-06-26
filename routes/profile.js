const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path")
const multer = require('multer');
const Model_Users = require('../model/Model_Users');
const Model_Video = require('../model/Model_Video');
const Model_Activity = require('../model/Model_Activity');
const Model_Kategori_Pembelajaran = require('../model/Model_Kategori');
const Model_Alur_Belajar = require('../model/Model_Alur_Belajar');
const bcrypt = require('bcrypt');

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

router.get('/user', async function(req, res, next) {
    try {
        let id = req.session.userId;
        let email = req.session.email;
        let nama_users = req.session.nama_users;

        // Fetch user data
        let userRows = await Model_Users.getId(id);
        let kategori = await Model_Kategori_Pembelajaran.getId(id);
        let alur_belajar = await Model_Alur_Belajar.getId(id);
        if (!userRows.length) {
            req.flash('error', 'User not found');
            return res.redirect('/login');
        }
        
        // Fetch activity data
        let activityRows = await Model_Activity.getByIdUsers(id);
        let activityRows2 = await Model_Activity.getByIdUsers2(id);
        let activityRows3 = await Model_Video.getAll();


        // Redirect based on user level
        let userLevel = userRows[0].role;
        if (userLevel == 1) {
            res.render('admin_profile/profile', {
                data: userRows,
                email: email,
                nama_users: nama_users,
                kategori: kategori,
                alur_belajar: alur_belajar,
                activities: activityRows
            });
        } else if (userLevel == 2) {
            res.render('mentor_profile/profile', {
                data: userRows,
                email: email,
                nama_users: nama_users,
                kategori: kategori,
                alur_belajar: alur_belajar,
                activities: activityRows
            });
        } else {
            res.render('common_profile/profile', {
                data: userRows,
                email: email,
                nama_users: nama_users,
                kategori: kategori,
                alur_belajar: alur_belajar,
                activities: activityRows
            });
        }
        res.render('profile/profile', {
            data: userRows,
            email: email,
            activities: activityRows,
            activitiescls: activityRows2,
            video: activityRows3
        });
    } catch (error) {
        console.error("Error fetching user or activity data:", error);
        res.status(500).render('error', {
            message: 'Internal server error',
            error: error
        });
    }
});

router.get('/commonuser', async function(req, res, next) {
    try {
        let id = req.session.userId;
        let email = req.session.email;

        // Fetch user data
        let userRows = await Model_Users.getId(id);
        
        // Fetch activity data
        let activityRows = await Model_Activity.getByIdUsers(id);
        let activityRows2 = await Model_Activity.getByIdUsers2(id);
        let activityRows3 = await Model_Video.getAll();
        let activityRows4 = await Model_Kategori_Pembelajaran.getAll();
        let activityRows5 = await Model_Alur_Belajar.getAll();


        res.render('common_profile/profile', {
            id: req.session.userId,
            data: userRows,
            email: email,
            activities: activityRows,
            activitiescls: activityRows2,
            video: activityRows3,
            kategori: activityRows4,
            alur_belajar: activityRows5
        });
    } catch (error) {
        console.error("Error fetching user or activity data:", error);
        res.status(500).render('error', {
            message: 'Internal server error',
            error: error
        });
    }
});

router.get('/edit/:id', async function(req, res, next){
    try {
        let id = req.params.id;
        let userRows = await Model_Users.getId(id);
        if (!userRows.length) {
            req.flash('error', 'User not found');
            return res.redirect('/profile');
        }

        // Check user role
        let userLevel = userRows[0].role;
        if (userLevel == 1) {
            res.render('admin_profile/edit', {
                id_users: id,
                nama_users: userRows[0].nama_users,
                email: userRows[0].email,
                file_user: userRows[0].file_user,
                
            });
        } else if (userLevel == 2) {
            res.render('mentor_profile/edit', {
                id_users: id,
                nama_users: userRows[0].nama_users,
                email: userRows[0].email,
                file_user: userRows[0].file_user,
            });
        } else {
            res.render('common_profile/edit', {
                id_users: id,
                nama_users: userRows[0].nama_users,
                email: userRows[0].email,
                file_user: userRows[0].file_user,
            });
        }
    } catch (error) {
        console.error("Error fetching user for edit:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/update/:id', upload.single("file_user"), async function (req, res, next) {
    try {
        const id = req.params.id;
        const rows = await Model_Users.getId(id);
        if (!rows.length) {
            req.flash('error', 'User not found');
            return res.redirect('/profile');
        }
        
        const filebaru = req.file ? req.file.filename : null;
        const namaFileLama = rows[0].file_user;

        if (filebaru && namaFileLama) {
            const pathFileLama = path.join(__dirname, "../public/images/upload", namaFileLama);
            try {
                await fs.unlink(pathFileLama);
            } catch (err) {
                console.error(`Error deleting old file: ${err.message}`);
            }
        }

        const { nama_users, email,password } = req.body;
        let enkripsi = await bcrypt.hash(password, 10);
        const file_user = filebaru || namaFileLama;
        const Data = {
            nama_users,
            email,
            password:enkripsi,
            file_user
        }

        // Update data
        await Model_Users.Update(id, Data);

        // Fetch user role after update
        const userRows = await Model_Users.getId(id);
        if (!userRows.length) {
            req.flash('error', 'User not found after update');
            return res.redirect('/profile');
        }

        const userLevel = userRows[0].role;
        req.flash('success', 'Berhasil memperbarui data!');
        if (userLevel == 1) {
            return res.redirect('/profile/user');
        } else if (userLevel == 2) {
            return res.redirect('/profile/user');
        } else {
            return res.redirect('/profile/commonuser');
        }
    } catch (error) {
        console.error("Error updating user:", error);
        req.flash('error', 'Terjadi kesalahan pada fungsi');
        return res.redirect('/profile');
    }
});

router.post('/delete/:id', async function(req, res, next){
    try {
        let id = req.params.id;

        // Delete data
        await Model_Users.Delete(id);
        req.flash('success', 'Berhasil menghapus data!');
        res.redirect('/profile');
    } catch (error) {
        console.error("Error deleting user:", error);
        req.flash('error', 'Terjadi kesalahan pada fungsi');
        res.redirect('/profile');
    }
});

module.exports = router;