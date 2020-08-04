import fetch from 'node-fetch';

import {deserialize as desInfo} from './InfoSerializer';
import {deserialize as desModel} from './ModelSerializer';

import {apiString2json} from './Serializer';
import {Logger} from 'winston';
import {DeviceState} from '../data/DeviceState';
import {DeviceStateSerializer} from './DeviceStateSerializer';
import {DeviceInfo} from '../data/DeviceInfo';

const DEFAULT_GROUP = 'aircon';
const ERROR_MESSAGE = 'PARAM NG';
//const OK_MESSAGE = 'OK';

export interface ServiceUrl {
  endpoint: string;
  queryString?: string;
  group?: string;
  host?: string;
}

export interface ApiProps {
  ipAddress: string;
}

export class DaikinApi {
  protected logger?: Logger;
  protected ipAddress: string;

  constructor(config: ApiProps, logger?: Logger) {
    this.ipAddress = config.ipAddress;
    this.logger = logger;
  }

  private checkResponseError(json: {[key: string]: string}) {
    if (!json.ret) {
      this.logger && this.logger.info('Missing operation return param');
    } else {
      if (json.ret === ERROR_MESSAGE) {
        throw new Error('API returned an error');
      }
    }
  }

  private async getUrl(serviceUrl: ServiceUrl) {
    const group = serviceUrl.group ? serviceUrl.group : DEFAULT_GROUP;
    const host = serviceUrl.host ? serviceUrl.host : this.ipAddress;
    const {endpoint, queryString} = serviceUrl;

    let url = `http://${host}/${group}/${endpoint}`;
    url = queryString ? `${url}?${queryString}` : url;
    this.logger && this.logger.silly(`Getting data from ${url}`);
    const res = await fetch(url);
    const text = await res.text();
    this.logger && this.logger.silly(`Got result: ${text}`);
    return text;
  }

  async getBasicInfo(): Promise<DeviceInfo> {
    const endpoint = 'basic_info';
    const group = 'common';
    const res = apiString2json(await this.getUrl({endpoint, group}));
    this.checkResponseError(res);
    return desInfo(res);
  }

  async getRemoteMethod() {
    const endpoint = 'get_remote_method';
    const group = 'common';
    const res = apiString2json(await this.getUrl({endpoint, group}));
    this.checkResponseError(res);
    return res;
  }

  async getModelInfo() {
    const endpoint = 'get_model_info';
    const res = apiString2json(await this.getUrl({endpoint}));
    this.checkResponseError(res);
    return desModel(res);
  }
  async getStateInfo(): Promise<DeviceState> {
    const endpoint = 'get_control_info';
    const res = apiString2json(await this.getUrl({endpoint}));
    this.checkResponseError(res);
    return DeviceStateSerializer.deserialize(res);
  }
  async setStateInfo(newState: DeviceState) {
    const endpoint = 'set_control_info';
    await this.getUrl({
      endpoint,
      queryString: DeviceStateSerializer.serializeToString(newState),
    });
  }
}
