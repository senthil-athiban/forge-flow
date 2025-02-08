export interface TriggerType {
  id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface Trigger {
  id: string;
  zapId: string;
  triggerTypeId: string;
  createdAt: string;
  updatedAt: string;
  triggerType: TriggerType;
}

export interface ActionType {
  id: string;
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Action {
  id: string;
  zapId: string;
  actionTypeId: string;
  sortingOrder: number;
  metadata: JsonValue;
  status: $Enums.Status;
  createdAt: Date;
  updatedAt: Date;
  actionType: ActionType;
}

export interface Zap {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  trigger: Trigger;
  actions: Action[];
}

export interface ZapPayload {
  triggerTypeId: string;
  actions: {
    actionTypeId: any;
    actionMetaData: any;
  }[];
}
