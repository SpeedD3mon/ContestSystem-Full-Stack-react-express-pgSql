export const assignPrize = async (userId, contestId, prize) => {
  await db.query(`
    INSERT INTO user_prizes (user_id, contest_id, prize)
    VALUES ($1, $2, $3)
    ON CONFLICT DO NOTHING
  `, [userId, contestId, prize]);
};
