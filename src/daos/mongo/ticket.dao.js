//   /src/daos/mongo/ticket.dao.js

import ticketModel from "./models/ticket.model.js";

class TicketDAO {
  async create(ticketData) {
    try {
      return await ticketModel.create(ticketData);
    } catch (error) {
      console.error("Error al crear el ticket:", error);
      throw error; // <- ✅ relanza para que suba al controller
    }
  }
  
  get model() {
    return ticketModel;
  }

  async getById(id) {
    try {
      return await ticketModel.findById(id);
    } catch (error) {
      console.error("Error al buscar ticket por ID:", error);
      return null;
    }
  }

  async getAll() {
    try {
      return await ticketModel.find();
    } catch (error) {
      console.error("Error al obtener todos los tickets:", error);
      return null;
    }
  }

}

export default TicketDAO;
