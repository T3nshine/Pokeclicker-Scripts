// ==UserScript==
// @name        [Pokeclicker] Enhanced Auto Mine
// @namespace   Pokeclicker Scripts
// @match       https://www.pokeclicker.com/
// @grant       none
// @version     1.2
// @author      Ephenia
// @description Automatically mines the Underground with Bombs. Features adjustable settings as well.
// ==/UserScript==

var mineState;
var smallRestoreState;
var awaitAutoMine;
var setThreshold;
var autoMineTimer;
var mineColor;
var smallRestoreColor;
var resetInProgress;
var busyMining;
var autoMineSkip;
var layersMined;
var sellTreasureState;
var sellTreasureColor;
var sellPlateState;
var sellPlateColor;
var trainerCards = document.querySelectorAll('.trainer-card');

function initAutoMine() {
    if (mineState == "ON") {
        autoMineTimer = setInterval(function () {
            doAutoMine();
        }, 1000);
    }
    if (mineState == "OFF") {
        mineColor = "danger"
    } else {
        mineColor = "success"
    }
    if (smallRestoreState == "OFF") {
        smallRestoreColor = "danger"
    } else {
        smallRestoreColor = "success"
    }
    if (sellTreasureState == "OFF") {
        sellTreasureColor = "danger"
    } else {
        sellTreasureColor = "success"
    }
    if (sellPlateState == "OFF") {
        sellPlateColor = "danger"
    } else {
        sellPlateColor = "success"
    }
    setThreshold = +setThreshold
    resetInProgress = "NO"
    localStorage.setItem("undergroundLayersMined", App.game.statistics.undergroundLayersMined());
    layersMined = localStorage.getItem('undergroundLayersMined');

    var minerHTML = document.createElement("div");
    minerHTML.innerHTML = `<button id="auto-mine-start" class="col-12 col-md-3 btn btn-`+mineColor+`">Auto Mine [`+mineState+`]</button>
<button id="small-restore-start" class="col-12 col-md-3 btn btn-`+smallRestoreColor+`">Auto Small Restore [`+smallRestoreState+`]</button>
<div id="threshold-input" class="col-12 col-md-3 btn-secondary"><img title="Money" src="assets/images/currency/money.svg" height="25px">
<input title="Enter in a value where Small Restores will stop being bought at." type="text" id="small-restore"></div>
<div id="skip-input" class="col-12 col-md-3 btn-secondary">
<input title="Auto skipping occurs if the max items in a layer is lower than the value put here." type="text" id="auto-skip"></div>`
    document.querySelectorAll('#mineBody + div')[0].prepend(minerHTML);
    $("#auto-mine-start").unwrap();
    document.getElementById('small-restore').value = setThreshold.toLocaleString();
    document.getElementById('auto-skip').value = autoMineSkip.toLocaleString();
    var autoSeller = document.createElement("div");
    autoSeller.innerHTML = `<div>
    <button id="auto-sell-treasure" class="col-12 col-md-3 btn btn-`+sellTreasureColor+`">Auto Sell Treasure [`+sellTreasureState+`]</button>
<button id="auto-sell-plate" class="col-12 col-md-3 btn btn-`+sellPlateColor+`">Auto Sell Plate [`+sellPlateState+`]</button>
</div>`
    document.getElementById('treasures').prepend(autoSeller);
    addGlobalStyle('#threshold-input { display:flex;flex-direction:row;flex-wrap:wrap;align-content:center;justify-content:space-evenly;align-items:center; }');
    addGlobalStyle('#skip-input { display:flex;flex-direction:row;flex-wrap:wrap;align-content:center;justify-content:space-evenly;align-items:center; }');
    addGlobalStyle('#small-restore { width:150px; }');
    addGlobalStyle('#auto-skip { width:150px; }');

    $("#auto-mine-start").click (startAutoMine);
    $("#small-restore-start").click (autoRestore);
    $("#auto-sell-treasure").click (autoSellTreasure);
    $("#auto-sell-plate").click (autoSellPlate);

    function startAutoMine() {
        if (mineState == "OFF") {
            localStorage.setItem("autoMineState", "ON");
            mineState = "ON"
            autoMineTimer = setInterval(function () {
                doAutoMine();
            }, 1000); // Happens every 1 second
            document.getElementById('auto-mine-start').innerText = `Auto Mine [`+mineState+`]`
            document.getElementById("auto-mine-start").classList.remove('btn-danger');
            document.getElementById("auto-mine-start").classList.add('btn-success');
        } else {
            endAutoMine();
        }
    }

    function doAutoMine() {
        var getEnergy = Math.floor(App.game.underground.energy);
        var getMoney = App.game.wallet.currencies[GameConstants.Currency.money]();
        var totalTiles = document.querySelectorAll('.mineSquare').length;
        var minedTiles = document.querySelectorAll('.rock0').length;
        var buriedItems = Mine.itemsBuried();
        var skipsRemain = Mine.skipsRemaining();
        var getRestores = player.itemList["SmallRestore"]();
        var getCost = ItemList["SmallRestore"].price();
        var shopWindow = document.getElementById('shopModal')
        if (buriedItems >= autoMineSkip || skipsRemain == 0) {
            if (smallRestoreState == "ON") {
                if ((getCost == 30000) && (+getRestores == 0) && (getMoney >= setThreshold + 30000)) {
                    ItemList["SmallRestore"].buy(1);
                }
                if (getEnergy < 10) {
                    ItemList["SmallRestore"].use();
                }
            }
            if (getEnergy >= 10) {
                var minedPercent = ((minedTiles / totalTiles) * 100);
                if (minedPercent >= 50) {
                    var toughLayer = document.querySelectorAll('.rock5');
                    var strongLayer = document.querySelectorAll('.rock3, .rock4');
                    var weakLayer = document.querySelectorAll('.rock1, .rock2');

                    if (Mine.toolSelected() != 0) {
                        Mine.toolSelected(Mine.Tool.Chisel);
                    }
                    if ((toughLayer.length+strongLayer.length+weakLayer.length) != 0) {
                        if (toughLayer.length != 0) {
                            for (var i = 0; i < toughLayer.length; i++) {
                                if (iii > toughLayer.length || i == 10) {
                                    iii = toughLayer.length + 1;
                                } else {
                                    var ti = toughLayer[i].getAttribute('data-i')
                                    var tj = toughLayer[i].getAttribute('data-j')
                                    Mine.click(+ti, +tj);
                                }
                            }
                        }
                        if ((strongLayer.length != 0) && (toughLayer.length == 0) && (getEnergy >= 10)) {
                            for (var ii = 0; ii < strongLayer.length; ii++) {
                                if (ii > strongLayer.length || ii == 10) {
                                    ii = strongLayer.length + 1;
                                } else {
                                    var si = strongLayer[ii].getAttribute('data-i')
                                    var sj = strongLayer[ii].getAttribute('data-j')
                                    Mine.click(+si, +sj);
                                }
                            }
                        }
                        if (weakLayer.length == (totalTiles - minedTiles) && (getEnergy >= 10)) {
                            for (var iii = 0; iii < weakLayer.length; iii++) {
                                if (iii > weakLayer.length || iii == 10) {
                                    iii = weakLayer.length + 1;
                                } else {
                                    var wi = weakLayer[iii].getAttribute('data-i')
                                    var wj = weakLayer[iii].getAttribute('data-j')
                                    Mine.click(+wi, +wj);
                                }
                            }
                        }
                    }
                    //console.log(toughLayer.length+" tough tiles, "+strongLayer.length+ " strong tiles & "+weakLayer.length+" weak tiles remain!")
                } else {
                    Mine.bomb();
                }
            }
        } else {
            if (resetInProgress == "NO") {
                if (Mine.itemsBuried() >= Mine.itemsFound()) {
                    // Don't resolve queued up calls to checkCompleted() until completed() is finished and sets loadingNewLayer to false
                    if (Mine.loadingNewLayer == true) {
                        resetInProgress = "YES"
                    }
                    if (resetInProgress == "NO") {
                        Mine.loadingNewLayer = true;
                        setTimeout(Mine.completed, 1500);
                        //GameHelper.incrementObservable(App.game.statistics.undergroundLayersMined);
                        if (Mine.skipsRemaining() != 0) {
                            GameHelper.incrementObservable(Mine.skipsRemaining, -1);
                        }
                        busyMining = setTimeout(function(){
                            resetInProgress = "NO"
                        } , 1500);
                    } else {
                        resetInProgress = "NO"
                    }
                }
            }
        }
        if (layersMined != App.game.statistics.undergroundLayersMined()) {
            var treasureLength = player.mineInventory().length;
            if (sellTreasureState == "ON") {
                for (var i = 0; i < treasureLength; i++) {
                    var valueType = player.mineInventory()[i].valueType
                    if (valueType == "Diamond") {
                        var treasureID = player.mineInventory()[i].id;
                        Underground.sellMineItem(treasureID, Infinity)
                    }
                }
            }
            if (sellPlateState == "ON") {
                for (var ii = 0; ii < treasureLength; ii++) {
                    var getName = player.mineInventory()[ii].name;
                    if (getName.includes("Plate")) {
                        var plateID = player.mineInventory()[ii].id;
                        Underground.sellMineItem(plateID, Infinity)
                    }
                }
            }
            localStorage.setItem("undergroundLayersMined", App.game.statistics.undergroundLayersMined());
            layersMined = localStorage.getItem('undergroundLayersMined');
        }
    }

    document.querySelector('#small-restore').addEventListener('input', event => {
        setThreshold = +event.target.value.replace(/[A-Za-z!@#$%^&*()]/g, '').replace(/[,]/g, "");
        localStorage.setItem("autoBuyThreshold", setThreshold);
        event.target.value = setThreshold.toLocaleString();
    });

    document.querySelector('#auto-skip').addEventListener('input', event => {
        autoMineSkip = +event.target.value.replace(/[A-Za-z!@#$%^&*()]/g, '').replace(/[,]/g, "");
        localStorage.setItem("autoMineSkip", autoMineSkip);
        event.target.value = autoMineSkip.toLocaleString();
    });

    function autoRestore() {
        if (smallRestoreState == "OFF") {
            smallRestoreState = "ON"
            document.getElementById("small-restore-start").classList.remove('btn-danger');
            document.getElementById("small-restore-start").classList.add('btn-success');
        } else {
            smallRestoreState = "OFF"
            document.getElementById("small-restore-start").classList.remove('btn-success');
            document.getElementById("small-restore-start").classList.add('btn-danger');
        }
        document.getElementById('small-restore-start').innerText = `Auto Small Restore [`+smallRestoreState+`]`
        localStorage.setItem("autoSmallRestore", smallRestoreState);
    }

    function autoSellTreasure() {
        if (sellTreasureState == "OFF") {
            sellTreasureState = "ON"
            document.getElementById("auto-sell-treasure").classList.remove('btn-danger');
            document.getElementById("auto-sell-treasure").classList.add('btn-success');
        } else {
            sellTreasureState = "OFF"
            document.getElementById("auto-sell-treasure").classList.remove('btn-success');
            document.getElementById("auto-sell-treasure").classList.add('btn-danger');
        }
        document.getElementById('auto-sell-treasure').innerText = `Auto Sell Treasure [`+sellTreasureState+`]`
        localStorage.setItem("autoSellTreasure", sellTreasureState);
    }

    function autoSellPlate() {
        if (sellPlateState == "OFF") {
            sellPlateState = "ON"
            document.getElementById("auto-sell-plate").classList.remove('btn-danger');
            document.getElementById("auto-sell-plate").classList.add('btn-success');
        } else {
            sellPlateState = "OFF"
            document.getElementById("auto-sell-plate").classList.remove('btn-success');
            document.getElementById("auto-sell-plate").classList.add('btn-danger');
        }
        document.getElementById('auto-sell-plate').innerText = `Auto Sell Plate [`+sellPlateState+`]`
        localStorage.setItem("autoSellPlate", sellPlateState);
    }

    function endAutoMine() {
        localStorage.setItem("autoMineState", "OFF");
        mineState = "OFF"
        document.getElementById('auto-mine-start').innerText = `Auto Mine [`+mineState+`]`
        document.getElementById("auto-mine-start").classList.remove('btn-success');
        document.getElementById("auto-mine-start").classList.add('btn-danger');
        clearTimeout(busyMining);
        //clearTimeout(mineComplete);
        resetInProgress = "NO";
        clearInterval(autoMineTimer)
    }

}

if (localStorage.getItem('autoMineState') == null) {
    localStorage.setItem("autoMineState", "OFF");
}
if (localStorage.getItem('autoSmallRestore') == null) {
    localStorage.setItem("autoSmallRestore", "OFF");
}
if (localStorage.getItem('autoBuyThreshold') == null) {
    localStorage.setItem("autoBuyThreshold", "0");
}
if (localStorage.getItem('autoMineSkip') == null) {
    localStorage.setItem("autoMineSkip", "0");
}
if (localStorage.getItem('autoSellTreasure') == null) {
    localStorage.setItem("autoSellTreasure", "OFF");
}
if (localStorage.getItem('autoSellPlate') == null) {
    localStorage.setItem("autoSellPlate", "OFF");
}
mineState = localStorage.getItem('autoMineState');
smallRestoreState = localStorage.getItem('autoSmallRestore');
setThreshold = localStorage.getItem('autoBuyThreshold');
autoMineSkip = localStorage.getItem('autoMineSkip');
sellTreasureState = localStorage.getItem('autoSellTreasure');
sellPlateState = localStorage.getItem('autoSellPlate');

for (var i = 0; i < trainerCards.length; i++) {
    trainerCards[i].addEventListener('click', checkAutoMine, false);
}

function checkAutoMine() {
    awaitAutoMine = setInterval(function () {
        var undergroundAccess;
        try {
            undergroundAccess = App.game.underground.canAccess();
        } catch(err) {}
        if (typeof undergroundAccess != 'undefined') {
            if (undergroundAccess == true) {
                initAutoMine();
                clearInterval(awaitAutoMine)
            } else {
                //console.log("Checking for access...")
            }
        }
    }, 1000);
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
