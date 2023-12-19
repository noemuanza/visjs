var groups = new vis.DataSet([
    { id: 1, content: "Prof 1", value: 1 },
    { id: 2, content: "Prof 2", value: 2 },
    { id: 3, content: "Prof 3", value: 3 }
  ]);
  
  // create a dataset with items
  // note that months are zero-based in the JavaScript Date object, so month 3 is April
  var items = new vis.DataSet([
    {
      id: 0,
      group: 1,
      content: "TP",
      start: new Date().setHours(10, 30),
      end: new Date().setHours(12, 30),
      style: 'background-color: #FFD699;', // Orange clair
    },
    {
      id: 1,
      group: 1,
      content: "TD",
      start: new Date().setHours(14, 30),
      end: new Date().setHours(16, 30),
      style: 'background-color: #B3FFCC;', // Vert clair
    }, 
    {
      id: 2,
      group: 2,
      content: "CM",
      start: new Date().setHours(8, 30),
      end: new Date().setHours(12, 30),
      style: 'background-color: #FFFF99;', // Jaune clair
    },
    {
      id: 3,
      group: 3,
      content: "TD",
      start: new Date().setHours(14, 30),
      end: new Date().setHours(17, 30),
      style: 'background-color: #B3FFCC;', // Vert clair
    },
  ]);
  
  
  
  
  var salles = [
    { id: 'Salle1', capacite: 30, disponibilite: [] },
    { id: 'Salle2', capacite: 50, disponibilite: [] },
    // ... d'autres salles
  ];
  
  
  
  
  // create visualization
  var container = document.getElementById("visualization");
  var options = {
    // option groupOrder can be a property name or a sort function
    // the sort function must compare two groups and return a value
    //     > 0 when a > b
    //     < 0 when a < b
    //       0 when a == b
    groupOrder: function (a, b) {
      return a.value - b.value;
    },
    editable: true,
  };
  
  var timeline = new vis.Timeline(container);
  timeline.setOptions(options);
  timeline.setGroups(groups);
  timeline.setItems(items);
  
  // Fonction pour ajouter un nouvel item
  function ajouterItem() {
    var group = parseInt(document.getElementById("inputGroup").value, 10);
    var content = document.getElementById("inputContent").value;
    var start = new Date(document.getElementById("inputStart").value);
    var end = new Date(document.getElementById("inputEnd").value);
    var nombreEleves = parseInt(document.getElementById("inputNombreEleves").value, 10);
  
    var salleTrouvee = trouverSallePourCours(nombreEleves, start, end);
    if (!salleTrouvee) {
        alert("Aucune salle disponible pour cette période et ce nombre d'élèves.");
        return;
    }
  
    // Ajouter un nouvel item à la timeline
    items.add({
      id: items.length + 1,
      group: group,
      content: content + " (" + salleTrouvee.id + ")",
      start: start,
      end: end,
      style: 'background-color: #B3FFCC;',
    });
  
    // Mettre à jour la disponibilité de la salle
    salleTrouvee.disponibilite.push({start: start, end: end});
  
    // Effacer le contenu des inputs après l'ajout
    document.getElementById("inputGroup").value = "";
    document.getElementById("inputContent").value = "";
    document.getElementById("inputStart").value = "";
    document.getElementById("inputEnd").value = "";
    document.getElementById("inputNombreEleves").value = "";
  }
  
  
  function estDisponible(salle, start, end) {
    return salle.disponibilite.every(function(period) {
        return (start >= period.end || end <= period.start);
    });
  }
  
  function trouverSallePourCours(nombreEleves, start, end) {
    for (let salle of salles) {
        if (salle.capacite >= nombreEleves && estDisponible(salle, start, end)) {
            // Mettre à jour la disponibilité de la salle
            salle.disponibilite.push({start: start, end: end});
            return salle;
        }
    }
    return null; // Aucune salle disponible
  }
  