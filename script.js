/* Configuration */
const WHATSAPP_NUMBER = "919855071280"; 
const AUTO_ADVANCE_DELAY = 200; 

/* State Management */
let currentState = {
    step: 1,
    intent: null,
    zone: null,
    block: null,
    type: null,
    size: null
};

/* DOM Elements */
const progressBar = document.getElementById('progressBar');
const prevBtn = document.getElementById('prevBtn');
const navControls = document.getElementById('navControls');
const successScreen = document.getElementById('successScreen');

// Linear Steps
const steps = {
    1: 'step1',
    2: 'step2',
    3: 'step3',
    4: 'step4',
    5: 'step5',
    6: 'step6'
};

document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    createParticles();
});

function selectOption(key, value, element) {
    currentState[key] = value;
    highlightSelection(element);
    setTimeout(nextStep, AUTO_ADVANCE_DELAY);
}

function selectZone(zoneName, element) {
    currentState.zone = zoneName;
    highlightSelection(element);
    
    // Render specific blocks dynamically
    const container = document.getElementById('specificBlockGrid');
    container.innerHTML = ''; 
    
    const blockList = zoneName === 'Block A-D' ? ['A', 'B', 'C', 'D'] : ['E', 'F', 'G', 'H', 'I', 'J'];
    
    blockList.forEach(b => {
        const div = document.createElement('div');
        div.className = 'option-card';
        div.innerHTML = `<span>Block ${b}</span>`;
        div.onclick = function() {
            selectOption('block', `Block ${b}`, this);
        };
        container.appendChild(div);
    });

    setTimeout(nextStep, AUTO_ADVANCE_DELAY);
}

function selectType(type, element) {
    currentState.type = type;
    currentState.size = null; 
    highlightSelection(element);
    renderSizes(); 
    setTimeout(nextStep, AUTO_ADVANCE_DELAY);
}

function highlightSelection(element) {
    const siblings = element.parentElement.children;
    for (let sib of siblings) {
        sib.classList.remove('selected');
    }
    element.classList.add('selected');
}

function renderSizes() {
    const container = document.getElementById('sizeOptionsContainer');
    container.innerHTML = ''; 

    let sizes = [];

    // Size Logic based on Zone
    if (currentState.zone === 'Block E-J' && currentState.type === 'Residential') {
        sizes = ['200 Gaj', '300 Gaj', '500 Gaj'];
    }
    else if (currentState.zone === 'Block E-J' && currentState.type === 'Commercial') {
        sizes = ['100 Gaj Showroom', '200 Gaj Showroom'];
    }
    else if (currentState.type === 'Residential') {
        sizes = ['100 Gaj', '150 Gaj', '200 Gaj', '300 Gaj', '500 Gaj'];
    } 
    else if (currentState.type === 'Commercial') {
        sizes = ['25 Gaj Booth', '60 Gaj Bay Shop', '100 Gaj Showroom', '200 Gaj Showroom'];
    }

    sizes.forEach(size => {
        const div = document.createElement('div');
        div.className = 'option-row';
        div.innerHTML = `<div class="row-content"><span>${size}</span></div> <i class="fa-regular fa-circle action-icon"></i>`;
        
        div.onclick = function() {
            currentState.size = size;
            Array.from(container.children).forEach(c => {
                c.classList.remove('selected');
                c.querySelector('.action-icon').className = 'fa-regular fa-circle action-icon';
            });
            this.classList.add('selected');
            this.querySelector('.action-icon').className = 'fa-solid fa-dot-circle action-icon';
            setTimeout(nextStep, AUTO_ADVANCE_DELAY);
        };
        container.appendChild(div);
    });
}

function nextStep() {
    if(currentState.step >= 6) return;
    currentState.step++;
    updateUI();
}

function prevStep() {
    if(currentState.step <= 1) return;
    currentState.step--;
    updateUI();
}

function updateUI() {
    document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
    document.getElementById(steps[currentState.step]).classList.add('active');

    let progress = (currentState.step / 6) * 100;
    progressBar.style.width = `${progress}%`;

    prevBtn.style.visibility = currentState.step === 1 ? 'hidden' : 'visible';
    
    if (currentState.step === 6) {
        fillSummary();
    }
}

function fillSummary() {
    document.getElementById('summaryIntent').innerText = currentState.intent;
    document.getElementById('summaryLocation').innerText = `Aerotropolis ${currentState.block}`;
    document.getElementById('summaryType').innerText = currentState.type;
    document.getElementById('summarySize').innerText = currentState.size;
}

function submitForm() {
    const message = `Hello Happy from GMADA Aerotropolis LOI Bazaar,%0aI am looking to *${currentState.intent.toUpperCase()}* an LOI.%0a📍 *Location:* Aerotropolis ${currentState.block}%0a🏠 *Type:* ${currentState.type}%0a📏 *Size:* ${currentState.size}%0a%0aPlease contact me at the earliest.`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');

    document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
    navControls.style.display = 'none';
    progressBar.parentElement.style.display = 'none';
    document.querySelectorAll('.step-title').forEach(t => t.style.display = 'none');
    successScreen.style.display = 'block';
}

function resetForm() {
    location.reload();
}

function createParticles() {
    const container = document.getElementById('particles');
    if(!container) return; 
    container.innerHTML = '';
    const particleCount = 20; 
    
    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + 'vw';
        const size = Math.random() * 8 + 4 + 'px'; 
        p.style.width = size;
        p.style.height = size;
        const duration = Math.random() * 15 + 15; 
        p.style.animationDuration = duration + 's';
        p.style.animationDelay = '-' + (Math.random() * duration) + 's';
        container.appendChild(p);
    }
}
