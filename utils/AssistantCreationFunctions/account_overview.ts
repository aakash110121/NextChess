import { chess_openings_library } from '@/lib/openings_library';
import { as } from '@upstash/redis/zmscore-490ca5bd';
import axios from 'axios';

async function GETChessdotcomGames(user: string, date: string): Promise<any[]> {
    const URL = `https://api.chess.com/pub/player/${user}/games/${date}`;

    try {
        const response = await axios.get(URL);
        if (response.data && response.data.games) {
            return response.data.games;
        } else {
            console.error(`No games found for user ${user} on date ${date}`);
            return [];
        }
    } catch (error) {
        console.error(`Error fetching data from URL: ${URL}`, error);
        return [];
    }
}


const fetchChessGames = async (user: string, date:string): Promise<any> => {
    try {
        const response = await fetch(`https://api.chess.com/pub/player/${user}/games/${date}`,{
            cache:'no-store'
        });
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was an error fetching the data:', error);
        throw error;
    }
};


async function GETChessdotcom2024Games(user: string, timeLimit: number = 8): Promise<any[]> {
    const startTime = Date.now();  // Record the start time
    let currentMonth = (new Date()).getMonth()+1;
    let games: any[] = [];
    const maxGames = 500;
    const months = ["12", "11", "10", "09", "08", "07", "06", "05", "04", "03", "02", "01"];
    const year = "2024";

    for (const month of months) {
        if (games.length >= maxGames || (Date.now() - startTime) / 1000 >= timeLimit) {
            break;
        }
        if(parseInt(month, 10)>currentMonth){
            continue;
        }

        const date = `${year}/${month}`;
        const URL = `https://api.chess.com/pub/player/${user}/games/${date}`;

        try {
            const newGames = await fetchChessGames(user, date);
            games = games.concat(newGames?.games);
            if (games.length >= maxGames || (Date.now() - startTime) / 1000 >= timeLimit) {
                games = games.slice(0, maxGames);
                break;
            }
        } catch (error) {
            console.error(`Error fetching data for user ${user} on date ${date}`, error);
        }
    }

    const endTime = Date.now();  // Record the end time
    const executionTime = (endTime - startTime) / 1000;  // Calculate the execution time
    
    return games;
}

interface Game {
    url?: string;
    pgn?: string;
    time_class?: string;
}

function checkGame(game: Game): boolean {
    if ('url' in game && !('pgn' in game)) {
        return false;
    }
    if ('time_class' in game && game.time_class === 'bullet') {
        return false;
    }
    return true;
}

interface Game {
    url?: string;
    pgn?: string;
    time_class?: string;
}

interface Player {
    [key: string]: any;
}

interface Gen {
    [key: string]: any;
}

const resultMapWhite = {
    '1-0': 1,
    '1/2-1/2': 0.5,
    '0-1': 0
} as const;
const resultMapBlack = {
    '0-1': 1,
    '1/2-1/2': 0.5,
    '1-0': 0
} as const;

