import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const api = axios.create({ baseURL: API_URL, timeout: 15000 });

export const registerPlayer = (summoner_name, region) =>
  api.post('/api/players', { summoner_name, region }).then(r => r.data);

export const getPlayer = (id) =>
  api.get(`/api/players/${id}`).then(r => r.data);

export const generateChallenge = (player_id, role) =>
  api.post('/api/challenges', { player_id, role }).then(r => r.data);

export const getChallenge = (id) =>
  api.get(`/api/challenges/${id}`).then(r => r.data);

export const getPlayerChallenges = (playerId) =>
  api.get(`/api/challenges/player/${playerId}`).then(r => r.data);

export const verifyChallenge = (challengeId) =>
  api.post(`/api/challenges/${challengeId}/verify`).then(r => r.data);

export const abandonChallenge = (challengeId) =>
  api.delete(`/api/challenges/${challengeId}/abandon`).then(r => r.data);

export const getLeaderboard = () =>
  api.get('/api/leaderboard').then(r => r.data);

export default api;
