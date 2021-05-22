import { useEffect, useState } from "react";

const Calculator = () => {

    const [eqaution,setEquation] = useState('');
    const [answer,setAnswer] = useState('');
    const [eq_array, setEq_array] =  useState(['']);
    const [checkbracket,setCheckBracket] = useState(0);
    const [answered,setAnswered] = useState(false);
    const [prevAnswer,setPrevAnswer] = useState(['']);
    const [status, setStatus] = useState('success');

    const divisionSymbol = '\u{00F7}';
    const eraseSymbol = '\u{232B}';

    let displayAnswer = '';
    if(answered)
    {
        displayAnswer = answer;
    }
    else{
        displayAnswer = '';
    }

    const checkPraenthsisSyntax = () => {
        let bool = true;
        if(checkbracket)
        {
            bool = false;
        }
        return bool;
    }

    const checkOperatorSyntax = () => {
        let bool = true;
        for(let i = 0 ;i < eq_array.length -1;i++)
        {
            if(eq_array[i] === "-" && eq_array[i+1]==="")
            {
                bool = false;
            }
            else if(i>0 &&
            (eq_array[i] === "+" ||
            eq_array[i] === divisionSymbol ||
            eq_array[i] === "X" ||
            eq_array[i] === "%" ) && 
            (eq_array[i-1] === "" || eq_array[i+1] === "")){
                bool = false;
            }
        }
        return bool;
    }

    const Solve = () => {
        let newEq_array = [...eq_array];
        let bracket_start = 0;
        let temp;
        //console.log(newEq_array);
        for(let i = 0;i< newEq_array.length;i++)
        {
            if(newEq_array[i] === ')')
            {
                //console.log(newEq_array.slice(bracket_start,i));
                temp = Solve_expression(newEq_array.slice(bracket_start,i));
                newEq_array = [...newEq_array.slice(0,bracket_start-1),temp,...newEq_array.slice(i+1,newEq_array.length)];
                //console.log(temp,newEq_array);
                i = -1;
            }
            else if(newEq_array[i] === '(')
            {
                bracket_start = i+1;
            }
            
        }
        let ans = Solve_expression(newEq_array);
        setAnswer(ans);
        setAnswered(true);
        setPrevAnswer([ans]);

    }

    const Solve_expression = (arr) => {

        for(let i=0;i<arr.length;i++)
        {
            if(arr[i] === '%'){
                const modulo = String(Number(arr[i-1]) % Number(arr[i+1]));
                arr = [...arr.slice(0,i-1),modulo,...arr.slice(i+2,arr.length)];
                i = 0;
            }         
        }
        for(let i=0;i<arr.length;i++)
        {
            if(arr[i] === divisionSymbol){
                if(arr[i+1] === '0')
                {
                    arr=[''];
                    setStatus('failure');
                    return 'Cant divide by zero';
                }
                const division = String(Number(arr[i-1]) / Number(arr[i+1]));
                arr = [...arr.slice(0,i-1),division,...arr.slice(i+2,arr.length)];
                i = 0;
            }         
        }
        
        for(let i=0;i<arr.length;i++)
        {
            if(arr[i] === 'X'){
                const product = String(Number(arr[i-1]) * Number(arr[i+1]));
                arr = [...arr.slice(0,i-1),product,...arr.slice(i+2,arr.length)];
                i = 0;
            } 
        }
        for(let i=0;i<arr.length;i++)
        {
            if(arr[i] === '+' ){
                const addition = String(Number(arr[i-1]) + Number(arr[i+1]));
                arr = [...arr.slice(0,i-1),addition,...arr.slice(i+2,arr.length)];
                i = 0;
            }
        }
        for(let i=0;i<arr.length;i++)
        {
            if(arr[i] === '-' ){
                const subtraction = String(Number(arr[i-1]) - Number(arr[i+1]));
                arr = [...arr.slice(0,i-1),subtraction,...arr.slice(i+2,arr.length)];
                i = 0;                
            }
        }
        return arr[0];        
    }


    useEffect(()=>{
        setEquation(eq_array.join(' '));
        //console.log(eq_array);       
    },[eq_array]);

    const handler_AC = () => {
        setEq_array(['']);
        setAnswer('');
        setPrevAnswer('');
        setCheckBracket(0);
        setAnswered(false);
    }

    const handler_erase = () => {
        const newEq_array = [...eq_array];
        if(newEq_array[newEq_array.length-1] !== '')
        {
            newEq_array[newEq_array.length-1] = newEq_array[newEq_array.length-1].slice(0,-1);
        }
        else if(newEq_array.length >1 && newEq_array[newEq_array.length-1] === '')
        {
            if(newEq_array[newEq_array.length-2] === '(')
            {
                setCheckBracket(checkbracket-1);  
                newEq_array.pop();
                newEq_array.pop();
                newEq_array.push('');
            }
            else if(newEq_array[newEq_array.length-2] === ')')
            {
                setCheckBracket(checkbracket+1);
                newEq_array.pop();
                newEq_array.pop();
            }
            else{
                newEq_array.pop();
                newEq_array.pop();
            }
            
        }
        setEq_array(newEq_array);
    }


    const handler_equal = () => {
        if(checkOperatorSyntax() && checkPraenthsisSyntax())
        {
            setStatus('success'); 
            Solve();                       
        }
        else{
            setAnswer('Syntax Error');
            setAnswered(true);
            setStatus('failure');
        }
        setEq_array(['']);       
    }

    const handle_number = (num) => {
        setAnswered(false);
        const newEq_array = [...eq_array.slice(0,eq_array.length-1), eq_array[eq_array.length-1] + num];
        setEq_array(newEq_array);
    }

    const handle_operator = (op) => {
        let newEq_array;
        if(answered)
        {
            newEq_array = [...prevAnswer];
        }
        else{
            newEq_array = [...eq_array];
        } 
        setAnswered(false);       
        if(newEq_array.length >=3 && 
            newEq_array[newEq_array.length-1] === '' && 
            (newEq_array[newEq_array.length-2] === '+' ||
            newEq_array[newEq_array.length-2] === '-'  ||
            newEq_array[newEq_array.length-2] === 'X'  ||
            newEq_array[newEq_array.length-2] === divisionSymbol  ||
            newEq_array[newEq_array.length-2] === '%'  )){
            newEq_array[newEq_array.length-2] = op;
        }
        else if(newEq_array.length >=3 && 
            newEq_array[newEq_array.length-2] === ')' && 
            (newEq_array[newEq_array.length-1] === '+' ||
            newEq_array[newEq_array.length-1] === '-'  ||
            newEq_array[newEq_array.length-1] === 'X'  ||
            newEq_array[newEq_array.length-1] === divisionSymbol  ||
            newEq_array[newEq_array.length-1] === '%'  )){
            newEq_array[newEq_array.length-1] = op;
            newEq_array.push('');
        }
        else if(newEq_array[newEq_array.length-1] !== ''&& newEq_array[newEq_array.length-1] !== '('){
            newEq_array.push(op);
            newEq_array.push('');
        }
        else if(newEq_array[newEq_array.length-1] === '' && op==='-' && newEq_array[newEq_array.length-2]==='(')
        {
            newEq_array[newEq_array.length-1] = '-';           
        }
        else if(newEq_array[newEq_array.length-1] === '' && newEq_array[newEq_array.length-2]===')')
        {
            newEq_array[newEq_array.length-1] = op;
            newEq_array.push('');
        }
        setEq_array(newEq_array);
    }


    const handle_parenthesis = () => {
        setAnswered(false);
        let newEq_array = [...eq_array];
        if(checkbracket && newEq_array[newEq_array.length -2] === ')' )
        {
            newEq_array[newEq_array.length -1] = ')';
            newEq_array.push('');
            setCheckBracket(checkbracket-1);  
        }
        else if(checkbracket && (Number(newEq_array[newEq_array.length -1] ) || newEq_array[newEq_array.length -1] ==='0' ))
        {
            newEq_array.push(')');
            newEq_array.push('');
            setCheckBracket(checkbracket-1);  
        }
        else{         
            if(newEq_array.length === 1)
            {
                if(newEq_array[0] === '')
                {
                    newEq_array[0] = '('; 
                    setCheckBracket(checkbracket+1);            
                }
                else{
                    newEq_array.push('X','(');
                    setCheckBracket(checkbracket+1);
                }
            }
            else if(newEq_array[newEq_array.length -2] === ')'){
                newEq_array[newEq_array.length -1] = 'X';
                newEq_array.push('(');
               
            }
            else if(newEq_array[newEq_array.length -1] ==='0' || Number(newEq_array[newEq_array.length - 1])  ){
                newEq_array.push('X','(');
               
            }   
            else{
                newEq_array[newEq_array.length -1] = '(';
            }
            newEq_array.push('');      
            setEq_array(newEq_array);
            setCheckBracket(checkbracket+1);

        }
        setEq_array(newEq_array);
    }





    return ( 
        <div className="calculator"> 
            <div className="display">
                <input type="text" className={status} value={displayAnswer} disabled readOnly></input>
                <br/>
                <input type="text" className="equation" value={eqaution} disabled readOnly onChange={(e) => setEquation(e.target.value)}></input>
            </div>          
            <div className="button_row">
                <button className="AC" onClick={handler_AC}>AC</button>
                <button className="erase" onClick={handler_erase}>{eraseSymbol}</button>
                <button className="operator" onClick={()=> handle_operator('%')}>%</button>
                <button className="operator" onClick={()=> handle_operator(divisionSymbol)}>{divisionSymbol}</button>
                
            </div>
            <div className="button_row">
                <button className="number"  onClick={() => handle_number('7')}>7</button>
                <button className="number" onClick={() => handle_number('8')}>8</button>
                <button className="number" onClick={() => handle_number('9')}>9</button>                
                <button  className="operator" onClick={()=> handle_operator('X')}>X</button>
            </div>
            <div className="button_row">
                <button className="number" onClick={() => handle_number('4')}>4</button>
                <button className="number" onClick={() => handle_number('5')}>5</button>
                <button className="number" onClick={() => handle_number('6')}>6</button>
                <button className="operator" onClick={()=> handle_operator('-')}>-</button>
            </div>
            <div className="button_row">
                <button className="number" onClick={() => handle_number('1')}>1</button>
                <button className="number" onClick={() => handle_number('2')}>2</button>
                <button className="number" onClick={() => handle_number('3')}>3</button>                 
                <button className="operator" onClick={()=> handle_operator('+')}>+</button>
            </div>
            <div className="button_row">
                <button className="number" onClick={() => handle_number('0')}>0</button>
                <button className="number" onClick={() => handle_number('.')}>.</button>
                <button className="number" onClick={handle_parenthesis}>()</button>
                <button className="equal" onClick={handler_equal}>=</button>
                
            </div>
        </div>
     );
}
 
export default Calculator;