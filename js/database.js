class Request {
    id;
    exampleName;
    exampleInputEmail;
    exampleSpecies;
    exampleAge;
    exampleNameAnimal;
    exampleDate;
    exampleTime;
    examplePhone;
}

class Database {
    db;
    isFull;
    requests;
    count = 0;

    constructor() {
    }

    create() {
        this.db = openDatabase("Golden", "1", "description", 2 * 1024 * 1024);

        if (this.checkConnect()) {
            this.db.transaction(function(tx) {
                tx.executeSql(`CREATE TABLE if not exists golden(id INTEGER PRIMARY KEY AUTOINCREMENT, 
                    exampleName TEXT, exampleInputEmail TEXT, exampleSpecies TEXT, exampleAge TEXT, 
                    exampleNameAnimal TEXT, exampleDate NUMERIC, exampleTime NUMERIC, examplePhone TEXT)`, [], null, null);
            });
        }

        this.requests = [];
    }

    checkConnect() {
        if (!this.db) {
            alert("Failed to connect to database.");
            return false;
        }

        return true;
    }

    deleteAllRows() {
        if (this.checkConnect()) {
            this.db.transaction(function(tx) {
                tx.executeSql(`DELETE FROM golden`, [], null, null);
            });
        }

        let div = document.getElementById("container");

        div.innerHTML = "";
    }

    insert() {
        let request = new Request();

        request.exampleName = document.getElementById("exampleName").value;
        request.exampleInputEmail = document.getElementById("exampleInputEmail").value;
        request.exampleSpecies = document.getElementById("exampleSpecies").value;
        request.exampleAge = document.getElementById("exampleAge").value;
        request.exampleNameAnimal = document.getElementById("exampleNameAnimal").value;
        request.exampleDate = document.getElementById("exampleDate").value;
        request.exampleTime = document.getElementById("exampleTime").value;
        request.examplePhone = document.getElementById("examplePhone").value;

        this.db.transaction(function(tx) {
            tx.executeSql(`INSERT INTO golden(exampleName, exampleInputEmail, exampleSpecies, exampleAge, 
                exampleNameAnimal, exampleDate, exampleTime, examplePhone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [request.exampleName, request.exampleInputEmail, request.exampleSpecies,
                request.exampleAge, request.exampleNameAnimal, request.exampleDate, request.exampleTime, request.examplePhone
            ], function ar(result) { alert("Запрос успешно отправлен!" + "Спасибо, что выбрали нас!") }, function er(result) { alert("Ошибка") });
        });
    }

    deleteRow(id) {
        this.db.transaction(function(tx) {
            tx.executeSql(`DELETE FROM golden WHERE id = (?)`, [id], null, null);
        });

        event.currentTarget.remove();
    }

    fillResult(tx, result) {
        this.requests = [];
        for (var i = 0; i < result.rows.length; i++) {
            let request = new Request();
            request.id = result.rows.item(i)['id'];
            request.exampleName = result.rows.item(i)['exampleName'];
            request.exampleInputEmail = result.rows.item(i)['exampleInputEmail'];
            request.exampleSpecies = result.rows.item(i)['exampleSpecies'];
            request.exampleAge = result.rows.item(i)['exampleAge'];
            request.exampleNameAnimal = result.rows.item(i)['exampleNameAnimal'];
            request.exampleDate = result.rows.item(i)['exampleDate'];
            request.exampleTime = result.rows.item(i)['exampleTime'];
            request.examplePhone = result.rows.item(i)['examplePhone'];

            this.requests.push(request);
        }

        this.count = 0;
        this.isFull = true;
    }

    output() {
        this.count++;
        if (!this.isFull && this.count <= 3) {
            setTimeout(() => (
                this.output()
            ), this.count * 1000)
        } else if (!this.isFull && this.count > 3) {
            alert("Запросите данные еще раз");
        } else {
            let div = document.getElementById("container");

            div.innerHTML = "";

            this.requests.forEach(function(element) {
                div.innerHTML += ` 
                    <div class="container" data-delete="${element.id}" onclick="deleteRow(event)"> 
                        <div class="col-xs-2"></div> 
                        <div class="col-xs-8 card border-primary mb-3">
                            <div class="card-header">${element.exampleName}</div> 
                            <div class="card-body text-primary"> 
                                <p>Дата и время приема: ${element.exampleDate} ${element.exampleTime} </p> 
                                <button type="button" class="btn btn-danger text-xs-right">Удалить</button> 
                            </div>
                        </div> 
                        <div class="col-xs-2"></div> 
                    </div> 
                    `;

            })

            div.innerHTML += `<br><button type="button" id="bot-button" class="btn btn-default yellow yellow-bot" onclick="deleteAllRows()">
                                  Удалить таблицу
                              </button>`
        }
    }

    select() {
        this.isFull = false;
        this.db.transaction((tx) => (tx.executeSql("SELECT * FROM golden", [], this.fillResult.bind(this), null)));
    }
}

let database = new Database();

function insert() {
    database.create();
    database.insert();
}

function select() {
    database.create();
    database.select();
    database.output();
}

function deleteAllRows() {
    database.deleteAllRows();
}

function deleteRow(event) {
    let container = event.target.closest(".container");
    let id;
    if (container) {
        id = container.dataset.delete;
        container.remove();
    }

    database.deleteRow(id);
}