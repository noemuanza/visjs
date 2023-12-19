var timelineProfesseurs;
var itemsProfesseurs;
var hasModifications = false;

// Données initiales des cours
var coursData = [
    { id: 1, title: 'Cours de Mathématiques', prof: 'Prof1', start: new Date('2023-01-01T10:00:00+01:00'), end: new Date('2023-01-01T12:00:00+01:00') },
    { id: 2, title: 'Cours de Physique', prof: 'Prof2', start: new Date('2023-01-01T10:00:00+01:00'), end: new Date('2023-01-01T15:00:00+01:00') }
    // ... autres cours ...
];

// Options de base pour la timeline
var options = {
    start: new Date('2023-01-01T08:00:00+01:00'),
    end: new Date('2023-01-01T18:00:00+01:00'),
    editable: true
};

function initTimelineProfesseurs() {
    var storedData = localStorage.getItem('modifiedTimelineData');
    var timelineData;

    if (storedData) {
        timelineData = JSON.parse(storedData);
    } else {
        timelineData = coursData;
    }

    itemsProfesseurs = new vis.DataSet(timelineData);

    timelineProfesseurs = new vis.Timeline(document.getElementById('timelineProfesseurs'), itemsProfesseurs, options);

    // Gestionnaire d'événement pour le déplacement, l'ajout et la suppression d'éléments
    timelineProfesseurs.on('changed', function (event) {
        hasModifications = true;
    });
}

function saveChanges() {
    if (hasModifications) {
        var modifiedData = itemsProfesseurs.get();
        localStorage.setItem('modifiedTimelineData', JSON.stringify(modifiedData));
        console.log("Modifications enregistrées localement");
        hasModifications = false;
    } else {
        console.log("Aucune modification à enregistrer.");
    }
}

function exportTimelineData() {
    var data = itemsProfesseurs.get({ returnType: 'Object' });

    // Ajustez les heures au fuseau horaire UTC+01:00
    for (var id in data) {
        if (data.hasOwnProperty(id)) {
            var item = data[id];
            var start = new Date(item.start);
            var end = new Date(item.end);
            start.setUTCHours(start.getUTCHours() + 1);
            end.setUTCHours(end.getUTCHours() + 1);
            item.start = start.toISOString();
            item.end = end.toISOString();
        }
    }

    var json = JSON.stringify(data, null, 2);

    var blob = new Blob([json], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'timeline-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

document.getElementById('saveChanges').addEventListener('click', saveChanges);
document.getElementById('exportData').addEventListener('click', exportTimelineData);

window.onload = initTimelineProfesseurs;
