//<!-Llamando al método onDeviceReady-->
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {

//<!--window.sqlitePlugin.openDatabase crea / abre una base de datos no existente / existente-->
var db = window.sqlitePlugin.openDatabase({name: "my.db"});
show();
db.transaction(function(tx) {
tx.executeSql('CREATE TABLE IF NOT EXISTS mydata (id integer primary key, name text, email text)');
});

//<!--Método para insertar una nueva fila en la base de datos-->
$(document).on('click', '#creat', function(){
var name = $("#name").val();
var email = $("#email").val();
db.transaction(function(transaction) {
var executeQuery = "INSERT INTO mydata (name, email) VALUES (?,?)";
transaction.executeSql(executeQuery, [name,email]
, function(tx, result) {
show();
},
function(error){
//filter(function(aSome) {alert('Error occurred');
});
});
});

//<!--Mostrar todas las filas almacenadas en la base de datos-->
function show(){
db.transaction(function(transaction) {
transaction.executeSql('SELECT * FROM mydata', [], function (tx, results) {
var key = "";

//<!--Display the table head-->
var pair="<tr><th data-priority=\"1\"><center>Id</center></th><th data-priority=\"1\"><center>Name</center></th><th data-priority=\"2\"><center>Email</center></th><th><center>Update</center></th><th><center>Delete</center></th></tr>";
var i=0;

//<!--results.rows.length para obtener el número total de filas almacenadas en la base de datos-->
var len = results.rows.length, i;
for (i=0; i<=len-1; i++) {

//<!--Fetching the 'name' from the database-->
key = results.rows.item(i).name;

//<!--Fetching the 'id' from the database-->
id = results.rows.item(i).id;

//<!--Mostrar todas las filas de la base de datos en la tabla-->
pair += "<tr><td><center>"+id+"</center></td><td><center>"+key+"</center></td><td><center>"+results.rows.item(i).email+"</center></td><td><a class=\"update\" href=\"#myPopupDialog\" data-custom="+"'"+ id+ "'" +"data-rel=\"popup\" data-position-to=\"window\" data-transition=\"pop\"><center><i class='fa fa-pencil-square-o'></i></center></a></td><td><a id=\"delete\" data=\""+id+"\"><center><i class='fa fa-trash'></i></center></a></td></tr>";
}
if (pair == "<tr><th>Name</th><th>Email</th></tr>") {
pair += "<tr><td><i>empty</i></td><td><i>empty</i></td></tr>";
}
$("#myTable").html(pair);
}, null);
});
}

//<!--Método para eliminar cualquier fila de la base de datos-->
$(document).on('click', '#delete', function(){
var id = $(this).attr("data");
db.transaction(function(transaction) {
transaction.executeSql("DELETE FROM mydata where id=?", [id],
function(tx, result) {
show();
},
function(error){
 alert('Something went Wrong');
});
});
});

//<!--Método para actualizar los valores de cualquier fila en la base de datos-->
$(document).on('click', '#upd', function(){
var id = $("#id").val();
var name = $("#uname").val();
var email = $("#uemail").val();
db.transaction(function(transaction) {
var executeQuery = "";
transaction.executeSql("UPDATE mydata SET name=?, email=? WHERE id=?", [name,email,id],
function(tx, result) {alert('Updated successfully');
show();
},
function(error){alert('Something went Wrong');});
});
});
$(document).on('click', '.update', function(){
var id = $(this).attr('data-custom');
$("#id").val(id);
db.transaction(function(transaction) {
transaction.executeSql('SELECT name,email FROM mydata where id=?', [id], function (tx, results) {
var name = results.rows.item(0).name;
var email = results.rows.item(0).email;
$("#uname").val(name);
$("#uemail").val(email);
},
function(error){
alert('Something went Wrong');
});
});
});

//<!--Método para borrar todas las filas de la base de datos-->
$(document).on('click', '#clearall', function(){
db.transaction(function(transaction) {
transaction.executeSql("DELETE FROM mydata", [],
function(tx, result) {alert('Delete successfully');
show();
},
function(error){alert('Something went Wrong');});
});
});
}