function AnalyzePGN(game: Game, user: string): any {
    let gen: Gen = {};
    let white: Player = {};
    let black: Player = {};
    let p1: Player = {};
    let p2: Player = {};
    let board: { [key: string]: string } = {};

    gen['platform'] = ['Lichess', 'Chess.com'][game.hasOwnProperty('pgn') ? 1 : 0];
    if (game.hasOwnProperty('pgn')) {
        game = { ...game, pgn: game['pgn'] };
    }
    const gameString = game['pgn'] || "";
    const header = gameString.split('\n\n')[0].split('\n');
    const full = gameString.split('\n\n')[1].split(' ');

    gen['result'] = full.pop();
    gen['standard'] = true;
    const notation: string[] = [];
    const moves: string[] = [];  
    white['movetimers'] = [];
    black['movetimers'] = [];

    full.forEach((item, i) => {
        if ([0, 1, 5].includes(i % 8)) notation.push(item);
        if ([1, 5].includes(i % 8)) moves.push(item);
        if (i % 8 === 3) white['movetimers'].push(item.slice(0, -2));
        if (i % 8 === 7) black['movetimers'].push(item.slice(0, -2));
    });

    header.forEach(line => {
        if (line.startsWith('[White "')) white['name'] = line.slice(8, -2);
        if (line.startsWith('[Black "')) black['name'] = line.slice(8, -2);
        if (line.startsWith('[WhiteElo')) white['rating'] = line.slice(11, -2);
        if (line.startsWith('[BlackElo')) black['rating'] = line.slice(11, -2);
        if (line.startsWith('[Variant') && line !== '[Variant "Standard"]') gen['standard'] = false;
        if (line === '[Event "Let\'s Play!"]') gen['standard'] = false;
        if (line.startsWith('[Termination')) gen['termination'] = line.slice(14, -2);
        if (line.startsWith('[TimeControl')) gen['timecontrol'] = line.slice(14, -2);
        if (line.startsWith('[UTCDate')) gen['date'] = line.slice(10, -2);
        if (line.startsWith('[UTCTime')) gen['time'] = line.slice(10, -2);
        if (line.startsWith('[Link')) gen['gameurl'] = line.slice(7, -2);
    });

    gen['queentrade'] = false;
    gen['isdraw'] = gen['result'] === '1/2-1/2';
    gen['moves'] = Math.floor(moves.length / 2);
    gen['color'] = white['name'].toLowerCase() === user.toLowerCase();
    gen['openings'] = '';

    //NOT SURE ABOUT IF THIS IS A CORRECT SET UP <<>>
    {/*notation.forEach((item, i) => {
        const prefix = notation.slice(0, i).join(' ');
            for(const opening of chess_openings_library){
                if (opening.pgn == prefix) {
                    gen['openings'] = opening.name;
                    break;
                }
            }
    });*/}
   
    //I DECIDED TO TAKE OPENING DIRECTLY FROM INFO PROVIDED IN GAME ITSELF RATHER THAN USING PGN
    //SAVE TIME + MORE ACCURATE

    const match = game?.pgn?.match(/\[ECOUrl "https:\/\/www\.chess\.com\/openings\/([^\"]+)"\]/);
    if (match) {
      let openingName = match[1];
      openingName = openingName.replace(/-/g, ' ');
      const numIndex = openingName.search(/\d/);
      if (numIndex !== -1) {
        openingName = openingName.slice(0, numIndex).trim();
      }
      gen['openings']=openingName;
    }
    else{
        gen['openings'] = '';
    }

    [white, black].forEach(d => {
        d['checks'] = 0;
        d['castle'] = 'None';
        d['Win'] = false;
        d['Draw'] = false;
        d['Loss'] = false;
        d['Total'] = true;
        d['firstpiecemove'] = {};
        d['piececount'] = { 'King': 1, 'Queen': 1, 'Rook': 2, 'Bishop': 2, 'Knight': 2, 'Pawn': 8 };
        d['movecount'] = { 'King': 0, 'Queen': 0, 'Rook': 0, 'Bishop': 0, 'Knight': 0, 'Pawn': 0 };
    });

    white['points']= resultMapWhite[gen['result'] as keyof typeof resultMapWhite];
    black['points'] = resultMapBlack[gen['result'] as keyof typeof resultMapBlack];
    white[{ '1-0': 'Win', '1/2-1/2': 'Draw', '0-1': 'Loss' }[gen['result'] as keyof typeof resultMapWhite]] = true;
    black[{ '0-1': 'Win', '1/2-1/2': 'Draw', '1-0': 'Loss' }[gen['result'] as keyof typeof resultMapBlack]] = true;

    const pdict = { 'K': 'King', 'Q': 'Queen', 'R': 'Rook', 'N': 'Knight', 'B': 'Bishop', 'O': 'King', 'P': 'Pawn', 'a': 'Pawn', 'b': 'Pawn', 'c': 'Pawn', 'd': 'Pawn', 'e': 'Pawn', 'f': 'Pawn', 'g': 'Pawn', 'h': 'Pawn' };
    const pdictinv = { 'King': 'K', 'Queen': 'Q', 'Rook': 'R', 'Knight': 'N', 'Bishop': 'B', 'Pawn': 'P' };
    board = { 'a1': 'R', 'b1': 'N', 'c1': 'B', 'd1': 'Q', 'e1': 'K', 'f1': 'B', 'g1': 'N', 'h1': 'R', 'a2': 'P', 'b2': 'P', 'c2': 'P', 'd2': 'P', 'e2': 'P', 'f2': 'P', 'g2': 'P', 'h2': 'P', 'a8': 'R', 'b8': 'N', 'c8': 'B', 'd8': 'Q', 'e8': 'K', 'f8': 'B', 'g8': 'N', 'h8': 'R', 'a7': 'P', 'b7': 'P', 'c7': 'P', 'd7': 'P', 'e7': 'P', 'f7': 'P', 'g7': 'P', 'h7': 'P' };

    moves.forEach((move, i) => {
        if (!gen['standard']) return;
        const d = [white, black][i % 2];
        const op = [black, white][i % 2];
        let iscapture = false;
        let promotion = false;
        if (move.includes('+')) d['checks'] += 1;
        if (move.includes('x')) iscapture = true;
        if (move.includes('=')) promotion = true;
        ['+', 'x', '#'].forEach(symbol => move = move.replace(symbol, ''));

        if (i % 2 === 0 && ['Na3', 'Nc3', 'Nd2'].includes(move)) white['firstpiecemove']['queensideknight'] = move;
        if (i % 2 === 1 && ['Na6', 'Nc6', 'Nd7'].includes(move)) black['firstpiecemove']['queensideknight'] = move;
        if (i % 2 === 0 && ['Nf3', 'Nh3', 'Ne2'].includes(move)) white['firstpiecemove']['kingsideknight'] = move;
        if (i % 2 === 1 && ['Nf6', 'Nh6', 'Ne7'].includes(move)) black['firstpiecemove']['kingsideknight'] = move;
        if (i % 2 === 0 && ['Ba3', 'Bb2', 'Bd2', 'Be3', 'Bf4', 'Bg5', 'Bh6'].includes(move)) white['firstpiecemove']['darkbishop'] = move;
        if (i % 2 === 1 && ['Ba6', 'Bb7', 'Bd7', 'Be6', 'Bf5', 'Bg4', 'Bh3'].includes(move)) black['firstpiecemove']['darkbishop'] = move;
        if (i % 2 === 0 && ['Bh3', 'Bg2', 'Be2', 'Bd3', 'Bc4', 'Bb5', 'Ba6'].includes(move)) white['firstpiecemove']['lightbishop'] = move;
        if (i % 2 === 1 && ['Bh6', 'Bg7', 'Be7', 'Bd6', 'Bc5', 'Bb4', 'Ba3'].includes(move)) black['firstpiecemove']['lightbishop'] = move;
        if (i % 2 === 0 && ['Qa4', 'Qb3', 'Qc2', 'Qd2', 'Qd3', 'Qd4', 'Qd5', 'Qd6', 'Qd7', 'Qd8', 'Qe2', 'Qf3', 'Qg4', 'Qh5'].includes(move)) white['firstpiecemove']['queen'] = move;
        if (i % 2 === 1 && ['Qa5', 'Qb6', 'Qc7', 'Qd7', 'Qd6', 'Qd5', 'Qd4', 'Qd3', 'Qd2', 'Qd1', 'Qe7', 'Qf6', 'Qg5', 'Qh4'].includes(move)) black['firstpiecemove']['queen'] = move;
        if (i % 2 === 0 && ['Kd1', 'Kd2', 'Ke2', 'Kf2', 'Kf1', 'O-O', 'O-O-O'].includes(move)) white['firstpiecemove']['king'] = move;
        if (i % 2 === 1 && ['Kd8', 'Kd7', 'Ke7', 'Kf7', 'Kf8', 'O-O', 'O-O-O'].includes(move)) black['firstpiecemove']['king'] = move;

        if (move === 'O-O') {
            d['castle'] = 'Kingside';
            board[['g1', 'g8'][i % 2]] = 'K';
            board[['f1', 'f8'][i % 2]] = 'R';
            return;
        }

        if (move === 'O-O-O') {
            d['castle'] = 'Queenside';
            board[['c1', 'c8'][i % 2]] = 'K';
            board[['d1', 'd8'][i % 2]] = 'R';
            return;
        }

        const piece = pdict[move[0] as keyof typeof pdict];
        d['movecount'][piece] += 1;
        let square = '';
        if (promotion) {
            square = move.slice(-4, -2);
        } else {
            square = move.slice(-2);
        }
        if (iscapture) {
            if (square in board) {
                op['piececount'][pdict[board[square] as keyof typeof pdict]] -= 1;
            } else {
                op['piececount']['Pawn'] -= 1;
            }
        }
        if (promotion) {
            d['piececount']['Pawn'] -= 1;
            d['piececount'][pdict[move.slice(-1) as keyof typeof pdict]] += 1;
            board[square] = move.slice(-1);
        } else {
            board[square] = pdictinv[piece as keyof typeof pdictinv];
        }
        const dpc = d['piececount'];
        const opc = op['piececount'];
        d['material'] = dpc['Queen'] * 9 + dpc['Rook'] * 5 + dpc['Bishop'] * 3 + dpc['Knight'] * 3 + dpc['Pawn'];
        op['material'] = opc['Queen'] * 9 + opc['Rook'] * 5 + opc['Bishop'] * 3 + opc['Knight'] * 3 + opc['Pawn'];
        gen['evalscore'] = d['material'] - op['material'];
        dpc['Total'] = dpc['King'] + dpc['Queen'] + dpc['Rook'] + dpc['Bishop'] + dpc['Knight'] + dpc['Pawn'];
        opc['Total'] = opc['King'] + opc['Queen'] + opc['Rook'] + opc['Bishop'] + opc['Knight'] + opc['Pawn'];
        if (dpc['Queen'] === 0 && opc['Queen'] === 0) {
            gen['queentrade'] = true;
        }
    });

    for (const key in white) {
        if (white.hasOwnProperty(key)) {
            [p2, p1][Number(gen['color'])][key] = white[key];
            [p1, p2][Number(gen['color'])][key] = black[key];
        }
    }

    const response = { gen, white, black, p1, p2, '': '' };
    return response;
}


