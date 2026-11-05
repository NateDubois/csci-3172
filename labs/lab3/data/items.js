// Data is from from the Vancouver Aquarium Marine Mammal Rescue Centre website.
const items = [
  { id: 'PV2684', name: 'Quadra', species: 'Harbour Seal', admitted: '2026-09-08',
    collectionSite: 'Cowichan Bay', reasonForAdmission: 'Emaciated, Dehydrated',
    weightKg: 10.5, status: 'in care' },
  { id: 'PV2683', name: 'Bear', species: 'Harbour Seal', admitted: '2026-08-26',
    collectionSite: 'Port McNeill', reasonForAdmission: 'Injuries, Underweight',
    weightKg: 9.6, status: 'deceased' },
  { id: 'PV2682', name: 'Wasgo', species: 'Harbour Seal', admitted: '2026-08-24',
    collectionSite: 'Browns Bay', reasonForAdmission: 'Marine Mammal Disturbance',
    weightKg: 7.6, status: 'deceased' },
  { id: 'PV2681', name: 'Spirit', species: 'Harbour Seal', admitted: '2026-08-24',
    collectionSite: 'Sooke', reasonForAdmission: 'Emaciated',
    weightKg: 11.5, status: 'in care' },
  { id: 'PV2680', name: 'Savary', species: 'Harbour Seal', admitted: '2026-08-19',
    collectionSite: 'Savary Island', reasonForAdmission: 'Emaciated, Maternal Separation',
    weightKg: 12.2, status: 'in care' },
  { id: 'PV2679', name: 'Saltspring', species: 'Harbour Seal', admitted: '2026-08-18',
    collectionSite: 'Keats Island', reasonForAdmission: 'Maternal Separation, Dehydrated',
    weightKg: 10.2, status: 'in care' },
];

// Continue numbering from the highest seed id
let lastNumber = Math.max(...items.map((item) => Number(item.id.slice(2))));

const getAll = () => items;

const getById = (id) => items.find((item) => item.id === id);

const add = (data) => {
  lastNumber += 1;
  const item = { id: `PV${lastNumber}`, ...data };
  items.push(item);
  return item;
};

const remove = (id) => {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  return items.splice(index, 1)[0];
};

module.exports = { getAll, getById, add, remove };