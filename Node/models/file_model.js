var Database = require('better-sqlite3');
var db = new Database('db.db');

const file_model = {
    id: null,
    name: null,
    data: null,

    set: function(id, name, data) {
        this.id = id;
        this.name = name;
        this.data = data;
    },

    load_by_id: function(id) {
        let q = `SELECT * FROM files WHERE id=${id}`;
        let row = db.prepare(q).get();
        console.log(row.id);
        this.id = row.id;
        this.name = row.name;
        this.data = data;

    },

    write_new_file: function() { 
        id = this.id;
        name = this.name;
        data = this.data;
        var query = `INSERT INTO files (id, name, data) VALUES ('${id}', '${name}', '${data}')`;
        db.prepare(query).run();
    },

    print: function() {
        console.log("id: " + this.id, this.name, this.data)
    },
        

    //Below here is testing code
    create_test_table: function() {
        db.prepare("DROP TABLE files").run();
        db.prepare("CREATE TABLE files (id INTEGER, name TEXT, data BLOB)").run();
        console.log("table create");
    }
}


const sanity_test = function() {

    const test_model = Object.create(file_model);

    test_model.set(1, "gay", "0101010101010");
    test_model.print();
    test_model.write_new_file()

    const new_model = Object.create(file_model);
    new_model.load_by_id(1);
    new_model.print();
            
}

sanity_test();