function AddOpeningColumns(matrix: any[][]): any[][] {
    const ocol = matrix[0].indexOf('genopenings');

    // console.log("Debugging AddOpeningColumns:");
    // console.log(`Matrix Shape: ${matrix.length} x ${matrix[0].length}`);

    const openingset: { [key: string]: number } = {};
    const header: string[] = [];

    // Create the opening set
    for (const row of matrix.slice(1)) {
        const cell = row[ocol];
        const elements = cell.slice(0, -2).split(', ');
        for (const element of elements) {
            if (openingset[element]) {
                openingset[element] += 1;
            } else {
                openingset[element] = 1;
            }
        }
    }

    // console.log("Opening Set:");
    // console.log(openingset);

    // Create the header based on openings with more than 20 occurrences
    for (const key in openingset) {
        if (openingset[key] > 20) {
            header.push(key);
        }
    }

    // console.log("Header:");
    // console.log(header);

    const table: string[][] = [header];

    // Create the new rows for the table
    for (const row of matrix.slice(1)) {
        const cell = row[ocol];
        const newrow: string[] = [];
        const elements = cell.slice(0, -2).split(', ');
        for (const key of header) {
            if (elements.includes(key)) {
                newrow.push('true');
            } else {
                newrow.push('false');
            }
        }
        table.push(newrow);
    }

    // Combine the original matrix with the new table
    const result_matrix = matrix.map((row, i) => {
        if (i === 0) {
            return [...row, ...header];
        }
        return [...row, ...table[i]];
    });
    
    
    // console.log(`Matrix Starting Shape: ${matrix.length} x ${matrix[0].length}`);
    // console.log("Result Matrix Shape:");
    // console.log(`${result_matrix.length} x ${result_matrix[0].length}`);
    
    
    return result_matrix;
}

