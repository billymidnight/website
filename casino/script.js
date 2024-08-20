let bankroll = 10000;
let gameStatus = 'LOADING';
let onOff = 'OFF';
let point = -1;
let betAmount = 0;
let buttonOn = false;
let betType = '';  // Track whether it's PASS LINE or DON'T PASS

function updateDisplay() {
    document.getElementById('bankroll').innerText = `Bankroll: $${bankroll}`;
    document.getElementById('game-status').innerText = gameStatus;
    document.getElementById('on-off').innerText = onOff;
    document.getElementById('point-box').innerText = `Point: ${point !== -1 ? point : '-'}`;
}

function toggleGame() {
    buttonOn = !buttonOn;
    onOff = buttonOn ? 'ON' : 'OFF';
    gameStatus = 'LOADING';
    updateDisplay();
}

function selectBetType(type) {
    betType = type;
    gameStatus = `${betType} SELECTED`;
    updateDisplay();
}

function placeBet() {
    if (!betType) {
        alert('Please select either PASS LINE or DON\'T PASS BAR before placing a bet.');
        return;
    }

    betAmount = parseInt(document.getElementById('bet-amount').value);
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > bankroll) {
        alert('Invalid bet amount');
        return;
    }
    bankroll -= betAmount;  // Immediately deduct bet amount
    gameStatus = betType;  // Display the selected bet type
    updateDisplay();
}

function rollDice() {
    if (betAmount <= 0) {
        alert('A bet has not been placed yet.');
        return;
    }

    let diceRoll = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
    console.log(`Dice roll: ${diceRoll}`);

    if (!buttonOn) {
        if (betType === 'PASS LINE') {
            if (diceRoll === 7 || diceRoll === 11) {
                bankroll += 2 * betAmount;  // Increment by 2x betAmount on win
                showPopup(`YOU WIN! Roll: ${diceRoll}`);
                onOff = 'OFF';
            } else if (diceRoll === 2 || diceRoll === 3 || diceRoll === 12) {
                showPopup(`YOU LOSE! Roll: ${diceRoll}`);
                onOff = 'OFF';
            } else {
                onOff = 'ON';
                point = diceRoll;
                buttonOn = true;
                gameStatus = `Point is set to ${point}. Rolling...`;
            }
        } else if (betType === 'DON\'T PASS') {
            if (diceRoll === 7 || diceRoll === 11) {
                showPopup(`YOU LOSE! Roll: ${diceRoll}`);
                onOff = 'OFF';
            } else if (diceRoll === 2 || diceRoll === 3) {
                onOff = 'OFF';
                bankroll += 2 * betAmount;  // Increment by 2x betAmount on win
                showPopup(`YOU WIN! Roll: ${diceRoll}`);
            } else if (diceRoll === 12) {
                onOff = 'OFF';
                bankroll += betAmount;  // Push: no change in bankroll
                showPopup(`PUSH! Roll: ${diceRoll}`);
            } else {
                onOff = 'ON';
                point = diceRoll;
                buttonOn = true;
                gameStatus = `Point is set to ${point}. Rolling...`;
            }
        }
    } else {
        if (betType === 'PASS LINE') {
            if (diceRoll === point) {
                bankroll += 2 * betAmount;  // Increment by 2x betAmount on win
                showPopup(`YOU WIN! Roll: ${diceRoll}`);
                onOff = 'OFF'
                buttonOn = false;
            } else if (diceRoll === 7) {
                showPopup(`YOU LOSE! Roll: ${diceRoll}`);
                onOff = 'OFF';
                buttonOn = false;
            } else {
                gameStatus = `You rolled ${diceRoll}. Keep rolling...`;
            }
        } else if (betType === 'DON\'T PASS') {
            if (diceRoll === 7) {
                bankroll += 2 * betAmount;  // Increment by 2x betAmount on win
                showPopup(`YOU WIN! Roll: ${diceRoll}`);
                onOff = 'OFF';
                buttonOn = false;
            } else if (diceRoll === point) {
                showPopup(`YOU LOSE! Roll: ${diceRoll}`);
                onOff = 'OFF';
                buttonOn = false;
            } else {
                gameStatus = `You rolled ${diceRoll}. Keep rolling...`;
            }
        }
    }

    updateDisplay();
}

function showPopup(message) {
    const popup = document.createElement('div');
    popup.id = 'popup';
    popup.innerText = message;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 1500);  // Popup duration is 1.5 seconds
}
