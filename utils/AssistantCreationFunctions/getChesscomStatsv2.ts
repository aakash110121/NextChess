import axios from 'axios';

interface ChessStats {
  chess_daily_last_rating: string;
  chess_daily_best_rating: string;
  chess_daily_record: string;
  chess960_daily_last_rating: string;
  chess960_daily_best_rating: string;
  chess960_daily_record: string;
  chess_rapid_last_rating: string;
  chess_rapid_best_rating: string;
  chess_rapid_record: string;
  chess_bullet_last_rating: string;
  chess_bullet_best_rating: string;
  chess_bullet_record: string;
  chess_blitz_last_rating: string;
  chess_blitz_best_rating: string;
  chess_blitz_record: string;
  fide_rating: string;
  tactics_highest_rating: string;
  tactics_lowest_rating: string;
  puzzle_rush_best_score: string;
  error?: string;
  status_code?: string;
}

async function getChesscomStatsv2(username: string): Promise<ChessStats> {
  const URL = `https://api.chess.com/pub/player/${username}/stats`;

  try {
    const response = await axios.get(URL);
    const stats = response.data;

    const formattedStats: ChessStats = {
      chess_daily_last_rating: stats.chess_daily?.last?.rating || 'Not available',
      chess_daily_best_rating: stats.chess_daily?.best?.rating || 'Not available',
      chess_daily_record: stats.chess_daily?.record || 'Not available',
      chess960_daily_last_rating: stats.chess960_daily?.last?.rating || 'Not available',
      chess960_daily_best_rating: stats.chess960_daily?.best?.rating || 'Not available',
      chess960_daily_record: stats.chess960_daily?.record || 'Not available',
      chess_rapid_last_rating: stats.chess_rapid?.last?.rating || 'Not available',
      chess_rapid_best_rating: stats.chess_rapid?.best?.rating || 'Not available',
      chess_rapid_record: stats.chess_rapid?.record || 'Not available',
      chess_bullet_last_rating: stats.chess_bullet?.last?.rating || 'Not available',
      chess_bullet_best_rating: stats.chess_bullet?.best?.rating || 'Not available',
      chess_bullet_record: stats.chess_bullet?.record || 'Not available',
      chess_blitz_last_rating: stats.chess_blitz?.last?.rating || 'Not available',
      chess_blitz_best_rating: stats.chess_blitz?.best?.rating || 'Not available',
      chess_blitz_record: stats.chess_blitz?.record || 'Not available',
      fide_rating: stats.fide || 'Not available',
      tactics_highest_rating: stats.tactics?.highest?.rating || 'Not available',
      tactics_lowest_rating: stats.tactics?.lowest?.rating || 'Not available',
      puzzle_rush_best_score: stats.puzzle_rush?.best?.score || 'Not available'
    };

    return formattedStats;
  } catch (error:any) {
    console.log("ERROR: ", error);
    return {
        chess_daily_last_rating: 'Not available',
        chess_daily_best_rating: 'Not available',
        chess_daily_record: 'Not available',
        chess960_daily_last_rating: 'Not available',
        chess960_daily_best_rating: 'Not available',
        chess960_daily_record: 'Not available',
        chess_rapid_last_rating: 'Not available',
        chess_rapid_best_rating: 'Not available',
        chess_rapid_record: 'Not available',
        chess_bullet_last_rating: 'Not available',
        chess_bullet_best_rating: 'Not available',
        chess_bullet_record: 'Not available',
        chess_blitz_last_rating: 'Not available',
        chess_blitz_best_rating: 'Not available',
        chess_blitz_record: 'Not available',
        fide_rating: 'Not available',
        tactics_highest_rating: 'Not available',
        tactics_lowest_rating: 'Not available',
        puzzle_rush_best_score: 'Not available',
        error: `Failed to retrieve stats for ${username}. Status Code: ${error.response?.status || 'Unknown'}`
      };
  }
}

export { getChesscomStatsv2 };
