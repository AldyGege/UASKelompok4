const connection = require('../config/database');

class Model_Kategori_Pembelajaran {

    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query('select * from kategori_pembelajaran order by id_kategori desc', (err, rows) => {
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
            connection.query('insert into kategori_pembelajaran set ?', Data, function(err, result){
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
            connection.query('SELECT * FROM kategori_pembelajaran where id_kategori = ' + id, (err, rows) => {
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
            connection.query('update kategori_pembelajaran set ? where id_kategori = ' + id, Data, function(err, result) {
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
            connection.query('delete from kategori_pembelajaran where id_kategori = ' + id, function(err, result) {
                if(err) {
                    reject(err);
                }else {
                    resolve(result);
                }
            });
        });
    }

}

module.exports = Model_Kategori_Pembelajaran;