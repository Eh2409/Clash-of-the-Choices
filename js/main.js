'use strict'

// Game State
// השחקנים
var gPlayer = {id:0, life: 200 , power: 250}
var gComputer = {id:1, life: 200 , power: 250}
// התקפת החשקנים
var gAttackingPlayer
var gAttackingComputer
// המנצח
var theWinner 

var gIsGameOn 
var gIsDrawDamage 
var gRoundIsInProgress = false
var gDrawSituation 

function init() {
    console.log('%c init','font-size: 15px;color:green');
    hideAttack()
    computerAttack()
    updateAttackResults()
    updateCurrPower()
    console.log(gPlayer);
    console.log(gComputer);
    isLifeZero()
    if (theWinner) {
        winner()
    } 
    
}

function play() {
    console.log('%c play','font-size: 15px;color:green');
    hideMessages('open-screen')
    gIsGameOn = true
    console.log('---------gmae on--------');
    
}

function playerAttack(selectedAttack) {
    console.log('%c playerAttack','font-size: 15px;color:green');
    if (!gIsGameOn) {
        return console.log('Game is not started yet');
        
    }

    const inputPlayePower = document.querySelector('input')
    var attackPower  = +inputPlayePower.value

    if (attackPower  === 0 ) {
        erorrInput('ziro')
        return console.log('No attack power selected, select the power');
    } else if (attackPower  >  gPlayer.power){
        erorrInput('over-power')
        return console.log('The attack power you chose is greater than the amount you have');
    } else {
        erorrInput('none')
        var moveType = selectedAttack.textContent
        gAttackingPlayer = {type: moveType , power: attackPower}
    }

    hideMessages('draw')
    roundInProgress()
    init()
}

function computerAttack() {
    console.log('%c computerAttack','font-size: 15px;color:green');
    const randomAttack = getRandomInt(0, 3)
    const attacks = ['rock','paper','scissors']
    var moveType  = attacks[randomAttack]
    var attackPower  = getRandomInt(1, gComputer.power + 1)
    gAttackingComputer = {type: moveType  , power: attackPower }
}

function updateAttackResults() {
    console.log('%c updateAttackResult','font-size: 15px;color:green');
    const winningCombinations = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
    };
    
    console.log('player: ' + gAttackingPlayer.type);
    console.log('Computer: ' + gAttackingComputer.type);

    if (winningCombinations[gAttackingComputer.type] === gAttackingPlayer.type) {
        console.log('computer hit');
        gPlayer.life -= gAttackingComputer.power
        if (gPlayer.life < 0)  gPlayer.life = 0
    } else if (winningCombinations[gAttackingPlayer.type] === gAttackingComputer.type){
        console.log('player hit');
        gComputer.life -= gAttackingPlayer.power
        if (gComputer.life < 0)  gComputer.life = 0
    } else {
        console.log('Draw');
        handleDraw()
    }

    console.log(gAttackingComputer.power);
    setTimeout(showAttack,100)
    domUpdateLifeAndPower()
    
}

function handleDraw() {
    console.log('%c handleDraw','font-size: 15px;color:green');
    gDrawSituation = true
    if (gAttackingPlayer.power === gAttackingComputer.power) {
        console.log('no damage');
        gIsDrawDamage = false
        displayDraw()
    } else {
        var strongestHitter = (gAttackingPlayer.power > gAttackingComputer.power)?'player': 'computer'
        console.log(strongestHitter);
        gIsDrawDamage = true
        displayDraw(strongestHitter)
        if (strongestHitter === 'player') gComputer.life -= gAttackingPlayer.power
        else if (strongestHitter === 'computer') gPlayer.life -= gAttackingComputer.power
    }
    if (gPlayer.life < 0)  gPlayer.life = 0
    if (gComputer.life < 0)  gComputer.life = 0

    // setInterval(hideMessages('draw'),2000)
}

function updateCurrPower() {
    console.log('%c updateCurrPower','font-size: 15px;color:green');
    gPlayer.power-= gAttackingPlayer.power
    gComputer.power-= gAttackingComputer.power
}

