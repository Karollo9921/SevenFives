import AbstractView from "../../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("SEVEN FIVES !");
    }

    async getHtml() {
        return `
        <h1>Hello !</h1>
        `
    }

    async addScript() {
        return `
        `
    }
}