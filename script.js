document.getElementById('uploadForm').addEventListener('submit', function(e) {
    e.preventDefault();

    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];

    if (!file) {
        alert('Por favor selecciona un archivo m3u8.');
        return;
    }

    var reader = new FileReader();
    reader.onload = async function(e) {
        var content = e.target.result;
        var lines = content.split('\n');

        var validLinks = [];
        var invalidLinks = [];

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('#EXTINF:') || trimmedLine.startsWith('#')) {
                continue; // Saltar líneas de información del canal y comentarios
            }
            if (trimmedLine) {
                const link = trimmedLine.split('#')[0].trim();
                try {
                    const response = await fetch(link, { method: 'HEAD' });
                    if (response.ok) {
                        validLinks.push(link);
                        mostrarEnlace(link, true);
                    } else {
                        invalidLinks.push(link);
                        mostrarEnlace(link, false);
                    }
                } catch (error) {
                    invalidLinks.push(link);
                    mostrarEnlace(link, false);
                }
            }
        }
    };

    reader.readAsText(file);

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
});
