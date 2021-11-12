export class Backlog {
    constructor(backlog) {
        this.backlog = backlog
    };

    setNewLog(log) {
        this.backlog.children[0].innerHTML += `<li>${log}</li>`
    };

    clearBacklog() {
        this.backlog.children[0].innerHTML = '';
    }
};