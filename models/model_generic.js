var Database = require('better-sqlite3');
var db = new Database('db.db');

const model_generic = {

    is_child_property: function(property) {
        return (this.hasOwnProperty(property) 
                && typeof (this[property]) !== "function"
                && property !== "testing");
    },

    load_by_id: function(id) {
        let q = `SELECT * FROM files WHERE id=${id}`;
        let row = db.prepare(q).get();

        //console.log(row);
        for (var property in this) {
            if (this.is_child_property(property) == true) {
                this[property] = row[property];
            }
        }
    },

    write: function() { 
        if (this.ensure_not_null == false) {
            console.log("Writing null file model!!");
        }
        let columns = "(";
        let values = "(";

        for (var property in this) {
            if (this.is_child_property(property) == true) {
                if (this.id == null && property == "id") {
                    continue;
                }
                columns += property + ", ";
                value = this[property];
                values += `'${value}', `;
            }
        }
        columns = columns.substring(0,columns.length-2);
        columns+=")";
        values = values.substring(0,values.length-2);
        values+=")";

        let query = 'INSERT OR REPLACE INTO files' + columns + " VALUES " + values + ";";
        //console.log(query);
        let results = db.prepare(query).run();

        if(this.id == null) {
            this.id = results.lastInsertROWID;
        }

    },

    print: function() {
        //console.log("id: " + this.id, this.name, this.data)
        let output = "";
        for (var property in this) {
            if (this.is_child_property(property) == true) {
                output+=property+": "+this[property]+", ";
            }
        }
        console.log(output);
    },

    ensure_not_null: function() {
        for (var property in this) {
            if (this.is_child_property() == true) {
                //console.log(property);
                if (this[property] == null) {
                    return (false);
                }
            }
        }
        return (true);

    },
        

}

module.exports = {
    model_generic: model_generic,
    db: db
}
