class DatabaseJSON {
    constructor() {
        let _database = "{}";
        this.getDatabase = () => _database;
        this.setDatabase = newDatabase => _database = newDatabase;
    }
    convertMainFormToJSON(objectObject) {
        let tempJSON;
        if (objectObject.index)
            tempJSON = `,"Form${objectObject.index}":{"index":"${objectObject.index}","type":"${objectObject.type}","value":"${objectObject.value}","parentIndex":"${objectObject.parentIndex}"}}`;
        else
            tempJSON = `"Form${objectObject.index}":{"index":"${objectObject.index}","type":"${objectObject.type}","value":"${objectObject.value}","parentIndex":"${objectObject.parentIndex}"}}`;
        return tempJSON;
    }
    findLastIndexMain() {
        let objectJSON = this.getDatabase();
        let i = objectJSON.lastIndexOf('"Form');
        if (i === -1)
            return i;
        else i += 5;
        let tempString = objectJSON.slice(i);
        let j = tempString.indexOf('"');
        tempString = tempString.slice(0, j);
        return Number(tempString);
    }
    addMainFormToJSON(valueToAdd) {
        let variableJSON = this.getDatabase();
        valueToAdd = this.convertMainFormToJSON(valueToAdd);
        variableJSON = variableJSON.slice(0, -1);
        variableJSON = variableJSON.concat(valueToAdd)
        return this.setDatabase(variableJSON);
    }
    deleteMainFormToJSON(index) {
        let objectJSON = this.getDatabase();
        if (objectJSON.includes(`"parentIndex":"${index}"`)) {
            alert("You can't delete this form, because he has children");
            return;
        } else if (index == 0) {
            if (objectJSON.indexOf(`"Form0":{"`) == -1)
                return;
            let i = this.getDatabase().slice(this.getDatabase().indexOf('}') + 2);
            i = '{'.concat(i);
            if (!i.includes('}'))
                i = i.concat('}');
            return this.setDatabase(i);
        }
        let i = objectJSON.indexOf(`"Form${index}":{"`);
        if (i == -1)
            return;
        i--;
        let j = objectJSON.slice(i).indexOf('}') + 1;
        let tempString = objectJSON.slice(0, i).concat(objectJSON.slice(i + j));
        if (tempString[0] != '{')
            tempString = '{'.concat(tempString);
        return this.setDatabase(tempString);
    }
    deleteSubFormToJSON(index) {
        let objectJSON = this.getDatabase();
        if (objectJSON.includes(`"parentIndex":"${index}"`)) {
            alert("You can't delete this form, because he has children");
            return;
        }
        let i = objectJSON.indexOf(`,"SubForm${index}":{"`);
        if (i == -1)
            return;
        console.log(i);
        let j = objectJSON.slice(i).indexOf('}') + 1;
        console.log(j);
        const tempString = objectJSON.slice(0, i).concat(objectJSON.slice(i + j));
        return this.setDatabase(tempString);
    }
    convertSubFormToJSON(objectObject, index) {
        if (index != -1)
            return `,"SubForm${objectObject.index}":{"index":"${objectObject.index}","type":"${objectObject.type}","value":"${objectObject.value}","parentIndex":"${objectObject.parentIndex}","conditionType":"${objectObject.conditionType}","conditionAnswer":"${objectObject.conditionAnswer}","conditionValue":"${objectObject.conditionValue}"}`;
        else
            return `,"SubForm${objectObject.index}":{"index":"${objectObject.index}","type":"${objectObject.type}","value":"${objectObject.value}","parentIndex":"${objectObject.parentIndex}","conditionType":"${objectObject.conditionType}","conditionAnswer":"${objectObject.conditionAnswer}","conditionValue":"${objectObject.conditionValue}"}}`;
    }
    findLastIndexSub(parentIndex) {
        const objectJSON = this.getDatabase();
        let tempString = objectJSON;
        let i = objectJSON.lastIndexOf(`"parentIndex":"${parentIndex}"`);
        if (i === -1)
            return i;
        tempString = objectJSON.slice(0, i);
        i = tempString.lastIndexOf(':{"index":"');
        i += 11;
        tempString = objectJSON.slice(i);
        const j = tempString.indexOf('"');
        tempString = tempString.slice(0, j);
        return tempString;
    }
    addNewIndexSub(parentIndex) {
        const i = this.findLastIndexSub(parentIndex);
        if (i == -1)
            return `${parentIndex}_0`;
        if (Number.isInteger(i))
            return `${parentIndex}_${i + 1}`;
        else {
            let tempValue = i.slice(i.lastIndexOf('_') + 1);
            tempValue = Number(tempValue) + 1;
            return `${parentIndex}_${tempValue}`;
        }
    }
    isParentsBrother(parentIndex) {
        let grandparentIndex = parentIndex.slice(0, parentIndex.lastIndexOf('_'));
        let index = this.findLastIndexSub(grandparentIndex);
        return index == -1 ? false : true;
    }
    firstBrotherMyParents(myIndex, parentIndex) {
        let brotherIndex = this.findLastIndexSub(parentIndex);
        let newMyIndex = myIndex;
        let newParentIndex = parentIndex;
        while ((brotherIndex == -1) || Number(newMyIndex.slice(newMyIndex.lastIndexOf('_') + 1)) > Number(brotherIndex.slice(brotherIndex.lastIndexOf('_') + 1))) {
            if (Number.isInteger(Number(newParentIndex))) {
                brotherIndex = this.findLastIndexMain();
                newParentIndex = Number(newParentIndex);
                if (brotherIndex <= newParentIndex) {
                    return -1;
                } else if (brotherIndex > newParentIndex) {
                    while (!this.getDatabase().includes(`"index":"${newParentIndex++}"`));
                    return newParentIndex;
                } else {
                    return brotherIndex;
                }
            }
            newMyIndex = newMyIndex.slice(0, newMyIndex.lastIndexOf('_'));
            newParentIndex = newParentIndex.slice(0, newParentIndex.lastIndexOf('_'));
            brotherIndex = this.findLastIndexSub(newParentIndex);
            if ((newMyIndex === brotherIndex) || Number(newMyIndex.slice(newMyIndex.lastIndexOf('_') + 1)) > Number(brotherIndex.slice(brotherIndex.lastIndexOf('_') + 1)))
                brotherIndex = -1;
        }
        let tempMy = Number(newMyIndex.slice(newMyIndex.lastIndexOf('_') + 1));
        let tempBrother = Number(brotherIndex.slice(brotherIndex.lastIndexOf('_') + 1));
        if (tempMy >= tempBrother) {
            if (Number.isInteger(Number(newParentIndex))) {
                newParentIndex = Number(newParentIndex);
                brotherIndex = this.findLastIndexMain();
                if (brotherIndex == newParentIndex)
                    return -1;
                else {
                    while (!this.getDatabase().includes(`"index":"${newParentIndex++}"`));
                    return newParentIndex;
                }
            } else {
                brotherIndex = this.findLastIndexSub(newParentIndex);
                tempMy = Number(newParentIndex.slice(newParentIndex.lastIndexOf('_') + 1));
                while (!this.getDatabase().includes(`"index":"${newParentIndex.slice(0,newParentIndex.lastIndexOf('_'))}_${tempMy++}"`)) {};
                return `${newParentIndex.slice(0,newParentIndex.lastIndexOf('_'))}_${tempMy}`;
            }
        }
        while (!this.getDatabase().includes(`"index":"${newMyIndex.slice(0,newMyIndex.lastIndexOf('_'))}_${tempMy++}"`)) {};
        return `${newMyIndex.slice(0,newMyIndex.lastIndexOf('_'))}_${tempMy}`;
    }
    findPlaceToAdd(myIndex, parentIndex) {
        let placeIndex;
        if (Number.isInteger(parentIndex)) {
            parentIndex = Number(parentIndex);
            if (placeIndex > parentIndex) {
                while (!this.getDatabase().includes(`"index":"${parentIndex++}"`));
                return parentIndex;
            }
            return -1;
        } else {
            return this.firstBrotherMyParents(myIndex, parentIndex);
        }
    }
    addSubFormToJSON(valueToAdd) {
        let variableJSON = this.getDatabase();
        let index = this.findPlaceToAdd(valueToAdd.index, valueToAdd.parentIndex);
        valueToAdd = this.convertSubFormToJSON(valueToAdd, index);
        if (index != -1) {
            let tempString = variableJSON.slice(0, variableJSON.indexOf(`":{"index":"${index}"`));
            let indexSecond = tempString.lastIndexOf(',');
            tempString = variableJSON.slice(0, tempString.lastIndexOf(','));
            tempString = tempString.concat(valueToAdd);
            tempString = tempString.concat(this.getDatabase().slice(indexSecond));
            return this.setDatabase(tempString);
        } else {
            variableJSON = variableJSON.slice(0, -1);
            variableJSON = variableJSON.concat(valueToAdd)
            return this.setDatabase(variableJSON);
        }
    }
    modifyValue(index, typeValue, newValue) {
        let tempString = this.getDatabase();
        let x = tempString.indexOf(`{"index":"${index}"`);
        tempString = tempString.slice(x);
        x += tempString.indexOf(typeValue);
        tempString = this.getDatabase().slice(x);
        x += tempString.indexOf(':"');
        tempString = this.getDatabase().slice(0, x + 2);
        let endString = this.getDatabase().slice(x);
        if (endString.indexOf('",') == -1)
            x += endString.indexOf('"}');
        else
            x += endString.indexOf('",');
        endString = this.getDatabase().slice(x);
        tempString = tempString.concat(newValue);
        tempString = tempString.concat(endString);
        this.setDatabase(tempString);
    }
}


