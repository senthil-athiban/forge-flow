import React from 'react';
import { Button } from '@/components/ui/button';
import WorkflowStep from '../Zap/WorkflowStep';
import { Action, Trigger } from '@/types/workflow';

interface WorkflowBuilderProps {
  trigger: Trigger;
  actions: Action[];
  onTriggerClick: () => void;
  onActionClick: (index: number) => void;
  onActionDelete: (index: number) => void;
  onAddAction: () => void;
}

const WorkflowBuilder = ({
  trigger,
  actions,
  onTriggerClick,
  onActionClick,
  onActionDelete,
  onAddAction,
}: WorkflowBuilderProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full max-w-2xl mx-auto">
      <WorkflowStep
        name={trigger.name}
        index={1}
        onClick={onTriggerClick}
        type="trigger"
        isConfigured={!!trigger.id}
      />

        {actions.map((action, index) => (
          <WorkflowStep
            key={`action-${index}`}
            name={action.actionName}
            index={index + 2}
            onClick={() => onActionClick(index)}
            type="action"
            isConfigured={!!action.actionId}
            onDelete={() => onActionDelete(index)}
          />
        ))}

      <Button
        variant="outline"
        onClick={onAddAction}
        className="w-12 h-12 rounded-full"
      >
        +
      </Button>
    </div>
  );
};

export default WorkflowBuilder;