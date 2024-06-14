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

  static async create(newActivity) {
    return new Promise((resolve, reject) => {
        connection.beginTransaction((err) => {
            if (err) {
                reject(err);
            }
            const selectQuery = `
            SELECT * FROM activity 
            WHERE id_users = ? AND (id_kelas = ? OR id_video = ?)
        `;
            connection.query(selectQuery, [newActivity.id_users, newActivity.id_kelas, newActivity.id_video], (err, rows) => {
              if (err) {
                  return connection.rollback(() => {
                      reject(err);
                  });
              
                } else {
                    if (rows.length > 0) {
                        return connection.rollback(() => {
                            reject(new Error('Activity with the same title already exists'));
                        });
                    } else {
                        connection.query('INSERT INTO activity SET ?', newActivity, (err, result) => {
                            if (err) {
                                return connection.rollback(() => {
                                    reject(err);
                                });
                            } else {
                                connection.commit((err) => {
                                    if (err) {
                                        return connection.rollback(() => {
                                            reject(err);
                                        });
                                    }
                                    resolve(result);
                                });
                            }
                        });
                    }
                }
            });
        });
    });
}

  static async getByIdUsers2(idUsers) {
    return new Promise((resolve, reject) => {
      const query = `
       SELECT 
        activity.*, 
        kelas_pembelajaran.* 
      FROM 
        activity 
      JOIN 
        kelas_pembelajaran 
        ON activity.id_kelas = kelas_pembelajaran.id_kelas 
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
  
  static async getByIdUsers(idUsers) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
    activity.*, 
    video.id_video, 
    video.judul_video, 
    video.link_video, 
    video.id_kelas
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
