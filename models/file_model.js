let generic_model = require("./model_generic").model_generic;
let db = require("./model_generic").db;
let schema_p = require("./schema");
let file_model = function() {

    this.schema = {
        properties: {
            table_name: "files",
            exported: false,
        },
        id: {
            db_type: "INTEGER PRIMARY KEY",
            column_name: "id",
            value: null,
        },
        name: {
            db_type: "TEXT",
            column_name: "name",
            value: null,
        },
        extension: {
            db_type: "TEXT",
            column_name: "extension",
            value: null,
        },
        data: {
            db_type: "BLOB",
            column_name: "data",
            value: null,
        },
        user: {
            db_type: "INTEGER",
            db_foreign_table: "users",
            db_foreign_column: "id",
            column_name: "user",
            value: null,
        },
        key: {
            db_type: "INTEGER",
            db_foreign_table: "keys",
            db_foreign_column: "id",
            column_name: "key",
            value: null,
        }
    },

    this.schema = Object.assign(this.schema, schema_p);
    
    this.set = function(id, name, extension, data, user, key) {
        try{
            this.schema.id.value = null;
            this.schema.name.value = name;
            this.schema.extension.value = extension;
            this.schema.data.value = data;
            this.schema.user.value = user;
            this.schema.key.value = key;
            let returned_id = this.schema.write();
            return returned_id;
        }catch(err){
            return null;
        }   
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
        console.log("====================" + this.to_string() + "====================");
    }
    
}
file_model.sanity = function() {
    const test_model = new file_model();
    test_model.schema.create_table();

    test_model.set("1", "cats", "txt", "01010101010", "1", "1");
    let t1 = test_model.to_string();
    test_model.print();

    const new_model = new file_model();

    new_model.schema.load(1);
    let t2 = new_model.to_string();
    new_model.print();

    if (t1 === t2) {
        console.log("[FILE MODEL]: Sanity check pass!\n");
        return (true);
    } else {
        return (false);
    }
}

file_model.sanity();

module.exports = file_model;
