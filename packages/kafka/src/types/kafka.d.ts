export interface RetryOptions {
  maxRetryTime?: number;
  initialRetryTime?: number;
  retries?: number;
}

export interface KafkaConfig {
  clientId: string;
  brokers: Array<string>;
  requestTimeout?: number;
  retry?: RetryOptions;
}

export interface KafkaTopicConfig {
    topic: string;
    numPartitions: number;
    replicationFactor: number;
}

export interface ProducerMessage {
  topic: string;
  message: {
    key?: string;
    value: T;
    headers?: Record<string, string>;
    timestamp?: string;
  }[];
}

export interface KafkaConsumerConfig {
  groupId: string;
  topics: Array<string>;
  fromBeginning?: boolean;
}

export interface AdminConfig {
    waitForLeaders: boolean;
    timeout: number;
}