const connection = require('../config/database');

class Model_Kelas_Pembelajaran {

    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT kp.*, a.nama_alat, a.file_alat, k.nama_kategori FROM kelas_pembelajaran kp LEFT JOIN alat a ON kp.id_alat = a.id_alat LEFT JOIN kategori_pembelajaran k ON kp.id_kategori = k.id_kategori ORDER BY kp.id_kelas DESC;', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    static async Store(Data) {
        return new Promise((resolve, reject) => {
            connection.query('insert into kelas_pembelajaran set ?', Data, function(err, result){
                if(err) {
                    reject(err);
                }else{
                    resolve(result);
                    console.log(err)
                }
            });
        });
    }
    
    static async getId(id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT kp.*, a.nama_alat, a.file_alat, k.nama_kategori FROM kelas_pembelajaran kp LEFT JOIN alat a ON kp.id_alat = a.id_alat LEFT JOIN kategori_pembelajaran k ON kp.id_kategori = k.id_kategori WHERE kp.id_kelas = ' + id, (err, rows) => {
                if(err) {
                    reject(err);
                }else {
                    resolve(rows);
                }
            });
        });
    }
    
    static async Update(id, Data) {
        return new Promise((resolve, reject) => {
            connection.query('update kelas_pembelajaran set ? where id_kelas = ' + id, Data, function(err, result) {
                if(err) {
                    reject(err);
                }else {
                    resolve(result);
                }
            });
        });
    }
    
    
    static async Delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('delete from kelas_pembelajaran where id_kelas = ' + id, function(err, result) {
                if(err) {
                    reject(err);
                }else {
                    resolve(result);
                }
            });
        });
    }

}

module.exports = Model_Kelas_Pembelajaran;