function deepCopy(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}

function GETGameStatszz(game: Game, params: any[], requests: string[][], user: string): string[] {
    params.push([['gen', 'standard'], true]);
    let response: string[] = [];
    let check = true;

    if (checkGame(game)) {
        const full = AnalyzePGN(game, user);
        // console.log(`game analyzed`, full); // Log the full object to inspect its structure

        for (const param of params) {
            let ktarget = { ...full }; // Copy the object
            const key = param[0];
            const val = param[1];
            for (const k of key) {
                ktarget = ktarget[k];
                if (ktarget === undefined) {
                    console.error(`Key ${k} not found in`, full); // Log missing keys
                    check = false;
                    break;
                }
            }
            if (ktarget !== val) {
                check = false;
            }
        }

        if (check) {
            for (const request of requests) {
                let rtarget = { ...full }; // Copy the object
                for (const r of request) {
                    if (!(r in rtarget)) {
                        console.error(`Request key ${r} not found in`, full); // Log missing request keys
                        rtarget = null;
                        break;
                    }
                    rtarget = rtarget[r];
                }
                response.push(String(rtarget));
            }
        }
    }
    return response;
}

function GETGameStats(game: Game, params: any[], requests: string[][], user: string): any[] {
    params.push([['gen', 'standard'], true]);
    let response: any[] = [];
    let check = true;

    if (checkGame(game)) {
        const full = AnalyzePGN(game, user);
        // console.log(`game analyzed`);
        for (const param of params) {
            let ktarget = { ...full }; // Copy the object
            const key = param[0];
            const val = param[1];
            for (const k of key) {
                ktarget = ktarget[k];
            }
            if (ktarget !== val) {
                check = false;
            }
        }
        if (check) {
            for (const request of requests) {
                let rtarget = { ...full }; // Copy the object
                for (const r of request) {
                    if (!(r in rtarget)) {
                        rtarget = null;
                        break;
                    }
                    rtarget = rtarget[r];
                }
                response.push(String(rtarget));
            }
        }
        //<<>>
        if(response[0] == 'undefined'){ 
            // console.log("First element of response is undefined...", response[0]);
            // console.log("FULL RESULT ", full.gen.result);
            // console.log("FULL: ", full);
            if(full.gen.color===false && full.gen.result.includes('1-0') || full.gen.color===true && full.gen.result.includes('0-1')){
              response[0] = '0';
            }
            else if(full.gen.color===true && full.gen.result.includes('1-0') || full.gen.color===false && full.gen.result.includes('0-1')){
                response[0] = '1';
            }
            else{
                response[0] = '0.5';
            }
            
        }
        
    }
    
    return response;
}


