import station from "./schemas/stations.js";

export async function getStationById(id) {
  return station.findOne({ id }).lean();
}

export async function getAllStations() {
  return station.find({}).sort({ id: 1 }).lean();
}
