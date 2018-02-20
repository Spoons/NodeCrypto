let generic_model = require("./model_generic");

let file_model = function() {
    this.id = null;
    this.name = null;
    this.data = null;


    //Below here is testing code
    this.prototype.create_migration_table = function() {
        db.prepare("DROP TABLE IF EXISTS files").run();
        db.prepare("CREATE TABLE files (id INTEGER PRIMARY KEY, name TEXT, data BLOB)").run();
        db.prepare("CREATE UNIQUE INDEX files_idx ON files(id)").run();
        console.log("table create");
    }

}

file_model.prototype = generic_model; //Object.create(generic_model);

const test_model = new file_model();
test_model.print();
console.log(test_model);
