import { SystemState } from '../state.js';

export const controlSmartDeviceTool = {
  name: 'control_smart_device',
  description: 'Inspect or control smart home IoT devices (lights, smart locks, thermostats, security systems). Allows toggling power, setting brightness, adjusting temperature, locking doors, and arming security.',
  inputSchema: {
    type: 'object',
    properties: {
      deviceId: {
        type: 'string',
        description: 'Unique device identifier (e.g. light-living-room, light-office, lock-front-door, thermostat-main, security-guard)',
      },
      action: {
        type: 'string',
        enum: ['turn_on', 'turn_off', 'set_brightness', 'set_color', 'set_temperature', 'lock', 'unlock', 'arm_security', 'disarm_security', 'get_status'],
        description: 'The operation to perform on the device',
      },
      value: {
        type: 'string',
        description: 'Optional argument for the action (e.g. brightness "75", color "#FF5733", temperature "22.5", armedState "armed_away")',
      }
    },
    required: ['deviceId', 'action']
  }
};

export function handleControlSmartDevice(params: { deviceId: string; action: string; value?: string }) {
  const state = SystemState.getInstance();
  const device = state.getDevice(params.deviceId);

  if (!device) {
    const available = Object.keys(state.environment.devices).join(', ');
    return {
      isError: true,
      content: [{ type: 'text', text: `Device '${params.deviceId}' not found. Available devices: [${available}]` }]
    };
  }

  const updates: Record<string, any> = {};

  switch (params.action) {
    case 'turn_on':
      updates.isOn = true;
      updates.brightness = device.brightness && device.brightness > 0 ? device.brightness : 100;
      break;
    case 'turn_off':
      updates.isOn = false;
      updates.brightness = 0;
      break;
    case 'set_brightness':
      const brightness = parseInt(params.value || '100', 10);
      updates.brightness = Math.min(100, Math.max(0, isNaN(brightness) ? 100 : brightness));
      updates.isOn = updates.brightness > 0;
      break;
    case 'set_color':
      updates.color = params.value || '#00CAFF';
      updates.isOn = true;
      break;
    case 'set_temperature':
      const temp = parseFloat(params.value || '21.0');
      updates.targetTemperature = isNaN(temp) ? 21.0 : temp;
      updates.isOn = true;
      break;
    case 'lock':
      updates.isLocked = true;
      break;
    case 'unlock':
      updates.isLocked = false;
      break;
    case 'arm_security':
      updates.armedState = (params.value as any) || 'armed_home';
      break;
    case 'disarm_security':
      updates.armedState = 'disarmed';
      break;
    case 'get_status':
      return {
        content: [{ type: 'text', text: JSON.stringify(device, null, 2) }]
      };
    default:
      return {
        isError: true,
        content: [{ type: 'text', text: `Unsupported action '${params.action}'.` }]
      };
  }

  const updatedDevice = state.updateDevice(params.deviceId, updates);

  return {
    content: [
      {
        type: 'text',
        text: `Device '${updatedDevice.name}' successfully updated. Status: ${JSON.stringify(updatedDevice)}`
      }
    ]
  };
}
