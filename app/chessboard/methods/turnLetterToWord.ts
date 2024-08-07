export default function turnLetterToWord(type:string){

        let piece='undefined';
        switch(type){
          case "p":
          case "P":{ 
              piece='Pawn';
              break;
          }
          case "r":
          case "R": {
              piece='Rook'
              break;
          }
          case "b": 
          case "B":{
              piece='Bishop'
              break;
          }
          case "n":
          case "N": {
              piece='Knight'
              break;
          }
          case "q": 
          case "Q": {
              piece='Queen'
              break;
          }
          case "k": 
          case "K":{
              piece='King'
              break;
          }
      }
      
   return piece;
}