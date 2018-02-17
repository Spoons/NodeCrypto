var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db.db');

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
        db.serialize(function() {
            db.all(`SELECT * FROM files WHERE id=${id}`, function(err, rows) {
                rows.forEach(function(row) {
                    console.log(row);
                    this.db_id = row.id;
                    this.name = row.name;
                    this.data = row.data;
                })
            });
        });
    },

    write_new_file: function() { 
        //console.log(this.name);
        db.serialize(function() {
            db.run("INSERT INTO files (id, name, data) VALUES ($id, $name, $data)", {
                $id: this.db_id,
                $name: this.name,
                $data: this.data
            });
        });
    },

    print: function() {
        console.log("id: " + this.db_id, this.name, this.data)
    },
        

    //Below here is testing code
    create_test_table: function() {
        db.serialize(function() {
            db.run("DROP TABLE files");
            db.run("CREATE TABLE files (id INTEGER, name TEXT, data BLOB)");
        });
        console.log("table create");
    }
}


const sanity_test = function() {
    const test_model = Object.create(file_model);
    test_model.create_test_table();

    test_model.set(1, "gay", "0101010101010");
    test_model.print();
    test_model.write_new_file()
    
    const new_model = Object.create(file_model);
    new_model.load_by_id(1);
    new_model.print();
    
}

sanity_test();
