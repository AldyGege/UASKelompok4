const connection = require('../config/database');

class Model_Kelas_Pembelajaran {

    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query('select * from kelas_pembelajaran order by id_kelas desc', (err, rows) => {
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
            connection.query('SELECT * FROM kelas_pembelajaran where id_kelas = ' + id, (err, rows) => {
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