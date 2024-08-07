export default function EvaluationCalculator(piece:string){
    let value= 0;
    switch(piece){
        case 'p':{
          value=1;
          break;
        }
        case 'b':{
          value=3;
          break;
        }
        case 'n':{
          value=3;
          break;
        }
        case 'r':{
          value=5;
          break;
        }
        case 'q':{
          value=9;
          break;
        }
    }

    return value;
}