import { LightningElement, track } from 'lwc';

export default class ToDoList extends LightningElement {
    @track taskList = [];
    inputText;

    handleInputChange(event) {
        this.inputText = event.detail.value;
    }

    handleAddClick() {
        if (this.inputText) {
            this.taskList.push(this.inputText);
            this.clearInput();
        }
    }

    clearInput() {
        this.inputText = null;
    }
}
