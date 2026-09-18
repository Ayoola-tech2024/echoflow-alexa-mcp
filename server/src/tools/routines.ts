import { SystemState } from '../state.js';
import { handleControlSmartDevice } from './smart-home.js';
import { RoutineExecutionResult } from '../../../shared/types.js';

export const triggerOpsRoutineTool = {
  name: 'trigger_ops_routine',
  description: 'Executes autonomous, multi-step smart home and workflow routines. Pre-configured routines include "morning_launch", "focus_work_mode", and "away_secure".',
  inputSchema: {
    type: 'object',
    properties: {
      routineId: {
        type: 'string',
        enum: ['morning_launch', 'focus_work_mode', 'away_secure'],
        description: 'Identifier of the routine to execute',
      },
      overrideParameters: {
        type: 'object',
        description: 'Optional overrides for routine actions',
      }
    },
    required: ['routineId']
  }
};

export function handleTriggerOpsRoutine(params: { routineId: string; overrideParameters?: Record<string, any> }) {
  const startTime = Date.now();
  const state = SystemState.getInstance();
  const routine = state.routines.find(r => r.id === params.routineId);

  if (!routine) {
    const available = state.routines.map(r => r.id).join(', ');
    return {
      isError: true,
      content: [{ type: 'text', text: `Routine '${params.routineId}' not found. Available routines: [${available}]` }]
    };
  }

  const executionDetails: string[] = [];
  let executedCount = 0;

  for (const step of routine.steps) {
    let action = step.action;
    let val: string | undefined = undefined;

    if (action === 'set_temperature') {
      val = String(step.params.targetTemperature);
    } else if (action === 'set_color' || (action === 'turn_on' && step.params.color)) {
      val = step.params.color;
    } else if (action === 'arm' || action === 'disarm') {
      action = action === 'arm' ? 'arm_security' : 'disarm_security';
      val = step.params.armedState;
    }

    const res = handleControlSmartDevice({
      deviceId: step.targetDeviceId,
      action: action,
      value: val
    });

    if (!res.isError) {
      executedCount++;
      executionDetails.push(`✔ ${step.description}`);
    } else {
      executionDetails.push(`✖ Failed: ${step.description}`);
    }
  }

  state.environment.activeRoutine = routine.id;

  let voiceMsg = `Routine '${routine.name}' completed with ${executedCount} actions executed.`;
  if (routine.id === 'morning_launch') {
    voiceMsg = `Good morning! I have adjusted the climate to 22.5 degrees, brightened the living room, and disarmed perimeter security. Ready for your day.`;
  } else if (routine.id === 'focus_work_mode') {
    voiceMsg = `Focus mode activated. Office lighting is tuned to energizing focus cyan, and living room lights have been dimmed.`;
  } else if (routine.id === 'away_secure') {
    voiceMsg = `Away routine active. All lights are off, the front door is locked, climate is in eco mode, and Alexa Guard security is armed.`;
  }

  const result: RoutineExecutionResult = {
    routineId: routine.id,
    routineName: routine.name,
    status: executedCount === routine.steps.length ? 'success' : 'partial',
    executedSteps: executedCount,
    totalSteps: routine.steps.length,
    details: executionDetails,
    voiceResponse: voiceMsg,
    latencyMs: Date.now() - startTime
  };

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }
    ]
  };
}
