var Database = require('better-sqlite3');
var db = new Database('db.db');

const file_model = {
    db_id: null,
    name: null,
    data: null,

    set: function(id, name, data) {
        this.db_id = id;
        this.name = name;
        this.data = data;
    },

    load_by_id: function(id) {
        let q = `SELECT * FROM files WHERE id=${id}`;
    },

    write_new_file: function() { 
        db.run("INSERT INTO files (id, name, data) VALUES ($id, $name, $data)");
    },

    print: function() {
        console.log("id: " + this.db_id, this.name, this.data)
    },
        

    //Below here is testing code
    create_test_table: function() {
        db.run("DROP TABLE files");
        db.run("CREATE TABLE files (id INTEGER, name TEXT, data BLOB)");
        console.log("table create");
    }
}


const sanity_test = function() {

    const test_model = Object.create(file_model);

    test_model.set(1, "gay", "0101010101010");
    test_model.print();
    test_model.write_new_file()
            
}

sanity_test();
