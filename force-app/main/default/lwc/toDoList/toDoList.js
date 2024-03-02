import { LightningElement, track } from 'lwc';

export default class ToDoList extends LightningElement {
    @track taskList = [];
    inputText;

    handleInputChange(event) {
        this.inputText = event.detail.value;
    }

    handleInputKeyDown(event) {
        if (event.key === 'Enter') {
            this.addTask();
        }
    }

    handleAddClick() {
        this.addTask();
    }

    addTask() {
        if (this.inputText) {
            this.taskList.push(this.inputText);
            this.clearInput();
        }
    }

    clearInput() {
        this.inputText = null;
    }
}
