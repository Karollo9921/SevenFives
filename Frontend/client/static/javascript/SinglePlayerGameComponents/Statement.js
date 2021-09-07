export class Statement {
    constructor(statement) {
        this.statement = statement
    };

    setNewStatement(newStatement) {
        this.statement.children[0].textContent = newStatement
    };
};