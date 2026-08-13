import { SecurityPreset } from '../types';

export const SECURITY_PRESETS: SecurityPreset[] = [
  {
    id: 'electric_fence',
    name: 'Electric Fence System (10 Materials / 5 Labor)',
    projectTitle: '12KV High Voltage Electric Perimeter Fence Installation',
    materialsTotal: 12500,
    laborTotal: 4500,
    grandTotal: 17000,
    materials: [
      { description: '12KV Commercial Security Energizer Controller', quantity: '1 Unit' },
      { description: 'Heavy Duty Lockable Energizer Weatherproof Cabinet', quantity: '1 Set' },
      { description: 'High Tensile Stainless Steel Perimeter Wire (1.6mm)', quantity: '4 Rolls 1000m' },
      { description: 'UV-Stabilized High Voltage Insulator Posts & Brackets', quantity: '48 Sets' },
      { description: 'Double Insulated High Voltage Lead-Out Cable (100m)', quantity: '2 Rolls' },
      { description: 'High Decibel Weatherproof Alarm Siren (120dB)', quantity: '2 Units' },
      { description: 'Red LED High Visibility Strobe Warning Light', quantity: '2 Units' },
      { description: 'High Voltage Warning Signage Boards (Yellow/Black)', quantity: '12 Pieces' },
      { description: 'Copper Clad Earth Grounding Rods & Clamps', quantity: '3 Sets' },
      { description: '12V 7Ah Sealed Lead-Acid Backup Battery System', quantity: '1 Unit' },
    ],
    labor: [
      { description: 'Civil Works, Wall Drilling & Expansion Bolt Mounting', quantity: '2 Technicians / 2 Days' },
      { description: 'Structural Welding, Post Alignment & Corner Bracing', quantity: '1 Welder / 2 Days' },
      { description: 'Flexible Gate Bypass Contacts & Tension Spring Tuning', quantity: '1 Team / 1 Day' },
      { description: 'Perimeter Wire Stringing, Tensioning & Cable Routing', quantity: '3 Technicians / 3 Days' },
      { description: 'Energizer Calibration, Siren Test & Client Commissioning', quantity: 'Lead Engineer / 1 Day' },
    ],
  },
  {
    id: 'sliding_gate',
    name: 'Sliding Gate Machine (5 Materials / 4 Labor)',
    projectTitle: 'Powertech Automatic Heavy Duty Sliding Gate Automation System',
    materialsTotal: 15800,
    laborTotal: 5200,
    grandTotal: 21000,
    materials: [
      { description: 'Powertech PSA1500KG Heavy-Duty Industrial Gate Motor', quantity: '1 Unit' },
      { description: 'Multi-Frequency Wireless Remote Controllers & Receiver', quantity: '4 Units' },
      { description: 'Galvanized Heavy Duty Steel Gear Rack (1 Meter Segments)', quantity: '5 Pieces' },
      { description: 'Flashing LED Safety Lamp with Built-in Antenna', quantity: '1 Set' },
      { description: 'THHN Electrical Cable & PVC Conduit Shielding (50m)', quantity: '1 Bundle' },
    ],
    labor: [
      { description: 'Concrete Base Pad Foundation Pouring & Anchor Bolts', quantity: '2 Masonry Crew / 2 Days' },
      { description: 'Motor Plate Welding, Gear Rack Alignment & Leveling', quantity: '1 Welder / 1 Day' },
      { description: 'Underground PVC Conduit Laying & Power Wiring Connection', quantity: '1 Electrician / 1 Day' },
      { description: 'Limit Switch Setup, Safety Sensor Calibration & Handover', quantity: '1 Senior Tech / 1 Day' },
    ],
  },
];
