const express = require('express');
const router = express.Router();
const Model_Users = require('../model/Model_Users');
const Model_Activity = require('../model/Model_Activity');
const bcrypt = require('bcrypt');

router.get('/', async function(req, res, next) {
    try {
        let id = req.session.userId;
        let email = req.session.email;

        // Fetch user data
        let userRows = await Model_Users.getId(id);
        
        // Fetch activity data
        let activityRows = await Model_Activity.getByIdUsers(id);

        res.render('profile/profile', {
            data: userRows,
            email: email,
            activities: activityRows
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
        let rows = await Model_Users.getId(id);
        res.render('profile/edit', {
            id: rows[0].id_users,
            nama_users: rows[0].nama_users,
            password: rows[0].password,
            email: rows[0].email,
            role: rows[0].role,
        });
    } catch(error) {
        console.error("Error fetching user for edit:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/update/:id', async function(req, res, next){
    try {
        let id = req.params.id;
        let { nama_users, jenis_kelamin, agama_users, alamat_users, email, password, level_users } = req.body; 
        let Data = {
            nama_users,
            jenis_kelamin,
            agama_users,
            alamat_users,
            email,
            level_users 
        };

        if (password) {
            Data.password = await bcrypt.hash(password, 10);
        }

        await Model_Users.Update(id, Data);
        req.flash('success', 'Berhasil memperbarui data!');
        res.redirect('/profile'); 
    } catch(error) {
        console.error("Error updating user:", error);
        req.flash('error', 'Terjadi kesalahan pada fungsi');
        res.redirect('/profile');     
    }
});


module.exports = router;