package ru.cinimex.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.cinimex.dao.FunnyNameDao;
import ru.cinimex.model.FunnyName;

import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * Created by ilapin on 12.12.2014.
 * Cinimex-Informatica
 */

@Path("/json/funny_names")
@Service
public class FunnyNameManager {

    @Autowired
    FunnyNameDao funnyNameDao;

    @GET
    @Path("/")
    @Produces("application/json")
    public List<FunnyName> getList() {
        return funnyNameDao.getList();
    }

    @GET
    @Path("/{id}")
    @Produces("application/json")
    public FunnyName getById(@PathParam("id") long funnyNameId) {

        return funnyNameDao.getById(funnyNameId);
    }

    @DELETE
    @Path("/{id}")
    @Consumes("application/json")
    public Response delete(@PathParam("id") long funnyNameId) {
        funnyNameDao.deleteById(funnyNameId);
        String result = "FunnyName with id = " + funnyNameId + " successfully been deleted";
        return Response.status(200)
                .header("Content-Type", "application/json; charset=UTF-8")
                .entity(result).build();
    }

    @POST
    @Path("/")
    @Consumes("application/json")
    public Response insertOrUpdate(FunnyName funnyName) {
        try {
            funnyNameDao.saveOrUpdate(funnyName);
            return Response.status(200)
                    .header("Content-Type", "application/json; charset=UTF-8")
                    .entity(funnyName).build();
        } catch (Exception e) {
            return Response.status(500)
                    .header("Content-Type", "application/json; charset=UTF-8")
                    .entity(e).build();
        }

    }
}
