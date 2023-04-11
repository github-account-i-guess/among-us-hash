const { CensorSensor } = this['censor-sensor'];
const censor = new CensorSensor();

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

    const profane = censor.isProfane(string);

    const callNext = _ => recurseHash(hashed, callback, n + 1);
    if (profane) callback(hashed);
    try {
        callNext();
    } catch (e) {
        hashProgress.innerHTML = n;
        setTimeout(callNext)
    }
}

hashButton.addEventListener("click", _ => {
    const { value } = hashInput;

    recurseHash(value, hash => {
        hashResult.innerHTML = hash;
    }, 0);
});