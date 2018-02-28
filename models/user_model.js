let generic_model = require("./model_generic").model_generic;
let db = require("./model_generic").db;

let user_model = function() {
    this.id = null;
    this.name = null;
    this.password = null;


    this.ignored_values = ["_TABLE_REF"];
    this._TABLE_REF = "users";

    //schema is ignored by database exporter
    this.schema = {

    }

    this.update = function(name, password) {
        this.id = this.id;
        this.name = name;
        this.password = password;
        this.write();
    }

    // Used to update user PW
    this.update_with_id = function(id, name, password) {
        this.id = id;
        update(name, password);
    }

    //Anything in the testing sub-object is ignored when writing to db
    this.testing = {
        create_migration_table: function() {
            db.prepare("DROP TABLE IF EXISTS users").run();
            db.prepare("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, password TEXT)").run();
            db.prepare("CREATE UNIQUE INDEX users_idx ON users(id, name)").run();
            console.log("users table create");
        },
    }

}

user_model.prototype = generic_model;
user_model.sanity = function() {
    const test_model = new user_model();
    test_model.testing.create_migration_table();

    test_model.update("Tj", "ilikegizmo");
    let t1 = test_model.to_string();
    test_model.print();

    const new_model = new user_model();

    new_model.load_by_id(1);
    let t2 = new_model.to_string();
    new_model.print();

    if (t1 === t2) {
        console.log("user-model: sanity check pass!");
        return (true);
    } else {
        return (false);
    }
}

user_model.sanity();