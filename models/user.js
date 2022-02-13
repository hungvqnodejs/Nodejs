const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email) {
        this.name = username;
        this.email = email;
    }

    save() {;
        const db = getDb()
        return db.collection('user').inserOne(this)
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('user').findOne({ _id: new ObjectId(userId) });
    }
}

module.exports = User;