class MainForm {
    constructor(index, parentIndex = null) {
        this.index = index;
        this.type = 0;
        this.value = '';
        this.parentIndex = parentIndex;
    }
    inputSaver() {
        databaseJSON.modifyValue(this.dataset.index, 'value', event.target.value);
    }
    saveSelect() {
        databaseJSON.modifyValue(this.dataset.index, 'type', event.target.value);
    }
    deleteElement() {
        event.preventDefault();
        databaseJSON.deleteMainFormToJSON(event.target.parentNode.parentNode.dataset.index);
        updateView();
    }
    addSubElement() {
        event.preventDefault();
        if (!event.target.parentNode.previousSibling.previousSibling.lastChild.value) {
            alert("Please first, write question.")
            return;
        }
        const i = event.target.parentNode.parentNode.dataset.index;
        let x = new SubForm(databaseJSON.addNewIndexSub(i), i, this.value);
        databaseJSON.addSubFormToJSON(x);
        updateView();
    }
    viewElement(objectJSON) {
        const form = document.createElement('form');
        form.dataset.index = objectJSON.index;
        //first row
        const divFirstRow = document.createElement('div');
        divFirstRow.className = 'formRow';
        const labelQuestion = document.createElement('label');
        labelQuestion.textContent = 'Question';
        labelQuestion.htmlFor = `questionInput${objectJSON.index}`;
        let inputQuestion = document.createElement('input');
        inputQuestion.type = 'text';
        inputQuestion.id = `questionInput${objectJSON.index}`;
        inputQuestion.value = objectJSON.value;
        inputQuestion.dataset.index = objectJSON.index;
        inputQuestion.addEventListener('input', this.inputSaver);
        divFirstRow.appendChild(labelQuestion);
        divFirstRow.appendChild(inputQuestion);
        // //secound row
        const divSecondRow = document.createElement('div');
        divSecondRow.className = 'formRow';
        const labelType = document.createElement('label');
        labelType.textContent = 'Type';
        labelType.htmlFor = `selectType${objectJSON.index}`;
        const select = document.createElement('select');
        select.dataset.index = objectJSON.index;
        select.addEventListener('change', this.saveSelect);
        select.id = `selectType${objectJSON.index}`;
        for (let i = 0; i < 3; i++) {
            const option = document.createElement('option');
            option.value = i;
            switch (i) {
                case 0:
                    option.text = 'Yes / No';
                    break;
                case 1:
                    option.text = 'Text';
                    break;
                case 2:
                    option.text = 'Number';
                    break;
                default:
                    break;
            }
            select.add(option);
        }
        select.value = Number(objectJSON.type);
        divSecondRow.appendChild(labelType);
        divSecondRow.appendChild(select);
        // //third row
        const divThirdRow = document.createElement('div');
        divThirdRow.className = 'formRow';
        divThirdRow.classList.add('buttons');
        const buttonAdd = document.createElement('button');
        buttonAdd.id = `buttonAdd${objectJSON.index}`;
        buttonAdd.textContent = 'Add Sub-input';
        buttonAdd.addEventListener('click', this.addSubElement.bind(select));
        const buttonDelete = document.createElement('button');
        buttonDelete.id = `buttonDelete${objectJSON.index}`;
        buttonDelete.textContent = 'Delete';
        buttonDelete.addEventListener('click', this.deleteElement);
        divThirdRow.appendChild(buttonAdd);
        divThirdRow.appendChild(buttonDelete);
        form.appendChild(divFirstRow);
        form.appendChild(divSecondRow);
        form.appendChild(divThirdRow);
        this.element = form;
        return this.element;
    }


}

