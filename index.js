const hashInput = document.querySelector("#hash-input");
const hashButton = document.querySelector("#hash-button");
const hashResult = document.querySelector("#hash-result");
const hashProgress = document.querySelector("#hash-progress");

function hash(string) {
    const hashObj = new jsSHA("SHA-512", "TEXT", { encoding: "UTF8", numRounds: 1 });
    hashObj.update(string);

    return hashObj.getHash("B64"); 
}

function recurseHash(string, callback, n) {
    const hashed = hash(string);

    const lowerCase = hashed.toLowerCase();
    const sus = amongUsWords.reduce((acc, cur) => {
        if (acc) return acc;
        return lowerCase.includes(cur);
    }, false);

    const callNext = _ => recurseHash(hashed, callback, n + 1);
    if (sus) callback(hashed);
    else {
        try {
            callNext();
        } catch (e) {
            // hashProgress.innerHTML = n;
            setTimeout(callNext)
        }
    }
    
}

let amongUsWords = [];
fetch('./among-us-words.json')
    .then((response) => response.json())
    .then((json) => {
        amongUsWords = json;
    });

hashButton.addEventListener("click", _ => {
    const { value } = hashInput;

    recurseHash(value, hash => {
        hashResult.innerHTML = `
        ${hash}
        `;
    }, 0);
});

const findInput = (word, callback, attempts) => {
    const randomWord = (Math.random() + 1).toString(32).substring(7);
    // if (!(attempts % 100)) console.log(attempts);
    recurseHash(randomWord, hash => {
        if(hash.toLowerCase().includes(word)) {
            callback(randomWord);
        } else {
            findInput(word, callback, attempts ? attempts + 1 : 1);
        }
    });
}