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
