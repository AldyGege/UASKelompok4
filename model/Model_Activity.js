const connection = require('../config/database');
class Activity {
  // Method untuk mengambil semua aktivitas
  static async getAll() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM activity ORDER BY id DESC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Method untuk membuat aktivitas baru
  static async create(newActivity) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO activity SET ?', newActivity, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async getByIdUsers(idUsers) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          activity.*, 
          video.* 
        FROM 
          activity 
        JOIN 
          video 
        ON 
          activity.id_video = video.id_video 
        WHERE 
          activity.id_users = ?
      `;
      connection.query(query, [idUsers], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }  
  
  // Method untuk mengambil aktivitas berdasarkan ID
  static async getById(activityId) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM activity WHERE id = ?', activityId, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Method untuk mengupdate aktivitas berdasarkan ID
  static async update(activityId, newData) {
    return new Promise((resolve, reject) => {
      db.query('UPDATE activity SET ? WHERE id = ?', [newData, activityId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  // Method untuk menghapus aktivitas berdasarkan ID
  static async delete(activityId) {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM activity WHERE id = ?', activityId, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = Activity;