function CreateFeatureMatrix(games: any[], user: string): any[][] {
    
    // Define feature sets
    const features: string[][] = [
        ["p1", "points"],
        ["gen", "color"],
        ["gen", "moves"],
        ["gen", "openings"],
        ["gen", "queentrade"]
    ];

    for (const player of ["p1", "p2"]) {
        features.push(
            [player, "castle"],
            [player, "movecount", "King"],
            [player, "movecount", "Queen"],
            [player, "movecount", "Rook"],
            [player, "movecount", "Bishop"],
            [player, "movecount", "Knight"],
            [player, "movecount", "Pawn"],
            [player, "firstpiecemove", "king"],
            [player, "firstpiecemove", "queen"],
            [player, "firstpiecemove", "darkbishop"],
            [player, "firstpiecemove", "lightbishop"],
            [player, "firstpiecemove", "kingsideknight"],
            [player, "firstpiecemove", "queensideknight"]
        );
    }

    // Initialize the feature matrix with headers
    let featureMatrix: any[][] = [["", "id", ...features.map(f => f.join(''))]];
    let Statts;
    // Process each game
    games.forEach((game, i) => {
        // console.log(`Processing game ${i}`);
        if (checkGame(game)) {
            // console.log(`Game ${i} passed checkGame`);
            const stats = GETGameStats(game, [], features, user);
            Statts = stats;
            // console.log(`Stats for game ${i}: ${stats}`);
            if (stats.length > 0) {
                featureMatrix.push(["", i, ...stats]);
            }
        }
    });
    
  
    // Add opening columns to the feature matrix<<>>
    const finalMatrix = AddOpeningColumns(featureMatrix);
    // console.log("Final feature matrix shape in CodeB: ", finalMatrix.length, "x", finalMatrix[0].length);
    //// console.log("------------------------GAMES LENGTH----------: ", games.length);
    return finalMatrix;
}

