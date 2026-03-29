// DOM элементы
const passwordInput = document.getElementById('password');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');
const uppercaseCheck = document.getElementById('uppercase');
const lowercaseCheck = document.getElementById('lowercase');
const numbersCheck = document.getElementById('numbers');
const symbolsCheck = document.getElementById('symbols');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');

// История паролей
let history = [];

// Загрузка истории из localStorage
function loadHistory() {
    const saved = localStorage.getItem('passwordHistory');
    if (saved) {
        history = JSON.parse(saved);
        updateHistoryDisplay();
    }
}

// Сохранение истории
function saveHistory() {
    localStorage.setItem('passwordHistory', JSON.stringify(history));
}

// Генерация пароля
function generatePassword() {
    const length = parseInt(lengthSlider.value);
    const hasUpper = uppercaseCheck.checked;
    const hasLower = lowercaseCheck.checked;
    const hasNumbers = numbersCheck.checked;
    const hasSymbols = symbolsCheck.checked;
    
    let chars = '';
    if (hasUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (hasLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (hasNumbers) chars += '0123456789';
    if (hasSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (chars === '') {
        alert('Выберите хотя бы один тип символов!');
        return '';
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }
    
    return password;
}

// Обновление индикатора длины
lengthSlider.addEventListener('input', () => {
    lengthValue.textContent = lengthSlider.value;
});
// Генерация и отображение пароля
function generateAndDisplay() {
    const password = generatePassword();
    if (password) {
        passwordInput.value = password;
        updateStrength(password);
        addToHistory(password);
    }
}

// Оценка надежности пароля
function updateStrength(password) {
    let score = 0;
    
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const percent = (score / 6) * 100;
    strengthFill.style.width = percent + '%';
    
    if (percent < 30) {
        strengthFill.style.background = '#f44336';
        strengthText.textContent = 'Слабый ❌';
    } else if (percent < 60) {
        strengthFill.style.background = '#ff9800';
        strengthText.textContent = 'Средний ⚠️';
    } else {
        strengthFill.style.background = '#4CAF50';
        strengthText.textContent = 'Сильный ✅';
    }
}

// Добавление в историю
function addToHistory(password) {
    history.unshift({
        password: password,
        date: new Date().toLocaleString(),
        length: password.length
    });
    
    if (history.length > 10) history.pop();
    saveHistory();
    updateHistoryDisplay();
}

// Отображение истории
function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.password}</span>
            <small>${item.date}</small>
        `;
        historyList.appendChild(li);
    });
}

// Копирование в буфер обмена
async function copyPassword() {
    const password = passwordInput.value;
    if (!password) return;
    
    try {
        await navigator.clipboard.writeText(password);
        copyBtn.textContent = '✅';
        setTimeout(() => {
            copyBtn.textContent = '📋';
        }, 2000);
    } catch (err) {
        alert('Не удалось скопировать');
    }
}

// Очистка истории
function clearHistory() {
    if (confirm('Удалить всю историю паролей?')) {
        history = [];
        saveHistory();
        updateHistoryDisplay();
    }
}

// Обработчики событий
generateBtn.addEventListener('click', generateAndDisplay);
copyBtn.addEventListener('click', copyPassword);
document.getElementById('clearHistory')?.addEventListener('click', clearHistory);

// Загрузка данных при старте
loadHistory();

// Первая генерация при загрузке
setTimeout(() => {
    generateAndDisplay();
}, 100);
document.getElementById('resetBtn')?.addEventListener('click', () => {
    document.getElementById('length').value = '12';
    document.getElementById('lengthValue').textContent = '12';
    document.getElementById('uppercase').checked = true;
    document.getElementById('lowercase').checked = true;
    document.getElementById('numbers').checked = true;
    document.getElementById('symbols').checked = false;
    generateAndDisplay();
});
