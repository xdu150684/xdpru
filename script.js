document.getElementById('uploadForm').addEventListener('submit', function(e) {
    e.preventDefault();

    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];

    if (!file) {
        alert('Por favor selecciona un archivo m3u8.');
        return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
        var content = e.target.result;
        var lines = content.split('\n');

        var resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        lines.forEach(function(line) {
            line = line.trim();
            if (line.startsWith('#EXTINF:') || line.startsWith('#')) {
                return; // Saltar líneas de información del canal y comentarios
            }
            if (line) {
                var link = line.split('#')[0].trim();
                var linkDiv = document.createElement('div');
                linkDiv.textContent = link;

                var request = new XMLHttpRequest();
                request.open('HEAD', link, true);
                request.onload = function() {
                    if (request.status === 200) {
                        linkDiv.textContent += ' - Válido';
                        linkDiv.style.color = 'green';
                    } else {
                        linkDiv.textContent += ` - Inválido (Código de Estado: ${request.status})`;
                        linkDiv.style.color = 'red';
                    }
                };
                request.onerror = function() {
                    linkDiv.textContent += ' - Error al conectar';
                    linkDiv.style.color = 'orange';
                };
                request.send();

                resultsDiv.appendChild(linkDiv);
            }
        });
    };

    reader.readAsText(file);
});
