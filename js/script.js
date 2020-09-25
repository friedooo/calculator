class Calculator {
    constructor() {
        // приоритеты операций
        this.prior = {
            2: ['*', '/'],
            1: ['+', '-']
        };

    };

    // метод преобразует выражение в опн
    getRPN(str) {
        this.stack = [];
        this.outArr = [];
        this.expArr = this.getExpArr(str);

        for (let i = 0; i < this.expArr.length; i += 1)
         {
            
            // если элемент - операнд - пушим его в выходной массив
             if (this.isOperand(this.expArr[i])) {
                                    
                 this.outArr.push(this.expArr[i]);
             }
             // если элемент - не операнд
             else if (this.isOperator(this.expArr[i]) || this.isBracket(this.expArr[i]))
             {
                 // присваиваем значения локальным переменным для простоты

                let element = this.expArr[i]; // нынешний элемент
                let lastInStack = this.stack[this.stack.length - 1]; // последний элемент в стэке
                if (this.isOperator(lastInStack) && this.isOperator(element)) { // случай, когда элемент и последний элемент стэка - операторы и решить, что с ними делать, в зависимости от их приоритетности
                    
                   if (this.isSwitch(element, lastInStack)) //сравнение приоритетностей
                    {
                        this.outArr.push(this.stack.pop()); //удаляем последний элемент стэка и пушим его в выходной массив
                        
                        for (let j = this.stack.length - 1; j >= 0; j -= 1) // проверяем приоритетность других элементов стэка и пушим их в выходной массив пока не дойдем до элемента, который пушить не надо после чего прерываем цикл
                        {
                            if (this.isSwitch(element, this.stack[j])) {
                                this.outArr.push(this.stack.pop());
                            }
                            else {
                                break;
                            }
                        }

                        this.stack.push(element); //пушим элемент в стэк
                    }
                    else {
                        this.stack.push(element); // пушим элемент в стэк, если его приоритетность выше, чем у последнего элемента стэка
                    }
                } 
                else if (this.expArr[i] === ')') { //случай, когда имеется закрывающая скобка
                    let lastOpenBracketIndex;
                    for (let k = this.stack.length - 1; k >= 0; k -= 1) {
                        if (this.stack[k] === '(') {
                            lastOpenBracketIndex = k; // находим индекс открывающей скобки
                            break;
                        }
                    }
                    for (let k = this.stack.length - 1; k >= lastOpenBracketIndex; k -= 1) {
                        if (this.stack[k] != '(') {
                            this.outArr.push(this.stack.pop()); // пушим все элементы из стэка в выходной массив попутно удаляя их из стэка
                        } 
                        else {
                            this.stack.pop(); // удаляем открывающую скобку из стэка
                        }
                    }
                }
                else {
                    this.stack.push(element); // случай, когда в стэке ничего нет, пушим туда элемент
                } 
             }

            //  console.log(this.expArr[i]);
            //  console.log(this.outArr);
            //  console.log(this.stack);
                
         }

         for (let i = this.stack.length - 1; i >= 0; i -= 1) { // случай при завершении обратки цикла, допушиваем элементы из стэка в выходной массив
            this.outArr.push(this.stack[i]);
         }
        
        console.log(this.stack);
        console.log(this.outArr);

        return this.outArr;

    };

    computeRPN(str) {
        this.getRPN(str);
        // console.log(this.outArr);
        let resultArr = []; // результирующий массив


        while (this.outArr.length > 0) { // цикл до тех пор, пока выходной массив не будет пуст

            
        
            if (this.isOperand(this.outArr[0])) { // если операнд, то удаляем элемент из выходного массива и добавляем в результирующий
                resultArr.push(Number(this.outArr.shift()));
            }
            else if (this.isOperator(this.outArr[0])) { // если оператор, то делаем производим операцию с двумя последними элементами результирующего массив например "предпоследний/последний"
                let a1 = Number(resultArr.pop());
                let a2 = Number(resultArr.pop());
                let operator = this.outArr.shift();

                resultArr.push(this.operate(a2, a1, operator));
            }
            
        }

        //console.log(resultArr);
        console.log(this.expArr);
        return resultArr[0];

    }

    operate(a1, a2, operator) { // выбираем действие в зависимости от оператора
        if (operator === '+')
        return a1 + a2;
        if (operator === '-')
        return a1 - a2;
        if (operator === '*')
        return a1 * a2;
        if (operator === '/')
        return a1 / a2;
    }

    isSwitch(a1, a2) { // проверка приоритетов операторов
        let key1;
        let key2;

        for (let key in this.prior) {
            
            if (this.prior[key].indexOf(a1) != -1) {
                key1 = key;
            }
            if (this.prior[key].indexOf(a2) != -1) {
                key2 = key;
            }
        }

        // console.log(a1 + ' is key ' + key1);
        // console.log(a2 + ' is key ' + key2);

        return key1 <= key2 ? true : false;
    }

    isOperand(n) { // проверка на операнд, также учитывается разделитель точка
        return /[0-9.]/.test(n);
    };

    isOperator(n) { // проверка на оператор
    return /[+*-/]/.test(n);
    };

    isBracket(n) { // проверка на скобки
        return /[()]/.test(n);
    }

    normalizeExp(str) {
        return str.replace(/\s+/g, '');
    }

    getExpArr(str) { // получаем из строки массив
        str = this.normalizeExp(str);
        let arr = [];
        let number = '';
        for (let i = 0; i < str.length; i += 1) {
            if (this.isOperator(str[i]) && (this.isOperator(str[i - 1]) || i === 0 || str[i - 1] === '(')) {// // условие, если в выражении стоят 2 или больше операторов
                console.log('aga');
                number += str[i]; // добавление знаков (например, минуса) перед следующим возможным числом, т.е это случай, когда операторов стоит сразу несколько. создает числа вроде -20, +--50
            }
            else if (this.isOperator(str[i]) && !this.isOperator(str[i - 1])) { // условие, если в выражении один оператор окружен операндами
                arr.push(str[i]); 

                
            }
            else if (this.isBracket(str[i])) { //условие если скобка
                arr.push(str[i]);
            
            }
            else if (this.isOperand(str[i])) { // проверка, если число имеет несколько цифр
                number += str[i]; // переменная аккумулирует число
                for (let j = i + 1; j <= str.length; j += 1) { // цикл идет от текущей проверяемой цифры (т.е первой цифры числа) и собирает все цифры, которые идут от нее до появления первого оператора
                    if (this.isOperand(str[j]))
                        number += str[j]
                    else {
                           arr.push(number);
                           i = j - 1;
                           number = '';
                           break;
                        }
                
                }
            }
        }
        return arr;
    }
};



let exp = '(6+10-4)/( 1+1*2)+1';

const calculator = new Calculator();

console.log(calculator.computeRPN(exp));

//console.log(calculator.isSwitch('+', '/'));