class SubForm extends MainForm {
    constructor(index, indexParent, conditionType) {
        super(index, indexParent);
        this.id = 0
        this.conditionType = conditionType;
        this.conditionValue = 0;
        this.conditionAnswer = 0;
    }
    deleteElement() {
        event.preventDefault();
        databaseJSON.deleteSubFormToJSON(event.target.parentNode.parentNode.dataset.index);
        updateView();
    }
    saveConditionAnswer() {
        // conditionAnswer
        console.log(`${this.dataset.index} ${event.target.value}`)
        databaseJSON.modifyValue(this.dataset.index, 'conditionAnswer', event.target.value);
        // console.log(event.target.value);
    }
    saveConditionSelect() {
        databaseJSON.modifyValue(this.dataset.index, 'conditionValue', event.target.value);
    }
    viewElement(objectJSON) {
        const form = document.createElement('form');
        form.dataset.index = objectJSON.index;
        //first row
        const divFirstRow = document.createElement('div');
        divFirstRow.className = 'formRow';
        const labelCondition = document.createElement('label');
        labelCondition.textContent = 'Condition';
        labelCondition.htmlFor = `conditionSelect${objectJSON.index}`;
        const conditionSelect = document.createElement('select');
        conditionSelect.id = `conditionSelect${objectJSON.index}`;
        conditionSelect.dataset.index = objectJSON.index;
        conditionSelect.addEventListener('change', this.saveConditionSelect);
        if (objectJSON.conditionType != '2') {
            const option = document.createElement('option');
            option.value = 0;
            option.text = 'Equals';
            conditionSelect.add(option);
        } else {
            for (let i = 0; i < 3; i++) {
                const option = document.createElement('option');
                option.value = i;
                switch (i) {
                    case 0:
                        option.text = 'Equals';
                        break;
                    case 1:
                        option.text = 'Less than';
                        break;
                    case 2:
                        option.text = 'Greater than';
                        break;
                    default:
                        break;
                }
                conditionSelect.add(option);
            }
        }
        conditionSelect.selectedIndex = Number(objectJSON.conditionValue);

        let conditionSelectAnswer;
        if (objectJSON.conditionType == '0') {
            conditionSelectAnswer = document.createElement('select');
            for (let i = 0; i < 2; i++) {
                const option = document.createElement('option');
                option.value = i;
                switch (i) {
                    case 0:
                        option.text = 'Yes';
                        break;
                    case 1:
                        option.text = 'No';
                        break;
                    default:
                        break;
                }
                conditionSelectAnswer.add(option);
            }
            conditionSelectAnswer.selectedIndex = objectJSON.conditionAnswer;
        } else if (objectJSON.conditionType == '1') {
            conditionSelectAnswer = document.createElement('input');
            conditionSelectAnswer.type = 'text';
            conditionSelectAnswer.value = objectJSON.conditionAnswer;

        } else {
            conditionSelectAnswer = document.createElement('input');
            conditionSelectAnswer.type = 'number';
            conditionSelectAnswer.value = objectJSON.conditionAnswer;
        }
        conditionSelectAnswer.id = `conditionSelectAnswer${objectJSON.index}`;

        conditionSelectAnswer.dataset.index = objectJSON.index;
        conditionSelectAnswer.addEventListener('input', this.saveConditionAnswer);
        divFirstRow.appendChild(labelCondition);
        divFirstRow.appendChild(conditionSelect);
        divFirstRow.appendChild(conditionSelectAnswer);
        const divSecondRow = document.createElement('div');
        divSecondRow.className = 'formRow';
        const labelQuestion = document.createElement('label');
        labelQuestion.textContent = 'Question';
        labelQuestion.htmlFor = `questionInput${objectJSON.index}`;
        let inputQuestion = document.createElement('input');
        inputQuestion.dataset.index = objectJSON.index;
        inputQuestion.addEventListener('input', this.inputSaver);
        inputQuestion.type = 'text';
        inputQuestion.id = `questionInput${objectJSON.index}`;
        inputQuestion.value = objectJSON.value;
        divSecondRow.appendChild(labelQuestion);
        divSecondRow.appendChild(inputQuestion);
        //secound row
        const divThirdRow = document.createElement('div');
        divThirdRow.className = 'formRow';
        divThirdRow.textContent = null;
        const labelType = document.createElement('label');
        labelType.textContent = 'Type';
        labelType.htmlFor = `selectType${objectJSON.index}`;
        const select = document.createElement('select');
        select.dataset.index = objectJSON.index;
        select.addEventListener('change', this.saveSelect);
        select.id = `selectType${objectJSON.index}`;
        // const options = [];
        for (let i = 0; i < 3; i++) {
            const option = document.createElement('option');
            option.value = i;
            switch (i) {
                case 0:
                    option.text = 'Yes / No';
                    break;
                case 1:
                    option.text = 'Text';
                    break;
                case 2:
                    option.text = 'Number';
                    break;
                default:
                    break;
            }
            select.add(option);
        }
        select.value = Number(objectJSON.type);
        divThirdRow.appendChild(labelType);
        divThirdRow.appendChild(select);
        const divFourthRow = document.createElement('div');
        divFourthRow.className = 'formRow';
        divFourthRow.classList.add('buttons');
        const buttonAdd = document.createElement('button');
        buttonAdd.id = `buttonAdd${objectJSON.index}`;
        buttonAdd.textContent = 'Add Sub-input';
        buttonAdd.addEventListener('click', this.addSubElement.bind(this));
        const buttonDelete = document.createElement('button');
        buttonDelete.id = `buttonDelete${objectJSON.index}`;
        buttonDelete.textContent = 'Delete';
        buttonDelete.addEventListener('click', this.deleteElement);
        divFourthRow.appendChild(buttonAdd);
        divFourthRow.appendChild(buttonDelete);
        form.appendChild(divFirstRow);
        form.appendChild(divSecondRow);
        form.appendChild(divThirdRow);
        form.appendChild(divFourthRow);
        this.element = form;
        return this.element;

    }
}

