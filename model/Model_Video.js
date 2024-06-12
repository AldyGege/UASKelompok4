const connection = require('../config/database');

class Model_Video {
    static async getByIdUsers(id_users) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM video WHERE id_users = ? ORDER BY id_video DESC', [id_users], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }    
    static async getByIdKelas(id_kelas) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM video WHERE id_kelas = ? ORDER BY id_video DESC',
                [id_kelas],
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
    
    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query('select * from video order by id_video desc', (err, rows) => {
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
            connection.query('insert into video set ?', Data, function(err, result){
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
            connection.query('SELECT * FROM video where id_video = ' + id, (err, rows) => {
                if(err) {
                    reject(err);
                }else {
                    resolve(rows);
                }
            });
        });
    }
    
    static async getByUserId(id_users) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM video WHERE id_users = ? ORDER BY id_video DESC', [id_users], (err, rows) => {
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
            connection.query('update video set ? where id_video = ' + id, Data, function(err, result) {
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
            connection.query('delete from video where id_video = ' + id, function(err, result) {
                if(err) {
                    reject(err);
                }else {
                    resolve(result);
                }
            });
        });
    }

}

module.exports = Model_Video;