function AddOpeningColumns2(matrix: any[][]): [any[][], string[], string[]] {
    const openingset_white: { [key: string]: number } = {};
    const openingset_black: { [key: string]: number } = {};
    let header_white: string[] = [];
    let header_black: string[] = [];
    const ocol = matrix[0].indexOf('genopenings');
    const ccol = matrix[0].indexOf('gencolor');

    // Process each row to populate opening sets
    for (const row of matrix.slice(1)) {
        const cell = row[ocol];
        const color = row[ccol];
        const elements = cell.split(', ');

        if (color === 'true') { // player played White
            for (const element of elements) {
                if (openingset_white[element]) {
                    openingset_white[element] += 1;
                } else {
                    openingset_white[element] = 1;
                }
            }
        } else { // player played Black
            for (const element of elements) {
                if (openingset_black[element]) {
                    openingset_black[element] += 1;
                } else {
                    openingset_black[element] = 1;
                }
            }
        }
    }

    // Find top 20 openings for each color
    const top_white = Object.entries(openingset_white)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);
    const top_black = Object.entries(openingset_black)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);

    header_white = top_white.map(([opening, count]) => opening);
    header_black = top_black.map(([opening, count]) => opening);

    // Create the table of new columns
    const table: string[][] = [header_white.concat(header_black)];

    for (const row of matrix.slice(1)) {
        const newrow_white: string[] = [];
        const newrow_black: string[] = [];
        const cell = row[ocol];
        const elements = cell.split(', ');

        for (const key of header_white) {
            newrow_white.push(elements.includes(key) ? 'true' : 'false');
        }
        for (const key of header_black) {
            newrow_black.push(elements.includes(key) ? 'true' : 'false');
        }

        table.push(newrow_white.concat(newrow_black));
    }

    // Combine the original matrix with the new columns
    const result_matrix = matrix.map((row, i) => {
        if (i === 0) {
            return [...row, ...header_white, ...header_black];
        }
        return [...row, ...table[i]];
    });

    return [result_matrix, header_white, header_black];
}

interface ColorConditions {
    [key: string]: string[];
}

function MatrixSelect(matrix: any[][], conditions: string[][], request: string): any[] {
    // console.log("---- Entering MatrixSelect Function ----");

    // console.log(`Input Request: ${request}`);
    const rcol = matrix[0].indexOf(request);
    // console.log(`Index of Request Column: ${rcol}`);

    let select = new Array(matrix.length - 1).fill(true);
    // console.log(`Initial 'select' Array: ${select}`);

    for (const condition of conditions) {
        // console.log(`Current Condition: ${condition}`);

        const ccol = matrix[0].indexOf(condition[0]);
        // console.log(`Index of Condition Column: ${ccol}`);

        const newSelection = matrix.slice(1).map(row => row[ccol] === condition[1]);
        // console.log(`'new' Array after Condition: ${newSelection}`);

        select = select.map((value, index) => value && newSelection[index]);
        // console.log(`Updated 'select' Array: ${select}`);
    }

    const result = matrix.slice(1).filter((row, index) => select[index]).map(row => row[rcol]);
    // console.log(`Final Result: ${result}`);

    // console.log("---- Exiting MatrixSelect Function ----");
    return result;
}
//newMatrix, [['', '', '']], 0, ['overall', 'white', 'black']
function ReturnCounts(matrix: any[][], features: string[][], mingames: number, colors: string[] = ["overall", "white", "black"]): string {
    // console.log("Starting ReturnCounts function");

    let color: ColorConditions = {};
    let count = [0, 0, 0, 0];
    let p = [0, 0, 0, 0];
    features = [["", "", ""]].concat(features);
    const result0 = ["", "", "played"];
    const result1 = ["p1points", "1", "won "];
    const result2 = ["p1points", "0.5", "drew "];
    const result3 = ["p1points", "0", "lost "];
    color["overall"] = ["", "", "Overall,"];
    color["white"] = ["gencolor", "true", "As white,"];
    color["black"] = ["gencolor", "false", "As black,"];

    const featuretext = features.map(f => f[2]).join(" ");
    // console.log(`Features: ${features}`);
    // console.log(`Feature Text: ${featuretext}`);

    let response = "";
    for (const c of colors) {
        // console.log(`Processing color: ${c}`);
        const results = [result0, result1, result2, result3];
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            // console.log(`Processing result ${i}: ${result}`);
            const conditions = features.concat([result, color[c]]);
            // console.log(`Conditions: ${conditions}`);
            count[i] = MatrixSelect(matrix, conditions, "").length;
            p[i] = Math.round((100 * count[i]) / Math.max(count[0], 1));
            // console.log(`Count ${i}: ${count[i]}, Percentage: ${p[i]}%`);
        }

        // console.log(`Counts: ${count}`);
        if (count[0] < mingames) {
            // console.log("Insufficient data for this scenario");
            response += "Insufficient Data\n";
        }
        response += `${color[c][2]}${featuretext.length>1 ? featuretext+', ' : ''}the player played ${count[0]} games. In these games, the player won ${p[1]}% of games, drew ${p[2]}% of games, and lost ${p[3]}% of games.\n`;
        //response += `- Total Games: ${count[0]}\n`;
        //response += `- Wins: ${p[1]}%\n`;
        //response += `- Draws: ${p[2]}%\n`;
        //response += `- Losses: ${p[3]}%\n\n`;
    }

    // console.log("Final Response:\n" + response);
    return response;
}

