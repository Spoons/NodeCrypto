let generic_model = require("./model_generic").model_generic;
let db = require("./model_generic").db;

let key_model = function() {
    this.id = null;
    this.key = null;
    this.file_ref_id = null;

    this.foreign_keys = ["file_ref_id"];

    Object.defineProperty(this, "_TABLE_REF", {
        enumerable: false,
        value: "keys"
    })

    this.update = function(key, file_ref_id) {
        this.id = this.id;
        this.key = key;
        this.file_ref_id = file_ref_id;
        this.write();
    }
    
    this.update_with_id = function(id, key, file_ref_id) {
        this.id = id;
        this.update(key, file_ref_id);
    }

    //Anything in the testing sub-object is ignored when writing to db
    this.testing = {
        create_migration_table: function() {
            db.prepare("DROP TABLE IF EXISTS keys").run();
            db.prepare("CREATE TABLE keys (id TEXT PRIMARY KEY, key TEXT, file_ref_id INTEGER)").run();
//            db.prepare("CREATE UNIQUE INDEX files_idx ON files(id)").run();
            console.log("keys table create");
        },
    }

}

key_model.prototype = generic_model; 
key_model.sanity = function() {
            const test_model = new key_model();
            test_model.testing.create_migration_table();

            test_model.update_with_id(1, "abcd1234zyxw", "1");
            let t1 = test_model.to_string();
            test_model.print();

            const new_model = new key_model(); 

            new_model.load_by_id(1);
            let t2 = new_model.to_string();
            new_model.print();

            if (t1 === t2) {
                console.log("file-model: sanity check pass!");
                return(true);
            } else {
                return(false);
            }
        }

key_model.sanity();

module.exports = key_model;
