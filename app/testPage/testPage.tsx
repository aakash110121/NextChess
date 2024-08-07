"use client";
import Cookies from "js-cookie";
import { axiosInstance } from "@/services/base-http.service";
import { useState, useContext, useRef } from "react";
import NewTestModal from "./components/NewTestModal";
import TestContext from "../context/testContext";
import { Chess, Square } from "chess.js";
import { build_prompt, get_board_pgn_from_history } from "@/lib/messagePrompt";
import { Run } from "openai/resources/beta/threads/runs/runs";
import { Message } from "openai/resources/beta/threads/messages";
import React from "react";
import { style } from "./data";
import TestingChart from "@/components/TestingChart";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/utils/auth/FirebaseCredentials";
import { v4 as uuid } from "uuid";
import ListOfTests from "./components/ListOfTests";

interface TableRowObject {
  transcript_create_lat: null | number;
  message_create_lat: null | number;
  run_create_lat: null | number;
  run_exec_lat: null | number;
  stockfish_move_lat: null | number;
  message_retrieve_lat: null | number;
  fen_before: string;
  fen_after: string;
  overall_lat: null | number;
  cost: null | number;
  response: null | string;
}

interface OverallData {
  overal_cost: number;
  avg_cost: number;
  avg_latency: number;
  cost_per_move: number[];
  transcribe_lat_per_move: number[];
  msg_create_lat_per_move: number[];
  run_exec_lat_per_move: number[];
  overal_lat_per_move: number[];
}

