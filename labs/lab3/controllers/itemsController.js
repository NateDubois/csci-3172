const store = require('../data/items');
const HttpError = require('../utils/HttpError');

const getItems = (req, res) => {
  res.json(store.getAll());
};

const getItem = (req, res, next) => {
  const id = req.params.id.toUpperCase();
  const item = store.getById(id);
  if (!item) return next(new HttpError(404, `Patient ${req.params.id} not found`));
  res.json(item);
};

const createItem = (req, res) => {
  const { name, species, admitted, collectionSite, reasonForAdmission, weightKg, status } =
    req.body;
  const item = store.add({
    name: name.trim(),
    species: species.trim(),
    admitted,
    collectionSite: collectionSite.trim(),
    reasonForAdmission: reasonForAdmission.trim(),
    weightKg,
    status,
  });
  res.status(201).json(item);
};

const deleteItem = (req, res, next) => {
  const id = req.params.id.toUpperCase();
  const removed = store.remove(id);
  if (!removed) return next(new HttpError(404, `Patient ${req.params.id} not found`));
  res.json({ message: `Patient ${id} deleted`, item: removed });
};

module.exports = { getItems, getItem, createItem, deleteItem };