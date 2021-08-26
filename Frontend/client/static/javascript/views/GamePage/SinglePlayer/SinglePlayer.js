import AbstractView from "../../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("User Profile");
    }

    async getHtml() {
        return `
        <h1>THIS PAGE DOES NOT EXISTS. 404 ERROR - NOT FOUND</h1>
        `
    }

    async addScript() {
        return `
        `
    }
}