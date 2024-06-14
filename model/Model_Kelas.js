const connection = require('../config/database');

class Model_Kelas {

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

    static async getIdK(id_kategori) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT kp.*, a.nama_alat, a.file_alat, k.nama_kategori FROM kelas_pembelajaran kp LEFT JOIN alat a ON kp.id_alat = a.id_alat LEFT JOIN kategori_pembelajaran k ON kp.id_kategori = k.id_kategori WHERE kp.id_kategori = ? ORDER BY kp.id_kelas DESC;',
                [id_kategori],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });
    }

    static async getByIdAlurBelajar(id_alur_belajar) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT kp.*, a.nama_alat, a.file_alat, k.nama_kategori FROM kelas_pembelajaran kp LEFT JOIN alat a ON kp.id_alat = a.id_alat LEFT JOIN kategori_pembelajaran k ON kp.id_kategori = k.id_kategori WHERE kp.id_alur_belajar = ? ORDER BY kp.urutan ASC;',
                [id_alur_belajar],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });
    }

    static async Store(Data) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO kelas_pembelajaran SET ?', Data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static async getId(id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT kp.*, a.nama_alat, a.file_alat, k.nama_kategori FROM kelas_pembelajaran kp LEFT JOIN alat a ON kp.id_alat = a.id_alat LEFT JOIN kategori_pembelajaran k ON kp.id_kategori = k.id_kategori WHERE kp.id_kelas = ?', [id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    
    static async Update(id, Data) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE kelas_pembelajaran SET ? WHERE id_kelas = ?', [Data, id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    
    
    static async Delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM kelas_pembelajaran WHERE id_kelas = ?', [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

}

module.exports = Model_Kelas;
