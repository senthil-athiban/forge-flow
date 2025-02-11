export interface Trigger {
  id: string;
  name: string;
}

export interface Action {
  actionId: string;
  actionName: string;
  metadata: Record<string, any>;
}

export interface WorkflowPayload {
  triggerTypeId: string;
  actions: Array<{
    actionTypeId: string;
    actionMetaData: Record<string, any>;
  }>;
}
