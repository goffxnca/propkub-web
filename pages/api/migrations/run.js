// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { m20221020_updateStatusAndSubStatusForExistingPosts } from "../../../data/migrations/m20221020_updateStatusAndSubStatusForExistingPosts";
import {
  addEmptyNextMigration,
  getMigrationByFuncName,
  getMigrationByMigrationKey,
  markMigrationAsRan,
} from "../../../libs/managers/migrationManager";

export default async function handler(req, res) {
  //extract query strings
  const { func, mKey } = req.query;

  if (!func || !mKey) {
    return res.status(400).json({
      message: "The provided arguments is invalid!",
      data: null,
    });
  }

  //return if the migration key with WATING_MIGRATION doc not found (mKey is invalid)
  const migrationDocByMKey = await getMigrationByMigrationKey(mKey);
  if (!migrationDocByMKey) {
    return res.status(400).json({
      message: "The provided migration key is invalid",
    });
  }

  //return if migration ran before
  const migrationDocByFuncName = await getMigrationByFuncName(func);
  if (migrationDocByFuncName) {
    return res.status(400).json({
      message: "This migration already ran before!",
    });
  }

  if (func !== m20221020_updateStatusAndSubStatusForExistingPosts.name) {
    return res.status(400).json({
      message: "The provided func name is not match the prepared function",
    });
  }
  const result = await m20221020_updateStatusAndSubStatusForExistingPosts();

  await markMigrationAsRan(migrationDocByMKey.id, func, result);
  await addEmptyNextMigration();

  return res.status(200).json({ func, mKey, result });
}
