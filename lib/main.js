/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import {asyncHandler} from 'bedrock-express';
import bedrock from 'bedrock';
import brStats from 'bedrock-stats';
const {config} = bedrock;

require('./config');
const cfg = config['stats-prometheus'];

bedrock.events.on('bedrock-express.configure.routes', app => {
  app.get(
    '/metrics',
    asyncHandler(async (req, res) => {
      const {storageApi} = cfg;
      const monitorIds = await brStats.getMonitorIds({storageApi});
      const query = {
        monitorIds,
      };
      const result = await brStats.getReports({query, storageApi});
      // get the last report
      const {monitors} = result[result.length - 1];
      for(const monitor in monitors) {
        /* eslint-disable max-len */
        res.write(`continuity_local_ops_per_second ${monitors[monitor].continuity.localOpsPerSecond}\n`);
        res.write(`continuity_peer_ops_per_second ${monitors[monitor].continuity.peerOpsPerSecond}\n`);
        res.write(`continuity_avg_consensus_time_sec ${monitors[monitor].continuity.avgConsensusTime}\n`);
        res.write(`continuity_block_height ${monitors[monitor].continuity.latestSummary.eventBlock.block.blockHeight}\n`);
        /* eslint-enable */
      }
      res.end();
    }));
});
