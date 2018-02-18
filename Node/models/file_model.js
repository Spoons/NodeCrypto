var Database = require('better-sqlite3');
var db = new Database('db.db');

/*
 * file_model will be our model for file objects, 
 * it has properties id, name, and date. ID will be set 
 * via the database, but it is listed as the last parameter
 * in case we want to set it for some reason. 
 
 * In JavaScript, if we don't pass enough data, the leftover 
 * will just be undefined, and if we pass too much, it will
 * just toss whatever extra we give. The = in the signature
 * is how default parameters are set. If no value is passed,
 * these values will be used. 
 */
const file_model = function(name = null, data = null, id = null){
    
    
    /*
     * Generate ID later via database - no 'let' needed as 'this' 
     * will assign the values as properties to the function 
     * object instance.
     */ 
    this.id = id;
    this.name = name;
    this.data = data;

    // Set functiion for setting values
    this.set = function(id, name, data) {
        this.id = id;
        this.name = name;
        this.data = data;
    }

    /*
    *   load_by_id will query the database and 
    *   return a single result with matching unique ID
    */
    this.load_by_id = function(id) {
        let query = `SELECT * FROM files WHERE id=${id}`;
        let row = db.prepare(query).get();
        this.id = row.id;
        this.name = row.name;
        this.data = row.data;
    }

    /*
    *   write_new_file will query the database and 
    *   write the value as a row with the current
    *   values inside the object instance
    */
    this.write_new_file = function() { 
        var query = `INSERT INTO files (id, name, data) VALUES (${this.id}, '${this.name}', '${this.data}')`;
        console.log("\tQuery:\t"+ query);
        db.prepare(query).run();
    }

    // Print simply prints the properties of the instance
    this.print = function() {
        console.log("\tid:\t" + this.id + "\n\tName:\t" + this.name + "\n\tData:\t" + this.data)
    }   

    /*
    *   For testing, drops then creates table
    */
}

/*
 * This will add the function create_test_table as a prototype
 * function of file_model. This means that any instances will 
 * be able to access it through the lookup-fallback style 
 * access (they don't have it so they traverse up the 
 * prototype chain to find it), and it will not be declared
 * as a part of the actual object instance itself.
 */
file_model.prototype.create_test_table = function() {
        db.prepare("DROP TABLE files").run();
        db.prepare("CREATE TABLE files (id INTEGER, name TEXT, data BLOB)").run();
        console.log("===table create===");
}


const sanity_test = function() {
    file_model.prototype.create_test_table();
    
    
    console.log("===Creating first model===");
    // Create model and run functions to test
    const test_model = new file_model("NameInfo", "DataInfo", 1);
    console.log("Printing originally set data...");
    test_model.print();
    
    console.log("\nWriting data to DB...");
    test_model.write_new_file();
    
    console.log("\nSetting new data...");
    test_model.set(2, "NEWNameInfo", "NEWDataInfo");
    
    console.log("\nPrinting new data...");
    test_model.print();
    
    console.log("\nWriting data to DB...");
    test_model.write_new_file()
    
    
    /*
     * Create new model to access information in DB without
     * directly accessing original object instance (to test).
     * 
     * Going to load it with default parameters since it will
     * only be used to retrieve the information above
     */
    
    console.log("\n===Creating second model===");
    const new_model = new file_model();
    
    console.log("\nUsing second model instance to load data from first model instance...");
    new_model.load_by_id(1);
    
    console.log("Printing data from first model instance using second model instance...")
    new_model.print();
    
    console.log("\nUsing second model instance to load data from first model instance, SECOND ROW...");
    new_model.load_by_id(2);
    
    console.log("Printing data from first model instance using second model instance, SECOND ROW...")
    new_model.print();
            
}

sanity_test();