export default function TestPage({ userId, testList }: any) {
  const {
    PGN_strings_array,
    questions,
    number_of_games,
    start_active,
    chessy_style,
    test_title,
    model,
  } = useContext(TestContext);
  const [newTestModalOpened, setNewTestModalOpened] = useState(false);
  const [isTestRunning, setIsTestRunning] = useState(false);
  function handleIsOpened() {
    setNewTestModalOpened((prevOpened) => !prevOpened);
  }

  const [overallData, setOverallData] = useState<OverallData[]>([]);

  async function getBestMoveFromStockfishv2(
    d: any,
    fenStr?: string,
    timeout: number = 3000
  ): Promise<Response> {
    let fen_string = fenStr || new Chess().fen();
    try {
      const bestMove = await fetch(
        `https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(
          fen_string
        )}&depth=${d}&mode=bestmove`,
        {
          method: "GET",
          cache: "no-store",
          signal: AbortSignal.timeout(timeout),
        }
      );
      return bestMove;
    } catch (error: any) {
      return getBestMoveFromStockfishv2(d, fen_string, timeout + 500);
    }
  }

  async function getMoveForComputer(chess: Chess) {
    // console.log("DEPTH IS: ", depth);
    let randomMove = false;
    const depth = [8, 1.0];
    //CHECK IF COMPUTER WOULD PLAY RANDOM OR STOCKFISH BEST MOVE
    if (depth[1] < 1.0) {
      const pick = Math.floor(Math.random() * 100) + 1;
      if (pick >= depth[1] * 100) {
        randomMove = true;
      }
    }

    //GETTING COMPLETE STOCKFISH ANALYSIS FOR CURRENT FEN POSITION (evaluation, best next move, continuation, mate)
    let completeAnalysis: {
      bestmove: any;
      mate: any;
      continuation: any;
      evaluation: any;
    } = { bestmove: null, mate: null, continuation: null, evaluation: null };
    const response = await getBestMoveFromStockfishv2(13, chess.fen());
    if (response.ok) {
      const { success, bestmove, mate, continuation, evaluation } =
        await response.json();
      if (success) {
        const bestMoveForPrompt = bestmove.split(" ")[1];
        // Store the best move calculated at depth 13
        // Continue using the depth according to difficulty level for making the actual move in the game
        completeAnalysis = {
          bestmove: bestMoveForPrompt,
          mate: mate,
          continuation: continuation,
          evaluation: evaluation,
        };
        //setPointer(prevPointer=>prevPointer+1);
      } else {
        completeAnalysis = {
          bestmove: chess.moves({ verbose: true })[0].lan,
          mate: null,
          continuation: "",
          evaluation: 0.2,
        };
      }
    } else {
      console.error(`Error: ${response.statusText}`);
      completeAnalysis = {
        bestmove: chess.moves({ verbose: true })[0].lan,
        mate: null,
        continuation: "",
        evaluation: 0.2,
      };
    }

    if (randomMove) {
      console.log("THIS IS A RANDOM MOVE!!!");
      const possibleMoves = chess.moves({ verbose: true });
      const pickRand = Math.floor(Math.random() * possibleMoves.length);
      return { move: possibleMoves[pickRand].lan, analysis: completeAnalysis };
    } else {
      const compMove = await getBestMoveFromStockfishv2(
        depth[0] ? depth[0] : 13,
        chess.fen()
      );
      if (response.ok) {
        const { success, bestmove } = await compMove.json();
        if (success) {
          const bestMoveForPrompt = bestmove.split(" ")[1];
          // Store the best move calculated at depth 13
          // Continue using the depth according to difficulty level for making the actual move in the game
          console.log("RETURNING: ", {
            move: bestMoveForPrompt,
            analysis: completeAnalysis,
          });
          return { move: bestMoveForPrompt, analysis: completeAnalysis };
          //setPointer(prevPointer=>prevPointer+1);
        } else {
          console.log("RETURNING 1: ", {
            move: completeAnalysis.bestmove,
            analysis: completeAnalysis,
          });
          return {
            move: completeAnalysis.bestmove,
            analysis: completeAnalysis,
          };
        }
      } else {
        console.error(`Error: ${response.statusText}`);
        console.log("RETURNING 2: ", {
          move: completeAnalysis.bestmove,
          analysis: completeAnalysis,
        });
        return { move: completeAnalysis.bestmove, analysis: completeAnalysis };
      }
    }
  }

  async function analysisAfterMove(chess: Chess) {
    const response = await getBestMoveFromStockfishv2(13, chess.fen());
    if (response.ok) {
      const { success, bestmove, mate, continuation, evaluation } =
        await response.json();
      if (success) {
        const bestMoveForPrompt = bestmove.split(" ")[1];
        // Store the best move calculated at depth 13
        // Continue using the depth according to difficulty level for making the actual move in the game
        return {
          bestmove: bestMoveForPrompt,
          mate: mate,
          continuation: continuation,
          evaluation: evaluation,
        };
        //setPointer(prevPointer=>prevPointer+1);
      } else {
        return {
          bestmove: chess.moves({ verbose: true })[0].lan,
          mate: null,
          continuation: "",
          evaluation: 0.2,
        };
      }
    } else {
      console.error(`Error: ${response.statusText}`);
      return {
        bestmove: chess.moves({ verbose: true })[0].lan,
        mate: null,
        continuation: "",
        evaluation: 0.2,
      };
    }
  }

  const makeMove = (
    moveString: string,
    analysisArray: any[],
    chess: Chess,
    fenStringsArray: string[],
    stockfishData: any[]
  ) => {
    const move = chess.move(moveString);
    if (move) {
      fenStringsArray.push(chess.fen());
      console.log("MAKE MOVE ANALYSIS ARRAY: ", analysisArray);
      stockfishData.push(...analysisArray);
    }
  };

  const makeMoveAdditional = (
    moveString: string,
    chess: Chess,
    fenStringsArray: string[]
  ) => {
    const move = chess.move(moveString);
    if (move) {
      fenStringsArray = [...fenStringsArray, chess.fen()];
    }
  };

  const stockfishPlayMove = async (
    moveToPlay: any,
    chess: Chess,
    fenStringsArray: string[],
    stockfishData: any[]
  ) => {
    const moveForPrompt = await getMoveForComputer(chess);
    const { move, analysis } = moveForPrompt;
    const GameCopy = new Chess(chess.fen());
    console.log("ANALYSIS: ", analysis);
    GameCopy.move(moveToPlay);
    let afterMoveAnalysis;
    if (GameCopy.isGameOver()) {
      afterMoveAnalysis = {
        bestmove: chess.moves({ verbose: true })[0].lan,
        mate: chess.turn() == "w" ? -1 : 1,
        continuation: "",
        evaluation: 0.2,
      };
    } else {
      afterMoveAnalysis = await analysisAfterMove(GameCopy);
    }
    makeMove(
      moveToPlay,
      [analysis, afterMoveAnalysis],
      chess,
      fenStringsArray,
      stockfishData
    );
  };

  async function stockfishPlayMoveAdditional(
    moveToPlay: any,
    chess: Chess,
    fenStringsArray: string[]
  ) {
    makeMoveAdditional(moveToPlay, chess, fenStringsArray);
  }

  async function processPrompt(
    input_data: string,
    after_last_move_stockfish: any,
    after_second_to_last_move_stockfish: any
  ) {
    console.log("INPUT DATA: ", input_data);
    const query = new URLSearchParams({
      input_data: encodeURIComponent(input_data),
      after_last_move_stockfish: encodeURIComponent(
        JSON.stringify(after_last_move_stockfish)
      ),
      after_second_to_last_move_stockfish: encodeURIComponent(
        JSON.stringify(after_second_to_last_move_stockfish)
      ),
    }).toString();

    const response = await fetch(`/api/analysis?${query}`, {
      method: "GET",
    });

    const data = await response.json();
    // console.log("DATA RESPONSEEEE :...------------------------------------", data);
    return data;
  }

  const createMessageAlternative = async (
    transcript: string,
    threadId: string,
    chess: Chess
  ) => {
    const messageObject = {
      id: "msg_abc123",
      object: "thread.message",
      created_at: 1713226573,
      assistant_id: null,
      thread_id: "thread_abc123",
      run_id: null,
      role: "user",
      content: [
        {
          type: "text",
          text: {
            value: transcript,
            annotations: [],
          },
        },
      ],
      attachments: [],
      metadata: {},
    };

    const chessPgnFromHistory = get_board_pgn_from_history(chess.history());
    const analysisStartTime = performance.now();

    const initialInstructions: string = `
         ### Chessy, you are in a chess coaching session with your student. Tailor your responses based on the game parameters, PGN game state, and Position analysis details are as follows:\n\n
         ### Game Parameters:\n
         # Your personality for this game: Roasty Chess, that means Chessy will lightly jest with you while still teaching you..\n
         # Level of assistance you will provide: A lot of support.\n
       `;
    //const {analysis_results, print_output} = await processPrompt(chessPgnFromHistory, stockfishData1, stockfishData2);

    const message =
      initialInstructions +
      build_prompt(
        chess.fen(),
        chessPgnFromHistory,
        "",
        transcript,
        "Template already in build prompt"
      );
    //const message = transcript;

    try {
      const response = await axiosInstance({
        url: "/api/message/create",
        method: "POST",
        data: {
          message: message,
          threadId: threadId,
          fen: chess.fen(),
          moveNumber: 1,
          evaluation: 1,
        },
      });
      const mmsgg = response.data.message;
      return response.data?.message.id;
      //return response.data?.message.id;
    } catch (error) {
      console.error("Message creation failed:", error);
      throw error;
    }
  };

  const createMessage = async (
    transcript: string,
    threadId: string,
    chess: Chess,
    stockfishData1: any,
    stockfishData2: any,
    chessyPersonality: any
  ) => {
    const chessPgnFromHistory = get_board_pgn_from_history(chess.history());

    console.log("PGN: ", chessPgnFromHistory);

    const initialInstructions: string = `
         ### Chessy, you are in a chess coaching session with your student. Tailor your responses based on the game parameters, PGN game state, and Position analysis details are as follows:\n\n
         ### Game Parameters:\n
         # Your personality for this game: ${chessyPersonality.name}, that means ${chessyPersonality.description}.\n
         \n
       `;
    //# Level of assistance you will provide: A lot of support.
    const { analysis_results, print_output } = await processPrompt(
      chessPgnFromHistory,
      stockfishData1,
      stockfishData2
    );

    const message =
      initialInstructions +
      build_prompt(
        chess.fen(),
        chessPgnFromHistory,
        print_output,
        transcript,
        "Template already in build prompt"
      );
    //const message = transcript;

    try {
      const response = await axiosInstance({
        url: "/api/message/create",
        method: "POST",
        data: {
          message: message,
          threadId: threadId,
          fen: chess.fen(),
          moveNumber: 1,
          evaluation: 1,
        },
      });
      const mmsgg = response.data.message;
      return response.data?.message.id;
      //return response.data?.message.id;
    } catch (error) {
      console.error("Message creation failed:", error);
      throw error;
    }
  };

  const createRun = async (threadId: string, assistantId: string) => {
    //const bestMovePerStockfish = await getBestMove();
    try {
      const res = await axiosInstance({
        url: "/api/run/create",
        method: "POST",
        data: {
          assistantId: assistantId,
          threadId: threadId,
        },
      });

      if (res) return res.data?.run.id;
    } catch (error) {
      return null;
    }
  };

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const createPolling = async (runId: string, threadId: string) => {
    let shouldPull = true;
    let errNum = 0;
    while (shouldPull) {
      try {
        const response = await axiosInstance({
          method: "GET",
          url: "/api/run/retrieve",
          params: {
            threadId: threadId,
            runId: runId,
          },
        });

        const latestRunInfo = response.data.run;

        if (
          [
            "failed",
            "succeeded",
            "canceled",
            "completed",
            "incomplete",
          ].includes(latestRunInfo.status)
        ) {
          // console.log("STATUS IS: ", latestRunInfo.status);
          // console.log("RUN: ", latestRunInfo);

          return latestRunInfo;
        }
      } catch (error) {
        // console.log(error);
        errNum += 1;
      }

      if (errNum > 2) {
        shouldPull = false;
      }

      await sleep(100);
    }

    return null;
  };

  const fetchMessages = async (limitNumber: number, threadId: string) => {
    try {
      const res = await axiosInstance({
        method: "GET",
        url: "/api/message/list",
        params: {
          threadId: threadId,
          limit: limitNumber,
        },
      });

      const newMessages = res.data.messages;

      if (limitNumber == 1 && newMessages[0]?.role == "assistant") {
        return newMessages[0].content.at(0).text.value;
      }

      // Return the message for other cases if needed
      return newMessages[0].content.at(0).text.value;
    } catch (error) {
      // console.log("error", error);
      return null;
    }
  };

  const createThread = async (userId: string) => {
    try {
      const response = await axiosInstance({
        url: "/api/thread/testCreate",
        method: "POST",
        data: {
          userId: userId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data?.thread.id;
    } catch (error) {
      console.error("Thread creation failed:", error);
      throw error;
    }
  };

  const handleTranscribe = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob);
    try {
      const transcribeResponse = await axiosInstance({
        url: "/api/transcribe",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Assuming `gameId` and `db` are available in your context
      if (transcribeResponse.status == 200) {
        const transcribeResult = transcribeResponse.data;
        return transcribeResult;
      } else {
        console.error("Transcription failed");
        return null;
      }
    } catch (error) {
      console.error("Error transcribing the audio:", error);
      return null;
    }
  };

  function handleGetOverallData(data: TableRowObject[]): OverallData {
    const overallCost = data.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.cost!;
    }, 0);
    const avgCost = overallCost / (data.length - 1);
    const overallLatency = data.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.overall_lat!;
    }, 0);
    const avgLatency = overallLatency / (data.length - 1);
    //const costPerMove = data.map((row, idx)=>row.cost);
    //const transcribeLatPerMove = data.map((row,idx)=>row.transcript_create_lat);
    //const msgCreateLatPerMove = data.map((row, idx)=>row.message_create_lat);
    const result = data.reduce(
      (
        acc: {
          costPerMove: number[];
          transcribeLatPerMove: number[];
          msgCreateLatPerMove: number[];
          runExecLatPerMove: number[];
          overalLatPerMove: number[];
        },
        row: TableRowObject
      ) => {
        acc.costPerMove.push(row.cost!);
        acc.transcribeLatPerMove.push(row.transcript_create_lat!);
        acc.msgCreateLatPerMove.push(row.message_create_lat!);
        acc.runExecLatPerMove.push(row.run_exec_lat!);
        acc.overalLatPerMove.push(row.overall_lat!);
        return acc;
      },
      {
        costPerMove: [],
        transcribeLatPerMove: [],
        msgCreateLatPerMove: [],
        runExecLatPerMove: [],
        overalLatPerMove: [],
      }
    );

    const {
      costPerMove,
      transcribeLatPerMove,
      msgCreateLatPerMove,
      runExecLatPerMove,
      overalLatPerMove,
    } = result;
    const dataOverall: OverallData = {
      overal_cost: overallCost,
      avg_cost: Number(avgCost.toFixed(4)),
      avg_latency: Number(avgLatency.toFixed(0)),
      cost_per_move: costPerMove,
      transcribe_lat_per_move: transcribeLatPerMove,
      msg_create_lat_per_move: msgCreateLatPerMove,
      run_exec_lat_per_move: runExecLatPerMove,
      overal_lat_per_move: overalLatPerMove,
    };
    return dataOverall;
  }

  function calculatePrice(
    prompt_tokens: number,
    completion_tokens: number,
    assistant_model: string
  ) {
    if (assistant_model == "gpt-4o-mini") {
      return Number(
        (
          ((prompt_tokens || 0) / 1000000) * 0.15 +
          ((completion_tokens || 0) / 1000000) * 0.6
        ).toFixed(4)
      );
    } else if (assistant_model == "gpt-3.5-turbo") {
      return Number(
        (
          ((prompt_tokens || 0) / 1000000) * 3.0 +
          ((completion_tokens || 0) / 1000000) * 6.0
        ).toFixed(4)
      );
    }
    return Number(
      (
        ((prompt_tokens || 0) / 1000000) * 5.0 +
        ((completion_tokens || 0) / 1000000) * 15.0
      ).toFixed(4)
    );
  }

  async function playGame(
    pgn: string[],
    questions: (string | Blob)[],
    chessyPersonality: any,
    assistant_model: string
  ) {
    console.log("PLAY GAME NOW!");
    let chessGame = new Chess();
    let counter = 0;
    let fenStringsArray: string[] = [chessGame.fen()];
    let stockfishData: any[] = [];

    let stockfishMoveLat = 0;
    let threadId = await createThread(userId);
    let assistantId =
      assistant_model == "gpt-4o-mini"
        ? "asst_I2otVcWhnIVlInks5k3TjAVL"
        : "gpt-3.5-turbo"
        ? "asst_l2a7j2ycluwzmv4UrRBlbPkX"
        : "asst_v7BYnZLTjVGeY2o893dthdFa";

    const TableData: TableRowObject[] = [];
    for (const move of pgn) {
      let TableRow: TableRowObject = {
        message_create_lat: 0,
        message_retrieve_lat: 0,
        run_create_lat: 0,
        run_exec_lat: 0,
        stockfish_move_lat: 0,
        response: "",
        fen_before: "",
        fen_after: "",
        cost: 0,
        overall_lat: 0,
        transcript_create_lat: 0,
      };
      if (counter % 2 == 0) {
        if (counter !== 0) {
          let questionForThisCycle = questions[counter % questions.length];
          let questionText = "";
          if (questionForThisCycle instanceof Blob) {
            const startTranscribe = performance.now();
            const transcribeResult = await handleTranscribe(
              questionForThisCycle
            );
            console.log("Transcribe Result: ", transcribeResult);
            questionText = transcribeResult;
            TableRow.transcript_create_lat = Math.floor(
              performance.now() - startTranscribe
            );
          }
          const timeNow = performance.now();

          const msg = await createMessage(
            typeof questionForThisCycle == "string"
              ? questionForThisCycle
              : questionText,
            threadId,
            chessGame,
            stockfishData[stockfishData.length - 1],
            stockfishData[stockfishData.length - 2],
            chessyPersonality
          );
          //const msg = await createMessageAlternative(typeof(questionForThisCycle)=='string' ? questionForThisCycle : questionText, threadId, chessGame);

          TableRow.message_create_lat = Math.floor(performance.now() - timeNow);
          const runCreateStart = performance.now();
          const runId = await createRun(threadId, assistantId);
          TableRow.run_create_lat = Math.floor(
            performance.now() - runCreateStart
          );
          if (!runId) {
            TableData.push(TableRow);
            counter++;
            continue;
          }
          const runExecStart = performance.now();
          const runObj: Run = await createPolling(runId, threadId);
          TableRow.run_exec_lat = Math.floor(performance.now() - runExecStart);
          if (!runObj) {
            TableData.push(TableRow);
            counter++;
            continue;
          }

          TableRow.cost = calculatePrice(
            runObj.usage?.prompt_tokens || 0,
            runObj.usage?.completion_tokens || 0,
            assistant_model
          );
          const retrieveMessageStart = performance.now();
          const messAge: any = await fetchMessages(1, threadId);
          TableRow.message_retrieve_lat = Math.floor(
            performance.now() - retrieveMessageStart
          );
          if (!messAge) {
            TableData.push(TableRow);
            counter++;
            continue;
          }
          TableRow.response = messAge;
          TableRow.stockfish_move_lat = stockfishMoveLat;
        }
        TableRow.fen_before = fenStringsArray[fenStringsArray.length - 1];
        chessGame.move(move);
        TableRow.fen_after = chessGame.fen();
        fenStringsArray.push(chessGame.fen());
        console.log("ROW: \n", TableRow);
        TableRow.overall_lat =
          (TableRow.message_create_lat || 0) +
          (TableRow.message_retrieve_lat || 0) +
          (TableRow.transcript_create_lat || 0) +
          (TableRow.run_exec_lat || 0) +
          (TableRow.run_create_lat || 0);
        TableData.push(TableRow);
      } else {
        const stockfishStartTime = performance.now();
        await stockfishPlayMove(
          move,
          chessGame,
          fenStringsArray,
          stockfishData
        );
        //await stockfishPlayMoveAdditional(move, chessGame, fenStringsArray);
        stockfishMoveLat = Math.floor(performance.now() - stockfishStartTime);
      }
      counter++;
    }
    return { threadId: threadId, TableData: TableData };
  }

  const [gamesList, setGamesList] = useState<any[]>([]);
  const [gamesOveralList, setGamesOveralList] = useState<OverallData[]>([]);

  function parseChessNotation(notation: string): string[] {
    // Remove everything that ends with a '.'
    let notationClean = notation.replace(/\d+\./g, "");

    // Remove everything between curly brackets including curly brackets
    notationClean = notationClean.replace(/\{.*?\}/g, "");

    console.log("NOTATION: ", notationClean);

    // Split the notation into individual moves
    let moves = notationClean.split(" ");

    // Remove the last element (game result)
    if (["1-0", "0-1", "1/2-1/2"].includes(moves[moves.length - 1])) {
      moves.pop();
    }
    return moves.filter((item, idx) => item !== "");
  }

  async function create_test_in_db(
    gameIds: string[],
    gamesOverallList: OverallData[],
    gamesList: TableRowObject[][],
    pgnArray: string[],
    chessyPersonality: string,
    test_title: string,
    assistant_model: string
  ) {
    const testId = uuid().slice(0, 18);
    const testRef = doc(db, "Test", testId);
    console.log(
      "GAME IDSS: ",
      gameIds,
      "OVERALL: ",
      gamesOverallList,
      "GAME LIST: ",
      gamesList
    );
    const testOverallMessages = gamesList.length * (gamesList[0].length - 1);
    const gamesLength = gameIds.length;
    const testOverallCost = gamesOverallList.reduce(
      (accumulator, currentValue) => {
        return accumulator + currentValue.overal_cost;
      },
      0
    );

    for (let i = 0; i < gameIds.length; i++) {
      const gameRef = doc(db, "TestGame", gameIds[i]);

      const result = gamesList[i].reduce(
        (
          acc: {
            transcribeLatPerMove: number[];
            msgCreateLatPerMove: number[];
            runCreateLatArray: number[];
            runExecLatPerMove: number[];
            stockfishMoveLatArray: number[];
            messageRetrieveLat: number[];
            fenBeforeArray: string[];
            fenAfterArray: string[];
            overalLatPerMove: number[];
            costPerMove: number[];
            responseArray: string[];
          },
          row: TableRowObject
        ) => {
          acc.transcribeLatPerMove.push(row.transcript_create_lat!);
          acc.msgCreateLatPerMove.push(row.message_create_lat!);
          acc.runExecLatPerMove.push(row.run_exec_lat!);
          acc.overalLatPerMove.push(row.overall_lat!);
          acc.costPerMove.push(row.cost!);
          acc.responseArray.push(row.response!);
          acc.fenAfterArray.push(row.fen_after);
          acc.fenBeforeArray.push(row.fen_before);
          acc.messageRetrieveLat.push(row.message_retrieve_lat!);
          acc.stockfishMoveLatArray.push(row.stockfish_move_lat!);
          acc.runCreateLatArray.push(row.run_create_lat!);
          return acc;
        },
        {
          costPerMove: [],
          transcribeLatPerMove: [],
          msgCreateLatPerMove: [],
          runExecLatPerMove: [],
          overalLatPerMove: [],
          responseArray: [],
          runCreateLatArray: [],
          fenBeforeArray: [],
          fenAfterArray: [],
          messageRetrieveLat: [],
          stockfishMoveLatArray: [],
        }
      );

      await setDoc(
        gameRef,
        {
          test_id: testId,
          transcript_create_lat_array: result.transcribeLatPerMove,
          message_create_lat_array: result.msgCreateLatPerMove,
          run_create_lat_array: result.runCreateLatArray,
          run_exec_lat_array: result.runExecLatPerMove,
          stockfish_move_lat_array: result.stockfishMoveLatArray,
          message_retrieve_lat_array: result.messageRetrieveLat,
          fen_before_array: result.fenBeforeArray,
          fen_after_array: result.fenAfterArray,
          overall_lat_array: result.overalLatPerMove,
          cost_array: result.costPerMove,
          response_array: result.responseArray,
          overall_cost: gamesOverallList[i].overal_cost,
          avg_cost: gamesOverallList[i].avg_cost,
          avg_latency: gamesOverallList[i].avg_latency,
        },
        { merge: true }
      );
    }

    await setDoc(
      testRef,
      {
        created_by: userId,
        chessy_personality: chessyPersonality,
        test_title: test_title || "Test " + testId.slice(6),
        test_total_games: gamesLength,
        test_total_messages: testOverallMessages,
        test_total_cost: testOverallCost,
        test_games: [...gameIds],
        san_array: [...pgnArray],
        created_time: new Date().getTime(),
        assistant_model: assistant_model,
      },
      {
        merge: true,
      }
    );
  }

  async function startTest() {
    if (!start_active) return;
    if (isTestRunning) return;
    setNewTestModalOpened(false);
    setIsTestRunning(true);
    const games = number_of_games;
    const pgn = parseChessNotation(PGN_strings_array);
    const quest = questions;
    const gameIds: string[] = [];
    const chessyPersonality = chessy_style;
    const gameOverallList: OverallData[] = [];
    const gameDataList: TableRowObject[][] = [];
    const testTitle = test_title;
    const assistant_model = model;
    for (let i = 0; i < games; i++) {
      const GameData = await playGame(
        pgn,
        quest,
        chessyPersonality,
        assistant_model
      );
      setGamesList((prevGames: any) => [GameData.TableData, ...prevGames]);
      console.log("TABLE DATA: ", GameData.TableData);
      const gameOverall: OverallData = handleGetOverallData(GameData.TableData);
      setGamesOveralList((prevGames: OverallData[]) => [
        gameOverall,
        ...prevGames,
      ]);
      gameOverallList.unshift(gameOverall);
      gameDataList.unshift(GameData.TableData);
      gameIds.unshift(GameData.threadId);
    }
    await create_test_in_db(
      gameIds,
      gameOverallList,
      gameDataList,
      pgn,
      chessyPersonality.name,
      testTitle,
      assistant_model
    );
    console.log("pgn is: ", pgn);
    setIsTestRunning(false);
  }

  const [testListOpened, setTestListOpened] = useState(false);

  function handleOpenTestList() {
    setTestListOpened((prevOpened) => !prevOpened);
  }

  return (
    <div className="w-full h-screen relative ">
      {newTestModalOpened && (
        <NewTestModal
          isOpened={newTestModalOpened}
          handleIsOpened={handleIsOpened}
          startTest={startTest}
        />
      )}
      {testListOpened && (
        <ListOfTests tests={testList} handleOpenTestList={handleOpenTestList} />
      )}
      <div className="w-full h-12 bg-black flex py-1 px-4 gap-x-2">
        <div
          onClick={() => setNewTestModalOpened(true)}
          className="px-4 hover:bg-gray-300 cursor-pointer bg-white text-center flex justify-center items-center h-full text-black rounded-sm"
        >
          Create New Test
        </div>
        {
          <div
            className="px-4 hover:bg-gray-300 cursor-pointer bg-white text-center flex justify-center items-center h-full text-black rounded-sm"
            onClick={() => handleOpenTestList()}
          >
            Test List
          </div>
        }
      </div>
      <div className="flex flex-col gap-y-4 px-2">
        {gamesList.map((rowArray: any, tableIndex: number) => (
          <div key={tableIndex} className="overflow-x-auto">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transcr Create Lat
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Msg Create Lat{" "}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Run Create Lat{" "}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Run Exec Lat{" "}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stockfish Move Lat{" "}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message Retrieve Lat{" "}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Overall Lat
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Response
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        FEN Before/After
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rowArray.map((row: any, rowIndex: number) => (
                      <tr key={rowIndex}>
                        <td className="px-6 py-4 text-sm text-gray-500 break-words">
                          {row.transcript_create_lat}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 break-words">
                          {row.message_create_lat}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 break-words">
                          {row.run_create_lat}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 break-words">
                          {row.run_exec_lat}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 break-words">
                          {row.stockfish_move_lat}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 break-words">
                          {row.message_retrieve_lat}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 break-words">
                          {row.overall_lat}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 break-words">
                          {row.cost}$
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 break-words">
                          {row.response}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 break-words">
                          {row.fen_before} {row.fen_after}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-black/80">
              Overall cost: {gamesOveralList[tableIndex].overal_cost.toFixed(4)}
              $
            </div>
            <div className="text-black/80">
              Avg cost per move: {gamesOveralList[tableIndex].avg_cost}$
            </div>
            <div className="text-black/80">
              Avg latency per move: {gamesOveralList[tableIndex].avg_latency}ms
            </div>
            <div className="w-full max-w-[1700px] grid grid-rows-4 grid-cols-1 md:grid-rows-2 md:grid-cols-2 lg:grid-rows-1 lg:grid-cols-4">
              <TestingChart
                data={gamesOveralList[tableIndex].msg_create_lat_per_move}
                chartTitle={"Message Latency Through Moves"}
                titleX={"Move number"}
                titleY={"Latency (ms)"}
              />
              <TestingChart
                data={gamesOveralList[tableIndex].cost_per_move}
                chartTitle={"Message Cost Through Moves"}
                titleX={"Move number"}
                titleY={"Cost ($)"}
              />
              <TestingChart
                data={gamesOveralList[tableIndex].run_exec_lat_per_move}
                chartTitle={"Run Exec Latency Through Moves"}
                titleX={"Move number"}
                titleY={"Latency (ms)"}
              />
              <TestingChart
                data={gamesOveralList[tableIndex].overal_lat_per_move}
                chartTitle={"Overall Latency Through Moves"}
                titleX={"Move number"}
                titleY={"Latency (ms)"}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
