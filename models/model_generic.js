let Database = require('better-sqlite3');
let db = new Database('db.db');


const model_generic = {

    ignored_values_global: ["foreign_keys", "testing", "schema", "ignored_values"],
    ignored_values: [],

    foreign_keys: [],




    is_property_foreign_key: function(property) {
        if (this.foreign_keys.contains(property)) {
            return (true);
        } else {
            return (false);
        }
    },

    ignore_value: function(property) {
        return (
            typeof(this[property]) !== "function" &&
            !this.ignored_values_global.includes(property) &&
            !this.ignored_values.includes(property))
    },

    is_child_property: function(property) {
        return (this.hasOwnProperty(property) &&
            this.ignore_value(property));
    },

    load_by_id: function(id) {
        let q = `SELECT * FROM ${this.get_table_ref()} WHERE id=${id}`;
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
            console.log("Writing null " + this.get_table_ref() + " model!!");
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
        columns = columns.substring(0, columns.length - 2);
        columns += ")";
        values = values.substring(0, values.length - 2);
        values += ")";

        let query = 'INSERT OR REPLACE INTO ' + this.get_table_ref() + columns + " VALUES " + values + ";";
        console.log(query);
        let results = db.prepare(query).run();

        if (this.id == null) {
            this.id = results.lastInsertROWID;
        }
    },


    get_property: function(property) {

        let user_model = require('./user_model');
        let file_model = require('./file_model');
        let key_model = require('./key_model');

        string_to_model: Object.freeze({
            "user": user_model,
            "key": key_model,
            "file": file_model
        });

        //if not a foreign key return the property
        if (!this.is_property_foreign_key(property)) {
            if (this[property]) {
                return this[property]
            } else {
                console.log(`Error: No ${property} in object ${this[id]}`);
            }
            //it is a foreign key generate appropriate model and return
        } else {
            let return_object = new string_to_model[property]();
            return_object.load_by_id(this[property]);
            return (return_object);
        }
    },

    get_table_ref: function() {
        return this._TABLE_REF;
    },

    to_string: function() {
        //console.log("id: " + this.id, this.name, this.data)
        let output = "";
        for (var property in this) {
            if (this.is_child_property(property) == true) {
                output += property + ": " + this[property] + ", ";
            }
        }
        return (output);
    },

    print: function() {
        console.log(this.to_string());
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
