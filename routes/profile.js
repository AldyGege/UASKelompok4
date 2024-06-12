const express = require('express');
const router = express.Router();
const Model_Users = require('../model/Model_Users');
const Model_Video = require('../model/Model_Video');
const Model_Activity = require('../model/Model_Activity');
const Model_Kategori_Pembelajaran = require('../model/Model_Kategori');
const Model_Alur_Belajar = require('../model/Model_Alur_Belajar');
const bcrypt = require('bcrypt');

router.get('/', async function(req, res, next) {
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


<<<<<<< HEAD
        // Redirect based on user level
        let userLevel = userRows[0].role;
        if (userLevel == 1) {
            res.render('admin_profile/profile', {
                data: userRows,
                email: email,
                kategori: kategori,
                activities: activityRows
            });
        } else if (userLevel == 2) {
            res.render('mentor_profile/profile', {
                data: userRows,
                email: email,
                kategori: kategori,
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
=======
        res.render('profile/profile', {
            data: userRows,
            email: email,
            activities: activityRows,
            activitiescls: activityRows2,
            video: activityRows3
        });
>>>>>>> 528a3baecb620329968d8726d84e86d0e856f17e
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
        let rows = await Model_Users.getId(id);
        if (!rows.length) {
            req.flash('error', 'User not found');
            return res.redirect('/profile');
        }

        res.render('profile/edit', {
            id: rows[0].id_users,
            nama_users: rows[0].nama_users,
            password: rows[0].password,
            email: rows[0].email,
            role: rows[0].role
        });
    } catch (error) {
        console.error("Error fetching user for edit:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/update/:id', async function(req, res, next){
    try {
        let id = req.params.id;
        let { nama_users, jenis_kelamin, agama_users, alamat_users, email, password, role } = req.body;
        let Data = {
            nama_users,
            jenis_kelamin,
            agama_users,
            alamat_users,
            email,
            role 
        };

        if (password) {
            Data.password = await bcrypt.hash(password, 10);
        }

        await Model_Users.Update(id, Data);
        req.flash('success', 'Berhasil memperbarui data!');
        res.redirect('/profile');
    } catch (error) {
        console.error("Error updating user:", error);
        req.flash('error', 'Terjadi kesalahan pada fungsi');
        res.redirect('/profile');
    }
});

module.exports = router;
