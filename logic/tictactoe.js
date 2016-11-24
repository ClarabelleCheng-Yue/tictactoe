var body = document.body;
var storage = [];
var keys = {};
var idTracker = null;

/*
store: works with storage to store elements
@param: ele: number, element to store
*/
var store = function(ele) {
  storage.push(ele);
}

/*
makeBoard: makes the board depending on rows
@param: rows: number, number of rows
*/
var makeBoard = function(rows) {
  var table = '';

  rows = rows || 3;

  table += '<table>';
  for (var i = 0; i < rows; i++) {
    table += '<tr>';
    for (var j = 0; j < rows; j++) {
      table += '<td>';
    }
    table += '</tr>'
  }
  table += '</table>';

  body.innerHTML += table;
};

/*
changeBoard: when a row option is selected, the board is changed to reflect the change
*/
var changeBoard = function() {
  body.removeChild(body.getElementsByTagName('table')[0]);
  var val = document.getElementById('newRows').value;
  makeBoard(val);
  document.getElementById('newRows').value = val;
};

/*
addElement: adds an element into another element
@param: parent: DOM node, the existing container on document for element
@param: ele: string, the element to be put into parent container
*/
var addElement = function(parent, ele) {
  parent.innerHTML += ele;
};

var clearChosen = function(start) {
  console.log('start: ', start);
  if (storage.length - start > 0) {
    storage[start].innerHTML = '';
    storage.pop();
  }
}

/*
showSign: shows the current player's sign in selected box
@param: idy: number, player's turn
*/
var showSign = function(idy) {
  // if move not yet stored
  if (!(this.classList[0] in keys)) {
    idy =  idTracker || 0;
    var x = '<img class="x" src="./assets/x.jpg" />';
    var o = '<img class="o" src="./assets/o.jpg" />';

    // clear previously chosen box
    clearChosen(idy);
    // store element in storage queue
    store(this);
    // put image into box
    this.innerHTML = (!(idy % 2)) ? o : x;
  } else { // else alert invalid move
    var invalidAlert = '<div class="alert"><span>Spot taken!</span></div>';
    var msgBody = document.getElementsByClassName('message')[0];
    addElement(msgBody, invalidAlert);
    var alert = document.getElementsByClassName('alert')[0];
    
    setTimeout(function() {
      msgBody.removeChild(alert);
    }, 1000)
  }
};

/*
whosTurn: shows on client the correct player's turn
@param: idy: number, the correct player's id
@return: string of DOM node
*/
var whosTurn = function(idy) {

  var xTurn = '<span>Player <span class="red">X</span>, go!</span>';
  var oTurn = '<span>Player <span class="blue">O</span>, go!</span>';

  return (!(idy % 2)) ? oTurn : xTurn;
}

/*
unlockBoard: opens the board for click interactions
*/
var unlockBoard = function() {
  var eles = document.getElementsByTagName('td');

  for (var i = 0; i < eles.length; i++) {
    eles[i].addEventListener('click', showSign.bind(eles[i], null), false);
    eles[i].classList.add(i);
  }
}

/*
go: starts the game by setting player id, showing who's turn on the page, and unlocking the board
@param: idy: null or number, current player's turn
@param: first: boolean, to check if at first round
*/
var go = function(idy, first) {
  idy = idy || 0;

  // if first move,
  if (first) {
    // add message board to page
    var message = '<div class="message"><span id="msgTxt"></span></div><button onclick="done()">Done</button>';
    addElement(body, message);
    // add click handlers to each gameboard box
    unlockBoard(idy);
  }

  // show player's turn message
  var turn = whosTurn(idy);
  document.getElementById('msgTxt').innerHTML = turn;
}

/*
done: invokes setup for next player's turn
*/
var done = function() {
  var winMsg = '<p>Winner! <span id="winner"></span></p>'
  var lastEle = storage[storage.length - 1];
  var lastKey = parseInt(lastEle.classList[0]);
  keys[lastKey] = lastEle;
  console.log(typeof lastKey, 'number?'); // string
  // if current player won
  if (isWon()) {
    addElement(document.getElementById('msgTxt'), winMsg);
    // display winning message
    if (typeof lastKey === 'number') {
      if (lastKey % 2) {
        addElement(document.getElementById('winner'), '<span>Player <span class="red">X</span>!</span>');
      } else {
        addElement(document.getElementById('winner'), '<span>Player <span class="blue">O</span>!</span>');
      }
    }
  } else { // else
    // display message for next turn
    ++idTracker;
    go(idTracker, false);
  }
}

var isWon = function() {
  // return true;
  return false;
}

//make dashboard
body.innerHTML += '<div class="dashboard"><span>Select number of rows: </span><select id="newRows" onchange="changeBoard()"><option>3</option><option>4</option><option>5</option></select></div>';

//add New Game button
addElement(document.getElementsByClassName('dashboard')[0], '<button class="start" onclick="go(idTracker, true)">New Game</button>');

// make board
makeBoard();