function isPowerZero() {
    console.log('%c isPowerZero','font-size: 15px;color:green');
    var elAllPower = document.querySelector('.all-the-power')
    var isPowerZiro = false
    if (gPlayer.power === 0) {
        hideMessages('draw')
        isPowerZiro = true
        // dom
        elAllPower.innerHTML = `The player runs out of power <br>
            The player is vulnerable to attack`
        elAllPower.classList.remove('hide')
        setTimeout(()=>{
        elAllPower.textContent = 'The computer attacks with all the power it has left'
        },5000)
        // update life and power
        setTimeout(()=>{
            gPlayer.life -= gComputer.power
            if (gPlayer.life < 0)  gPlayer.life = 0
            gComputer.power = 0 
            theWinner = (gPlayer.life > gComputer.life)? 'player' : 'computer'
            domUpdateLifeAndPower()
        },8000)
        setTimeout(()=>{
            elAllPower.classList.add('hide')
        },10000)
        setTimeout(winner,10000)
    }

    if (gComputer.power === 0) {
        hideMessages('draw')
        isPowerZiro = true
        // dom
        elAllPower.innerHTML = `The computer runs out of power <br>
            The computer is vulnerable to attack`
         elAllPower.classList.remove('hide')
        setTimeout(()=>{
        elAllPower.textContent = 'The player attacks with all the power it has left'
        },5000)
        // // update life and power
        setTimeout(()=>{
            gComputer.life -= gPlayer.power
            if (gComputer.life < 0)  gComputer.life = 0
            gPlayer.power = 0
            theWinner = (gPlayer.life > gComputer.life)? 'player' : 'computer'
            domUpdateLifeAndPower()
        },8000)
        setTimeout(()=>{
            elAllPower.classList.add('hide')
        },10000)
        setTimeout(winner,10000)
    } 
   
     domUpdateLifeAndPower()
    if (!isPowerZiro) {
        roundInProgress()
    }
}

function isLifeZero() {
    console.log('%c isLifeZero','font-size: 15px;color:green');
    if (gPlayer.life === 0 && gComputer.life === 0) {
        theWinner = 'draw'
        gIsGameOn = false
    }
    if (gPlayer.life <= 0) {
        theWinner = 'computer'
        gIsGameOn = false
        return
    } 
    if (gComputer.life <= 0) {
        theWinner = 'player'
        gIsGameOn = false
        return
    } 
    if (gDrawSituation && gPlayer.power === 0 ||gDrawSituation && gComputer.power === 0 ) {
        console.log('kakakak!!!!!!!');
        gDrawSituation = false
        setTimeout(isPowerZero,2000)
    } else {
        isPowerZero()
        gDrawSituation = false
    }
}
    

function winner() {
console.log('%c winner','font-size: 15px;color:green');
var elMessage = document.querySelector('.message')
elMessage.classList.add('hide')
domUpdateLifeAndPower()
console.log('the winner:' + theWinner);
console.log(gPlayer);
console.log(gComputer);
domGameEnd()
domNewGame(true)
}

function newGame() {
    console.log('%c newGame','font-size: 15px;color:green');
    hideAttack()
    gPlayer = {id:0, life: 200 , power: 250}
    gComputer = {id:1, life: 200 , power: 250}
    theWinner = null
    hideMessages('end-game')
    console.log('--------new-game-------');
    domUpdateLifeAndPower()
    roundInProgress()
    domNewGame(false)
    play()
}

////////////DOM//////////////

function domGameEnd() {
    var elEndGame = document.querySelector('.end-game-message')
    if (theWinner === 'draw') {
     elEndGame.classList.remove('hide')
    elEndGame.textContent = `${theWinner}!`
    } else {
    elEndGame.classList.remove('hide')
    elEndGame.textContent = `${theWinner} won!`
    }
   
}

function displayDraw(strongestHitter){
var elMessage = document.querySelector('.message')
elMessage.classList.remove('hide')
var elDraw = document.querySelector('.draw-message')
elDraw.textContent = `Draw`
if (gIsDrawDamage) {
    var elStrongest = document.querySelector('.The-stronger-message')
    console.log(elStrongest);
    elStrongest.innerHTML = `${strongestHitter} <br> has the stronger attack`
} else{
    var elStrongest = document.querySelector('.The-stronger-message')
    elStrongest.innerHTML = 'no damage'
}
}

