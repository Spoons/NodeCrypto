let generic_model = require("./model_generic").model_generic;
let db = require("./model_generic").db;

let file_model = function() {
    this.id = null;
    this.name = null;
    this.data = null;
    Object.defineProperty(this, "_TABLE_REF", {
        enumerable: false,
        value: "files"
    })

    this.update = function(name, data) {
        this.id = this.id;
        this.name = name;
        this.data = data;

        //this.write.call(this);
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
            db.prepare("CREATE TABLE files (id INTEGER PRIMARY KEY, name TEXT, data BLOB)").run();
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
                return(true);
            } else {
                return(false);
            }
        }

file_model.sanity();
