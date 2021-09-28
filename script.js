//get the displayViewer which is an inbox 
let displayViewer=document.querySelector(".display-viewer");

//if the user is using the buttons the following should happen
function newClick(valueClicked){
    if(valueClicked=="c"){
        displayViewer.value="";
    }
    else if(valueClicked=="="){
        let operationResult=doOperation(displayViewer.value);
        displayViewer.value=operationResult;
    }
    else{
        displayViewer.value=displayViewer.value+valueClicked;
    }
}
//perform the operation
function doOperation(usersOperation){
    let usersOperationParsed=parsedArray(usersOperation);
    while (usersOperationParsed.includes("(")){
        let indexInnerOpenParenthesis=usersOperationParsed.lastIndexOf("(");
        let indexInnerCloseParenthesis;
        //find the closing parenthesis
        for(let i=indexInnerOpenParenthesis+1;i<=usersOperationParsed.length;i++){
            if(usersOperationParsed[i]==')'){
                indexInnerCloseParenthesis=i;
                break;
            }
        }
        //evaluate expresions using PEMDAS
        let insideParenthesisStuff=usersOperationParsed.slice(indexInnerOpenParenthesis+1,indexInnerCloseParenthesis)//get what is inside the parenthesis.
        let insideParenthesSolveE=resolveE(insideParenthesisStuff); //resolve all the exponents first. 
        let insideParentheSolveMDM=resolveMDM(insideParenthesSolveE);//resolve operations involving * / and % inside the parenthesis 
        let resultParenthesis =resolveSS(insideParentheSolveMDM);//resolve sum and substraction inside the parenthesis 
        usersOperationParsed[indexInnerOpenParenthesis]=resultParenthesis//replace the openinig parentheisis with the inside result 
        usersOperationParsed.splice(indexInnerOpenParenthesis+1,indexInnerCloseParenthesis-indexInnerOpenParenthesis);//remove everything inside the parenthesis that was just resolved
    }
    let operationsSolveE=resolveE(usersOperationParsed); //resolve all the exponents 
    let operationSolvedMDM=resolveMDM(operationsSolveE); //resolve operations involving * / %
    let answer=resolveSS(operationSolvedMDM);//resolve operations involving + - 
    return answer;
}

function resolveE(operation){
    let i=0;
    while (operation.includes("^")){
        if(operation[i]=="^"){
            let firstValue=parseFloat(operation[i-1]);let secondValue=parseFloat(operation[i+1]);
            let newValue=firstValue**secondValue;
            operation[i-1]=newValue;//replace the first number with the solution 
            operation.splice(i,2);  //remove the operator and the number after it 
        }
        else{
            i++;
        }
    }
    return operation;
}

function resolveMDM(operation){
    let targetOperators=["*","/","%"];
    let i=0;
    while (operation.includes("*")||operation.includes("/")||operation.includes("%")){
        if(operation[i]=="*"||operation[i]=="/"||operation[i]=="%"){
            let newValue;
            let firstValue=parseFloat(operation[i-1]);let operator=operation[i];let secondValue=parseFloat(operation[i+1]);//get the first threee elements
            //perform the operation with these three elements 
            switch(operator){
                case "*":
                    newValue=firstValue*secondValue;
                    break;
                case "/":
                    newValue=firstValue/secondValue;
                    break;
                case "%":
                    newValue=firstValue%secondValue;
                    break;
                default:
                    newValue="The expression was written incorrectly"
    
            }
            operation[i-1]=newValue;//replace the first number with the solution 
            operation.splice(i,2);  //remove the operator and the number after it 
        }
        else{
            i++;
        }
    }
    return operation;
}

function resolveSS(operation){
    let i=0;
    while (operation.length>2){
        let newValue;
        let firstValue=parseFloat(operation[i]);let operator=operation[i+1];let secondValue=parseFloat(operation[i+2]);//get the first threee elements
        //perform operations of - and +
        switch(operator){
            case "+": 
                newValue=firstValue+secondValue;
                break;
            case "-":
                newValue=firstValue-secondValue;
                break;
            default:
                newValue="The expression was written incorrectly"
                break;
        }
        //remove these elements from the array 
        operation.shift();operation.shift();operation.shift();
        //add the new value at the begginig of the array
        operation.unshift(newValue);
    }
    return (operation[0].toString());
}


function parsedArray(userCommand){
    let commandArray=userCommand.split(""); //the command is splitted in an array
    let allOperators=["+","-","/","*","%","^","(",")"];
    let parsedArray=[];
    let number="";
    //the numbers that have more than one digit are put together in the same position of the array 
    for (let i=0;i<commandArray.length;i++){
        //if I am reading a number 
        if(!allOperators.includes(commandArray[i])){//if i am reading a number
            number=number+commandArray[i];
        }
        //if i am reading an operator
        else{
            //if a number was just read a number 
            if(number!=""){
                parsedArray.push(number);
                parsedArray.push(commandArray[i]);
                number="";
            }
            //if there is a negative number 
            else if((i==0 && commandArray[i]=="-")||(commandArray[i]=="-" && allOperators.includes(commandArray[i-1]))){
                number="-";
            }
            //other cases
            else{
                parsedArray.push(commandArray[i]);
            }
        }
    }
    if(number!=""){
        parsedArray.push(number);// al the numbers are put together 
    }
    return parsedArray;
}





