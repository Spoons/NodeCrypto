let generic_model = require("./model_generic").model_generic;
let db = require("./model_generic").db;

let file_model = function() {

    this.schema = {
        properties: {
            table_name: "files",
            exported: false,
        },
        id: {
            db_type: "PRIMARY KEY INTEGER",
            column_name: "id"
        },
        name: {
            db_type: "TEXT",
            column_name: "name"
        },
        data: {
            db_type: "BLOB",
            column_name: "data"
        },
        user: {
            db_type: "INTEGER",
            db_foreign_table: "users",
            db_foreign_column: "id",
            column_name: "user"

        },
        key: {
            db_type: "INTEGER",
            db_foreign_table: "keys",
            db_foreign_column: "id",
            column_name: "key"
        },

        create_table: function() {
            let properties = this.get_schema_properties();

            db.prepare("DROP TABLE IF EXISTS files").run();
            let table_create_query = `CREATE TABLE ${this.get_table_name()} (`;
                properties.forEach(function(prop){
                       table_create_query += prop.column_name +" "+ prop.db_type + ", ";

                });
            table_create_query = table_create_query.substring(0, table_create_query.length - 2);
            table_create_query += ');';    
            console.log(table_create_query);
        },
        get_schema_properties: function() {
            let list = [];
            for (var property in this) {
                if (property.exported != false
                        && typeof(this[property]) !== "function"
                        && property !== "properties") {
                    list.push(this[property]);
                }
            }
            return (list);
        },
        get_table_name: function() {
            return (this.properties.table_name);
        }
    }


    this.update = function(name, data) {
        this.id = this.id;
        this.name = name;
        this.data = data;
        this.write();
    }

    this.update_with_id = function(id, name, data) {
        this.id = id;
        update(name, data);
    }

    //Anything in the testing sub-object is ignored when writing to db
    this.testing = {
        create_migration_table: function() {
            db.prepare("DROP TABLE IF EXISTS files").run();
            db.prepare("CREATE TABLE files (id INTEGER PRIMARY KEY, name TEXT, data BLOB, user INTEGER, key INTEGER)").run();
            db.prepare("CREATE UNIQUE INDEX files_idx ON files(id)").run();
            console.log("table create");
        },
    }

}

file_model.prototype = generic_model;
file_model.sanity = function() {
    const test_model = new file_model();
    test_model.testing.create_migration_table();

    test_model.update("cats", "0101010101010");
    let t1 = test_model.to_string();
    test_model.print();

    const new_model = new file_model();

    new_model.load_by_id(1);
    let t2 = new_model.to_string();
    new_model.print();

    if (t1 === t2) {
        console.log("file-model: sanity check pass!");
        return (true);
    } else {
        return (false);
    }
}

//file_model.sanity();

test = new file_model();
test.schema.create_table();

module.exports = file_model;
