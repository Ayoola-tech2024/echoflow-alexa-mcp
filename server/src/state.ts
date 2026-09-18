import { SmartDevice, EnvironmentState, CalendarEvent, DailyBriefing, RoutineDefinition } from '../../shared/types.js';

export class SystemState {
  private static instance: SystemState;

  public environment: EnvironmentState;
  public calendar: CalendarEvent[];
  public routines: RoutineDefinition[];
  public knowledgeBase: Record<string, string>;

  private constructor() {
    this.environment = {
      devices: {
        'light-living-room': {
          id: 'light-living-room',
          name: 'Living Room Ceiling',
          room: 'Living Room',
          type: 'light',
          isOn: true,
          brightness: 80,
          color: '#FFE4B5',
          lastUpdated: new Date().toISOString()
        },
        'light-office': {
          id: 'light-office',
          name: 'Office Desk Lamp',
          room: 'Office',
          type: 'light',
          isOn: false,
          brightness: 0,
          color: '#00CAFF',
          lastUpdated: new Date().toISOString()
        },
        'light-bedroom': {
          id: 'light-bedroom',
          name: 'Bedroom Ambience',
          room: 'Bedroom',
          type: 'light',
          isOn: false,
          brightness: 20,
          color: '#9370DB',
          lastUpdated: new Date().toISOString()
        },
        'lock-front-door': {
          id: 'lock-front-door',
          name: 'Front Door Deadbolt',
          room: 'Entryway',
          type: 'lock',
          isOn: true,
          isLocked: true,
          lastUpdated: new Date().toISOString()
        },
        'thermostat-main': {
          id: 'thermostat-main',
          name: 'Climate Eco Control',
          room: 'Hallway',
          type: 'thermostat',
          isOn: true,
          temperature: 21.5,
          targetTemperature: 22.0,
          lastUpdated: new Date().toISOString()
        },
        'security-guard': {
          id: 'security-guard',
          name: 'Alexa Guard Security Hub',
          room: 'Whole Home',
          type: 'security',
          isOn: true,
          armedState: 'armed_home',
          lastUpdated: new Date().toISOString()
        }
      },
      ambientTemperature: 21.5,
      energyUsageWatts: 340,
      securityStatus: 'secure',
      activeRoutine: null,
      lastSync: new Date().toISOString()
    };

    this.calendar = [
      {
        id: 'cal-1',
        title: 'Alexa+ Hackathon Team Standup',
        time: '09:30 AM',
        location: 'Virtual / Chime',
        priority: 'high'
      },
      {
        id: 'cal-2',
        title: 'AWS Bedrock Agentic Architecture Review',
        time: '11:00 AM',
        location: 'Lab 4',
        priority: 'high'
      },
      {
        id: 'cal-3',
        title: 'Productivity Review & Code Sprint',
        time: '02:00 PM',
        location: 'Home Office',
        priority: 'medium'
      },
      {
        id: 'cal-4',
        title: 'Grocery Delivery (Whole Foods via Alexa)',
        time: '05:30 PM',
        location: 'Front Porch',
        priority: 'low'
      }
    ];

    this.routines = [
      {
        id: 'morning_launch',
        name: 'Good Morning Launch',
        triggerPhrase: 'Alexa, good morning',
        description: 'Illuminates living spaces, adjusts climate, disarms night security, and triggers daily audio briefing.',
        steps: [
          {
            targetDeviceId: 'security-guard',
            action: 'disarm',
            params: { armedState: 'disarmed' },
            description: 'Disarm night perimeter security'
          },
          {
            targetDeviceId: 'light-living-room',
            action: 'turn_on',
            params: { isOn: true, brightness: 100, color: '#FFF8DC' },
            description: 'Set living room lights to energizing daylight'
          },
          {
            targetDeviceId: 'thermostat-main',
            action: 'set_temperature',
            params: { targetTemperature: 22.5 },
            description: 'Adjust thermostat to morning comfort temp 22.5°C'
          }
        ]
      },
      {
        id: 'focus_work_mode',
        name: 'Deep Focus Work Mode',
        triggerPhrase: 'Alexa, focus mode',
        description: 'Optimizes home office environment for deep work, tunes lighting, and silences peripheral alerts.',
        steps: [
          {
            targetDeviceId: 'light-office',
            action: 'turn_on',
            params: { isOn: true, brightness: 100, color: '#00CAFF' },
            description: 'Turn on office lighting with cyan focus tone'
          },
          {
            targetDeviceId: 'light-living-room',
            action: 'dim',
            params: { isOn: true, brightness: 30 },
            description: 'Dim living room to conserve energy'
          }
        ]
      },
      {
        id: 'away_secure',
        name: 'Away Lockdown Routine',
        triggerPhrase: 'Alexa, I am leaving',
        description: 'Turns off all lights, locks all doors, sets eco thermostat, and arms whole-home security.',
        steps: [
          {
            targetDeviceId: 'light-living-room',
            action: 'turn_off',
            params: { isOn: false },
            description: 'Turn off living room lighting'
          },
          {
            targetDeviceId: 'light-office',
            action: 'turn_off',
            params: { isOn: false },
            description: 'Turn off office lighting'
          },
          {
            targetDeviceId: 'light-bedroom',
            action: 'turn_off',
            params: { isOn: false },
            description: 'Turn off bedroom lighting'
          },
          {
            targetDeviceId: 'lock-front-door',
            action: 'lock',
            params: { isLocked: true },
            description: 'Secure front door deadbolt'
          },
          {
            targetDeviceId: 'security-guard',
            action: 'arm',
            params: { armedState: 'armed_away' },
            description: 'Arm Alexa Guard whole-home perimeter'
          },
          {
            targetDeviceId: 'thermostat-main',
            action: 'set_temperature',
            params: { targetTemperature: 19.0 },
            description: 'Set thermostat to Eco mode (19.0°C)'
          }
        ]
      }
    ];

    this.knowledgeBase = {
      'user_name': 'Ayoola',
      'home_location': 'Seattle, WA',
      'favorite_temperature': '22.0°C',
      'emergency_contact': 'Campus Security (+1-800-555-0199)',
      'alexa_mcp_spec': 'Model Context Protocol spec 2025-11-25+ Streamable HTTP',
      'bedrock_model': 'anthropic.claude-3-5-sonnet-20241022-v2:0 / amazon.nova-pro-v1:0'
    };
  }

  public static getInstance(): SystemState {
    if (!SystemState.instance) {
      SystemState.instance = new SystemState();
    }
    return SystemState.instance;
  }

  public getDevice(id: string): SmartDevice | undefined {
    return this.environment.devices[id];
  }

  public updateDevice(id: string, updates: Partial<SmartDevice>): SmartDevice {
    const device = this.environment.devices[id];
    if (!device) {
      throw new Error(`Device '${id}' not found in environment.`);
    }

    const updated = {
      ...device,
      ...updates,
      lastUpdated: new Date().toISOString()
    };

    this.environment.devices[id] = updated;
    this.recalculateEnergy();
    this.environment.lastSync = new Date().toISOString();
    return updated;
  }

  private recalculateEnergy(): void {
    let watts = 50; // baseline
    for (const d of Object.values(this.environment.devices)) {
      if (d.type === 'light' && d.isOn) {
        watts += Math.round(((d.brightness || 100) / 100) * 45);
      }
      if (d.type === 'thermostat' && d.isOn) {
        watts += 180;
      }
      if (d.type === 'security' && d.armedState !== 'disarmed') {
        watts += 25;
      }
    }
    this.environment.energyUsageWatts = watts;
  }
}
