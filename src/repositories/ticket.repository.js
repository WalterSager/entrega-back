// /src/repositories/ticket.repository.js

import TicketDAO from "../daos/mongo/ticket.dao.js";

const ticketDAO = new TicketDAO();

class TicketRepository {
  create(ticketData) {
    return ticketDAO.create(ticketData);
  }


  get model() {
    return ticketDAO.model;
  }

  
  getAll() {
    return ticketDAO.getAll();
  }

  getById(id) {
    return ticketDAO.getById(id);
  }
 
 
}

export default TicketRepository;