const databaseJSON = new DatabaseJSON();

var request = indexedDB.open('database', 1);

request.onerror = function (event) {
    alert("Error i can't create database");
}

request.onsuccess = function (event) {
    db = this.result;
    const transaction = db.transaction(['dbJSON'], 'readwrite');
    const store = transaction.objectStore('dbJSON');
    const request = store.get(1);
    request.onsuccess = function (event) {
        if (request.result === undefined)
            databaseJSON.setDatabase("{}");
        else if (request.result[0] != '{' && request.result[request.result.length - 1] != '}')
            databaseJSON.setDatabase("{}");
        else
            databaseJSON.setDatabase(request.result);
    };
}
request.onupgradeneeded = function (event) {
    request.result.createObjectStore('dbJSON');
};



const saveData = (value) => {
    db = this.request.result;
    const transaction = db.transaction(['dbJSON'], 'readwrite');
    const store = transaction.objectStore('dbJSON');
    store.put(value, 1);
}

const mainButton = document.querySelector(".mainButton");

const updateView = () => {
    const ul = document.querySelector('ul.mainUl');
    ul.textContent = null;
    let tempObject;
    let tempDatabase = databaseJSON.getDatabase().slice(1);
    while (tempDatabase.length > 2) {
        tempObject = JSON.parse(tempDatabase.slice(tempDatabase.indexOf('{'), tempDatabase.indexOf('}') + 1));
        if (tempObject.parentIndex === 'null') {
            const li = document.createElement('li');
            ul.appendChild(li);
            li.appendChild(MainForm.prototype.viewElement(tempObject));
            const fromUl = document.createElement('ul');
            fromUl.dataset.index = tempObject.index;
            li.appendChild(fromUl);
        } else {
            const ul = document.querySelector(`ul[data-index="${tempObject.parentIndex}"]`);
            const li = document.createElement('li');
            ul.appendChild(li);
            li.appendChild(SubForm.prototype.viewElement(tempObject));
            const fromUl = document.createElement('ul');
            fromUl.dataset.index = tempObject.index;
            li.appendChild(fromUl);
        }
        tempDatabase = tempDatabase.slice(tempDatabase.indexOf('}') + 1);
    }
}

mainButton.addEventListener('click', () => {
    let x = new MainForm(databaseJSON.findLastIndexMain() + 1);
    databaseJSON.addMainFormToJSON(x);
    updateView();

})
setTimeout(updateView, 100);
setInterval(() => {
    saveData(databaseJSON.getDatabase());
}, 100);