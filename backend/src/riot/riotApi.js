const axios = require('axios');

const RIOT_API_KEY = process.env.RIOT_API_KEY;

const ACCOUNT_REGION_MAP = {
  na1: 'americas', na: 'americas', br1: 'americas', la1: 'americas', la2: 'americas',
  euw1: 'europe', euw: 'europe', eune1: 'europe', eune: 'europe', tr1: 'europe', ru: 'europe',
  kr: 'asia', jp1: 'asia', oc1: 'sea',
};
const PLATFORM_HOST = {
  na1: 'na1.api.riotgames.com', na: 'na1.api.riotgames.com',
  euw1: 'euw1.api.riotgames.com', euw: 'euw1.api.riotgames.com',
  eune1: 'eun1.api.riotgames.com', eune: 'eun1.api.riotgames.com',
  kr: 'kr.api.riotgames.com', br1: 'br1.api.riotgames.com',
  la1: 'la1.api.riotgames.com', la2: 'la2.api.riotgames.com',
  tr1: 'tr1.api.riotgames.com', jp1: 'jp1.api.riotgames.com', oc1: 'oc1.api.riotgames.com',
};

function getRegionalHost(region) {
  const key = region.toLowerCase();
  return `${ACCOUNT_REGION_MAP[key] || 'europe'}.api.riotgames.com`;
}

async function riotGet(url) {
  if (!RIOT_API_KEY || RIOT_API_KEY.startsWith('fake') || RIOT_API_KEY.startsWith('RGAPI-your')) {
    throw new Error('Valid RIOT_API_KEY not configured');
  }
  const response = await axios.get(url, { headers: { 'X-Riot-Token': RIOT_API_KEY } });
  return response.data;
}

async function getPuuidByRiotId(gameName, tagLine, region) {
  const host = getRegionalHost(region);
  return riotGet(`https://${host}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
}

async function getMatchIds(puuid, region, count = 10) {
  const host = getRegionalHost(region);
  return riotGet(`https://${host}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}`);
}

async function getMatchDetails(matchId, region) {
  const host = getRegionalHost(region);
  return riotGet(`https://${host}/lol/match/v5/matches/${matchId}`);
}

// ── SCORING: 10 pts per correct item, +40 bonus if win ──────
function calculateScore(playerItems, challengeItemIds, isWin) {
  const correctItems = challengeItemIds.filter(id => playerItems.includes(id));
  const itemScore = correctItems.length * 10;
  const winBonus = isWin ? 40 : 0;
  return { score: itemScore + winBonus, correctCount: correctItems.length, total: challengeItemIds.length };
}

async function verifyChallenge(puuid, region, challenge) {
  const matchIds = await getMatchIds(puuid, region, 10);
  if (!matchIds || matchIds.length === 0) {
    return { verified: false, reason: 'No recent ranked matches found.' };
  }

  const challengeItems = JSON.parse(challenge.items);
  const challengeItemIds = challengeItems.map(i => i.id);

  for (const matchId of matchIds) {
    const matchData = await getMatchDetails(matchId, region);
    const participants = matchData.info.participants;
    const participant = participants.find(p => p.puuid === puuid);
    if (!participant) continue;

    // Check champion match
    const matchChamp = participant.championName.toLowerCase().replace(/[^a-z]/g, '');
    const challengeChamp = challenge.champion.toLowerCase().replace(/[^a-z]/g, '');
    if (matchChamp !== challengeChamp) continue;

    // Get player's items
    const playerItems = [
      participant.item0, participant.item1, participant.item2,
      participant.item3, participant.item4, participant.item5,
    ].filter(id => id > 0);

    const { score, correctCount, total } = calculateScore(playerItems, challengeItemIds, participant.win);

    // At least 1 correct item to count this match
    if (correctCount === 0) continue;

    if (participant.win && correctCount === total) {
      // Perfect: all items + win
      return {
        verified: true, partialWin: false,
        scoreEarned: score,
        message: `🎉 Perfect! All ${total} items matched and you won! +${score} points`,
        matchId, kills: participant.kills, deaths: participant.deaths,
        assists: participant.assists, gameDuration: matchData.info.gameDuration,
      };
    }

    // Partial: some items or win without all items
    return {
      verified: false, partialWin: false, partialMatch: true,
      scoreEarned: score,
      message: `Found a match with ${correctCount}/${total} items${participant.win ? ' and a win' : ' but you lost'}. Score would be +${score}. Keep going!`,
      matchId,
    };
  }

  return {
    verified: false,
    reason: 'No matching game found in your last 10 ranked matches. Play with the correct champion!',
  };
}

module.exports = { getPuuidByRiotId, getMatchIds, getMatchDetails, verifyChallenge };