function average(arr: number[]): number {
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return sum / arr.length;
}

function ReturnTopOpenings(matrix: any[][], openings: string[], color: string): string {
    let top_openings: any[] = [];
    let total_openings = 0;
    let response = "";

    for (const opening of openings) {
        const opening_feature = [`${opening}`, "true", `in the ${opening}`];

        let total_games = MatrixSelect(matrix, [opening_feature, ["gencolor", String(color === "white"), ""]], "").length;
        total_games += MatrixSelect(matrix, [opening_feature, ["gencolor", String(color === "black"), ""]], "").length;
        total_openings += total_games;

        let wins = MatrixSelect(matrix, [opening_feature, ["gencolor", String(color === "white"), ""], ["p1points", "1", "won"]], "").length;
        wins += MatrixSelect(matrix, [opening_feature, ["gencolor", String(color === "black"), ""], ["p1points", "1", "won"]], "").length;

        let losses = MatrixSelect(matrix, [opening_feature, ["gencolor", String(color === "white"), ""], ["p1points", "0", "lost"]], "").length;
        losses += MatrixSelect(matrix, [opening_feature, ["gencolor", String(color === "black"), ""], ["p1points", "0", "lost"]], "").length;

        const draws = total_games - wins - losses;

        const selected_rows_white = MatrixSelect(matrix, [opening_feature, ["gencolor", String(color === "white"), ""]], "genmoves");
        const selected_rows_black = MatrixSelect(matrix, [opening_feature, ["gencolor", String(color === "black"), ""]], "genmoves");
        const selected_rows = selected_rows_white.concat(selected_rows_black);

        const avg_moves = selected_rows.length > 0 ? Math.round(average(selected_rows.map(x => parseFloat(x)))) : 0;

        if (total_games > 0) {
            const win_rate = wins / total_games;
            const draw_rate = draws / total_games;
            const loss_rate = losses / total_games;

            const opening_data = {
                opening: opening,
                total_games: total_games,
                wins: wins,
                draw_rate: draw_rate,
                loss_rate: loss_rate,
                win_rate: win_rate,
                average_moves: avg_moves,
            };

            top_openings.push(opening_data);
        }
    }

    for (const opening_data of top_openings) {
        opening_data["percentage_of_openings"] = total_openings > 0 ? opening_data["total_games"] / total_openings : 0;
    }

    top_openings.sort((a, b) => (b["percentage_of_openings"] - a["percentage_of_openings"]) || (b["win_rate"] - a["win_rate"]));
    top_openings = top_openings.slice(0, 3);

    response += `### Top 3 openings as ${color} with statistics:\n`;
    for (const opening_data of top_openings) {
        response += `# Opening: ${opening_data['opening']}\n`;
        response += `- Total Games: ${opening_data["total_games"]}\n`;
        response += `- Wins: ${opening_data["wins"]}\n`;
        response += `- Win Rate: ${(opening_data["win_rate"] * 100).toFixed(2)}%\n`;
        response += `- Loss Rate: ${(opening_data["loss_rate"] * 100).toFixed(2)}%\n`;
        response += `- Draw Rate: ${(opening_data["draw_rate"] * 100).toFixed(2)}%\n`;
        response += `- Average Moves: ${opening_data["average_moves"]}\n`;
        response += `- Percentage of Total Openings: ${(opening_data["percentage_of_openings"] * 100).toFixed(2)}%\n`;
        response += "\n";
    }

    return response;
}

