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
        res.write(`continuity_local_ops_list_length ${monitors[monitor].continuity.localOpsListLength}\n`);
        res.write(`continuity_aggregate_duration ${monitors[monitor].continuity.aggregate}\n`);
        res.write(`continuity_findConsensus_duration ${monitors[monitor].continuity.findConsensus}\n`);
        res.write(`continuity_events_outstanding ${monitors[monitor].continuity.eventsOutstanding}\n`);
        res.write(`continuity_events_total ${monitors[monitor].continuity.eventsTotal}\n`);
        res.write(`continuity_merge_events_outstanding ${monitors[monitor].continuity.mergeEventsOutstanding}\n`);
        res.write(`continuity_merge_events_total ${monitors[monitor].continuity.mergeEventsTotal}\n`);
        /* eslint-enable */
      }
      res.end();
    }));
});
