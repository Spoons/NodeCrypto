let generic_model = require("./model_generic").model_generic;
let db = require("./model_generic").db;
let schema_p = require("./schema");
let test_keys = require("./test_keys");
let key_model = function() {

    this.schema = {
        properties: {
            table_name: "keys",
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
        private_key: {
            db_type: "TEXT",
            column_name: "private_key",
            value: null,
        },
        public_key: {
            db_type: "TEXT",
            column_name: "public_key",
            value: null,
        },
        file: {
            db_type: "INTEGER",
            db_foreign_table: "files",
            db_foreign_column: "id",
            column_name: "file",
            value: null,
        },
        user: {
            db_type: "INTEGER",
            db_foreign_table: "users",
            db_foreign_column: "id",
            column_name: "user",
            value: null,
        }
    },

    this.schema = Object.assign(this.schema, schema_p);

    this.set = function(id, name, private_key, public_key, file, user) {
        try{
            this.schema.id.value = null;
            this.schema.name.value = name;
            this.schema.private_key.value = private_key;
            this.schema.public_key.value = public_key;
            this.schema.file.value = file;
            this.schema.user.value = user;

            let returned_id = this.schema.write();
            return returned_id;
        }catch(err){
            console.log(err);
            return null;
        }
    },
    this.to_string = function() {
        let prop = this.schema.get_schema_properties();
        let output = "";
        prop.forEach(function(p) {
            if(p.column_name == "private_key" || p.column_name == "public_key") {
                return;
            }
            output+= p.column_name + ": " + p.value + " ";
        });
        return(output);
    }
    this.print = function() {
        console.log("====================" + this.to_string() + "====================");
    }

}
key_model.sanity = function() {
    const test_model = new key_model();
    test_model.schema.create_table();

// key_model.set: (id: any, name: any, private_key: any, public_key: any, file: any, user: any) => any
    test_model.set(1, "test_key", test_keys.private_key, test_keys.public_key, 1, 1);
    let t1 = test_model.to_string();
    test_model.print();

    const new_model = new key_model();

    new_model.schema.load(1);
    let t2 = new_model.to_string();
    new_model.print();

    if (t1 === t2) {
        console.log("[key MODEL]: Sanity check pass!\n");
        return (true);
    } else {
        console.log("blame zack");
        return (false);
    }
}

module.exports.key_model = key_model;

//key_model.sanity();