export async function account_overview(username: string): Promise<string> {
    // console.log(`Inside accountOverview for username: ${username}`);  // Print: function entry

    // console.log("Calling GETChessdotcom2024Games to retrieve games");  // Print: Before calling GETChessdotcom2024Games
    const games = await GETChessdotcom2024Games(username);
    
    

    // console.log("Calling CreateFeatureMatrix to create feature matrix");  // Print: Before calling CreateFeatureMatrix
    
    const matrix = CreateFeatureMatrix(games, username);
   

    //// console.log(`Matrix shape after creation: ${matrix}`);  // Print: After creating matrix
    // console.log("Calling AddOpeningColumns2 to add opening columns");  // Print: Before calling AddOpeningColumns2
    const [newMatrix, whiteOpenings, blackOpenings] = AddOpeningColumns2(matrix);

    // console.log("NEW MATRIX: \n", newMatrix, "WHITE OPENINGS: \n", whiteOpenings, "BLACK OPENINGS: \n", blackOpenings);
    
    //// console.log("Creating DataFrame and saving to CSV");  // Print: Before creating DataFrame
    // Section 1: Overall account overview
    // This section focuses on the overall statistics of the account

    // Section 1.0: Overall game win rates
    // console.log("Section 1.0: Overall game win rates");
    let output1_0 = ReturnCounts(newMatrix, [['', '', '']], 0, ['overall', 'white', 'black']);
    // console.log(`Output for Section 1.0: ${output1_0}\n`);

    // Section 1.1: Top 5 openings by color
    // console.log("Section 1.1: Top 5 openings by color");
    let output1_1_1 = ReturnTopOpenings(newMatrix, whiteOpenings, 'white');
    // console.log(`Top 5 white openings: ${output1_1_1}`);
    let output1_1_2 = ReturnTopOpenings(newMatrix, blackOpenings, 'black');
    // console.log(`Top 5 black openings: ${output1_1_2}\n`);

    // Section 1.2: Overall queen trades
    // console.log("Section 1.2: Overall queen trades");
    const feature1 = ['genqueentrade', 'true', 'where they trade queens'];
    const feature2 = ['genqueentrade', 'false', 'where they dont trade queens'];
    let output1_2_1 = ReturnCounts(newMatrix, [feature1], 0);
    // console.log(`Statistics for games with queen trades: ${output1_2_1}`);
    let output1_2_2 = ReturnCounts(newMatrix, [feature2], 0);
    // console.log(`Statistics for games without queen trades: ${output1_2_2}\n`);

    // Section 1.3: Overall castle side
    // This subsection presents statistics on the side of castling
    const castleSideCombinations:any[] = [
        // Add appropriate castle side combinations here
    ];
    let output1_3: string[] = [];
    for (let castleSide of [
        ["Kingside", "Kingside", "and the opponent castles kingside"],
        ["Kingside", "Queenside", "and the opponent castles queenside"],
        ["Kingside", "None", "and the opponent doesn't castle"],
        ["Queenside", "Queenside", "and the opponent castles queenside"],
        ["Queenside", "Kingside", "and the opponent castles kingside"],
        ["Queenside", "None", "and the opponent doesn't castle"],
        ["None", "Queenside", "and the opponent castles queenside"],
        ["None", "Kingside", "and the opponent castles kingside"],
        ["None", "None", ""],
    ]) {
        const feature1 = ['p1castle', castleSide[0], `where the player castles ${castleSide[0].toLowerCase()}`];
        const feature2 = ['p2castle', castleSide[1], castleSide[2]];
        output1_3.push(`## Statistics: ${castleSide[0]} castle\n` + ReturnCounts(newMatrix, [feature1, feature2], 0, ['overall']));
    }
    const output1_3_refined = output1_3.join('\n');
    const output1 = (
        '### 1.0 Statistics: Win rate overall, for white and for black:\n' + output1_0 + '\n' +
        '### 1.1 Statistics: Top 3 openings with win rates for white and for black\n' + output1_1_1 + '\n' + output1_1_2 + '\n' +
        '### 1.2 Statistics: Queen trade preferences and win rates\n' + output1_2_1 + output1_2_2 + '\n' +
        '### 1.3 Statistics: Castle side preferences and win rates \n' + output1_3_refined
    );

    return output1;
}
