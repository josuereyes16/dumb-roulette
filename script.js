const options = [];
const colors = {};
let chart;
let spinning = false;

// Mostrar el modal con el mensaje
function showAlert(message) {
    const alertModal = document.getElementById('alertModal');
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.textContent = message;
    alertModal.style.display = 'flex';
}

// Cerrar el modal
function closeAlert() {
    const alertModal = document.getElementById('alertModal');
    alertModal.style.display = 'none';
}

function addOption() {
    const optionInput = document.getElementById('optionInput');
    const option = optionInput.value.trim();

    if (option && !options.includes(option)) {
        options.push(option);
        updateOptionList();
        updateChart();
        optionInput.value = '';
    } else {
        showAlert('Opción vacía o ya existente.');
    }
}

function updateOptionList() {
    const optionList = document.getElementById('optionList');
    optionList.innerHTML = '';
    options.forEach((option) => {
        const div = document.createElement('div');
        div.textContent = option;
        div.style.backgroundColor = generateColor(option);
        optionList.appendChild(div);
    });
}

function generateColor(option) {
    if (!colors[option]) {
        colors[option] = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
    }
    return colors[option];
}

function updateChart() {
    const ctx = document.getElementById('pieChart').getContext('2d');
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: options,
            datasets: [{
                data: Array(options.length).fill(1),
                backgroundColor: options.map(generateColor),
            }],
        },
        options: {
            responsive: true,
            animation: { duration: 0 },
        },
    });
}

function spinWheel() {
    if (options.length === 0) {
        showAlert('Por favor, agrega opciones antes de girar la ruleta.');
        return;
    }
    if (spinning) return;
    spinning = true;

    const randomIndex = Math.floor(Math.random() * options.length);
    const selectedOption = options[randomIndex];
    const rotationAngle = (randomIndex / options.length) * 360 + 360 * (Math.random() * 3 + 5);

    let currentAngle = 0;
    const spinAnimation = setInterval(() => {
        currentAngle += 10;
        chart.options.rotation = currentAngle % 360;
        chart.update();

        if (currentAngle >= rotationAngle) {
            clearInterval(spinAnimation);
            showAlert(`El elegido es: ${selectedOption}`);
            spinning = false;
        }
    }, 20);
}
