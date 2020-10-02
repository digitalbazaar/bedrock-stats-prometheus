/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import bedrock from 'bedrock';
const {config} = bedrock;

const cfg = config['stats-prometheus'] = {};

cfg.storageApi = 'redis';
