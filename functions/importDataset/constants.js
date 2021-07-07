const statuses = [
  {
    value: 'arrested',
    label: 'Arrested',
  },
  {
    value: 'detained',
    label: 'Detained',
  },
  {
    value: 'at large',
    label: 'At Large',
  },
];
const sexes = [
  {
    label: 'Male',
    value: 'male',
  },
  {
    label: 'Female',
    value: 'female',
  },
];

const municipalities = [
  {
    label: 'Pakil',
    value: 'PAKIL',
  },
  {
    label: 'Pangil',
    value: 'PANGIL',
  },
  {
    label: 'Mabitac',
    value: 'MABITAC',
  },
  {
    label: 'Siniloan',
    value: 'SINILOAN',
  },
  {
    label: 'Sta. Maria',
    value: 'SANTA MARIA',
  },
  {
    label: 'Famy',
    value: 'FAMY',
  },
  {
    label: 'Paete',
    value: 'PAETE',
  },
  {
    label: 'Kalayaan',
    value: 'KALAYAAN',
  },
  {
    label: 'Lumban',
    value: 'LUMBAN',
  },
  {
    label: 'Pagsanjan',
    value: 'PAGSANJAN',
  },
  {
    label: 'Cavinti',
    value: 'CAVINTI',
  },
  {
    label: 'Sta. Cruz',
    value: 'SANTA CRUZ',
  },
  {
    label: 'Pila',
    value: 'PILA',
  },
  {
    label: 'Luisiana',
    value: 'LUISIANA',
  },
  {
    label: 'Magdalena',
    value: 'MAGDALENA',
  },
  {
    label: 'Majayjay',
    value: 'MAJAYJAY',
  },
  {
    label: 'Liliw',
    value: 'LILIW',
  },
  {
    label: 'Nagcarlan',
    value: 'NAGCARLAN',
  },
  {
    label: 'Victoria',
    value: 'VICTORIA',
  },
  {
    label: 'Rizal',
    value: 'RIZAL',
  },
  {
    label: 'Calauan',
    value: 'CALAUAN',
  },
  {
    label: 'Bay',
    value: 'BAY',
  },
  {
    label: 'San Pablo City',
    value: 'SAN PABLO',
  },
  {
    label: 'Alaminos',
    value: 'ALAMINOS',
  },
  {
    label: 'Los Banos',
    value: 'LOS BANOS',
  },
  {
    label: 'City of Calamba',
    value: 'CALAMBA',
  },
  {
    label: 'Cabuyao City',
    value: 'CABUYAO',
  },
  {
    label: 'City of Sta. Rosa',
    value: 'SANTA ROSA',
  },
  {
    label: 'City of Binan',
    value: 'BINAN',
  },
  {
    label: 'San Pedro City',
    value: 'SAN PEDRO',
  },
];

const headerValues = [
  'age',
  'sex',
  'action',
  'date',
  'time',
  'status',
  'remarks',
  'violation',
  'address',
];

module.exports = { headerValues, municipalities, sexes, statuses };
