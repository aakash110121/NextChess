import { TbChessBishopFilled, TbChessRookFilled, TbChessKingFilled, TbChessKnightFilled } from "react-icons/tb";
import { TbChessFilled } from "react-icons/tb";
import { TbChessQueenFilled } from "react-icons/tb";



export function PieceIcon(char:String, evenOdd:number){
    switch (char) {
        case 'P':
          if(evenOdd == 0)
          return <TbChessFilled/>;
          else return <TbChessFilled/>
        case 'Q':
          if(evenOdd == 0)
          return <TbChessQueenFilled />;
          else return <TbChessQueenFilled className="text-black"/>
        case 'K':
            if(evenOdd == 0)
            return <TbChessKingFilled/>;
            else return <TbChessKingFilled className="text-black"/>
        case 'R':
            if(evenOdd == 0)
            return <TbChessRookFilled className="h-full"/>;
            else return <TbChessRookFilled className="text-black h-full"/>
        case 'N':
           if(evenOdd == 0)
            return <TbChessKnightFilled/>;
            else return <TbChessKnightFilled className="text-black"/>
        case 'B':
            if(evenOdd == 0)
            return <TbChessBishopFilled/>;
            else return <TbChessBishopFilled className="text-black"/>
        default:
          return null; // Return null or a default icon if the character doesn't match any case
      }
}