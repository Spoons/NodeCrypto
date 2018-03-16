let generic_model = require("./model_generic").model_generic;
let db = require("./model_generic").db;
let schema_p = require("./schema");
let user_model = function() {

    this.schema = {
        properties: {
            table_name: "users",
            exported: false,
        },
        id: {
            db_type: "INTEGER PRIMARY KEY",
            column_name: "id",
            value: null,
        },
        username: {
            db_type: "TEXT",
            column_name: "username",
            value: null,
        },
        password: {
            db_type: "BLOB",
            column_name: "password",
            value: null,
        },
        files: {
            db_type: "INTEGER",
            db_foreign_table: "files",
            db_foreign_column: "id",
            column_name: "files",
            value: null,

        }
    //  key: {
    //      db_type: "INTEGER",
    //      db_foreign_table: "keys",
    //      db_foreign_column: "id",
    //      column_name: "key",
    //      value: null,
    //  }
    },

    this.schema = Object.assign(this.schema, schema_p);

    this.set = function(id, username, password,  files) {
        this.schema.id.value = id;
        this.schema.username.value = username;
        this.schema.password.value = password;
        this.schema.files.value = files;
        this.schema.write();
    },
    this.to_string = function() {
        let prop = this.schema.get_schema_properties();
        let output = "";
        prop.forEach(function(p) {
            output+= p.column_name + ": " + p.value + " ";
        });
        return(output);
    }
    this.print = function() {
        console.log(this.to_string());
    }
}
user_model.sanity = function() {
    const test_model = new user_model();
    test_model.schema.drop_table();
    test_model.schema.create_table();

    test_model.set("1", "rick", "crisis", "1");
    let t1 = test_model.to_string();
    test_model.print();

    const new_model = new user_model();

    new_model.schema.load(1);
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

module.exports = user_model;