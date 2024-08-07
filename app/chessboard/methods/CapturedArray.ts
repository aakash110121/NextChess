export default function CapturedArray(fenArray: string){
    const startingFen = "rnbqkbnrppppppppPPPPPPPPRNBQKBNR"
    function filterFen(input: string): string {
        const filteredInput = input.replace(/[0-9\/]/g, '');  //remove all numbers and '/' characters
        // console.log("FILTERED FEN: ", filteredInput);
        return filteredInput;
    }
    function compareStrings(currentFen: string){
        let initialFen = "rnbqkbnrppppppppPPPPPPPPRNBQKBNR"
        for(var i=0; i<currentFen.length; i++){
           initialFen = initialFen.replace(currentFen[i], '');
        }
        return initialFen;
    }
    {/*const startingFenNums = {
        p:8,
        P:8,
        r:2,
        R:2,
        n:2,
        N:2,
        b:2,
        B:2,
        q:1,
        Q:1,
        k:1,
        K:1,
    }
    function filterFen(input: string): string {
        const filteredInput = input.replace(/[0-9\/]/g, '');  //remove all numbers and '/' characters
        return filteredInput;
    }
    function createObjectWithNewFen(input: string){
        let object={
            p:0,
            P:0,
            r:0,
            R:0,
            n:0,
            N:0,
            b:0,
            B:0,
            q:0,
            Q:0,
            k:0,
            K:0,
        }
        while(input.length>0){
            const regex = new RegExp(input[0], 'g');
    
            // Match the character in the input string
            const matches = input.match(regex);
            // console.log("MECEVI: ", matches);
            //@ts-ignore
            object[input[0]]=matches;
            input=input.replace(regex,'');
        }
      return object;
    }

    function subtractObjects(baseObject:any, subtractor:any) {
        let result={
            p:0,
            P:0,
            r:0,
            R:0,
            n:0,
            N:0,
            b:0,
            B:0,
            q:0,
            Q:0,
            k:0,
            K:0,
        }
        // Iterate over each key in the base object
        for (let key in baseObject) {
            // Ensure the key also exists in the subtractor object
            if (subtractor.hasOwnProperty(key)) {
                // Subtract the value of the current key in the subtractor from the base object
                //@ts-ignore
                result[key] = baseObject[key] - subtractor[key];
            } else {
                // If the key does not exist in the subtractor, use the original value
                //@ts-ignore
                result[key] = baseObject[key];
            }
        }
        return result;
    }
    const capturedArray = subtractObjects(startingFenNums, createObjectWithNewFen(filterFen(fenArray)));
    let capturedPieces = [];
    for(let key in capturedArray){
        let char = key;
        if(key.toUpperCase() === char){
            const piece = 'w'+char.toLowerCase();
            //@ts-ignore
            for(var i=0; i<capturedArray[key]; i++){
                capturedPieces.push(piece);
            }
        }
        else{
            const piece = 'b'+char.toLowerCase();
            //@ts-ignore
            for(var i=0; i<capturedArray[key]; i++){
                capturedPieces.push(piece);
            }
        }
    }*/}
    const filteredFen = filterFen(fenArray);

    
    return compareStrings(filteredFen);
}