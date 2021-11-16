import { SINGULAR } from './dictonary.js'

export class BidTable {
    constructor(table) {
        this.table = table
    };

    addColumn(columnNumber) {
        this.table.innerHTML += `<div class="column-${columnNumber} column">
                                    <p class="staking-header">${SINGULAR[columnNumber-1]}</p>
                                    <button class="staking-btn">ONES</button><br>
                                    <button class="staking-btn">TWOS</button><br>
                                    <button class="staking-btn">THREES</button><br>
                                    <button class="staking-btn">FOURS</button><br>
                                    <button class="staking-btn">FIVES</button><br>
                                    <button class="staking-btn">SIXES</button>
                                </div>`;

        this.table.style.gridTemplateColumns = `repeat(${columnNumber}, 1fr)`;  
    }

    dropColumns(n) {
        for (let i = 0; i < n; i++) {
            Array.from(this.table.children)[Array.from(this.table.children).length-1].remove();
        }
    }

    hideTable() {
        this.table.style.display = 'none';
    };

    showTable() {
        this.table.style.display = 'grid';
    };
};