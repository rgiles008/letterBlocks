const fetch = require("axios");

const url = 'https://raw.githubusercontent.com/dolph/dictionary/master/enable1.txt';

const run = async url => {
  try {
    const response = await fetch(url);
    const data = response.data;
    processBoggle(data);
  } catch(error) {
    console.log(error);
  }
};

run(url);

let alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

function processBoggle(data){
  let parseList = parseDict(data);
  
  let filteredResult = filterList(parseList);
  let characterMap = createCharacterBlockMap();

  let finalList = [];

  filteredResult.forEach(word => {
    let wordCharacterMap = {};
    word.split('').forEach(char => {
      wordCharacterMap[char] = characterMap[char].concat([]);
    });
    var wordArray = createWordArray(word, wordCharacterMap, characterMap);
    
    //Exit if 4 unique block combo found.
    if(wordArray.length === 4){
      finalList.push(word);
    } else {
      let didFilterIndex = false;

      do {
        didFilterIndex = false;
        for(var c in wordCharacterMap) {
          let blockList = wordCharacterMap[c];
          if(blockList.length > 1) {
            //Filter out double index values
            wordCharacterMap[c] = blockList.filter( blockIndex => {
              if(wordArray.find(i => i === blockIndex)){
                didFilterIndex = true;
                return false;
              } else {
                return true;
              }
            })
          }
        }
        wordArray = createWordArray(word, wordCharacterMap, characterMap);        
      } while(didFilterIndex) 
      if(wordArray.length === 4){
        finalList.push(word);
      }
    }
  })
  console.log("I found this many words " + finalList.length);
  finalList.forEach(word => console.log(word));
}

function createWordArray(word, wordCharacterMap, characterMap){
  let wordArray = [];
  //Populate single letter block for combinations
  if(word.length === 3){
    wordArray.push(characterMap[''][0]);
  }
  for (var char in wordCharacterMap) {
    let blockList = wordCharacterMap[char];
    if(blockList.length === 1){
      let blockIndex = blockList[0];
      if(!wordArray.find( i => i === blockIndex)){
        wordArray.push(blockIndex);
      };
    }
  }
  return wordArray;
}




function parseDict(data) {
  let splitData = data.split('\n');
  let filterData = splitData.filter(word => {
    let isCorrectLength =  word.length > 2 && word.length < 5
    return isCorrectLength;
  })
  return filterData;
}

const input = [
  ['H','L','S','J','U','B'],
  ['O','O','N','O','S','O'],
  ['M','V','O','Y','A','O'],
  ['E','E','W','' ,'' ,'' ]
];

function createCharacterBlockMap(){
  let set = createSet();
  let characterMap = {};

  set.forEach(character => {
    characterMap[character] = [];
  })

  input.forEach((block, i) => {
    block.forEach(char => {
      let foundCharacter = set.find(c => char.toLowerCase() === c)
      if(typeof foundCharacter !== 'undefined'){
        if(!characterMap[foundCharacter].find(index => index === i)){
          characterMap[foundCharacter].push(i);
        }
      }
    })
  })
  return characterMap;
}

function filterList(data) {
  let newArr = [];
  let possibleSet = createSet();
  data.forEach(word => {
    var isGood = true;
    word.split('').forEach(char => {
      var foundChar = false; 
      possibleSet.forEach(possibleCharacter => {
        if(possibleCharacter === char){
          foundChar = true;
        }
      })
      isGood &= foundChar;
    })
    if(isGood){
      newArr.push(word);
    }
  })
  return newArr;
}


function createSet() {
  let invertedSet = [];
  input.forEach(block => {
    block.forEach(char => {
      let result = invertedSet.find(letter => char.toLowerCase() === letter);
      if(!result){
        invertedSet.push(char.toLowerCase());
      }
    })
  })
  return invertedSet;
}