function showAttack() {
    // player attck show
    var elPlayerAttack = document.querySelector('.player-attck')
    var elPlayerAttackPic = elPlayerAttack.querySelector('.show-player-attack')
    elPlayerAttackPic.src= `img/${gAttackingPlayer.type}-player.png`
    var elPlayerAttackDamage = elPlayerAttack.querySelector('p')
    elPlayerAttackDamage.textContent = `${gAttackingPlayer.power}`
    elPlayerAttack.classList.remove('hide')
    // computer attck show
    var elComputerAttack = document.querySelector('.computer-attck')
    var elComputerAttackPic = elComputerAttack.querySelector('.show-computer-attack')
    elComputerAttackPic.src= `img/${gAttackingComputer.type}-computer.png`
    var elComputerAttackDamage = elComputerAttack.querySelector('p')
    elComputerAttackDamage.textContent = `${gAttackingComputer.power}`
    elComputerAttack.classList.remove('hide')
}

function hideAttack(){
    // player attck hide
    var elPlayerAttack = document.querySelector('.player-attck')
    elPlayerAttack.classList.add('hide')
    // computer attck hide
    var elComputerAttack = document.querySelector('.computer-attck')
    elComputerAttack.classList.add('hide')
}

function domUpdateLifeAndPower() {
    // update life
    var elPlayerLife = document.querySelector('.player-life')
    elPlayerLife.style.width = gPlayer.life + 'px'
    var elPlayerLifePercentage = document.querySelector('.player-life-percentage')
    elPlayerLifePercentage.textContent = `${gPlayer.life} HP`

    var elComputerLife = document.querySelector('.computer-life')
    elComputerLife.style.width = gComputer.life + 'px' 
    var elComputerLifePercentage = document.querySelector('.computer-life-percentage')
    elComputerLifePercentage.textContent = `${gComputer.life} HP`
    // update power
    var elPlayerPower = document.querySelector('.player-power')
    elPlayerPower.style.width = gPlayer.power + 'px'
    var elPlayerPowerPercentage = document.querySelector('.player-power-percentage')
    elPlayerPowerPercentage.textContent =  `${gPlayer.power} power`

    var elComputerPower = document.querySelector('.computer-power')
    elComputerPower.style.width = gComputer.power + 'px'
    var elComputerPowerPercentage = document.querySelector('.computer-power-percentage')
    elComputerPowerPercentage.textContent = `${gComputer.power} power`
}

function roundInProgress() {
    console.log(gRoundIsInProgress);
    var elProgress = document.querySelector('.round-in-progress')
    gRoundIsInProgress = !gRoundIsInProgress
    if (gRoundIsInProgress) {
        elProgress.classList.remove('none')
    }

    if (!gRoundIsInProgress) {
        setTimeout(()=>{
            elProgress.classList.add('none')
        },1000)
    }
}

function hideMessages(massageType) {
    if (massageType === 'draw') {
        var elMessage = document.querySelector('.message')
        elMessage.classList.add('hide')
    }
    if (massageType === 'end-game') {
        var elEndGame = document.querySelector('.end-game-message')
        elEndGame.classList.add('hide')
    }
    if (massageType = 'open-screen') {
        var openScreen = document.querySelector('.open-screen')
        openScreen.classList.add('none')
        var openGamePad = document.querySelector('.game-pad')
        openGamePad.classList.remove('none')
    }
    
}
function domNewGame(isGameEnd) {
    if (isGameEnd) {
        var elNewGame = document.querySelector('.new-game')
        elNewGame.classList.remove('none')
    }
    if (!isGameEnd) {
        var elNewGame = document.querySelector('.new-game')
        elNewGame.classList.add('none')
    }
    
}

function erorrInput(erorrType) {
    var elErorr = document.querySelector('.erorr-input')
    if (erorrType === 'ziro') {
        elErorr.textContent= 'No attack power selected, select the power'
        elErorr.classList.remove('none')
    }

    if (erorrType === 'over-power') {
        elErorr.textContent= 'The attack power you chose is greater than the amount you have'
        elErorr.classList.remove('none')
    }

    if (erorrType === 'none') {
        elErorr.classList.add('none')
    }

}
/////////////assistance/////////

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }

