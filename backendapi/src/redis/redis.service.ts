import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy{
    private redisClient: RedisClientType;

  constructor() {
    this.redisClient = createClient({
      username: 'default',
      password: '4nBBZzzwyOBruUwlL2nv28tUS1tM2zOW',
      socket: {
        host: 'redis-19018.c301.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 19018
      }
    });

    this.redisClient.on('error', err => console.log('Redis Client Error', err));
    this.redisClient.on('connect', () => console.log('Redis Client Connected'));
  }

  async onModuleInit() {
    await this.redisClient.connect();
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }

  async set(key: string, value: any, ttl?: number) {
    try {
      const stringValue = JSON.stringify(value);
      if (ttl) {
        await this.redisClient.set(key, stringValue, { EX: ttl });
      } else {
        await this.redisClient.set(key, stringValue);
      }
    } catch (error) {
      console.error('Redis Set Error:', error);
      throw error;
    }
  }

  async get(key: string) {
    try {
      const value = await this.redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis Get Error:', error);
      throw error;
    }
  }

  async del(key: string) {
    try {
      await this.redisClient.del(key);
    } catch (error) {
      console.error('Redis Delete Error:', error);
      throw error;
    }
  }
}
