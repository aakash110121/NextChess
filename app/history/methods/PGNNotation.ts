export default function PGNNotation(arrayOfMoves:string[]){
    let modifiedArray = '';
    let moveNumber = 1;
     for(let i = 0; i<arrayOfMoves.length; i++){
        if(i%2==0){
           let strg='';
           if(arrayOfMoves[i+1]){
           strg = moveNumber.toString() + '.' + ' ' + arrayOfMoves[i]+' '+arrayOfMoves[i+1]+' '
           }
           else strg = moveNumber.toString() + '.' + ' ' +arrayOfMoves[i];
           modifiedArray+=strg;
           moveNumber++;
        }
     }
     return modifiedArray;
}