const hashInput = document.querySelector("#hash-input");
const hashButton = document.querySelector("#hash-button");
const hashResult = document.querySelector("#hash-result");
const hashProgress = document.querySelector("#hash-progress");

function hash(string) {
    const hashObj = new jsSHA("SHA-512", "TEXT", { encoding: "UTF8", numRounds: 1 });
    hashObj.update(string);

    return hashObj.getHash("B64"); 
}

const hashes = [];

function recurseHash(string, callback, n) {
    const hashed = hash(string);
    hashes.push(hashed);

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
            hashProgress.innerHTML = n;
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