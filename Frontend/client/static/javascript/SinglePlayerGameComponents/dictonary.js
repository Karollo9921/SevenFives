const SINGULAR = [
    "ONE", "TWO", "THREE", "FOUR", "FIVE",
    "SIX", "SEVEN", "EIGHT", "NINE", "TEN", 
    "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", 
    "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN", "TWENTY"
];

const PLURAL = ['ONES', 'TWOS', 'THREES', 'FOURS', 'FIVES', 'SIXES'];



function convertBidToArray(singular, plural) {

    const convertedBid = [];
    const howManyDices = SINGULAR.indexOf(singular) + 1;
    const whichDice = PLURAL.indexOf(plural) + 1

    for (let i = 0; i < howManyDices; i++) {
        convertedBid.push(whichDice)
    }

    return convertedBid
}



// console.log(convertBidToArray("SEVEN", "FIVES"));


export { convertBidToArray, SINGULAR, PLURAL };

