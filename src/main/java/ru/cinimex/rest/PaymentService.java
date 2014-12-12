package ru.cinimex.rest;

import ru.cinimex.transaction.TransactionBo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

@Component
@Path("/payment")
public class PaymentService {

	@Autowired
	TransactionBo transactionBo;

	@GET
	@Path("/test")
	public Response savePayment() {

		String result = transactionBo.save();

		return Response.status(200).entity(result).build();

	}

}