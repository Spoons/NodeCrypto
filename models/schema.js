let db = require("./model_generic").db;
const schema = {
    create_table: function() {
        let properties = this.get_schema_properties();

        db.prepare("DROP TABLE IF EXISTS files").run();
        let table_create_query = `CREATE TABLE ${this.get_table_name()} (`;
        properties.forEach(function(prop){
            table_create_query += prop.column_name +" "+ prop.db_type + ", ";

        });
        table_create_query = table_create_query.substring(0, table_create_query.length - 2);
        table_create_query += ');';
        //console.log(table_create_query);
        db.prepare(table_create_query).run();
    },

    drop_table: function() {
        db.prepare(`DROP TABLE IF EXISTS ${this.get_table_name()}`).run();
    },

    write: function() {
        let properties = this.get_schema_properties();

        //console.log("writing object to db");
        let query = "INSERT OR REPLACE INTO " + this.properties.table_name + "(";
        let values = "";
        properties.forEach(function(p) {
            query+=p.column_name + ", ";
            values+="\'"+p.value + "\', ";
        });
        query = query.substring(0, query.length-2) + ") VALUES (";
        query += values + ")";
        query = query.substring(0, query.length-3);
        query += ");"
        db.prepare(query).run();
    },

    load: function(id) {
        let q = `SELECT * FROM ${this.properties.table_name} WHERE id=${id};`;
        let v = db.prepare(q).get();
        let properties = this.get_schema_properties();

        let object = this;
        properties.forEach(function(p) {
            object[p.column_name].value = v[p.column_name];
        });
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
module.exports = schema;
