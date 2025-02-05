import { PrivyClient } from '@privy-io/server-auth';
import config from './config/config';


export const privy = new PrivyClient(config.privy.app_id, config.privy.app_secret);
