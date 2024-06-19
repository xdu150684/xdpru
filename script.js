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

        var validLinks = [];
        var invalidLinks = [];

        lines.forEach(function(line) {
            line = line.trim();
            if (line.startsWith('#EXTINF:') || line.startsWith('#')) {
                return; // Saltar líneas de información del canal y comentarios
            }
            if (line) {
                var link = line.split('#')[0].trim();
                var request = new XMLHttpRequest();
                request.open('HEAD', link, true);
                request.onload = function() {
                    if (request.status === 200) {
                        validLinks.push(link);
                        mostrarEnlace(link, true);
                    } else {
                        invalidLinks.push(link);
                        mostrarEnlace(link, false);
                    }
                };
                request.onerror = function() {
                    invalidLinks.push(link);
                    mostrarEnlace(link, false);
                };
                request.send();
            }
        });

        // Función para mostrar el enlace en la lista correspondiente
        function mostrarEnlace(link, esValido) {
            var lista = esValido ? document.getElementById('validLinksList') : document.getElementById('invalidLinksList');
            var linkDiv = document.createElement('div');
            linkDiv.textContent = link;
            lista.appendChild(linkDiv);
        }

        // Función para descargar los enlaces válidos o inválidos
        function descargarEnlaces(enlaces, nombreArchivo) {
            var blob = new Blob([enlaces.join('\n')], { type: 'text/plain' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = nombreArchivo;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }

        // Evento para descargar enlaces válidos
        document.getElementById('downloadValidLinks').addEventListener('click', function() {
            descargarEnlaces(validLinks, 'enlaces_validos.txt');
        });

        // Evento para descargar enlaces inválidos
        document.getElementById('downloadInvalidLinks').addEventListener('click', function() {
            descargarEnlaces(invalidLinks, 'enlaces_invalidos.txt');
        });
    };

    reader.readAsText(file);
});
