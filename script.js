 document.getElementById('upload').addEventListener('change', function() {
     alert("Imagem selecionada!");
 });

document.getElementById('upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const colors = extractColors(data);
        displayPalette(colors);
    };
});

function extractColors(data) {
    const colorCounts = {};
    for (let i = 0; i < data.length; i += 4 * 10) { // faz a amostra pela qntd de pixels - nesse caso 10 
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const color = `rgb(${r},${g},${b})`;

        colorCounts[color] = (colorCounts[color] || 0) + 1;
    }

    const sortedColors = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1]) // arruma pelas mais frequentes
        .slice(0, 5) // qntd de cores principais amostradas
        .map(([color]) => color);

    return sortedColors;
}

// muda de rgb p/ hex
function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

// mostra as cores pela div palette
function displayPalette(colors) {
    const palette = document.getElementById('palette');
    palette.innerHTML = '';

    colors.forEach(color => {
        const [r, g, b] = color.match(/\d+/g).map(Number);
        const hexColor = rgbToHex(r, g, b);

        const box = document.createElement('div');
        box.className = 'color-box';
        box.style.backgroundColor = color;
        box.innerText = hexColor; // mostra o hex ** mudar
        palette.appendChild(box);
    });
}