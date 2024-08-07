export default function VerbalDescription(fen: string){

    const rows = fen.split(' ')[0].split('/');
    // console.log(rows);

    interface MyObject {
        [key: string]: string[];
    }

    const listOfPiecesAndTheirPositions: MyObject= {
        "White pawns":[],
        "White knights":[],
        "White bishops":[],
        "White rooks":[],
        "White queen":[],
        "White king":[],
        "Black pawns":[],
        "Black knights":[],
        "Black bishops":[],
        "Black rooks":[],
        "Black queen":[],
        "Black king":[],
    }
   
    const rowsC = ['h','g','f','e','d','c','b','a'];
    //const rowsC = ['a','b','c','d','e','f','g','h'];
    //let numOfIndex= 8;
     rows.map((row:string, rowIndex:number)=>{
       let numberOfSquare = 8;
       
       for(let char of row) {
        if(isNaN(parseInt(char))){
            const piece = char;
            switch(piece){
                case "p":
                case "P":{ 
                    listOfPiecesAndTheirPositions[piece === 'p' ? "Black pawns" : "White pawns"].push(`${rowsC[numberOfSquare-1]}${8-rowIndex}`);
                    break;
                }
                case "r":
                case "R": {
                    listOfPiecesAndTheirPositions[piece === 'r' ? "Black rooks" : "White rooks"].push(`${rowsC[numberOfSquare-1]}${8-rowIndex}`);
                    break;
                }
                case "b": 
                case "B":{
                    listOfPiecesAndTheirPositions[piece === 'b' ? "Black bishops" : "White bishops"].push(`${rowsC[numberOfSquare-1]}${8-rowIndex}`);
                    break;
                }
                case "n":
                case "N": {
                    listOfPiecesAndTheirPositions[piece === 'n' ? "Black knights" : "White knights"].push(`${rowsC[numberOfSquare-1]}${8-rowIndex}`);
                    break;
                }
                case "q": 
                case "Q": {
                    listOfPiecesAndTheirPositions[piece === 'q' ? "Black queen" : "White queen"].push(`${rowsC[numberOfSquare-1]}${8-rowIndex}`);
                    break;
                }
                case "k": 
                case "K":{
                    listOfPiecesAndTheirPositions[piece === 'k' ? "Black king" : "White king"].push(`${rowsC[numberOfSquare-1]}${8-rowIndex}`);
                    break;
                }
            }
            numberOfSquare--;
        } else {
            numberOfSquare-=parseInt(char);
        }
       }
       //numOfIndex--;
    })
    
    let finalString = '';

    for(let key in listOfPiecesAndTheirPositions){
        if(listOfPiecesAndTheirPositions[key].length==0) return;
        let strg = '';
        listOfPiecesAndTheirPositions[key].forEach((pos:string, idx:number)=>{
          if(idx==listOfPiecesAndTheirPositions[key].length-1) {strg+=`${pos}.\n`}
          else strg+=`${pos}, `;
        })
        finalString+=`${key} on position ${strg}`;
    }
  
    //return description.slice(0, -2) + '.'; // Remove the last comma and space, then add a period
    return finalString;
}